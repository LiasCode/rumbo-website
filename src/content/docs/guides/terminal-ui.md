---
title: Terminal UI
description: Use rumbo's terminal UI. Sessions in a sidebar, the conversation, a composer, a command palette, panels with session details and Git changes, and every key it takes.
---

`rumbo` in a terminal opens the terminal UI over the whole screen: a header with the folder and
the session shown, the sessions started in that folder in a sidebar, the conversation in a column of its own,
and under it a composer with the model, how full the context is, and what the session spent.

```sh
rumbo                      # open it
rumbo "a task"             # open it and start a task
rumbo -c                   # open the latest session started here
rumbo -s <session>         # open a given one
```

When it quits, it gives the terminal back as it found it, and leaves in it the command that
continues the session, `rumbo -s <session>`. To keep a conversation, `/export` writes it to a
Markdown file.

## Following a run

- What you said shows in a box on the right, and what the model writes as Markdown: headings,
  lists, quotes, code, links, and tables with their columns lined up.
- A tool call shows with a spinner and its time while it works, and then as a block that says how
  it went: an edit with the lines it changed, a command with the start of what it printed, or, when
  it failed, its status and the end of what it printed.
- A run ends with a line that says how it ended, how long it took, and its turns and tokens.
- Enter during a run tells the run what you typed. It reaches the model before its next request,
  without stopping it.
- When a run ends while the terminal is not in front, it rings the bell and sends a desktop
  notification, in the terminals that report their focus and take OSC 9 (in tmux, with
  `focus-events` on).

## Sessions

The sidebar lists the sessions started in the folder rumbo was started in. Each is a rumbo of its
own, which the terminal UI starts when you first show the session and ends when you quit, so a run
goes on in its session while you look at another. The sidebar marks the sessions that are working,
those whose run ended while they were not shown, and, with a ring, those a rumbo is still open for.

| Key                                       | Does                                       |
| ----------------------------------------- | ------------------------------------------ |
| Tab (on an empty composer), arrows, Enter | Show a session of the sidebar              |
| Ctrl-N                                    | Start a new session, in a rumbo of its own |
| Ctrl-B                                    | Show or put away the sidebar               |

The rumbos of the sessions you left with nothing to do are closed past the two shown last, so they
do not go on costing memory; showing one again starts its rumbo. `/rumbos` says what the rumbo of
each open session uses, and "Close the rumbos not in use", in the palette, closes them all.

`/delete`, or "Delete this session" in the palette, deletes the session shown once you agree. The
session rumbo was started in is held until you quit: delete it then, with `rumbo sessions rm`.

## Commands

- **Ctrl-P** opens a palette of the UI's own actions, the folder's other sessions, and every
  command, which typing narrows. A command that takes something asks for it in a form, and one that
  cannot be undone asks you to agree in a dialog.
- **A slash** in the composer opens a menu of the commands, with what each does, and then of the
  values its next parameter takes: `/use` lists the providers, `/use openai` the models of
  `openai`. A parameter that can be left out is typed by name, as `name=value`:
  `/extension-add docs config={"url":"https://example.com/mcp"} {self} extend mcp`.
- **`/help`** lists them all: the host's, grouped by what they act on (the system, the session, the
  providers, and the extensions), the provider's, and the UI's own.

The commands come from what the host and the provider describe, so a provider's functions, such as
`/login`, show up without the UI knowing them. The UI's own are `/help`, `/copy` (the model's last
answer, or `/copy code` for its last code block), `/export` (the session as Markdown), `/rumbos`,
and `/delete`. `/processes` shows the processes the rumbo you are in has running, each under the one
that started it, with the memory and the processor time it uses.

An extension’s commands appear with its registered name, such as `/notes-forget`, as soon as it is
added. Its output is marked `[extension]` or `[extension <name>]`. See [Extensions and MCP](/guides/extensions/).

## Model and options

A click on the model under the composer, or Model and options in the palette, opens the picker. It
changes the provider, the model, and the options of the session, such as `effort`, and shows each
change as the command it is.

## Panels

- **Ctrl-Alt-B** shows the session's details beside the conversation: its id and how it stands, its
  folder, its model, how full its context is, what it spent, and the skills the model is told of.
- **Ctrl-G** shows what changed in the session's folder as Git sees it against the last commit, new
  files included. It only reads.

## Going back in the conversation

Shift-Tab goes up into the conversation, where Up and Down choose an entry and Enter acts on it, as
a click does:

- on a tool call, it shows all it was given and returned, or goes back to its excerpt;
- on a message of yours, it changes it, or asks it again, in a [branch](/guides/sessions/#branch)
  that starts before it;
- on anything else, it copies it.

Dragging the mouse over the conversation or a panel selects its text, and letting go copies it, to
the clipboard and to the primary selection. It uses OSC 52, so it also works over ssh in the
terminals that take it (in tmux, with `set-clipboard on`). With Shift, the terminal selects as it
does elsewhere.

## The composer

| Key                            | Does                                                                                |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Enter                          | Send the task, or tell the run in progress what you typed                           |
| Alt-Enter, Shift-Enter, Ctrl-J | New line                                                                            |
| Up, Down                       | Move through the rows typed, and past them through what you entered before          |
| Ctrl-R                         | Search what you entered before, in any session started in this folder               |
| Ctrl-V                         | Paste the image in the clipboard, which goes with what you send next                |
| Backspace on an empty composer | Take the last pasted image away                                                     |
| Escape                         | Give up a provider's function in progress, else cancel the run of the session shown |
| Ctrl-C                         | The same as Escape, else clear the composer, else quit                              |
| Ctrl-D                         | Quit, on an empty composer                                                          |
| PgUp, PgDn, the mouse wheel    | Scroll the conversation                                                             |

The composer edits with readline's keys: Ctrl-A and Ctrl-E, Ctrl-F, Alt-B and Alt-F, Ctrl-W,
Ctrl-U, and Ctrl-K. Pasting an image reads the desktop's clipboard with `wl-paste` on Wayland,
`xclip` on X11, or AppKit on macOS, since a terminal pastes only text.

## Colors

The UI's colors are its configuration, set with `rumbo frontend set tui`:

```sh
rumbo frontend set tui theme=plain          # auto (the default, which follows NO_COLOR), color, or plain
rumbo frontend set tui color_code=bright-blue
rumbo frontend show tui                     # everything set for it, with the defaults
```

`color_host`, `color_provider`, `color_code`, `color_success`, `color_failure`, `color_warning`,
and `color_progress` each take a name such as `cyan` or `bright-blue`, a number of the 256 colors,
`#rrggbb`, or `default`.
