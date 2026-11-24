import { getCollection, render } from 'astro:content';
import { entryId, groups, href, locales, slugs, type Locale } from './navigation';

export async function documents() {
	const entries = new Map((await getCollection('docs')).map((entry) => [entry.id, entry]));

	return locales.flatMap((locale) =>
		slugs.map((slug) => {
			const localized = entries.get(entryId(locale, slug));
			const entry = localized ?? entries.get(slug);
			if (!entry || (!localized && !slug.startsWith('reference/'))) {
				throw new Error(`Missing documentation: ${entryId(locale, slug)}`);
			}

			return { locale, slug, entry, fallback: !localized };
		}),
	);
}

export function directory(docs: Awaited<ReturnType<typeof documents>>, locale: Locale) {
	return groups.map(({ labels, items }) => ({
		label: labels[locales.indexOf(locale)],
		items: items.map((slug) => {
			const doc = docs.find((doc) => doc.locale === locale && doc.slug === slug)!;
			return {
				slug,
				title: doc.entry.data.sidebar?.label ?? doc.entry.data.title,
				href: href(locale, slug),
				fallback: doc.fallback,
			};
		}),
	}));
}

export async function searchIndex() {
	const docs = await documents();
	const headings = new Map(
		await Promise.all(
			docs
				.filter(({ fallback }) => !fallback)
				.map(
					async ({ entry }) =>
						[entry.id, (await render(entry)).headings.map(({ text }) => text)] as const,
				),
		),
	);

	return docs.map(({ locale, slug, entry, fallback }) => ({
		locale,
		href: href(locale, slug),
		title: entry.data.title,
		description: entry.data.description,
		headings: headings.get(entry.id) ?? [],
		commands: [...new Set((entry.body ?? '').match(/^rumbo [a-z][a-z -]*/gm) ?? [])].map(
			(command) => command.trim(),
		),
		lang: fallback ? 'en' : locale,
	}));
}
