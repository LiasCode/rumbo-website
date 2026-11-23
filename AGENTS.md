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
  the repository, and its description. Canonical links, the sitemap,
  `robots.txt` (`src/pages/robots.txt.ts`), and the social preview are built
  from the address.
- `scripts/sync-reference.ts` copies rumbo's reference docs and changelog
  into `src/content/docs/reference/`, the images they show and the home
  page's diagram into `public/diagrams/`, and the latest release into
  `src/generated/release.json`, from a rumbo checkout at `../rumbo` or
  `RUMBO_DIR`. `dev`, `build`, and `check` run it first. Those files are not
  kept in this repository.
- The copied reference is in English only. In the other languages Starlight
  shows the English page, saying it is not translated, and
  `src/routeData.ts` makes the English page its canonical address.
- `design/og.svg` is the social preview; `bun run og` renders it to
  `public/og.png` with `resvg`.

## Rules

- **The reference is rumbo's.** Never edit a copied page here: change it in
  rumbo's repository. Only `reference/command-line.md` is written here.
- **Say only what rumbo does.** Every claim on a page is checked against
  rumbo's README, docs, or code, and links to the reference for the details
  instead of copying them.
- **Every page is in every language.** A page written here exists in English
  and under `es/`, `fr/`, and `it/` with the same path, and a change to one
  is made to all four in the same change. `bun run translations` fails
  otherwise. Code blocks stay as they are in English: commands, and what
  rumbo prints.
- **Diagrams are SVG, never ASCII art.** Draw one as an `.svg` with a
  `<title>` and a `<desc>`, colors for light and dark
  (`prefers-color-scheme`), and a background of its own, as rumbo's
  `docs/*.svg` are. The sync refuses a copied page with a code block without
  a language, which is where ASCII diagrams are drawn.
- **A new page goes in the sidebar** in `astro.config.mjs`, and has a
  `description` in each language, which is what search engines show.
- **Links are site-absolute and stay in their language** (`/guides/sessions/`
  in English, `/es/guides/sessions/` in Spanish). A link to a heading uses
  that language's heading. The links validator fails the build on a broken
  link, or one to another language.
- **Versions are not written by hand.** A page that names the latest release
  imports `src/generated/release.json`.

## Commands

```sh
bun install
bun run dev             # http://localhost:4321
bun run verify          # format check, lint, translations, astro check, and the production build
```

When starting the dev server from an agent, run it in the background.
