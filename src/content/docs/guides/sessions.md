---
title: Sessions
description: How rumbo keeps your work in sessions. Continue, resume, branch, rename, export, and delete them, and replay the exact request any turn sent the model.
---

A session is a conversation bound to the directory it was started in: every task you give in it, what the model answered,
and each tool call with its result. rumbo keeps it as an append-only list of entries, which is what
lets you continue it, resume it after a failure, branch it, and replay any request it sent.

## Where a session belongs

A session belongs to the directory rumbo was started in, its root, and works there wherever you
continue it from. rumbo does not look for a Git repository around it: started in a subdirectory, the
session is that subdirectory's, and reads only its [instructions](/guides/instructions-and-skills/).
Start rumbo at the top of a repository to work with its guide.

## Continue and resume

```sh
rumbo -c "also document it"     # continue the latest session started here
rumbo -s <session> "and test it"  # continue a given one
rumbo -r                        # resume the unfinished run of the latest session
```

A run that failed, was cancelled, or was cut short because its process died is unfinished.
Resuming it tells the model the run was interrupted, closes the tool calls that never finished
with an error, and carries on without a new task.

Every run ends with a note in the session that says how it ended: done, failed, or cancelled. A
failure is never only on the screen.

## One rumbo, one session

Each `rumbo` you start works in one session, with its own provider and extensions, as a process of
its own. Another session is another `rumbo`: start one for a new session, `rumbo -c` for the latest
of the directory, or `rumbo -s <session>` for any. Several run side by side.

The [terminal UI](/guides/terminal-ui/) shows several sessions by starting a rumbo for each one you
open: a run goes on in its session while you look at another, and the sidebar tells you when it
ends. While a run works, what you type reaches the model before its next request, without stopping
it.

## Branch

A branch is a new session that starts with a copy of another one, as it is or as it was before one
of your messages, and goes on from there. The session it came from stays as it was, and can go on
working at the same time.

- In the terminal UI, Shift-Tab goes up into the conversation; Enter on one of your messages
  changes it, or asks it again, in a branch that starts before it, and `b` branches from the
  message the chosen task started with, once you agree.
- `/branch` branches the session as it is, and says which session the branch is; `/branch <n>`
  starts it before your message number `n`, which goes in the branch's composer.

The rumbo that made a branch stays in its session, and another goes on in the branch: the terminal
UI starts it and shows it, and elsewhere `rumbo -s <session>` does. A branch is titled "Branch",
then the title of the session it came from, so a list tells them apart.

A branch copies the conversation only. rumbo does not track files, so the files are as they are.

## List, rename, and delete

```sh
rumbo sessions                          # the sessions started here, with how each stands
rumbo sessions -all                     # those of every directory
rumbo sessions -json                    # the same, for a program to read
rumbo sessions rename <session> <title> # a title of your own
rumbo sessions rm <session>...          # delete sessions and their history
rumbo sessions prune 30d                # list those not used in 30 days; -yes deletes them
```

A session that a rumbo process is using is never deleted. In the terminal UI, `/sessions` lists
the sessions of the folder, `/rename` gives the session shown a title, and `/delete [session]`
deletes it, or the one named, once you agree. The session rumbo was started in is held until you
quit, so delete that one afterwards, with `rumbo sessions rm`.

## Compaction

When a conversation nears the model's context, rumbo asks the model to summarize it, and the next
request starts from that summary. This is compaction. It happens at 80% of the context the
provider reports, or at 150,000 tokens when it does not say; the `compact_at`
[setting](/guides/configuration/#system-settings) changes the share. `/compact` summarizes a
session when you ask.

What came before stays stored in the session. Only the request changes.

## What a session holds

Each session is a directory in `~/.rumbo/sessions/<id>/`:

- `session.json` says what it is and what it chose: its provider, its model, and the options set
  for it;
- `entries.jsonl` holds its history, one entry to a line, only ever appended.

```sh
rumbo log <session>             # every entry, as JSON lines
rumbo request <session> [turn]  # the exact request a turn sent the provider
```

Every request is rebuilt from the entries alone, so `rumbo request` prints what was sent, byte for
byte. That makes a session something you can debug: when a run went wrong, you can see exactly what
the model was given.

## Export

`/export` in the terminal UI writes the session as Markdown: what was asked, what the model wrote,
each tool call with the change it made or the start of what it returned, and how each run ended and
how long it took. It writes `rumbo-<session>.md` in the directory the session works in, or the path
you give, and never over a file that exists.
