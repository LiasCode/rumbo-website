---
title: What changes after 0.9.0
description: What the development branch of rumbo changes after 0.9.0, checked against its source. One host per session, front end protocol version 2, sessions by directory, and extensions managed from any front end.
---

> **Not released.** This page describes the `main` branch of rumbo as of commit `e02a851`. Everything else on this site describes [0.9.0](/reference/changelog/), which is what the install instructions give you. Providers and extensions are untouched: both protocols stay at version 1.

## One rumbo, one session

| In 0.9.0                                                                                                | On the development branch                                                                                                       |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| One host works in several sessions of a project at once. `-single` keeps it to one.                     | Each `rumbo` is one session, with its own provider and extensions. `-single` is gone.                                           |
| A session belongs to a project: the top of the Git repository it was started in.                        | A session belongs to the directory it was started in. rumbo no longer looks for a repository.                                   |
| `-c` and `rumbo sessions` find the sessions of the project, from any directory inside it.               | They find only the sessions started in this directory. `rumbo sessions -all` lists every one, and `-s <session>` continues any. |
| `AGENTS.md`, `CLAUDE.md`, and `.agents/skills/` are read from the project's root down to where you are. | Only those of the starting directory are read. Start rumbo at the top of the repository to use its guide.                       |
| `/branch` moves you to the new session.                                                                 | `/branch` makes the session and says which one; another rumbo goes on in it. A branch is titled after the session it came from. |
| `/sessions`, `/projects`, `/open`, `/new`, `/delete`, and `/prune` are functions of the host.           | The host has none of them. Use `rumbo sessions`, `rumbo sessions rm`, and `rumbo sessions prune`, or start another rumbo.       |

```sh
rumbo sessions -json    # the sessions, for a program: directory, title, how the last run ended, whether a rumbo holds it
rumbo -s <session>      # continue any of them
```

The terminal UI still shows several sessions, by starting a rumbo for each one you open and ending them when you quit. `/rumbos` says what each uses, and `/delete` deletes the session shown.

## Front end protocol version 2

A host on this branch sends `protocol: 2`, and refuses a front end that answers `1`.

| Version 1                                                                                  | Version 2                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `run` takes `session` and `new`.                                                           | It takes neither: a run goes to the host's session.                                                                                                                                                              |
| `history` takes `session`.                                                                 | It takes no parameter.                                                                                                                                                                                           |
| The host's functions include `sessions`, `projects`, `open`, `new`, `delete`, and `prune`. | They are gone. A front end starts one `rumbo serve` for each session it shows, and groups them by the `dir` each says.                                                                                           |
| `initialize` and a function's `state` name the session by id.                              | Both also carry `title`.                                                                                                                                                                                         |
| `branch` moves the front end to the branch.                                                | `branch` answers with the session it made, and the host stays where it was.                                                                                                                                      |
| —                                                                                          | `processes` answers with what the host has running: itself, its front end, its providers and extensions, what those started, and what the model left in the background, each with its memory and processor time. |
| The host's functions are of the `system`, `session`, and `provider` groups.                | There is an `extension` group too.                                                                                                                                                                               |

The current [desktop app](/guides/desktop-app/) speaks version 2 and reads `rumbo sessions -json`, so it needs a rumbo built from this branch.

## Elsewhere

- **`{self}` is any word of a command**, not only the first, so a front end rumbo starts can be told which rumbo to start for its other sessions: `[my-frontend, --rumbo, "{self}"]`.
- **Extensions are managed from any front end**, as providers are: `/extensions`, `/extension-add`, `/extension-show`, `/extension-set`, and `/extension-rm`. A change applies to the runs that start after it.
- **`/processes`** shows the processes of the rumbo you are in.
- In the terminal UI, a parameter that can be left out can be typed by name, as in `/extension-add docs config={…} {self} extend mcp`.

## Going back

rumbo 0.9.0 lists a session by the repository it was started in, which a session made or changed by this branch does not say. 0.9.0 shows those with `rumbo sessions -all`, and continues them with `-s <session>`.

**Source:** [`protocol/frontend.go`](https://github.com/LiasCode/rumbo/blob/main/protocol/frontend.go), [`internal/cli/functions.go`](https://github.com/LiasCode/rumbo/blob/main/internal/cli/functions.go), and the [changes since 0.9.0](https://github.com/LiasCode/rumbo/compare/v0.9.0...main).
