---
title: Architecture
description: How rumbo 0.10.0 is put together. The host and what it owns, the three protocols around it, the loop that turns a task into an answer, and the rules the design depends on, from the source.
---

rumbo is one process, **the host**, and the programs it starts. The host owns the loop, the tools, and one session; another session is another host. It draws nothing, calls no model API, and knows nothing of MCP: each of those is another program, reached through a protocol.

## Who owns what

| Part          | Owns                                                                               | Never                                                            |
| ------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Host**      | The agent loop, the model's tools, the context, its session on disk, the settings. | Draws, or speaks to a model's API.                               |
| **Front end** | What the person sees and types.                                                    | Reads a session's files, or calls the model or a tool.           |
| **Provider**  | The connection to one model API and its credentials.                               | Runs a tool, or keeps a conversation between requests.           |
| **Extension** | Tools of its own, sections of context, commands, and what it does with events.     | Changes a message, another extension's tool, or when a run ends. |
| **Plugin**    | Nothing at run time: it is a package of the three kinds of program, and of skills. | Adds a kind of thing, or a protocol.                             |

Every line between two programs is **JSON-RPC 2.0, one object per line**, over pipes. No part listens on a port. A provider, or the MCP extension, may use HTTP beyond its own side.

## The loop

1. **Accept.** The front end sends `run`, which goes to the host's session. The host starts the provider and the extensions the run needs.
2. **Prepare.** The host records the system prompt if it changed, and the sections of context that changed: the environment, your instructions, your skills, and what extensions say. Then the task.
3. **Ask.** The host rebuilds the whole request from the session's entries and sends the provider `complete`. Text streams to the front end as it comes; what is recorded is the finished message.
4. **Act.** Each tool the model called runs in order, rumbo's own in the host and an extension's through `call`, and each result is recorded with the id of its call.
5. **Repeat** from 3, until the model answers without calling a tool. That is how it says it is done. rumbo runs no checks of its own and sends the model back for nothing.
6. **Finish.** The host records how the run ended, and answers the `run` request.

Before each request the host looks for what the person said meanwhile, so a `steer` reaches the model at its next turn, and checks whether the conversation has to be [compacted](/guides/sessions/#compaction).

| When                                             | The host                                                                                   |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| A request fails for a transient reason           | Waits 2 s, 10 s, 30 s, then 1 min, trying again each time; then the run fails.             |
| The context reaches `compact_at`                 | Has the model summarize the conversation, and goes on from the summary.                    |
| A request does not fit in the model's context    | Summarizes without the last step, tells the model that step was lost, and tries once more. |
| The output limit cuts a response                 | Tells the model to continue. Its tool calls are not run. Three in a row fail the run.      |
| The model refuses                                | The run fails.                                                                             |
| `max_turns` responses were given                 | The run stops, and can be resumed.                                                         |
| The run is cancelled, fails, or the process dies | It is unfinished: `rumbo -r` closes the calls that never ended and carries on.             |

[Watch a run cross the protocols](/#run-trace).

## The model's tools

| Tool       | Does                                                                                                 | Bounded by                                                                                 |
| ---------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `read`     | Reads a text file, or looks at an image.                                                             | 500 lines a call by default; never more than 2,000 lines or 50,000 bytes.                  |
| `write`    | Creates a file or replaces all of it. An existing file must have been read first.                    |                                                                                            |
| `edit`     | Replaces text that occurs exactly once, or every occurrence when asked.                              |                                                                                            |
| `bash`     | Runs a command in the session's directory, or leaves it running in the background.                   | 2 minutes by default, 30 at most; 12,000 bytes of output inline, the rest saved to a file. |
| `computer` | Screenshots, pointer, and keyboard of the desktop. Only with [`computer=on`](/guides/computer-use/). |                                                                                            |

A result is paid for again on every later request, which is why each is kept small and says how to get the rest.

## A session is a log

Each session is a directory with two files: `session.json`, what it is and what it chose, and `entries.jsonl`, its history, one entry to a line. Entries are **only ever appended**. Their kinds are `system`, `context`, `user`, `steer`, `assistant`, `tool_result`, `harness`, `note`, and `compaction`.

One function, `transcript.Build`, replays the entries into the system prompt, the tools, the messages, and the sections the model was told. Nothing else decides what the model sees. That single rule is what makes a session replayable (`rumbo request`), resumable, and branchable, and what keeps the start of every request identical to the one before, so the provider reads it from its cache.

## One host, one session

A rumbo process starts in a new session or continues one, works in it one run at a time, and ends with it. So each session has its own settings as they were read, its own provider and extension processes, and its own tools, and what goes wrong in one stays there. The host holds a lock on its session while it works in it, so two processes never interleave entries into one history.

A session's **root** is the directory rumbo was started in: where it works, what lists and continues it, and the one place besides your own whose instructions and skills the model is told. Nothing above it is looked at, the top of a Git repository included.

A front end that shows several sessions, as the [terminal UI](/guides/terminal-ui/) and the [desktop app](/guides/desktop-app/) do, starts a host for each, lists them with `rumbo sessions -json`, and closes those it does not need. The `processes` request says what each costs.

## Rules the design depends on

| Rule                                                              | So that                                                                                           |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Entries are append-only.                                          | History never changes under a branch, a resume, or a replay.                                      |
| The request is rebuilt from the entries alone.                    | `rumbo request` prints what was sent, and a run that died picks up where it stopped.              |
| The prefix is stable: no timestamps, no random order.             | The provider's cache holds, and a miss is told to you.                                            |
| rumbo's own programs use the same protocols as yours.             | Anything they do, yours can.                                                                      |
| The protocols only grow. A break needs a new version.             | A program written for a version keeps working with it.                                            |
| The host never touches the terminal once a front end is attached. | The front end owns what the person sees. What they must see is an event.                          |
| The agent acts with your rights.                                  | Limits come from a sandbox you choose, not from prompts. See [before you run it](/start/safety/). |

**Source:** [`internal/cli`](https://github.com/LiasCode/rumbo/tree/v0.10.0/internal/cli) wires the host; [`internal/agent/agent.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/internal/agent/agent.go) is the loop; [`internal/transcript`](https://github.com/LiasCode/rumbo/tree/v0.10.0/internal/transcript) rebuilds requests; [`internal/store/files.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/internal/store/files.go) keeps sessions; [`internal/tool`](https://github.com/LiasCode/rumbo/tree/v0.10.0/internal/tool) has the tools.
