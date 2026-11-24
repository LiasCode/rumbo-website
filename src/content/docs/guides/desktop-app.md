---
title: Desktop app
description: rumbo-gui is a desktop window for rumbo. Every project and session in one place, each session as a conversation, a diff of what changed, and rumbo's settings, without a terminal.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) is a desktop window for rumbo: every project and
session in one place, each session as a conversation, and rumbo's settings, without a terminal. It
is a front end like any other, built with Rust and [GPUI](https://github.com/zed-industries/zed),
and speaks [version 2 of the Agent Frontend Protocol](/reference/next/), which only the development
branch of rumbo has.

## What you can do

- **Work in sessions.** Search them, open one with Ctrl-K or Ctrl-1 to Ctrl-9, and rename, branch,
  compact, export as Markdown, or delete it from its menu. Every project is in the sidebar, its
  sessions newest first; pin the projects you use most to its top.
- **Go back and forward**, as in a browser, between the sessions, projects, and settings you went
  to, with Alt-Left and Alt-Right or the mouse's back and forward buttons.
- **Follow a run.** The model's answer as Markdown, each tool call with what it changed in a file,
  and how long the run took; tell it something while it works, or cancel it.
- **Show the model a picture.** Ctrl-V pastes the image in the clipboard into the composer.
- **Change your mind.** Edit a message, or ask it again, in a branch that starts before it.
- **Review the work.** The Changes panel shows the diff of the project's folder; the Files panel,
  its files, each marked with what Git says of it; the Details panel, how full the model's context
  is, the tokens spent, and the skills the model is told of.
- **Leave runs working.** Runs go on in other sessions and projects, and the window, or the desktop
  if you turn it on, tells you when one ends.

> **rumbo-gui does not work with rumbo 0.9.0.** It needs a rumbo that speaks front end protocol version 2 and has `rumbo sessions -json`, which today means one built from the development branch: `go install github.com/LiasCode/rumbo/cmd/rumbo@main`. [What changes after 0.9.0](/reference/next/).

## How it works with rumbo

Each open session has its own host. Runs continue in the background while you switch sessions; closing the window cancels runs on the hosts it started.

## Install

It is a plugin, which rumbo builds where you add it, so it needs Rust's `cargo` on that machine. Then choose `gui` for a start:

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-gui
rumbo -f gui
```

## Use

The window also runs by itself, and starts the rumbos it needs:

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]   # --rumbo: the rumbo executable, when it is not on PATH
```

[rumbo-gui README](https://github.com/LiasCode/rumbo-gui#readme)
