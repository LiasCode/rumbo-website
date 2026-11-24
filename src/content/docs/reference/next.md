---
title: What changes after 0.10.0
description: What the development branch of rumbo changes after 0.10.0, checked against its source. Today nothing, since main is the 0.10.0 release.
---

> **Nothing unreleased yet.** The `main` branch of rumbo is the [0.10.0](/reference/changelog/) release, commit `6c97f58`, and its changelog has nothing under _Unreleased_. Everything on this site describes 0.10.0, which is what the install instructions give you.

## What 0.10.0 changed

0.10.0 released what this page described of the development branch before it:

| In 0.9.0                                                                                      | In 0.10.0                                                                                                                          |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| One host works in several sessions of a project at once. `-single` keeps it to one.           | Each `rumbo` is one session. [Sessions](/guides/sessions/#one-rumbo-one-session).                                                  |
| A session belongs to the top of the Git repository it was started in.                         | It belongs to the directory it was started in, and only that directory's instructions and skills are read.                         |
| `/sessions`, `/projects`, `/open`, `/new`, `/delete`, and `/prune` are functions of the host. | `rumbo sessions`, `rm`, `prune`, and `-json` from the command line; `/delete` is the terminal UI's own.                            |
| Front end protocol version 1.                                                                 | [Version 2](/reference/frontend-protocol/): a `run` names no session, and `processes`, `title`, and the `extension` group are new. |
| Extensions are managed from the command line.                                                 | Also from any front end, with `/extensions`, `/extension-add`, `/extension-show`, `/extension-set`, and `/extension-rm`.           |
| `{self}` is only the first word of a command.                                                 | It is any word.                                                                                                                    |

**Source:** the [changes since 0.10.0](https://github.com/LiasCode/rumbo/compare/v0.10.0...main), and the [changelog](https://github.com/LiasCode/rumbo/blob/main/CHANGELOG.md).
