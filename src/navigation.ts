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

// The section of the manual a page is in, as man numbers them: its group's
// place in the navigation, from 1.
export function section(slug: string) {
	return groups.findIndex(({ items }) => items.includes(slug)) + 1;
}

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
		manual: 'rumbo manual',
		index: 'index',
		heads: {
			name: 'Name',
			synopsis: 'Synopsis',
			description: 'Description',
			examples: 'Examples',
			seeAlso: 'See also',
		},
		keys: { search: 'search', page: 'page', home: 'front page' },
		ribbon: 'ribbon',
		ribbons: { paper: 'paper', carbon: 'carbon' },
		missing: 'No manual entry for this page.',
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
		manual: 'Manual de rumbo',
		index: 'índice',
		heads: {
			name: 'Nombre',
			synopsis: 'Sinopsis',
			description: 'Descripción',
			examples: 'Ejemplos',
			seeAlso: 'Véase también',
		},
		keys: { search: 'buscar', page: 'página', home: 'portada' },
		ribbon: 'cinta',
		ribbons: { paper: 'papel', carbon: 'carbón' },
		missing: 'No hay entrada de manual para esta página.',
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
		manual: 'Manuel de rumbo',
		index: 'index',
		heads: {
			name: 'Nom',
			synopsis: 'Synopsis',
			description: 'Description',
			examples: 'Exemples',
			seeAlso: 'Voir aussi',
		},
		keys: { search: 'rechercher', page: 'page', home: 'accueil' },
		ribbon: 'ruban',
		ribbons: { paper: 'papier', carbon: 'carbone' },
		missing: 'Aucune entrée de manuel pour cette page.',
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
		manual: 'Manuale di rumbo',
		index: 'indice',
		heads: {
			name: 'Nome',
			synopsis: 'Sinossi',
			description: 'Descrizione',
			examples: 'Esempi',
			seeAlso: 'Vedi anche',
		},
		keys: { search: 'cerca', page: 'pagina', home: 'copertina' },
		ribbon: 'nastro',
		ribbons: { paper: 'carta', carbon: 'carbone' },
		missing: 'Nessuna voce di manuale per questa pagina.',
	},
};
