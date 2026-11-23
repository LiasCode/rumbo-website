// Copies rumbo's reference docs, and its changelog, into the site, so they
// are written once, in rumbo's repository, and never drift from it here. It
// also notes the latest release, which the install instructions name.
//
// It reads a checkout of rumbo: ../rumbo beside this project, or the one
// RUMBO_DIR names. Links between the copied pages become links of the site;
// links to anything else in the repository go to it on GitHub.

import { access, copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { repository } from '../src/site.mjs';

type Page = {
	source: string;
	slug: string;
	description: string;
};

const pages: Page[] = [
	{
		source: 'docs/architecture.md',
		slug: 'architecture',
		description:
			'How rumbo is built: the agent loop, providers, tools, ambient context, the session store, and the rules the design depends on.',
	},
	{
		source: 'docs/use-cases.md',
		slug: 'use-cases',
		description:
			'Everything the rumbo host, its providers, and its front ends must do, can do, and must not do, including the built-in ones.',
	},
	{
		source: 'docs/protocol.md',
		slug: 'provider-protocol',
		description:
			'The Agent Provider Protocol: the JSON-RPC contract between the rumbo host and a provider, the program that reaches a model.',
	},
	{
		source: 'docs/frontend-protocol.md',
		slug: 'frontend-protocol',
		description:
			'The Agent Frontend Protocol: the JSON-RPC contract between the rumbo host and a front end, the program a person uses.',
	},
	{
		source: 'docs/glossary.md',
		slug: 'glossary',
		description:
			'The terms rumbo uses, from session and entry to provider, front end, and compaction, and what each means.',
	},
	{
		source: 'CHANGELOG.md',
		slug: 'changelog',
		description: 'What changes from one release of rumbo to the next, for the people who use it.',
	},
];

// Images the site shows from rumbo's repository: the home page's diagram, and
// every image a copied page shows, which is added as the pages are copied.
const images = new Set(['docs/how-it-works.svg']);
const imageTypes = ['.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp'];

const root = path.resolve(import.meta.dirname, '..');
const rumboDir = path.resolve(root, process.env.RUMBO_DIR ?? '../rumbo');
const pagesDir = path.join(root, 'src/content/docs/reference');
const imagesDir = path.join(root, 'public/diagrams');

async function exists(file: string): Promise<boolean> {
	try {
		await access(file);

		return true;
	} catch {
		return false;
	}
}

// Where a link in a copied page should point on the site.
async function rewriteLink(source: string, link: string): Promise<string> {
	if (/^[a-z]+:/i.test(link) || link.startsWith('#')) {
		return link;
	}

	const [linkPath, hash] = link.split('#');
	const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), linkPath));
	const anchor = hash ? `#${hash}` : '';

	const page = pages.find((candidate) => candidate.source === resolved);

	if (page) {
		return `/reference/${page.slug}/${anchor}`;
	}

	const local = path.join(rumboDir, resolved);

	if (!(await exists(local))) {
		throw new Error(`${source} links to ${link}, which is not in ${rumboDir}`);
	}

	if (imageTypes.includes(path.extname(resolved).toLowerCase())) {
		images.add(resolved);

		return `/diagrams/${path.basename(resolved)}`;
	}

	const kind = (await stat(local)).isDirectory() ? 'tree' : 'blob';

	return `${repository}/${kind}/main/${resolved}${anchor}`;
}

async function convert(page: Page): Promise<string> {
	const text = await readFile(path.join(rumboDir, page.source), 'utf8');
	const heading = text.match(/^# (.+)\n+/);

	if (!heading) {
		throw new Error(`${page.source} does not start with a "# Title" line`);
	}

	let body = text.slice(heading[0].length);

	// Diagrams are SVG images, never ASCII art, which is drawn in a code
	// block without a language.
	let inBlock = false;

	for (const [index, line] of body.split('\n').entries()) {
		if (!line.startsWith('```')) {
			continue;
		}

		if (!inBlock && line.trim() === '```') {
			throw new Error(
				`${page.source} has a code block without a language after its title, line ${index + 1}: name its language, or draw a diagram as an SVG`,
			);
		}

		inBlock = !inBlock;
	}

	const links = [...body.matchAll(/\]\(([^)\s]+)\)/g)].map((match) => match[1]);

	for (const link of new Set(links)) {
		const rewritten = await rewriteLink(page.source, link);

		body = body.replaceAll(`](${link})`, `](${rewritten})`);
	}

	const frontmatter = [
		'---',
		`# Copied from ${page.source} in rumbo's repository by scripts/sync-reference.ts. Edit it there.`,
		`title: ${JSON.stringify(heading[1])}`,
		`description: ${JSON.stringify(page.description)}`,
		`editUrl: ${JSON.stringify(`${repository}/edit/main/${page.source}`)}`,
		'---',
	].join('\n');

	return `${frontmatter}\n\n${body}`;
}

if (!(await exists(path.join(rumboDir, 'docs/architecture.md')))) {
	console.error(
		`No rumbo checkout at ${rumboDir}. Clone ${repository} there, or set RUMBO_DIR to one.`,
	);
	process.exit(1);
}

await mkdir(pagesDir, { recursive: true });

for (const page of pages) {
	await writeFile(path.join(pagesDir, `${page.slug}.md`), await convert(page));
}

await mkdir(imagesDir, { recursive: true });

for (const image of images) {
	await copyFile(path.join(rumboDir, image), path.join(imagesDir, path.basename(image)));
}

// The latest release is the changelog's first dated section, which the
// install instructions name.
const changelog = await readFile(path.join(rumboDir, 'CHANGELOG.md'), 'utf8');
const release = changelog.match(/^## (\d+\.\d+\.\d+) \((\d{4}-\d{2}-\d{2})\)$/m);

if (!release) {
	throw new Error('CHANGELOG.md has no released version, a "## X.Y.Z (YYYY-MM-DD)" section');
}

const releaseFile = path.join(root, 'src/generated/release.json');

await mkdir(path.dirname(releaseFile), { recursive: true });
await writeFile(
	releaseFile,
	`${JSON.stringify({ version: release[1], date: release[2] }, null, '\t')}\n`,
);

console.log(
	`Copied ${pages.length} pages and ${images.size} images from ${rumboDir}; latest release ${release[1]}`,
);
