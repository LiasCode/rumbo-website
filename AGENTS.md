# rumbo-web: agent guide

The official website of [rumbo](https://github.com/LiasCode/rumbo): a landing
page that brings people to the repository, and rumbo's documentation. Built
with Astro and Starlight, in English, Spanish, French, and Italian.

## How it is put together

- `src/content/docs/` holds the pages: English at its root, and the same
  pages translated under `es/`, `fr/`, and `it/`. The landing page is
  `index.mdx` in each. The sidebar's order, its group labels in each
  language, and the languages are in `astro.config.mjs`; an item's label is
  its page's title, or its `sidebar.label`.
- `src/site.mjs` holds what the whole site says about itself: its address,
  the repository, its description, and rumbo's latest release, which the
  install instructions name. Canonical links, the sitemap, `robots.txt`
  (`src/pages/robots.txt.ts`), and the social preview are built from the
  address.
- `src/content/docs/reference/` is in English only, but for
  `command-line.md`. In the other languages Starlight shows the English page,
  saying it is not translated, and `src/routeData.ts` makes the English page
  its canonical address.
- `public/diagrams/` holds the diagrams, as SVG.
- `design/og.svg` is the social preview; `bun run og` renders it to
  `public/og.png` with `resvg`.

The site builds from this repository alone: nothing is read from rumbo's
repository when it builds or is checked.

## Updating the documentation

The documentation is written here, from what rumbo's repository says. To
bring it up to date, read rumbo's repository, a checkout beside this one
(`../rumbo`) or [on GitHub](https://github.com/LiasCode/rumbo), and write
what changed:

1. Find what changed since the site was last updated: `git log` and the
   diff of rumbo's `README.md`, `CHANGELOG.md`, `docs/`, `examples/`, and
   the commands' help (`internal/cli`).
2. Update the reference pages from rumbo's `docs/`: `architecture.md`,
   `use-cases.md`, `protocol.md` (`provider-protocol.md` here),
   `frontend-protocol.md`, and `glossary.md`, and `changelog.md` from its
   `CHANGELOG.md`. Links between them are site links (`/reference/...`);
   links to anything else in rumbo's repository go to it on GitHub.
3. Copy a diagram rumbo's docs add or change into `public/diagrams/`.
4. Update the guides each change touches, in all four languages, and
   `reference/command-line.md` from `rumbo help` and the help of each group
   of commands.
5. After a release, set `release` in `src/site.mjs` to the changelog's
   first dated section.
6. Check every claim against rumbo's code where the docs are unclear, and
   run `bun run verify`.

## Rules

- **Say only what rumbo does.** Every claim on a page is checked against
  rumbo's README, docs, or code, and links to the reference for the details
  instead of repeating them.
- **Every page is in every language.** A page outside the reference exists
  in English and under `es/`, `fr/`, and `it/` with the same path, and a
  change to one is made to all four in the same change. Code blocks stay as
  they are in English: commands, and what rumbo prints.
- **Diagrams are SVG, never ASCII art.** Draw one as an `.svg` in
  `public/diagrams/` with a `<title>` and a `<desc>`, colors for light and
  dark (`prefers-color-scheme`), and a background of its own, as the ones
  there are.
- **A new page goes in the sidebar** in `astro.config.mjs`, and has a
  `description` in each language, which is what search engines show.
- **Links are site-absolute and stay in their language** (`/guides/sessions/`
  in English, `/es/guides/sessions/` in Spanish). A link to a heading uses
  that language's heading. The links validator fails the build on a broken
  link, or one to another language.

`bun run pages` fails on a page missing in a language, and on a code block
without a language, which is where ASCII diagrams are drawn.

## Commands

```sh
bun install
bun run dev             # http://localhost:4321
bun run verify          # format check, lint, pages, astro check, and the production build
```

When starting the dev server from an agent, run it in the background.
