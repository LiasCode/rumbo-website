---
title: Releases
description: What each release of rumbo brought, which one this site describes, and whether the development branch has anything no release does yet.
---

This site describes **rumbo 0.11.0**. The exact notes of every release are in the repository's [CHANGELOG](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md), and the archives on its [releases page](https://github.com/LiasCode/rumbo/releases).

## Unreleased

Nothing yet: the `main` branch is the 0.11.0 release. [What changes after 0.11.0](/reference/next/).

## 0.11.0 (2026-11-25)

**The current release.** The terminal UI does everything with a few commands typed in the composer.

- **The command palette is gone.** A slash on an empty line starts a command, and so does Ctrl-P. [Terminal UI](/guides/terminal-ui/#commands).
- **Fewer commands, in your words**: `/new`, `/sessions`, `/resume`, `/rename`, `/branch`, `/compact`, `/delete`, `/copy`, `/export`, `/status`, `/changes`, `/model`, `/login`, `/logout`, `/providers`, `/extensions`, `/settings`, `/rumbos`, `/help`, and `/quit`. They take the place of `/use`, `/session-set`, `/config`, `/system-set`, `/skills`, `/processes`, every `/provider-…` and `/extension-…`, and the commands named after an extension, which are called as `/extensions <name> <function>`.
- **Every word is completed**: what a command still takes shows after the cursor, the menu shows an example, a command typed wrong is answered with the one meant, and `/extensions <name> tools=` chooses an MCP server's tools from all it has.
- **More room for the conversation.** The bar at the top is gone, the sidebar starts put away (Ctrl-B), and the conversation takes the whole width. Under the composer are the Git branch and the folder, and how many runs work in other sessions.
- **The keys of the conversation and the sidebar**: j and k, gg and G, K and J between your messages, c to copy, and b to branch from your message; d deletes a session in the sidebar, which says how long ago each was used.
- The line under a finished task gives its tokens in and out, then what the cache gave, and a session you continue says how long each earlier task took, as `/export` does.
- **Copying works in more terminals**: also through the desktop's clipboard, or tmux's buffer, when the terminal does not take OSC 52.
- The `mcp` extension lists every tool its server has with a function of its own, `tools`. Its sign-in is `/login <name>`.
- **The front end protocol stays at version 2.** A history's `ended` has `took`, how long the run took in milliseconds, and what the host answers no longer names its functions as commands. [Front end protocol](/reference/frontend-protocol/#event).

[Release](https://github.com/LiasCode/rumbo/releases/tag/v0.11.0) · [What changed in the source](https://github.com/LiasCode/rumbo/compare/v0.10.0...v0.11.0)

## Earlier releases

| Version | Date       | What it brought                                                                                        |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------ |
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
