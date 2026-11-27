---
title: Releases
description: What each release of rumbo brought, which one this site describes, and whether the development branch has anything no release does yet.
---

This site describes **rumbo 0.13.0**. The exact notes of every release are in the repository's [CHANGELOG](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md), and the archives on its [releases page](https://github.com/LiasCode/rumbo/releases).

## Unreleased

Nothing yet: the `main` branch is the 0.13.0 release. [What changes after 0.13.0](/reference/next/).

## 0.13.0 (2026-11-27)

**The current release.** rumbo comes with a skill that tells the model where its documentation is, and `anthropic` sends a tool's whole schema.

- **The skill `rumbo`.** rumbo's own plugin brings a skill that points the model at rumbo's documentation in its repository, so it can answer questions about rumbo and help write plugins, providers, front ends, and extensions. rumbo writes it to `~/.rumbo/builtin/skills/`, and a skill of yours called `rumbo` replaces it. [Skills](/guides/instructions-and-skills/#skills).
- **A tool's whole schema with `anthropic`**, as with `openai` and `chatgpt`, instead of only its properties and which are required. A tool of an MCP server whose schema refers to definitions of its own (`$defs` and `$ref`), or allows no fields but its own, reaches the model as the server wrote it. [MCP servers](/guides/extensions/#add-an-mcp-server).

Nothing changes in the protocols, the commands, or where rumbo keeps the rest.

[Release](https://github.com/LiasCode/rumbo/releases/tag/v0.13.0) · [What changed in the source](https://github.com/LiasCode/rumbo/compare/v0.12.0...v0.13.0)

## Earlier releases

| Version | Date       | What it brought                                                                                        |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| 0.12.0  | 2026-11-26 | Windows, everything in `~/.rumbo/`, and files of any kind. The front end protocol is at version 3.     |
| 0.11.0  | 2026-11-25 | Commands typed in the composer take the place of the palette, and the conversation the whole width.    |
| 0.10.0  | 2026-11-25 | A rumbo is one session, rooted where it starts. The front end protocol is at version 2.                |
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
