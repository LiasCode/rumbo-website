---
title: Releases
description: What each release of rumbo brought, which one this site describes, and whether the development branch has anything no release does yet.
---

This site describes **rumbo 0.12.0**. The exact notes of every release are in the repository's [CHANGELOG](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md), and the archives on its [releases page](https://github.com/LiasCode/rumbo/releases).

## Unreleased

Nothing yet: the `main` branch is the 0.12.0 release. [What changes after 0.12.0](/reference/next/).

## 0.12.0 (2026-11-26)

**The current release.** rumbo runs on Windows, keeps everything in one directory, and the model is given files of any kind.

- **Windows.** The releases have a zip with `rumbo.exe`, for amd64 and arm64. The model runs commands with PowerShell there, through a tool called `powershell` in place of `bash`; the computer tool, Ctrl-V, and what the processes use are not available yet, and say so. rumbo passes its checks on Windows and macOS but is used every day only on Linux. [Installation](/start/installation/).
- **Everything in `~/.rumbo/`**: `config.yaml`, your instructions and skills, credentials, plugins, sessions, and pasted images, the same on every system, or where `RUMBO_HOME` says. What 0.11.0 kept elsewhere is not moved. [Where rumbo keeps things](/start/installation/#where-rumbo-keeps-things).
- **Files of any kind with what you ask.** `/attach <file>`, Ctrl-V for the files copied in a file manager or the image held, and a file dropped on the terminal give the model the file's path, and it reads the file when it needs to. [Files](/guides/terminal-ui/#files).
- **The front end protocol is version 3.** `files`, a list of paths, takes the place of `images` in `run`, `steer`, and the `objective` and `steer` events. On Windows a front end rumbo starts reads the protocol from the handles `RUMBO_FRONTEND_HANDLES` names. [Front end protocol](/reference/frontend-protocol/).
- A plugin built with Go builds into a directory, `-o bin/`, so that Windows gets the `.exe` it runs. [Plugins](/reference/plugins/).

[Release](https://github.com/LiasCode/rumbo/releases/tag/v0.12.0) · [What changed in the source](https://github.com/LiasCode/rumbo/compare/v0.11.0...v0.12.0)

## Earlier releases

| Version | Date       | What it brought                                                                                        |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
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
