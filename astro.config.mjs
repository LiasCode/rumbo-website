import { defineConfig } from 'astro/config';
import { site } from './src/site.mjs';

export default defineConfig({
	site,
	trailingSlash: 'always',
	markdown: { shikiConfig: { theme: 'github-dark' } },
});
