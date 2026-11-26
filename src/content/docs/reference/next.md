---
title: What changes after 0.12.0
description: What the development branch of rumbo changes after 0.12.0, checked against its source. Today nothing, since main is the 0.12.0 release.
---

> **Nothing unreleased yet.** The `main` branch of rumbo is the [0.12.0](/reference/changelog/) release, commit `c84580d`, and its changelog has nothing under _Unreleased_. Everything on this site describes 0.12.0, which is what the install instructions give you.

## What 0.12.0 changed

0.12.0 changed where rumbo keeps things, and the front end protocol, incompatibly:

| In 0.11.0                                                                                        | In 0.12.0                                                                                                          |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Linux and macOS.                                                                                 | Windows too, where the shell tool is `powershell`. [Installation](/start/installation/).                           |
| `~/.config/rumbo/` and `~/.local/share/rumbo/`, `~/Library/Application Support/rumbo/` on macOS. | `~/.rumbo/` on every system, or `RUMBO_HOME`. Nothing is moved for you.                                            |
| Ctrl-V pastes an image, which goes to the model in base64.                                       | `/attach`, Ctrl-V, and a dropped file give files of any kind, by their paths. [Files](/guides/terminal-ui/#files). |
| Front end protocol version 2, with `images` in `run` and `steer`.                                | Version 3, with `files`, a list of paths. [Front end protocol](/reference/frontend-protocol/).                     |
| A registered front end reads the protocol on file descriptors 3 and 4.                           | The same, and on Windows from the handles `RUMBO_FRONTEND_HANDLES` names.                                          |

**Source:** the [changes since 0.12.0](https://github.com/LiasCode/rumbo/compare/v0.12.0...main), and the [changelog](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md).
