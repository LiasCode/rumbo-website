---
title: Extensions and MCP
description: Give the model tools of your own in rumbo, from a program you write or from a Model Context Protocol server. Register, inspect, sign in, limit, and replace tools.
---

An extension is a program that gives the model more tools, beside rumbo's own four. You register it once, and every run that starts afterwards has its tools, in every project. rumbo starts it when a run first needs it and keeps one process of it while it runs.

## Add an MCP server

rumbo brings the extension for [Model Context Protocol](https://modelcontextprotocol.io) servers. Add it once for each server, under a name you choose:

```sh
# A server started with a command
rumbo extension add files {self} extend mcp npx -y @modelcontextprotocol/server-filesystem "$HOME/notes"

# A server reached at a URL
rumbo extension add -config '{"url":"https://example.com/mcp"}' docs {self} extend mcp
```

`{self}` stands for the rumbo executable. rumbo starts the extension when you add it, which is the test that it works, and says which tools the model gets.

| Field       | What it does                                                                              |
| ----------- | ----------------------------------------------------------------------------------------- |
| `url`       | The address of a server reached over HTTP, instead of a command.                          |
| `tools`     | The names of the tools the model is given, separated by commas. Without it, all of them.  |
| `prefix`    | Goes before each tool's name, so two servers' tools do not collide.                       |
| `token_env` | The **name** of the environment variable that holds a token of your own, never the token. |
| `client_id` | For a server whose authorization does not register clients by itself.                     |

### Signing in

A server at a URL that wants a sign-in offers one as a command named after the extension. Registered as `docs`:

| Command        | Does                                                                                |
| -------------- | ----------------------------------------------------------------------------------- |
| `/docs-login`  | Opens the sign-in in your browser. Over ssh, paste the address the browser ends on. |
| `/docs-logout` | Forgets the sign-in.                                                                |

The sign-in is kept with rumbo's other credentials, readable only by you, and renewed as it expires. The server's tools are the model's from the next run.

## See what one gives, and what it costs

```sh
rumbo extension list             # the extensions you added
rumbo extension show files       # its configuration, its tools, and the bytes they add to every request
rumbo extension set files tools=read_text_file,list_directory prefix=notes_
rumbo extension set files tools= # an empty value gives a field back
rumbo extension rm files
```

Every tool's name, description, and schema is sent to the model with **every request**, whether the task uses it or not. `show` says how many bytes that is. Give the model the tools a task needs, with `tools`, rather than everything a server has.

## Replace one of rumbo's tools

An extension can take the place of `read`, `write`, `edit`, or `bash`, to run commands in a container or ask before some of them. It never does so by its name alone. You say so:

```sh
rumbo extension add -replaces bash guard python3 /path/to/examples/guard.py
rumbo extension set guard replaces=       # give bash back to rumbo
```

[`examples/guard.py`](https://github.com/LiasCode/rumbo/blob/v0.9.0/examples/guard.py) asks before any `rm -rf`, in a dialog, and passes everything else on to rumbo's own `bash`.

## What else an extension does

- **Tells the model something when a run starts**, in a section of its own, such as the notes it keeps. It is sent once, and again only when it changes.
- **Offers you commands**, named after it, such as `/notes-forget`.
- **Asks you something** while one of its tools works.
- **Listens** to what the runs do, to notify you or count what they cost.

> An extension runs as you, with your rights, and so does an MCP server it starts. Add the ones whose code you trust.

## Next

- [Write an extension](/extend/extension/) of your own, in any language.
- [Plugins](/guides/plugins/) bring extensions together with providers, front ends, and skills.
- The [extension protocol](/reference/extension-protocol/) has every message.
