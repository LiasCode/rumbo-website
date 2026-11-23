// What the whole site says about itself, read by the Astro configuration and
// by the pages that need it, so it is written once.

// The address the site is published at. Canonical links, the sitemap,
// robots.txt, and the social preview are all built from it.
export const site = 'https://rumbo.liascode.dev';

export const repository = 'https://github.com/LiasCode/rumbo';

export const description =
	'rumbo is a minimal, open-source agent harness for your terminal. Bring any model and any interface: Claude, OpenAI, ChatGPT, or a local model, with sessions you can replay.';

// rumbo's latest release, which the install instructions name: the first
// dated section of the changelog, "## X.Y.Z (YYYY-MM-DD)".
export const release = { version: '0.7.0', date: '2026-11-21' };
