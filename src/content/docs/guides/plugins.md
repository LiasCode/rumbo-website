---
title: Plugins
description: Install, inspect, update, and remove rumbo plugins, which bring providers, front ends, extensions, and skills together from a directory or a Git repository.
---

A plugin brings several things at once: providers, front ends, extensions, and skills. It is a directory, or a Git repository, with a `plugin.yaml` that names them. Once added, what it brings is there as what rumbo has built in is, and is set the same way.

## Add one

```sh
rumbo plugin add https://example.com/team/ink-plugin.git   # a Git repository, which rumbo copies
rumbo plugin add ~/code/ink-plugin                         # a directory, used where it is
```

Adding a plugin builds it, when its manifest says how, and then starts every provider and extension it brings, which is the test that it works. A plugin that does not pass is not added. rumbo then says what it brought:

```text
added the plugin notes, which brings:
  the extension notes
  the skill meeting-notes
```

> A plugin's build and its programs run as you, with your rights. Add one whose code you trust.

## See what you have

```sh
rumbo plugin list          # rumbo's own plugin, and the ones you added
rumbo plugin show notes    # where it is, and what it brings
rumbo plugin show rumbo    # what comes with rumbo: its providers and its terminal UI
```

## Set what it brought

A plugin's programs are set like any other, by their kind and name:

```sh
rumbo extension set notes <field>=<value>
rumbo provider set house-model model=<model>
rumbo frontend set panel <field>=<value>
```

What you set goes over the configuration the plugin gives. Its skills are listed with yours by `rumbo skills`.

## Update and remove

```sh
rumbo plugin update notes   # a plugin added from Git: pull, build, and try it again
rumbo plugin rm notes       # take it out, with what you set for what it brought
```

An update that no longer builds or starts goes back to what the plugin was. A plugin added from a directory is read as it is each time, so there is nothing to update. Removing a plugin deletes rumbo's copy of a repository, and never your own directory.

## When a plugin replaces a tool

An extension of a plugin can ask to take the place of one of rumbo's own tools, such as `bash`. Adding the plugin then stops and says so, and you agree by naming the tools:

```sh
rumbo plugin add -replaces bash <source>
```

An update that asks to replace more than you agreed to is refused.

## Next

- The [plugin manifest](/reference/plugins/) says everything a `plugin.yaml` can have.
- [`examples/plugin`](https://github.com/LiasCode/rumbo/tree/v0.9.0/examples/plugin) is one to copy from.
- The [desktop app](/guides/desktop-app/) is distributed as a plugin.
