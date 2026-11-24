export const locales = ['en', 'es', 'fr', 'it'] as const;
export type Locale = (typeof locales)[number];

export const languageNames = { en: 'English', es: 'Español', fr: 'Français', it: 'Italiano' };

export function href(locale: Locale, slug = '') {
	return `${locale === 'en' ? '' : `/${locale}`}/${slug ? `${slug}/` : ''}`;
}

export function entryId(locale: Locale, slug: string) {
	return locale === 'en' ? slug : `${locale}/${slug}`;
}

export const groups = [
	{
		labels: ['Start here', 'Empieza aquí', 'Pour commencer', 'Per iniziare'],
		items: ['start/introduction', 'start/installation', 'start/quick-start', 'start/safety'],
	},
	{
		labels: ['Guides', 'Guías', 'Guides', 'Guide'],
		items: [
			'guides/terminal-ui',
			'guides/sessions',
			'guides/providers',
			'guides/configuration',
			'guides/instructions-and-skills',
			'guides/computer-use',
			'guides/scripting',
			'guides/desktop-app',
			'guides/extensions',
			'guides/plugins',
		],
	},
	{
		labels: ['Build', 'Desarrolla', 'Développer', 'Sviluppa'],
		items: ['extend/provider', 'extend/front-end', 'extend/extension'],
	},
	{
		labels: ['Concepts', 'Conceptos', 'Concepts', 'Concetti'],
		items: ['concepts/design', 'concepts/faq'],
	},
	{
		labels: ['Reference', 'Referencia', 'Référence', 'Riferimento'],
		items: [
			'reference/command-line',
			'reference/architecture',
			'reference/use-cases',
			'reference/provider-protocol',
			'reference/frontend-protocol',
			'reference/extension-protocol',
			'reference/plugins',
			'reference/glossary',
			'reference/next',
			'reference/changelog',
		],
	},
];

export const slugs = groups.flatMap(({ items }) => items);

export const interfaceCopy = {
	en: {
		docs: 'Documentation',
		contents: 'On this page',
		search: 'Search docs',
		close: 'Close',
		empty: 'No matching pages.',
		skip: 'Skip to content',
		fallback: 'This reference is available in English.',
		prev: 'Previous',
		next: 'Next',
		copy: 'Copy',
		copied: 'Copied',
		language: 'Language',
		release: 'For rumbo',
	},
	es: {
		docs: 'Documentación',
		contents: 'En esta página',
		search: 'Buscar en la documentación',
		close: 'Cerrar',
		empty: 'No hay páginas que coincidan.',
		skip: 'Saltar al contenido',
		fallback: 'Esta referencia está disponible en inglés.',
		prev: 'Anterior',
		next: 'Siguiente',
		copy: 'Copiar',
		copied: 'Copiado',
		language: 'Idioma',
		release: 'Para rumbo',
	},
	fr: {
		docs: 'Documentation',
		contents: 'Sur cette page',
		search: 'Rechercher',
		close: 'Fermer',
		empty: 'Aucune page correspondante.',
		skip: 'Aller au contenu',
		fallback: 'Cette référence est disponible en anglais.',
		prev: 'Précédent',
		next: 'Suivant',
		copy: 'Copier',
		copied: 'Copié',
		language: 'Langue',
		release: 'Pour rumbo',
	},
	it: {
		docs: 'Documentazione',
		contents: 'In questa pagina',
		search: 'Cerca nella documentazione',
		close: 'Chiudi',
		empty: 'Nessuna pagina corrispondente.',
		skip: 'Vai al contenuto',
		fallback: 'Questa pagina di riferimento è disponibile in inglese.',
		prev: 'Precedente',
		next: 'Successivo',
		copy: 'Copia',
		copied: 'Copiato',
		language: 'Lingua',
		release: 'Per rumbo',
	},
};
