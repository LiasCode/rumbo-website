# rumbo-web

The website of [rumbo](https://github.com/LiasCode/rumbo), the minimal agent
harness: a landing page and the documentation, in English, Spanish, French,
and Italian. Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build).

## Develop

It needs [Bun](https://bun.sh).

```sh
bun install
bun run dev        # http://localhost:4321
```

| Command           | Does                                                                             |
| ----------------- | -------------------------------------------------------------------------------- |
| `bun run dev`     | Serve the site while you edit it                                                 |
| `bun run build`   | Build the site into `dist/`                                                      |
| `bun run preview` | Serve what `build` made                                                          |
| `bun run pages`   | Check that every page exists in every language, and that no diagram is ASCII art |
| `bun run verify`  | Format check, lint, pages, type check, and the production build                  |
| `bun run format`  | Format the code                                                                  |
| `bun run og`      | Render `design/og.svg` to `public/og.png` (needs `resvg`)                        |

The documentation is written here, from what rumbo's repository says.
[AGENTS.md](AGENTS.md) says how to bring it up to date, and how the site is
put together.

## Publish

The site is static: `bun run build` writes it to `dist/`. Any static host
serves it, such as Cloudflare Pages, with `bun run build` as the build
command and `dist` as the output directory.

The address it is published at is `site` in `src/site.mjs`; change it there
before the first deploy.
