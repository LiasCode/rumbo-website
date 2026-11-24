---
title: Configuration
description: Configure rumbo with name=value at three levels, the system, a provider, and a session, all kept in one config.yaml you can read and edit.
---

Every setting in rumbo is changed the same way, as `name=value`, and an empty value gives it back
to its default. What you set is kept in one file, `config.yaml`, which holds only what you chose.

```sh
rumbo config                     # everything that is set and what applies, with where each value comes from
rumbo system set computer=on     # a system setting
rumbo provider set openai effort=high
rumbo frontend set tui theme=plain
rumbo system set max_turns=      # an empty value: back to the default
```

What a program does not take is refused before it is kept: a name it does not have, or a value it
does not accept.

## Three levels

Configuration has three levels, kept apart:

- **The system** is rumbo's own, the same everywhere: which provider and front end to start, and
  the limits of a run.
- **A provider** has the model a new session that uses it starts with, and one configuration, which
  holds the values of its options too.
- **A session** keeps what it chose: its provider, its model, and values of the provider's options.
  What a session chose wins over the provider's in it.

Nothing is set per project. Settings are the same in every directory, and what changes from one
piece of work to another is the session.

## System settings

| Setting            | Default                                | What it does                                                                         |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------ |
| `default_provider` | not set; `-p` chooses one              | The provider a new session starts with, with that provider's model                   |
| `frontend`         | `tui` in a terminal, `plain` otherwise | The front end to start                                                               |
| `max_turns`        | `150`                                  | Model responses after which a run is stopped; `0` for no limit                       |
| `max_tokens`       | the provider's own limit               | Output token limit per response                                                      |
| `compact_at`       | `80%`                                  | Share of the model's context at which the conversation is summarized; `0%` for never |
| `computer`         | `off`                                  | `on` gives the model the [computer tool](/guides/computer-use/)                      |

```sh
rumbo system                     # the system settings, each with where its value comes from
rumbo system set compact_at=70%
```

A system setting applies to the runs that start after it is stored, without starting rumbo again.
`default_provider` and `frontend` apply from the next start.

## Provider and front end settings

```sh
rumbo provider show anthropic              # its model, configuration, and options, with their defaults
rumbo provider set anthropic model=claude-opus-5-5 effort=high
rumbo frontend show tui
rumbo frontend set tui color_code=cyan
```

What fields and options a program takes is its own decision, and it says so when it starts; rumbo
checks a value against that, and starts the program with the change, before keeping it.

## Session settings

```sh
rumbo -p openai -m <model> -o effort=low "a task"   # choose for a new session
```

In the terminal UI:

```text
/use openai <model>       the provider and model of this session
/session-set effort=low   an option, for this session only
/session-set effort=      back to the provider's value
```

A run keeps what it started with; a change applies to the next one.

## The configuration file

`config.yaml` is in `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` on macOS). It holds
only what you chose, never a default, and you can edit it: rumbo changes it one value at a time and
leaves your comments.

```yaml
system:
  default_provider: anthropic
providers:
  anthropic:
    model: claude-opus-5-5
    config:
      effort: high # every session, unless it chooses another with -o
```

rumbo refuses to start with a setting that is missing, malformed, or misspelled in the file, and
says where it is, instead of guessing.

## Environment variables

| Variable          | What it changes                                           |
| ----------------- | --------------------------------------------------------- |
| `RUMBO_CONFIG`    | The configuration file to use instead of `config.yaml`    |
| `RUMBO_DATA`      | The directory of rumbo's data, which holds the sessions   |
| `XDG_CONFIG_HOME` | Base directory for `rumbo/config.yaml` on Linux           |
| `XDG_DATA_HOME`   | Base directory for `rumbo/` data on Linux and macOS       |
| `NO_COLOR`        | The terminal UI shows no colors, with its default `theme` |

The providers read their own, such as `ANTHROPIC_API_KEY` and `OPENAI_API_KEY`. See
[models and providers](/guides/providers/).
