import { Glob } from 'bun';
import { href, entryId, locales, slugs, type Locale } from '../src/navigation';
import { release, site } from '../src/site.mjs';

const failures: string[] = [];
const sources = new Set(await Array.fromAsync(new Glob('**/*.md').scan('src/content/docs')));
for (const source of sources) {
	const content = await Bun.file(`src/content/docs/${source}`).text();
	if (/^:::(?:note|tip|caution|danger)\b/m.test(content)) {
		failures.push(`${source}: use a Markdown blockquote for callouts`);
	}
}

const routes = new Map<string, { locale: Locale; fallback: boolean }>();
for (const locale of locales) {
	routes.set(href(locale), { locale, fallback: false });
	for (const slug of slugs) {
		const source = `${entryId(locale, slug)}.md`;
		const fallback = !sources.has(source) && locale !== 'en' && slug.startsWith('reference/');
		if (!sources.has(source) && !fallback) {
			failures.push(`Missing ${source}`);
		}

		routes.set(href(locale, slug), { locale, fallback });
		sources.delete(source);
	}
}
for (const source of sources) {
	failures.push(`Not in the sidebar: ${source}`);
}

for (const locale of locales) {
	const install = await Bun.file(
		`src/content/docs/${entryId(locale, 'start/installation')}.md`,
	).text();
	if (
		!install.includes(`version=${release.version}\n`) ||
		!install.includes(`cmd/rumbo@v${release.version}`)
	) {
		failures.push(`Release version mismatch in the ${locale} installation guide`);
	}
}

interface Page {
	ids: Set<string>;
	links: { target: string; isFallbackLink: boolean }[];
	canonical?: string;
}

const pages = new Map<string, Page>();
for (const [path, { locale, fallback }] of routes) {
	const file = Bun.file(`dist${path}index.html`);
	if (!(await file.exists())) {
		failures.push(`Not built: ${path}`);
		continue;
	}

	const page: Page = { ids: new Set(), links: [] };
	const addLink = (target: string | null, isFallbackLink = false) => {
		if (target) {
			page.links.push({ target, isFallbackLink });
		}
	};

	await new HTMLRewriter()
		.on('[id]', {
			element(element) {
				page.ids.add(element.getAttribute('id')!);
			},
		})
		.on('a[href]', {
			element(element) {
				addLink(element.getAttribute('href'), fallback || element.hasAttribute('lang'));
			},
		})
		.on('img[src], script[src]', {
			element(element) {
				addLink(element.getAttribute('src'));
			},
		})
		.on('link[rel=canonical]', {
			element(element) {
				page.canonical = element.getAttribute('href') ?? undefined;
			},
		})
		.on('html', {
			element(element) {
				if (element.getAttribute('lang') !== locale) {
					failures.push(`${path}: incorrect language`);
				}
			},
		})
		.transform(new Response(file))
		.arrayBuffer();

	const canonical = fallback ? path.replace(/^\/(es|fr|it)\//, '/') : path;
	if (page.canonical !== new URL(canonical, site).href) {
		failures.push(`${path}: incorrect canonical URL`);
	}

	pages.set(path, page);
}

const assets = new Map<string, boolean>();
for (const [path, page] of pages) {
	const locale = routes.get(path)!.locale;
	for (const { target, isFallbackLink } of page.links) {
		const url = new URL(target, new URL(path, site));
		if (url.origin !== site) {
			continue;
		}

		const destination = pages.get(url.pathname);
		if (destination) {
			if (!isFallbackLink && routes.get(url.pathname)!.locale !== locale) {
				failures.push(`${path}: link leaves its language: ${target}`);
			}
			if (url.hash && !destination.ids.has(decodeURIComponent(url.hash.slice(1)))) {
				failures.push(`${path}: missing anchor ${target}`);
			}
			continue;
		}

		if (!assets.has(url.pathname)) {
			assets.set(url.pathname, await Bun.file(`dist${url.pathname}`).exists());
		}
		if (!assets.get(url.pathname)) {
			failures.push(`${path}: broken link ${target}`);
		}
	}
}

const index = (await Bun.file('dist/search.json').json()) as { href: string }[];
if (
	new Set(index.map((entry) => entry.href)).size !== locales.length * slugs.length ||
	index.some((entry) => !pages.has(entry.href))
) {
	failures.push('The search index does not match the documentation routes');
}

if (failures.length) {
	console.error([...new Set(failures)].join('\n'));
	process.exit(1);
}

console.log(
	`Checked ${pages.size} pages, localized links, anchors, release snippets, and the search index.`,
);
