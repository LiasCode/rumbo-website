---
title: Agent Provider Protocol
description: Version 1 of the protocol between the rumbo host and a provider, the program that turns a conversation into one request to a model. Every method, field, and error code, from the source.
---

A provider is a program the host starts as a child process. They exchange **JSON-RPC 2.0 objects, one per line**, on the provider's stdin and stdout. Whatever the provider prints on stderr reaches the person as a diagnostic, and a line on stdout that is not JSON is skipped rather than fatal.

This page describes protocol **version 1**, which rumbo 0.11.0 speaks, as 0.10.0 and 0.9.0 did.

## The methods

| Method       | Direction       | Kind         | What it does                                                                     |
| ------------ | --------------- | ------------ | -------------------------------------------------------------------------------- |
| `initialize` | Host → provider | Request      | Opens the connection and asks the provider what it is and what it offers.        |
| `complete`   | Host → provider | Request      | Asks for the next assistant message of a conversation.                           |
| `delta`      | Provider → host | Notification | Streams visible text for the request named by `id`.                              |
| `invoke`     | Host → provider | Request      | Calls one of the functions the provider described.                               |
| `ask`        | Provider → host | Request      | A function asks the person a question, while its `invoke` is in progress.        |
| `cancel`     | Host → provider | Notification | Asks the provider to stop the request named by `id`: a completion or a function. |
| `shutdown`   | Host → provider | Request      | The provider answers and exits.                                                  |

## `initialize`

The host sends `protocol` and the provider's registered `config`, which it never interprets. The provider answers:

| Field       | Required | Meaning                                                                                                         |
| ----------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `protocol`  | Yes      | `1`.                                                                                                            |
| `name`      | Yes      | What the provider calls itself.                                                                                 |
| `config`    | No       | The configuration in force: what it was given, plus its own default for each field left out. Shown, not stored. |
| `model`     | No       | An option that says how a model is chosen, usually by naming in `values` the function that lists them.          |
| `options`   | No       | What it accepts with each request besides the model, such as `effort`.                                          |
| `fields`    | No       | The fields of its configuration that a person can set, each with its default.                                   |
| `functions` | No       | What it can be asked through `invoke`.                                                                          |

An **option** is a small subset of JSON Schema: `name`, `type` (`string`, `number`, or `boolean`), `description`, `enum` for fixed values or `values` naming the function that returns them, `default`, and `optional` for a function's parameter. A **function** has a `name`, a `description`, `params`, an optional `confirm` text for one that cannot be undone, and `lists` when it exists only to supply another function's values. The host checks what a person sets against these descriptions and passes them to every front end, which is how a provider's settings and commands appear in an interface that has never heard of it.

## `complete`

```json
{
	"jsonrpc": "2.0",
	"id": 7,
	"method": "complete",
	"params": {
		"model": "some-model",
		"system": "You are an agent running in rumbo…",
		"messages": [{ "role": "user", "content": [{ "type": "text", "text": "list the files" }] }],
		"tools": [{ "name": "bash", "description": "…", "schema": { "type": "object" } }],
		"options": { "effort": "high" }
	}
}
```

The host **always sends the whole conversation**, and the conversation only grows by appending, so a provider can cache its prefix. `max_tokens` is left out, or zero, when the provider's own limit applies. `options` holds only the options a value was chosen for.

A message has a `role` (`user` or `assistant`) and `content`, a list of blocks:

| Block `type`  | Fields                                         | In                                                                                                                       |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `text`        | `text`, and `images` in a user message         | Both roles.                                                                                                              |
| `tool_call`   | `id`, `name`, `args`                           | Assistant messages.                                                                                                      |
| `tool_result` | `id` of the call, `text`, `is_error`, `images` | User messages.                                                                                                           |
| `opaque`      | `data`                                         | Whatever the provider needs back unchanged, such as signed reasoning. The host stores and replays it without reading it. |

An image is `{ "media_type", "data" }`, with the file in base64 and a type of `image/png`, `image/jpeg`, `image/gif`, or `image/webp`.

The answer is the finished message:

| Field            | Meaning                                                                                      |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `message`        | The assistant message. This, not the deltas, is what the session records.                    |
| `stop`           | `end`, `tool_calls`, `max_tokens`, or `refusal`.                                             |
| `usage`          | `input`, `output`, and optionally `cache_read` and `cache_write`, in tokens.                 |
| `context_window` | How many tokens the model's context holds, when the provider knows. The host compacts by it. |

## What the host does with the answer

| The provider says         | The host                                                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `stop: "tool_calls"`      | Runs each call in order, records the results, and asks again.                                                |
| `stop: "end"`             | Ends the run, unless the person said something the model has not read yet.                                   |
| `stop: "max_tokens"`      | Tells the model it was cut and asks it to continue. Its tool calls are not run. Three in a row fail the run. |
| `stop: "refusal"`         | Fails the run.                                                                                               |
| Error with code `1`       | Waits 2 s, 10 s, 30 s, then 1 min, sending the request again each time, and then fails the run.              |
| Error with code `2`       | Summarizes the conversation without the last step and tries once more.                                       |
| Any other error           | Fails the run with its message.                                                                              |
| Nothing, after a `cancel` | Kills the process after 5 seconds.                                                                           |

Codes `1` (transient: a rate limit, an overloaded server, a dropped connection) and `2` (the request did not fit in the model's context) are the two a provider chooses. The standard JSON-RPC codes `-32601`, `-32602`, and `-32603` keep their meaning.

## Functions and questions

`invoke` carries the function's `name` and its `params`. A function listed in an option's `values` answers `{ "values": [{ "value", "label", "description" }] }`; any other answers with whatever JSON it likes. While it works, a function can:

- send `delta` with the `id` of its `invoke`, to say something to the person;
- send `ask` as a request of its own, with that `id`, a `text`, and `secret` when the answer must not be shown or recorded. The answer is `{ "text" }`, or an error when the person declines or nobody can answer.

That is all a sign-in needs: say where to go, ask for the code.

## One request at a time

A provider process answers one request at a time. When the host needs several at once, it starts more processes of the same provider, and any of them may get any request, since each request carries the whole conversation. A provider must therefore keep nothing between requests that the next one depends on. A process that exits is replaced, and the request it was answering is treated as a transient failure.

No process starts until a request needs one. On `shutdown` the provider has 5 seconds to answer and exit before it is killed.

## In Go

The [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.11.0/protocol) package has these types and `Serve`, which turns a `Handler` into a provider.

**Source:** [`protocol/types.go`](https://github.com/LiasCode/rumbo/blob/v0.11.0/protocol/types.go) for the wire, [`internal/provider/stdio.go`](https://github.com/LiasCode/rumbo/blob/v0.11.0/internal/provider/stdio.go) and [`pool.go`](https://github.com/LiasCode/rumbo/blob/v0.11.0/internal/provider/pool.go) for the host's side, and [`internal/agent/agent.go`](https://github.com/LiasCode/rumbo/blob/v0.11.0/internal/agent/agent.go) for what the loop does with each answer. [Write a provider](/extend/provider/).
