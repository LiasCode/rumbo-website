---
title: Command line
description: Every rumbo command and flag. Run tasks, continue and resume sessions, and manage sessions, settings, providers, and front ends from the shell.
---

`rumbo help` prints this list, and each group of commands prints its own with `help`, such as
`rumbo provider help`.

## Running tasks

```text
rumbo [flags] [objective]
    work in the current directory, in a front end
rumbo serve [flags]
    be the host for a front end on stdin/stdout
```

| Flag                | Does                                                                                                                             |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `-c`                | Continue the latest session started in this directory                                                                            |
| `-r`                | Resume the unfinished run of that session, without a new objective                                                               |
| `-s <session>`      | Continue the given session                                                                                                       |
| `-p <provider>`     | Provider of the session (default: the `default_provider` setting)                                                                |
| `-m <model>`        | Model of the session (default: the model set for its provider)                                                                   |
| `-o <name>=<value>` | A provider option of the session, such as `-o effort=high`; may be repeated, and an empty value gives one back to the provider's |
| `-f <name>`         | Front end for this start (default: the `frontend` setting, else `tui` in a terminal, else `plain`)                               |

The session keeps what `-p`, `-m`, and `-o` choose, over the system settings. Each `rumbo` works in
one session; another session is another `rumbo`.

## Sessions

```text
rumbo sessions [-all] [-json]
    list the sessions of this directory, or of every one; with -json, for a
    program to read
rumbo sessions rename <session> <title>
    give a session a title of your own
rumbo sessions rm <session>...
    delete sessions and their history
rumbo sessions prune [-all] [-yes] <age>
    delete the sessions not used in that long, such as 12h, 30d, or 2w;
    without -yes, only list them
rumbo log <session>
    print a session's entries as JSON lines
rumbo request <session> [turn]
    print the request a turn sent the provider, as it was sent; without a
    turn, the last one
```

Sessions in use by a rumbo process are not deleted. See [sessions](/guides/sessions/).

## Settings

```text
rumbo config
    what is chosen and what applies, each value with where it comes from
rumbo system
    every system setting, its value, and where it comes from
rumbo system set <name>=<value>...
    an empty value gives one back to its default
rumbo skills
    list the skills the model is told of here, and those left out
```

See [configuration](/guides/configuration/).

## Providers

```text
rumbo provider list
    the providers there are: rumbo's, plugins', and yours
rumbo provider show <name>
    start it, and say each setting, where its value comes from, and what it
    offers
rumbo provider models <name>
    the models it offers, asking it
rumbo provider set <name> <setting>=<value>...
    its model, a field of its configuration, or one of its options; an empty
    value gives one back to its default
rumbo provider add [-config <json>] <name> <command>...
rumbo provider rm <name>
    remove yours, or what you set for rumbo's or a plugin's
```

A provider is any program that speaks the Agent Provider Protocol on its stdin and stdout. `{self}`
as the command stands for the rumbo executable. See [models and providers](/guides/providers/).

## Front ends

```text
rumbo frontend list
    the front ends there are: rumbo's, plugins', and yours
rumbo frontend show <name>
    how it is started, and what is set for it
rumbo frontend set <name> <field>=<value>...
    a field of its configuration, checked when it starts; an empty value
    gives one back to its default
rumbo frontend add [-config <json>] <name> <command>...
rumbo frontend rm <name>
    remove yours, or what you set for rumbo's or a plugin's
```

A front end is any program that speaks the Agent Frontend Protocol on file descriptors 3 (read) and
4 (write), or on Windows the two handles `RUMBO_FRONTEND_HANDLES` names, and keeps the terminal on
stdin and stdout. See [write a front end](/extend/front-end/).

## Built-in programs and version

```text
rumbo provide <name>
    run a provider of rumbo's own plugin on stdin/stdout
rumbo attach <name>
    run plain, or a front end of rumbo's own plugin, on descriptors 3/4
    (handles on Windows)
rumbo extend mcp [command...]
    run rumbo's own plugin's extension for an MCP server on stdin/stdout
rumbo version
    print the version
```

`provide` and `attach` are how rumbo starts its own providers and front ends, through the same
protocols as any other.

## Extensions and MCP

```text
rumbo extension list
    the extensions you added
rumbo extension show <name>
    start it, and say what is set for it and the tools it gives the model
rumbo extension set <name> <field>=<value>...
    a field of its configuration, or replaces, the tools of rumbo's own it
    takes the place of, checked by starting it; an empty value gives one
    back
rumbo extension add [-config <json>] [-replaces <tools>] <name> <command>...
rumbo extension rm <name>
    remove one
```

An extension is any program that speaks the Agent Extension Protocol on its stdin and stdout. rumbo's
own plugin has one for MCP servers, added once for each as `{self} extend mcp <the server's command>`.
See [extensions and MCP](/guides/extensions/).

## Plugins

```text
rumbo plugin list
    rumbo's own plugin, and those you added
rumbo plugin show <name>
    where it is, and what it brings
rumbo plugin add [-replaces <tools>] <source>
    a directory, or the address of a Git repository
rumbo plugin update <name>
    bring one added from an address up to date
rumbo plugin rm <name>
    take one out, with what you set for what it brought
```

A plugin is a directory, or a Git repository, with a `plugin.yaml` that names the programs it brings,
and its skills in `skills/`. rumbo's own, `rumbo`, is built in and always there. See
[plugins](/guides/plugins/).
