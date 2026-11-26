---
title: Quick start
description: Choose a model, run your first task with rumbo, open the terminal UI, and continue or resume a session.
---

This page takes you from an installed `rumbo` to a finished task. If you have not installed it yet,
see [installation](/start/installation/).

## 1. Choose a provider and a model

A provider is how rumbo reaches a model. With an Anthropic API key:

```sh
export ANTHROPIC_API_KEY=...                         # or /login in the terminal UI, or `ant auth login`
rumbo system set default_provider=anthropic          # what new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # and the model they start with there
```

With a ChatGPT plan instead of an API key, a local model, or OpenAI, see
[models and providers](/guides/providers/).

## 2. Give it a task

Go to the project you want to work in, and give rumbo a task:

```sh
cd ~/code/my-project
rumbo "add a --json flag to the export command"
```

rumbo opens the terminal UI, and the model works with its tools until it stops calling them. Each
tool call shows as it runs, and the run ends with a line that says how it ended, how long it took,
and the turns and tokens it used.

> **Caution**
>
> The model reads, writes, and runs commands as you, without asking. Read
> [before you run it](/start/safety/) first.

## 3. Keep going

```sh
rumbo                                            # the terminal UI; /help lists its commands
rumbo -c "also document it"                      # continue the latest session started here
rumbo -r                                         # resume a run that stopped
rumbo "summarize notes.md" > summary.txt         # piped: plain text out, exit code
```

`rumbo` alone opens the terminal UI over the whole screen: the conversation, and under it a
composer with the model, the Git branch, and how full the context is. A slash starts a command,
such as `/model` or `/resume`, and `/help` lists them all; Ctrl-B shows the folder's sessions. See
the [terminal UI](/guides/terminal-ui/) guide.

## 4. Tell it how you work

The model reads your instructions: the `AGENTS.md` or `CLAUDE.md` file of the directory rumbo
starts in, and yours in `~/.rumbo/`. Start rumbo at the top of a repository to work with its
guide. Write there how work should be done, and
what to check before it is finished. See [instructions and skills](/guides/instructions-and-skills/).

## Next

- [Sessions](/guides/sessions/): continue, resume, branch, and export your work.
- [Configuration](/guides/configuration/): every setting, changed the same way.
- [Command line](/reference/command-line/): every command and flag.
