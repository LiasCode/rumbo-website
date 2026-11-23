// Checks that every page written here exists in every language the site
// has, so a page is never added or removed in one language alone. The
// reference copied from rumbo's repository is in English only, and is left
// out.

import { readdir } from 'node:fs/promises';
import path from 'node:path';

const languages = ['es', 'fr', 'it'];

const root = path.resolve(import.meta.dirname, '..');
const docsDir = path.join(root, 'src/content/docs');
const copiedDir = 'reference';
const writtenHere = ['reference/command-line.md'];

async function pages(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { recursive: true, withFileTypes: true });

	return entries
		.filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
		.map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)))
		.sort();
}

const all = await pages(docsDir);

const english = all.filter((page) => {
	const top = page.split(path.sep)[0];

	if (languages.includes(top)) {
		return false;
	}

	return top !== copiedDir || writtenHere.includes(page);
});

const problems: string[] = [];

for (const language of languages) {
	const translated = await pages(path.join(docsDir, language));

	for (const page of english) {
		if (!translated.includes(page)) {
			problems.push(`${language}/${page} is missing`);
		}
	}

	for (const page of translated) {
		if (!english.includes(page)) {
			problems.push(`${language}/${page} has no English page`);
		}
	}
}

if (problems.length > 0) {
	console.error(
		`Every page is written in English, ${languages.join(', ')}:\n  ${problems.join('\n  ')}`,
	);
	process.exit(1);
}

console.log(`${english.length} pages in English, ${languages.join(', ')}`);
