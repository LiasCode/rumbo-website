# rumbo-web

The website of [rumbo](https://github.com/LiasCode/rumbo), the minimal agent
harness: a landing page and the documentation.

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
