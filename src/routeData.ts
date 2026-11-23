import { defineRouteMiddleware } from '@astrojs/starlight/route-data';

// A page not yet translated shows the English one at its language's address.
// Search engines are told the English page is the original, so the same text
// is not indexed twice.
export const onRequest = defineRouteMiddleware((context) => {
	const route = context.locals.starlightRoute;

	if (!route.isFallback || !context.site) {
		return;
	}

	const canonical = route.head.find((tag) => tag.tag === 'link' && tag.attrs?.rel === 'canonical');

	if (canonical?.attrs) {
		canonical.attrs.href = new URL(`${route.entry.id}/`, context.site).href;
	}
});
