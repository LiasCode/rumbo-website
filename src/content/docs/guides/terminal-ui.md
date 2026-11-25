---
title: Terminal UI
description: Use rumbo's terminal UI. The conversation over the whole screen, a composer, a few commands typed in it, the sessions in a sidebar, panels with session details and Git changes, and every key it takes.
---

`rumbo` in a terminal opens the terminal UI over the whole screen: the conversation across it, and
under it a composer with the model, the Git branch checked out, the folder (under your home as
`~/`), how full the context is, and what the session spent. The sessions started in that folder are
in a sidebar, put away until Ctrl-B shows it.

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
- How the run stands, its spinner and its time, shows over the composer.
- A run ends with a line that says how it ended, how long it took, its tokens in and out, what the
  cache gave with its share of what went in, and its turns:
  `12.3s · 1.1k in · 810 out · 26.5k cached (96%) · 1 turn`. A session you continue says how long
  each of its earlier tasks took too.
- Enter during a run tells the run what you typed. It reaches the model before its next request,
  without stopping it.
- When a run ends while the terminal is not in front, it rings the bell and sends a desktop
  notification, in the terminals that report their focus and take OSC 9 (in tmux, with
  `focus-events` on).

## Commands

Everything is a command typed in the composer. A slash on an empty line starts one, and so does
Ctrl-P. An empty conversation shows the few to start with.

- **The menu** lists the commands, with an example of the one chosen, and then the values its next
  word takes: `/resume` lists the sessions, `/model ` the providers and the options, and
  `/model openai/` the models of `openai`. Up and Down choose, Tab or Enter take, Escape closes it.
- **What a command still takes** shows after the cursor, dimmed, as `/resume <session>`.
- **A command typed wrong** is answered with the one you meant.
- **`/help`** lists the commands by what they are about, and the keys; `/help <command>` says what
  one does, with examples.
- A command that cannot be undone asks you to agree in a dialog, which starts on the button that
  leaves things as they are.

| Command                         | Does                                                                                   |
| ------------------------------- | -------------------------------------------------------------------------------------- |
| `/new`                          | Start the next task in a new session                                                   |
| `/sessions`                     | List the sessions of this folder, with how each stands and when it was last used       |
| `/resume <session>`             | Go to another session, by its id, the start of it, or the start of its title           |
| `/rename <title>`               | Give this session a title of your own                                                  |
| `/branch [message]`             | Go on in a [branch](/guides/sessions/#branch), before one of your messages or from now |
| `/compact`                      | Replace the conversation with a summary now                                            |
| `/delete [session]`             | Delete a session and its history, once you agree; without one, this one                |
| `/copy [code\|id]`              | Copy the model's last answer, its last code block, or this session's id                |
| `/export [path]`                | Write this session as Markdown to a file, which it does not overwrite                  |
| `/model [provider/model]`       | Change the model and its options (`option=value`); without them, open the picker       |
| `/login [extension]`, `/logout` | Sign in to the provider, or to an extension, and out                                   |
| `/providers`, `/extensions`     | List, show, set up, add, and remove them                                               |
| `/settings [name=value]`        | Show what applies here and where each value comes from, or change a setting            |
| `/status`, `/changes`           | Show the session's details, or what changed in the folder, beside the conversation     |
| `/rumbos [close]`               | What the rumbo of each open session uses; `close` ends those not in use                |
| `/help [command]`, `/quit`      | Show the commands and the keys, or leave rumbo                                         |

Answers, errors, and diagnostics are marked `[host]`, `[provider <name>]`, or
`[extension <name>]`, by where they come from.

## Providers and extensions

`/providers` and `/extensions` work the same way:

```text
/providers                                list them
/providers openai                         show one: its settings and what it offers
/providers openai base_url=http://localhost:11434/v1
/providers add local {self} provide openai
/providers remove local                   remove one, once you agree
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
```

What a program offers is called after its name: `/providers anthropic account` for the session's
provider, or `/extensions notes forget` for an extension. Each word is completed: the programs, the
changes each takes but those you gave already, what each offers and what its functions take, and,
for `add`, how the programs there are started, and an extension's `config=` and `replaces=`. A word
that can be left out, before one that cannot, is typed by name, as `name=value`.

`/extensions <name> tools=` chooses an MCP server's tools from all it has, item by item: first the
list as it is chosen now, then each tool not in it yet, with what it does; a comma goes on with
another. See [Extensions and MCP](/guides/extensions/).

## Model and options

`/model`, or a click on the model under the composer, opens the picker. It changes the provider, the
model, and the options of the session, such as `effort`, and shows each change as the `/model` it
is. Typed in full, it changes them at once:

```text
/model anthropic/claude-opus-5-5 effort=high
/model effort=                     the option back to the provider's value
```

What comes before the slash is a provider only when there is one of that name, so a model's own name
may hold slashes.

## Sessions

The sidebar lists the sessions started in the folder rumbo was started in, a row apart, each with
how long ago it was used, as `5m`, `3h`, or `2d`. Each session is a rumbo of its own, which the
terminal UI starts when you first show the session and ends when you quit, so a run goes on in its
session while you look at another. The sidebar marks the sessions that are working, those whose run
ended while they were not shown, and, with a ring, those a rumbo is still open for. How many runs
work in other sessions shows under the composer, on the right.

| Key                       | Does                                       |
| ------------------------- | ------------------------------------------ |
| Ctrl-B                    | Show or put away the sidebar               |
| Tab, on an empty composer | Go to the sidebar, when it is shown        |
| Up and Down, k and j      | Choose a session                           |
| gg and G                  | Choose the first or the last               |
| Enter                     | Show the session chosen                    |
| d                         | Delete the session chosen, once you agree  |
| Ctrl-N                    | Start a new session, in a rumbo of its own |

`/sessions` lists the same sessions in the conversation, and `/resume <session>` goes to one.

The rumbos of the sessions you left with nothing to do are closed past the two shown last, so they
do not go on costing memory; showing one again starts its rumbo. `/rumbos` says what the rumbo of
each open session uses: its processes, their memory, and their processor time. `/rumbos close`
closes those neither shown nor working.

The session rumbo was started in is held until you quit, so it cannot be deleted from inside: delete
it then, with `rumbo sessions rm`.

## Panels

- **`/status`** or **Ctrl-Alt-B** shows the session's details beside the conversation: its id and
  how it stands, its folder, its model, how full its context is, what it spent, and the skills the
  model is told of.
- **`/changes`** or **Ctrl-G** shows what changed in the session's folder as Git sees it against the
  last commit, new files included. It only reads.

## Going back in the conversation

Shift-Tab goes up into the conversation, where Enter acts on the entry chosen, as a click does:

- on a tool call, it shows all it was given and returned, or goes back to its excerpt;
- on a message of yours, it changes it, or asks it again, in a [branch](/guides/sessions/#branch)
  that starts before it;
- on anything else, it copies it.

| Key                  | Does                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| Up and Down, k and j | Choose an entry                                                        |
| K and J              | Go to your messages, up and down                                       |
| gg and G             | Go to the start and the end                                            |
| c                    | Copy the entry chosen                                                  |
| b                    | Branch from the message of yours the task started with, once you agree |
| Tab, Escape          | Go back to the composer                                                |

`b` chooses that message first, and the dialog says what the branch keeps: the conversation as it
was before it, with the message in the branch's composer, to change it or send it again.

## Copying

Dragging the mouse over the conversation or a panel selects its text, and letting go copies it, to
the clipboard and to the primary selection. With Shift, the terminal selects as it does elsewhere.

Text is copied with OSC 52, which also works over ssh, and through the desktop rumbo runs on, since a
terminal or a tmux that does not take OSC 52 drops it without a word: with `wl-copy`, `xclip` or
`xsel`, or `pbcopy`, else, in tmux, through tmux's buffer. What is copied says where it went.

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
