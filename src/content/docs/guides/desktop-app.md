---
title: Desktop app
description: rumbo-gui is a desktop window for rumbo. Every project and session in one place, each session as a conversation, a diff of what changed, and rumbo's settings, without a terminal.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) is a desktop window for rumbo: every project and
session in one place, each session as a conversation, and rumbo's settings, without a terminal. It
is a front end like any other, built with Rust and [GPUI](https://github.com/zed-industries/zed),
and speaks the same [Agent Frontend Protocol](/reference/frontend-protocol/) as the terminal UI.

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

## How it works with rumbo

- **Each open project has its own `rumbo serve`**, so its runs go on while you look at another
  project or session.
- **Everything is rumbo's.** Sessions, settings, and providers live in rumbo; the window keeps only
  its own preferences, such as its theme and the projects pinned.
- **Nothing is hard-coded.** Commands, forms, and pickers come from what rumbo and the provider
  describe, so a new function shows up by itself.
- **The files are yours.** It only reads them, to show what Git sees changed, and Open in Editor
  hands the project to your editor.

## Install

rumbo-gui is built from source, with Rust, and needs rumbo installed apart: a version later than
0.5.

```sh
git clone https://github.com/LiasCode/rumbo-gui
cd rumbo-gui
cargo build --release      # the binary is target/release/rumbo-gui
install -Dm644 rumbo-gui.desktop ~/.local/share/applications/rumbo-gui.desktop
```

Set `Exec` in the `.desktop` file to the binary's path if it is not on your `PATH`.

## Use

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]
```

`DIR` is the first project to open, and `FLAGS` are passed to `rumbo serve`, such as `-c` or
`-p`. `--rumbo` names the rumbo executable when it is not on your `PATH`.

rumbo can also start the window itself, as it starts its terminal UI. The window then works only in
that rumbo's project, and closes with it:

```sh
rumbo frontend add gui /path/to/rumbo-gui --attached
rumbo -f gui "a task"      # or: rumbo system set frontend=gui
```

Its [README](https://github.com/LiasCode/rumbo-gui#readme) lists every key.
