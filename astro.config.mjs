// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

import { description, repository, site } from './src/site.mjs';

// Structured data that tells search engines what rumbo is and that it is free.
const softwareApplication = {
	'@context': 'https://schema.org',
	'@type': 'SoftwareApplication',
	name: 'rumbo',
	description,
	url: site,
	applicationCategory: 'DeveloperApplication',
	operatingSystem: 'Linux, macOS',
	license: 'https://opensource.org/licenses/MIT',
	downloadUrl: `${repository}/releases`,
	offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
	author: { '@type': 'Person', name: 'LiasCode', url: 'https://github.com/LiasCode' },
};

const socialImage = `${site}/og.png`;

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [
		starlight({
			title: 'rumbo',
			description,
			logo: { src: './src/assets/logo.svg', alt: 'rumbo' },
			social: [{ icon: 'github', label: 'GitHub', href: repository }],
			customCss: ['./src/styles/custom.css'],
			routeMiddleware: './src/routeData.ts',
			plugins: [
				// A translated page links to pages of its own language; one not yet
				// translated is checked against the English page it shows.
				starlightLinksValidator({ errorOnFallbackPages: false, errorOnInconsistentLocale: true }),
			],
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: socialImage } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{
					tag: 'meta',
					attrs: { property: 'og:image:alt', content: 'rumbo, a minimal agent harness' },
				},
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: socialImage } },
				{
					tag: 'script',
					attrs: { type: 'application/ld+json' },
					content: JSON.stringify(softwareApplication),
				},
			],
			// English is the default, at the site's root; the others under /es/, /fr/, and /it/.
			// A page not yet translated shows the English one, saying so.
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				es: { label: 'Español', lang: 'es' },
				fr: { label: 'Français', lang: 'fr' },
				it: { label: 'Italiano', lang: 'it' },
			},
			// An item's label is its page's title in each language, or the page's sidebar.label.
			sidebar: [
				{
					label: 'Start here',
					translations: { es: 'Empieza aquí', fr: 'Pour commencer', it: 'Per iniziare' },
					items: [
						{ slug: 'start/introduction' },
						{ slug: 'start/installation' },
						{ slug: 'start/quick-start' },
						{ slug: 'start/safety' },
					],
				},
				{
					label: 'Guides',
					translations: { es: 'Guías', fr: 'Guides', it: 'Guide' },
					items: [
						{ slug: 'guides/terminal-ui' },
						{ slug: 'guides/sessions' },
						{ slug: 'guides/providers' },
						{ slug: 'guides/configuration' },
						{ slug: 'guides/instructions-and-skills' },
						{ slug: 'guides/computer-use' },
						{ slug: 'guides/scripting' },
						{ slug: 'guides/desktop-app' },
					],
				},
				{
					label: 'Extend rumbo',
					translations: { es: 'Amplía rumbo', fr: 'Étendre rumbo', it: 'Estendi rumbo' },
					items: [{ slug: 'extend/provider' }, { slug: 'extend/front-end' }],
				},
				{
					label: 'Concepts',
					translations: { es: 'Conceptos', fr: 'Concepts', it: 'Concetti' },
					items: [{ slug: 'concepts/design' }, { slug: 'concepts/faq' }],
				},
				{
					label: 'Reference',
					translations: { es: 'Referencia', fr: 'Référence', it: 'Riferimento' },
					items: [
						{ slug: 'reference/command-line' },
						{ slug: 'reference/architecture' },
						{ slug: 'reference/use-cases' },
						{ slug: 'reference/provider-protocol' },
						{ slug: 'reference/frontend-protocol' },
						{ slug: 'reference/glossary' },
						{ slug: 'reference/changelog' },
					],
				},
			],
		}),
	],
});
