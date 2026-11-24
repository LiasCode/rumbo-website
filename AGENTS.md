# rumbo-web: agent guide

This is the official site for [rumbo](https://github.com/LiasCode/rumbo), built
with Astro and published in English, Spanish, French, and Italian. The site
builds from this repository alone.

## Boundaries

- `src/navigation.ts` owns the routes, navigation order, and locale labels.
  English lives at the root; the other locales use `/es/`, `/fr/`, and `/it/`.
- `src/content/docs/` holds Markdown articles. `src/documents.ts` connects
  content to navigation, search, and locale fallbacks. Reference pages may
  fall back to English; show that explicitly and use the English canonical URL.
- `src/layouts/` owns the shared shell and documentation layout.
  `src/styles/site.css` owns the palette (rice paper, sumi ink, and the
  vermilion of a seal; the dark panels are "night"), the typography, and the
  responsive layout. Add no color outside those tokens.
- Controls and icons are shared. Every button, select, and text field uses
  `.button`, `.select`, or `.field` from `site.css` (with `.solid`, `.square`,
  `.small`, and `.night` on a dark panel), and every arrow or mark is an
  `Icon.astro`. Style no control in a component, and type no arrow character.
- `src/components/ink.ts` computes the brush strokes at build time, from
  seeds, so nothing is filtered in the browser. `timeline.ts` drives the
  drawings that grow: an element with `data-span="from to"` is given `--t`.
- The drawings: `Heart.astro` (the cover), `Growth.astro` (the host growing
  into everything built on it; `compact` in the introduction and the
  architecture article), `RunTrace.astro` (one run, frame by frame),
  `Compositions.astro` (recipes), and `Sequence.astro` (the frames of a
  protocol, at the top of the articles `Article.astro` names).
- `src/site.mjs` owns the site address, repository, and published release.
  The production output includes a local search index, sitemap, and robots.txt.
  `design/og.svg` is the editable social image; `bun run og` renders it.

## Content rules

- Check claims against the release named in `src/site.mjs`. Identify unreleased
  behavior separately in `reference/next.md` and the changelog. In particular,
  do not mix front end protocol versions or their session semantics.
- Use the tagged source, wire types, dispatch code, tests and `rumbo help` as
  evidence. Write original explanations and diagrams here; do not import
  upstream Markdown or diagrams. Link to the exact version of the source.
- `RunTrace.astro` and `Sequence.astro` show the frames rumbo really sends:
  the first was checked by running the release with a provider and an
  extension made for it, in both ways of starting. Change a frame there only
  with the wire types open, and keep both ways of starting.
- Add full guides in all four languages and place them in the navigation.
  Give every article a description. Keep code examples in English. Use
  site-absolute links, in the same locale unless explicitly switching languages
  or quoting an English fallback reference.
- Prefer a drawing to a paragraph, a table to a list of cases, and a small
  example to a description. Everything that moves must be readable without
  scripts, stop under `prefers-reduced-motion`, fit a 320 px screen, and move
  only transforms, opacity, and stroke offsets.
- In a table, the first column names the row. `Article.astro` keeps a first
  cell of up to 34 characters on one line, and the styles never break a word
  of a longer one, so write first cells short.
- On release, update `src/site.mjs`, the localized install snippets, the
  changelog, the CLI reference, and any guides and protocols that changed.

## Verification

Run `bun run verify` for format, lint, Astro types, the production build, and
checks of the generated pages, routes, and anchors. Run the dev server in the
background when working as an agent.
