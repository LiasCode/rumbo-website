# rumbo-web

The multilingual website and documentation for [rumbo](https://github.com/LiasCode/rumbo).
Astro renders the site to static HTML; documentation and search do not need a server.

## Develop

Use [Bun](https://bun.sh) and Node.js 22.23.4 or newer (Astro 7).

```sh
bun install
bun run dev    # http://localhost:4321
bun run verify
```

`bun run verify` checks formatting, lint, types, the production build, and the
built documentation. `bun run preview` serves the output in `dist/` locally.

To regenerate the social image, install `resvg` and the GNU FreeFont fonts and run
`bun run og`. See [AGENTS.md](AGENTS.md) for content and release conventions.
