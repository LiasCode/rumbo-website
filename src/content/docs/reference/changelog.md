---
title: Releases
description: What each release of rumbo brought, which one this site describes, and what the development branch has that no release does yet.
---

This site describes **rumbo 0.9.0**. The exact notes of every release are in the repository's [CHANGELOG](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md), and the archives on its [releases page](https://github.com/LiasCode/rumbo/releases).

## Unreleased

The `main` branch makes each rumbo one session, moves the front end protocol to version 2, and lets any front end manage extensions. None of it is in a release. [What changes after 0.9.0](/reference/next/).

## 0.9.0 (2026-11-24)

**The current release.** rumbo gets its third protocol, and a way to ship what speaks them.

- **Extensions.** Any program can give the model tools, take the place of one of rumbo's own when you say so, tell the model something when a run starts, offer you commands, ask you a question from inside a tool, and be told what the runs do. [Extensions and MCP](/guides/extensions/).
- **MCP servers** work through the extension rumbo brings for them, started with a command or reached at a URL, with a sign-in in the browser when the server wants one.
- **Plugins** bring providers, front ends, extensions, and skills at once, from a directory or a Git repository, and can be built where they are added. [Plugins](/guides/plugins/).
- rumbo's own providers and terminal UI are now a plugin, `rumbo`, built into the executable. Only `plain` is still built in.
- A `config.yaml` with `extensions:` or `plugins:` is refused by 0.8.1 and earlier.

[Release](https://github.com/LiasCode/rumbo/releases/tag/v0.9.0) · [What changed in the source](https://github.com/LiasCode/rumbo/compare/v0.8.1...v0.9.0)

## Earlier releases

| Version | Date       | What it brought                                                                                       |
| ------- | ---------- | ----------------------------------------------------------------------------------------------------- |
| 0.8.1   | 2026-11-23 | Misspelled commands and configuration fields are refused, saying where, instead of being ignored.     |
| 0.8.0   | 2026-11-23 | The terminal UI takes the whole screen, with the sessions in a sidebar. Images go with what you ask.  |
| 0.7.0   | 2026-11-21 | The model looks at images with `read`, and can use the screen with the computer tool.                 |
| 0.6.0   | 2026-11-20 | One `config.yaml`, each session in a directory of its own, and every setting changed as `name=value`. |
| 0.5.0   | 2026-11-16 | Skills, session status, rename and prune, `rumbo request`, cache-miss notices, compaction at 80%.     |
| 0.4.0   | 2026-11-15 | The `chatgpt` provider, which uses a ChatGPT plan.                                                    |
| 0.3.0   | 2026-11-15 | The first terminal UI, and branching.                                                                 |
| 0.2.0   | 2026-11-15 | Sign-in with an API key, and OpenAI's Responses API.                                                  |
| 0.1.0   | 2026-11-15 | The first release: the loop, four tools, and the provider and front end protocols.                    |

[Install the current release](/start/installation/)
