---
title: Glossary
description: The words rumbo uses for its parts, its messages, and what it stores, each as the source of rumbo 0.13.0 means it.
---

## The parts

| Term                   | Meaning                                                                                                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Host**               | rumbo itself: the process that runs the agent loop and the tools in one session. Another session is another host.                               |
| **Front end**          | The program a person uses. It sends tasks and shows events, and holds no credentials and no session files.                                      |
| **Provider**           | The program that reaches one model API. It turns a conversation into a request and back.                                                        |
| **Extension**          | A program that gives the model tools, tells it context, offers the person commands, or listens to runs.                                         |
| **Plugin**             | A directory with a `plugin.yaml` that brings providers, front ends, extensions, and skills at once.                                             |
| **Attached**           | rumbo started the front end. The protocol is on the front end's file descriptors 3 and 4, and the terminal stays its own.                       |
| **Standalone**         | The front end started `rumbo serve`. The protocol is on the host's stdin and stdout.                                                            |
| **`plain`**            | The built-in front end with no screen: the model's text on stdout, the progress on stderr, and an exit code.                                    |
| **MCP extension**      | rumbo's own extension for one Model Context Protocol server, `rumbo extend mcp`, added once for each server.                                    |
| **rumbo's own plugin** | The plugin `rumbo`, built into the executable: the built-in providers, the terminal UI, the MCP extension, and the skill `rumbo`. Always there. |

## A run

| Term          | Meaning                                                                                                                                                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Objective** | The task a run is given. The protocols call it `objective`.                                                                                                                  |
| **Run**       | The work on one objective, from the `run` request to its answer: done, failed, or cancelled.                                                                                 |
| **Turn**      | One response of the model, with the tool calls it made.                                                                                                                      |
| **Steer**     | What the person says to a run while it works. The model reads it before its next request.                                                                                    |
| **Resume**    | Carrying on a run that failed, was cancelled, or was cut short, without a new objective.                                                                                     |
| **Tool call** | The model asking for a tool, with an id. Its **tool result** carries the same id back in the next request.                                                                   |
| **Function**  | An operation for the person, not the model: the host's, a provider's, or an extension's. A front end offers it as a command; the terminal UI makes its few commands of them. |
| **Option**    | A value a provider accepts with a request, such as `effort`, described so any front end can offer it.                                                                        |
| **Event**     | Something the host tells a front end, or a listening extension, about a run.                                                                                                 |
| **Delta**     | A piece of text streamed while a request is in progress. For display; the finished message is what counts.                                                                   |
| **Transient** | A failure worth sending the request again for, such as a rate limit. Error code `1`.                                                                                         |
| **Overflow**  | A request that did not fit in the model's context. Error code `2`.                                                                                                           |

## What is kept

| Term                | Meaning                                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Session**         | A conversation and what it chose, in a directory of its own. Not a copy of your files. One host works in it.           |
| **Entry**           | One line of a session's `entries.jsonl`. Entries are only ever appended.                                               |
| **Root**            | The directory rumbo was started in, where its session works. Nothing above it is looked at, a Git repository included. |
| **Branch**          | A new session that starts with a copy of another's entries, up to a point. The first one stays as it was.              |
| **Compaction**      | Replacing the conversation the model is sent with a summary of it. The entries before it stay stored.                  |
| **Prefix**          | The start a request shares with the one before, which a provider reads from its cache.                                 |
| **Ambient context** | What the model is told without asking: the environment, your instructions, the skills, and extensions' sections.       |
| **Section**         | One named part of the ambient context. It is sent once, and again only when it changed.                                |
| **Instructions**    | Your `AGENTS.md` or `CLAUDE.md` files: yours for everywhere, and the one in the session's root.                        |
| **Skill**           | Instructions for one kind of task, in a `SKILL.md`. The model is told its name and purpose, and reads it when needed.  |
| **Opaque block**    | Data a provider needs back unchanged, such as signed reasoning. The host stores it without reading it.                 |

[How the parts fit](/reference/architecture/) · [A run, frame by frame](/#run-trace)
