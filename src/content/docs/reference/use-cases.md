---
title: What each part can do
description: What the rumbo host, a provider, a front end, an extension, and a plugin must do, can do, and never do in rumbo 0.10.0, with where to read more.
---

Find the part you are working on, and what it is allowed to do. Each line was checked against the source of rumbo 0.10.0; the protocol pages have the frames.

## Host

| You want to                         | How                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Start a task                        | `rumbo "a task"`, or `run` from a front end.                                                                   |
| Choose the model and the interface  | `-p`, `-m`, `-o`, and `-f` for one start; [settings](/guides/configuration/) for all of them.                  |
| Go on with earlier work             | `-c` for the latest session started here, `-s` for any, `-r` to resume an unfinished run.                      |
| Say something to a run that works   | `steer`. It reaches the model before its next request, and the task stays as it was.                           |
| Stop a run                          | `cancel`. The run is recorded as cancelled, and can be resumed.                                                |
| Work in several sessions at once    | Start a rumbo for each. Each is one session, with its own provider and extensions.                             |
| Try another direction               | [Branch](/guides/sessions/#branch): a new session from before any of your messages. Files are not rolled back. |
| See exactly what the model was sent | `rumbo request <session> [turn]`, and `rumbo log <session>` for every entry.                                   |
| Keep a long session going           | [Compaction](/guides/sessions/#compaction) summarizes it near the model's limit, or `/compact` when you ask.   |
| Show the model a picture            | `images` on `run` or `steer`; the `read` tool looks at an image file.                                          |
| Manage providers and extensions     | `rumbo provider` and `rumbo extension`, or their functions from any front end, such as `/extension-add`.       |
| See what a rumbo costs the machine  | `processes`, or `/processes`: each process, its memory, and its processor time.                                |
| Limit what the agent can touch      | Run rumbo in a container, a virtual machine, or another account. There are no permission prompts.              |

## Provider

A provider **must** answer `initialize` and `complete`, one request at a time, keep its own credentials, and stop a cancelled request within 5 seconds.

| It can                                          | Through                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| Stream the answer as it is written              | `delta`.                                                                             |
| List its models and describe its options        | `model`, `options`, and `fields` in its answer to `initialize`.                      |
| Offer commands, such as signing in              | `functions`, called with `invoke`, which can say things and `ask` questions.         |
| Keep what it needs to continue a conversation   | `opaque` blocks, stored and returned unchanged.                                      |
| Have a failed request sent again                | An error with code `1`.                                                              |
| Have a conversation that did not fit summarized | An error with code `2`.                                                              |
| Say how large the model's context is            | `context_window`, which compaction goes by.                                          |
| Say what it read from its cache                 | `cache_read` and `cache_write` in `usage`. The host tells you when a request missed. |
| Show the model images                           | The `images` of a user's text and of a tool's result.                                |

It **never** runs a tool, and never counts on getting the next request of the same conversation. [Write a provider](/extend/provider/) · [Protocol](/reference/provider-protocol/).

## Front end

A front end **must** answer `initialize`, send the `run` for a task or a resume the host passed it, and answer or decline every `ask`.

| It can                                   | Through                                                             |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Be started by rumbo, or start rumbo      | Descriptors 3 and 4, or `rumbo serve` on stdin and stdout.          |
| Show a run as it happens                 | `event`.                                                            |
| Offer every command without knowing them | The functions in `initialize` and `describe`, called with `invoke`. |
| Offer the provider's models and options  | `describe`.                                                         |
| Show a session it did not follow         | `history`.                                                          |
| Bring back what the person asked before  | `recall`.                                                           |
| Show several sessions                    | A `rumbo serve` for each, found with `rumbo sessions -json`.        |
| Say what its hosts cost                  | `processes`, asked of each host.                                    |
| Have a configuration of its own          | `config` in `initialize`, set with `rumbo frontend set`.            |

It **never** shows or stores a secret answer, and never guesses that a run is over before its `run` is answered. [Write a front end](/extend/front-end/) · [Protocol](/reference/frontend-protocol/).

## Extension

An extension **must** answer `initialize`, and every `call` to a tool it declared.

| It can                                        | Through                                                       |
| --------------------------------------------- | ------------------------------------------------------------- |
| Give the model tools                          | `tools`, called with `call`.                                  |
| Take the place of one of rumbo's tools        | A tool of that name, once the person agreed with `-replaces`. |
| Use rumbo's own tools while it answers a call | A `call` request of its own.                                  |
| Tell the model something when a run starts    | `sections`.                                                   |
| Offer the person commands                     | `functions`, shown as `/<extension>-<function>`.              |
| Ask the person something, from a tool         | `ask`, such as whether a command may run.                     |
| Hear what the runs do                         | `events`.                                                     |
| Change what it declares                       | `changed`; the host starts it again before the next run.      |
| Bring an MCP server's tools                   | rumbo's own `extend mcp`, added once for each server.         |

It **never** changes a message, another extension's tool, or when a run ends, and no run waits for a listener. [Write an extension](/extend/extension/) · [Protocol](/reference/extension-protocol/).

## Plugin

A plugin brings providers, front ends, extensions, and skills together, from a directory or a Git repository, and can build its programs when it is added. It adds no kind of thing and no protocol. [Install one](/guides/plugins/) · [Manifest](/reference/plugins/).
