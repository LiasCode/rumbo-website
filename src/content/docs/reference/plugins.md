---
title: Plugin manifest
description: What a rumbo plugin is made of. The plugin.yaml manifest, the placeholders in its commands, the build step, where plugins are kept, and what adding, updating, and removing one does, from the source.
---

A plugin is a directory with a `plugin.yaml` at its root. It brings **providers, front ends, extensions, and skills** in one piece, and adds no kind of thing: once it is added, what it brings is there as what rumbo has built in is, and is set with the same commands. rumbo's own providers and terminal UI are a plugin too, called `rumbo`, built into the executable.

## The manifest

```yaml
name: ink
description: A catalog of inks, and how we write orders.

# Run in the plugin's directory when it is added and updated.
build: [go, build, -o, catalog, ./cmd/catalog]

extensions:
  catalog:
    command: ['{plugin}/catalog']
    config:
      source: local
    replaces: [bash]

providers:
  house-model:
    command: [python3, '{plugin}/provider.py']

frontends:
  panel:
    command: ['{plugin}/panel']
```

| Key                                    | Meaning                                                                                       |
| -------------------------------------- | --------------------------------------------------------------------------------------------- |
| `name`                                 | The plugin's name: a lowercase letter, then lowercase letters, digits, `_`, and `-`.          |
| `description`                          | What it is, for `rumbo plugin list`.                                                          |
| `build`                                | A command, as a list of words, that builds the plugin's programs from their source. Optional. |
| `providers`, `frontends`, `extensions` | The programs it brings, each a name, written as a plugin's is, and what follows.              |
| `command`                              | The words that start the program. A list, not a shell line. Required.                         |
| `config`                               | The configuration the plugin gives the program. What the person sets goes over it.            |
| `replaces`                             | Extensions only: the tools of rumbo's own that it asks to take the place of.                  |

A key that is none of these is refused, saying which, rather than ignored. So is a program named like one rumbo has built in.

**Skills** need no entry: each directory in `skills/` with a `SKILL.md` is one.

## Placeholders

| Placeholder | Stands for                     | Where                                                                                                               |
| ----------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `{plugin}`  | The directory the plugin is in | Anywhere in any word of `command` or `build`, so `{plugin}/bin/tool` works.                                         |
| `{self}`    | The rumbo executable that runs | In 0.9.0, only as the **first word** of a command. The [development branch](/reference/next/) takes it as any word. |

## What adding one does

1. **Fetch.** A directory is used where it is. An address, anything with `://` or starting with `git@`, is cloned with `git clone --depth 1` into `plugins/` under [rumbo's data directory](/guides/configuration/#environment-variables).
2. **Read** `plugin.yaml`, and refuse a plugin that does not fit beside what there is: one of the same name, a program another plugin brings or you registered, or a replacement you did not agree to.
3. **Build**, when the manifest has a `build`, with its output on your screen.
4. **Try.** Every provider and extension it brings is started, with the extensions you already have, and stopped. A plugin that does not pass is not added. A front end needs the terminal, so it is tried when it is first used.

| Command               | A directory                                                         | A Git address                                                                                    |
| --------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `rumbo plugin add`    | Read where it is, each time rumbo starts.                           | Cloned, built, tried, and kept.                                                                  |
| `rumbo plugin update` | Refused: there is nothing to update.                                | `git pull --ff-only`, built and tried again; one that no longer passes goes back to what it was. |
| `rumbo plugin rm`     | Forgets it and what you set for its programs. Your directory stays. | The same, and deletes rumbo's copy.                                                              |

`config.yaml` keeps of a plugin only where it comes from and the replacements you agreed to, never what its manifest says.

## Replacing a tool

An extension that declares `replaces: [bash]` asks to take the place of rumbo's `bash`. Adding the plugin says so and stops until you agree by name:

```sh
rumbo plugin add -replaces bash <source>
```

What you agree to must be all it asks for, and an update that asks for more is refused.

> A plugin's build and its programs run as you, with your rights. Add one whose code you trust.

**Source:** [`internal/cli/plugins.go`](https://github.com/LiasCode/rumbo/blob/v0.9.0/internal/cli/plugins.go), [`internal/cli/programs.go`](https://github.com/LiasCode/rumbo/blob/v0.9.0/internal/cli/programs.go), rumbo's [own manifest](https://github.com/LiasCode/rumbo/blob/v0.9.0/plugins/rumbo/plugin.yaml), and a [plugin to copy from](https://github.com/LiasCode/rumbo/tree/v0.9.0/examples/plugin). [Install a plugin](/guides/plugins/).
