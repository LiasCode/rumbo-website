import type { APIRoute } from 'astro';

// Built from the configured site, so the sitemap's address is never written twice.
export const GET: APIRoute = ({ site }) => {
	if (!site) {
		throw new Error('robots.txt needs the site address: set `site` in astro.config.mjs');
	}

	const sitemap = new URL('sitemap-index.xml', site).href;

	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
