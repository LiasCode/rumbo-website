# rumbo-web

The website of [rumbo](https://github.com/LiasCode/rumbo), the minimal agent
harness: a landing page and the documentation, in English, Spanish, French,
and Italian. Built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build).

## Develop

It needs [Bun](https://bun.sh), and a checkout of rumbo beside this
directory, at `../rumbo`, or wherever `RUMBO_DIR` says: the reference pages,
the changelog, and the latest release are copied from it.

```sh
bun install
bun run dev        # http://localhost:4321
```

| Command                | Does                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| `bun run sync`         | Copy the reference from rumbo's checkout                               |
| `bun run dev`          | Serve the site while you edit it                                       |
| `bun run build`        | Build the site into `dist/`                                            |
| `bun run preview`      | Serve what `build` made                                                |
| `bun run translations` | Check that every page exists in every language                         |
| `bun run verify`       | Format check, lint, translations, type check, and the production build |
| `bun run format`       | Format the code                                                        |
| `bun run og`           | Render `design/og.svg` to `public/og.png` (needs `resvg`)              |

## Publish

The site is static: `bun run build` writes it to `dist/`. Any static host
serves it, such as Cloudflare Pages, with the build command:

```sh
git clone --depth 1 https://github.com/LiasCode/rumbo ../rumbo && bun run build
```

The address it is published at is `site` in `src/site.mjs`; change it there
before the first deploy.

See [AGENTS.md](AGENTS.md) for how the site is put together.
