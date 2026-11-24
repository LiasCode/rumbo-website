---
title: Releases
description: What each release of rumbo brought, which one this site describes, and whether the development branch has anything no release does yet.
---

This site describes **rumbo 0.10.0**. The exact notes of every release are in the repository's [CHANGELOG](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md), and the archives on its [releases page](https://github.com/LiasCode/rumbo/releases).

## Unreleased

Nothing yet: the `main` branch is the 0.10.0 release. [What changes after 0.10.0](/reference/next/).

## 0.10.0 (2026-11-25)

**The current release.** A rumbo is one session.

- **One rumbo, one session.** Each `rumbo` works in a session of its own, with its own provider and extensions; another session is another `rumbo`. `-single` is gone. [Sessions](/guides/sessions/#one-rumbo-one-session).
- **A session's root is where it was started.** rumbo no longer looks for a Git repository: `-c`, `rumbo sessions`, and the `AGENTS.md`, `CLAUDE.md`, and `.agents/skills/` read are those of the starting directory alone.
- `/sessions`, `/projects`, `/open`, `/new`, and `/prune` are gone. `rumbo sessions`, `rm`, and `prune` manage sessions, and `rumbo sessions -json` lists them for a program.
- `/branch` says which session it made, and another rumbo goes on in it. A branch is titled after the session it came from.
- **The terminal UI** starts a rumbo for each session you show, closes those left with nothing to do, and has `/rumbos`, `/delete`, and `/processes`.
- **The front end protocol is at version 2**, and a front end that speaks version 1 is refused. It adds `processes`, `title`, and the `extension` group of functions. [Front end protocol](/reference/frontend-protocol/).
- **Extensions are managed from any front end**: `/extensions`, `/extension-add`, `/extension-show`, `/extension-set`, and `/extension-rm`.
- `{self}` is any word of a command, not only the first.
- Going back, rumbo 0.9.0 lists a session this version made or changed only with `rumbo sessions -all`, and continues it with `-s <session>`.

[Release](https://github.com/LiasCode/rumbo/releases/tag/v0.10.0) · [What changed in the source](https://github.com/LiasCode/rumbo/compare/v0.9.0...v0.10.0)

## Earlier releases

| Version | Date       | What it brought                                                                                        |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| 0.9.0   | 2026-11-24 | Extensions, MCP servers, and plugins. rumbo's own providers and terminal UI become the `rumbo` plugin. |
| 0.8.1   | 2026-11-23 | Misspelled commands and configuration fields are refused, saying where, instead of being ignored.      |
| 0.8.0   | 2026-11-23 | The terminal UI takes the whole screen, with the sessions in a sidebar. Images go with what you ask.   |
| 0.7.0   | 2026-11-21 | The model looks at images with `read`, and can use the screen with the computer tool.                  |
| 0.6.0   | 2026-11-20 | One `config.yaml`, each session in a directory of its own, and every setting changed as `name=value`.  |
| 0.5.0   | 2026-11-16 | Skills, session status, rename and prune, `rumbo request`, cache-miss notices, compaction at 80%.      |
| 0.4.0   | 2026-11-15 | The `chatgpt` provider, which uses a ChatGPT plan.                                                     |
| 0.3.0   | 2026-11-15 | The first terminal UI, and branching.                                                                  |
| 0.2.0   | 2026-11-15 | Sign-in with an API key, and OpenAI's Responses API.                                                   |
| 0.1.0   | 2026-11-15 | The first release: the loop, four tools, and the provider and front end protocols.                     |

[Install the current release](/start/installation/)
