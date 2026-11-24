import type { APIRoute } from 'astro';
import { documents } from '../documents';
import { href, locales } from '../navigation';

export const GET: APIRoute = async ({ site }) => {
	const docs = await documents();
	const paths = [
		...locales.map((locale) => href(locale)),
		...docs.filter(({ fallback }) => !fallback).map(({ locale, slug }) => href(locale, slug)),
	];
	const urls = paths.map((path) => `<url><loc>${new URL(path, site)}</loc></url>`).join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{
			headers: { 'Content-Type': 'application/xml; charset=utf-8' },
		},
	);
};
