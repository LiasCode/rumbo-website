---
title: What changes after 0.11.0
description: What the development branch of rumbo changes after 0.11.0, checked against its source. Today nothing, since main is the 0.11.0 release.
---

> **Nothing unreleased yet.** The `main` branch of rumbo is the [0.11.0](/reference/changelog/) release, commit `3be63cd`, and its changelog has nothing under _Unreleased_. Everything on this site describes 0.11.0, which is what the install instructions give you.

## What 0.11.0 changed

0.11.0 changed the terminal UI most, and what it changed of the protocols is additive:

| In 0.10.0                                                                       | In 0.11.0                                                                                            |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Ctrl-P opens a command palette.                                                 | Ctrl-P starts a command in the composer, as a slash does. [Commands](/guides/terminal-ui/#commands). |
| A command for each function: `/use`, `/session-set`, `/provider-set`, and more. | A few in your words: `/model`, `/resume`, `/providers`, `/extensions`, `/settings`, and the rest.    |
| An extension's functions are `/<name>-<function>`, such as `/docs-login`.       | `/extensions <name> <function>`, and `/login <name>` to sign in.                                     |
| A header over the conversation, which is at most 100 columns wide.              | No header; the conversation takes the whole width, and the sidebar starts put away.                  |
| The history's `ended` has `status` and `text`.                                  | It also has `took`, in milliseconds. [Front end protocol](/reference/frontend-protocol/#event).      |
| The `mcp` extension declares its server's tools.                                | It also lists every tool the server has, with its `tools` function, for a front end to choose among. |

**Source:** the [changes since 0.11.0](https://github.com/LiasCode/rumbo/compare/v0.11.0...main), and the [changelog](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md).
