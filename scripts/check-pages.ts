// Checks the pages before the site is built:
//
// - every page exists in every language the site has, so a page is never
//   added or removed in one language alone. The reference is in English
//   only, but for the command line;
// - no page draws a diagram as ASCII art, which goes in a code block without
//   a language. Diagrams are SVG images.

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const languages = ['es', 'fr', 'it'];

const root = path.resolve(import.meta.dirname, '..');
const docsDir = path.join(root, 'src/content/docs');
const englishOnlyDir = 'reference';
const translatedReference = ['reference/command-line.md'];

async function pages(dir: string): Promise<string[]> {
	const entries = await readdir(dir, { recursive: true, withFileTypes: true });

	return entries
		.filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
		.map((entry) => path.relative(dir, path.join(entry.parentPath, entry.name)))
		.sort();
}

// The lines of a page that open a code block without naming its language.
function bareCodeBlocks(text: string): number[] {
	const lines: number[] = [];
	let inBlock = false;

	for (const [index, line] of text.split('\n').entries()) {
		if (!line.trimStart().startsWith('```')) {
			continue;
		}

		if (!inBlock && line.trim() === '```') {
			lines.push(index + 1);
		}

		inBlock = !inBlock;
	}

	return lines;
}

const all = await pages(docsDir);
const problems: string[] = [];

const english = all.filter((page) => {
	const top = page.split(path.sep)[0];

	if (languages.includes(top)) {
		return false;
	}

	return top !== englishOnlyDir || translatedReference.includes(page);
});

for (const language of languages) {
	const translated = await pages(path.join(docsDir, language));

	for (const page of english) {
		if (!translated.includes(page)) {
			problems.push(
				`${language}/${page} is missing: every page is written in English, ${languages.join(', ')}`,
			);
		}
	}

	for (const page of translated) {
		if (!english.includes(page)) {
			problems.push(`${language}/${page} has no English page`);
		}
	}
}

for (const page of all) {
	const text = await readFile(path.join(docsDir, page), 'utf8');

	for (const line of bareCodeBlocks(text)) {
		problems.push(
			`${page}:${line} opens a code block without a language: name it, or draw a diagram as an SVG`,
		);
	}
}

if (problems.length > 0) {
	console.error(problems.join('\n'));
	process.exit(1);
}

console.log(
	`${all.length} pages checked: ${english.length} in English, ${languages.join(', ')}, and no ASCII diagrams`,
);
