import { defineConfig } from 'astro/config';
import { site } from './src/site.mjs';

export default defineConfig({
	site,
	trailingSlash: 'always',
	// Listings are printed in ink, with comments dimmed: site.css gives the colors.
	markdown: { shikiConfig: { theme: 'css-variables' } },
});
