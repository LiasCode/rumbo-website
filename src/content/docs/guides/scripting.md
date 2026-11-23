---
title: Scripts and pipes
description: Run rumbo from scripts, cron jobs, and CI. The plain front end prints the model's text to stdout and progress to stderr, and exits with a status a script can check.
---

When rumbo's input or output is not a terminal, or you ask for it with `-f plain`, it uses the
`plain` front end: no screen to draw, the model's text on stdout, and an exit code.

```sh
rumbo "summarize notes.md" > summary.txt
cat task.md | rumbo                               # the whole input is the task
rumbo -c -f plain "now list what is still missing"
```

## What goes where

- **stdout** gets the model's text, and nothing else.
- **stderr** gets the progress, the session, and the tokens spent.

So `> file` keeps the answer, and the progress stays on the screen.

## The task

`plain` takes the task from the command line; without one, the whole of a piped input is the task.
When the input is a terminal, it reads tasks one line at a time, each a run of its own.

A task given on the command line wins over piped input, which is then not read. To have the model
work on something, name it in the task, and the model reads it with its tools:

```sh
rumbo "review the changes in git diff HEAD~1 and list what is risky"
```

## Exit codes

| Code  | The run                            |
| ----- | ---------------------------------- |
| `0`   | was done                           |
| `1`   | failed                             |
| `130` | was cancelled, such as with Ctrl-C |

## Sessions in scripts

A scripted run is a session like any other: `rumbo -c` continues it, `rumbo -r` resumes it if it
was cut short, and `rumbo log` and `rumbo request` show what it did and what it sent. Set
`max_turns` to bound how long a run may go:

```sh
rumbo system set max_turns=50
```

## Driving rumbo from a program

To drive rumbo from a program of your own, rather than from a shell, start `rumbo serve` and speak
the [Agent Frontend Protocol](/reference/frontend-protocol/) on its stdin and stdout. See
[write a front end](/extend/front-end/).
