---
title: Agent Extension Protocol
description: Version 1 of the protocol between the rumbo host and an extension, the program that gives the model tools, tells it context, offers the person commands, and listens to runs. Every method, limit, and rule, from the source.
---

An extension is a program the host starts as a child process. They exchange **JSON-RPC 2.0 objects, one per line**, on the extension's stdin and stdout; stderr reaches the person as a diagnostic, and a stdout line that is not JSON is skipped. The framing, `initialize`, `invoke`, `delta`, `ask`, `cancel`, and `shutdown` are the [provider protocol's](/reference/provider-protocol/).

This page describes protocol **version 1**, which rumbo 0.10.0 speaks, as 0.9.0 did.

## Four things an extension can declare

Its answer to `initialize` says which of these it does. All are optional.

| Declares    | As                                                                                 | The host then                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `tools`     | `{ "name", "description", "schema" }` each                                         | Declares them to the model after rumbo's own, in an order that does not change, and sends `call` for each use. |
| `sections`  | Names                                                                              | Asks for each one's text with `section` when a run starts, and tells the model the ones that changed.          |
| `functions` | The same [descriptions](/reference/provider-protocol/#initialize) a provider gives | Offers them to every front end, which reaches them through `invoke`.                                           |
| `events`    | Event types, such as `ended`                                                       | Sends matching `event` notifications, the ones a [front end](/reference/frontend-protocol/#event) is told.     |

`initialize` gives the extension `protocol`, its registered `config`, and `name`, the name the person registered it under. It answers `protocol: 1`, a `name`, and the declarations above.

## The methods

| Method       | Direction        | Kind         | What it does                                                                    |
| ------------ | ---------------- | ------------ | ------------------------------------------------------------------------------- |
| `initialize` | Host → extension | Request      | Opens the connection.                                                           |
| `call`       | Host → extension | Request      | Runs one of the extension's tools.                                              |
| `call`       | Extension → host | Request      | Runs one of rumbo's own tools, while the extension answers a call.              |
| `section`    | Host → extension | Request      | Asks for the text of one section.                                               |
| `invoke`     | Host → extension | Request      | Calls one of its functions, for the person.                                     |
| `event`      | Host → extension | Notification | Something happened in a run, of a type it asked for.                            |
| `delta`      | Extension → host | Notification | Something to say while a `call` or an `invoke` works.                           |
| `ask`        | Extension → host | Request      | A question for the person, from inside a `call` or an `invoke`.                 |
| `changed`    | Extension → host | Notification | What it declared is no longer so. The host starts it again before the next run. |
| `cancel`     | Host → extension | Notification | Stop the request named by `id`.                                                 |
| `shutdown`   | Host → extension | Request      | Answer and exit. It is killed after 5 seconds.                                  |

## A tool call

```json
{
	"jsonrpc": "2.0",
	"id": 3,
	"method": "call",
	"params": {
		"name": "remember",
		"args": { "text": "ship on Friday" },
		"dir": "/home/me/notes",
		"session": "…"
	}
}
```

`args` is the object the model gave, which the tool's schema describes; `dir` is the directory the session works in; `session` is there for an extension that keeps something for each. The answer is what the model reads:

| Field      | Meaning                                                                              |
| ---------- | ------------------------------------------------------------------------------------ |
| `text`     | The result. Long text is shortened as a command's output is.                         |
| `images`   | Pictures it shows the model, each `{ "media_type", "data" }` in base64.              |
| `is_error` | The call failed, and `text` says how to recover. The model reads it and tries again. |

Use `is_error` for a tool that failed, and a JSON-RPC error only for a request the extension could not take at all.

While it answers a call, an extension can call **rumbo's own tools** with a `call` request of its own: `{ "id": 3, "name": "bash", "args": { … } }`, where `id` is the id of the call it is answering. The tool runs in that session's directory, as it would for the model, and the host answers with the same `{ "text", "images", "is_error" }`. An extension that replaces `bash` passes on what it lets through this way. A function, which runs in no session, cannot.

## Naming, and replacing a tool

| What it declares | Must match                | Refused when                                                                                        |
| ---------------- | ------------------------- | --------------------------------------------------------------------------------------------------- |
| A tool           | `^[a-zA-Z0-9_-]{1,64}$`   | Another extension has one of that name, or rumbo does and the person did not say it may replace it. |
| A section        | `^[a-z0-9_-]{1,64}$`      | Rumbo or another extension has one of that name.                                                    |
| A function       | `^[a-z][a-z0-9_-]{0,63}$` | The name is not one.                                                                                |

**A tool never replaces rumbo's by its name alone.** The person says so, with `rumbo extension add -replaces bash …` or `replaces=bash`, and the extension must then declare a tool of that name. When any extension fails to start or declares something refused, the run does not start at all: a run with some of its tools missing would not be the one the person asked for.

## Sections

A section is text the model is told when a run starts, and again only when it changed, so it is paid for once. The host sends `section` with `name`, `dir`, and `session`, and the extension answers `{ "text" }`. An empty text takes the section away.

Every run waits for its sections, so they are bounded: an extension has **10 seconds** to answer, and at most **8,000 bytes** are told. When it cannot answer, the person is told why, and the model goes on with what it was told last.

## Functions, questions, and events

A front end offers an extension's function as a command named after the extension: `forget`, of an extension registered as `notes`, is `/notes-forget` in the terminal UI. The host sends `invoke` with its `name` and `params`.

From inside a `call` or an `invoke`, `delta` says something to the person and `ask` asks them something, both naming the `id` of the request they belong to. `ask` takes `text` and `secret`, and is answered `{ "text" }`, or with an error when the person declines or no one is there to ask. What is asked and answered is recorded nowhere.

An extension that asked for events is sent them without the run waiting for it. Up to 1,024 wait for one that is slow to read; what comes after is dropped. Nothing an extension does with an event changes a run.

## One process for the host

The host starts an extension when a run first needs it and keeps that **one process** until the host exits, for its runs and for what the person asks of the extension meanwhile. A host is one session, so each session has a process of the extension of its own. What a call leaves in memory is there for the next, so an extension can hold a connection, and calls can be in progress at once, which is why each answer carries the `id` of its request. A process that died is started again by the next call.

## In Go

The [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.10.0/protocol) package has these types and `ServeExtension`, which turns an `ExtensionHandler` into an extension.

**Source:** [`protocol/extension.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/protocol/extension.go) for the wire, [`internal/extension/process.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/internal/extension/process.go) for one process, and [`set.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/internal/extension/set.go) for the rules on names, replacement, and sections. [Write an extension](/extend/extension/) · [Extensions and MCP](/guides/extensions/).
