---
title: Agent Frontend Protocol
description: Version 1 of the protocol between a front end and the rumbo host, as rumbo 0.9.0 speaks it. Both ways of connecting, every method, every event, and the functions the host offers, from the source.
---

A front end is the program a person uses: it sends tasks and shows what happens. It speaks **JSON-RPC 2.0, one object per line**, with the host. Lines that are not JSON are skipped.

This page describes **version 1, in rumbo 0.9.0**. The development branch speaks [version 2](/reference/next/) and refuses a front end that answers `1`.

## Two ways to connect

| Who starts whom                                               | The front end reads | The front end writes | The terminal                               |
| ------------------------------------------------------------- | ------------------- | -------------------- | ------------------------------------------ |
| **Attached.** `rumbo -f <name>` starts a registered front end | File descriptor 3   | File descriptor 4    | Stays the front end's, on stdin and stdout |
| **Standalone.** The front end starts `rumbo serve`            | The host's stdout   | The host's stdin     | Whatever the front end does with its own   |

The frames are the same either way, and in both **the host speaks first**. [Watch the two side by side](/#run-trace).

Attached, the host waits for the front end to exit and exits with its code. Standalone, closing the host's stdin ends it. Either way, when the connection closes the host cancels the runs in progress, records how they ended, and stops its providers and extensions.

## `initialize`

The host's first frame is a request, and nothing else happens until the front end answers it.

| The host says       | Meaning                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `protocol`          | `1`.                                                                                             |
| `dir`               | The directory the session works in.                                                              |
| `session`           | The session attached to; absent until the first run of a new one.                                |
| `provider`, `model` | What the session uses.                                                                           |
| `objective`         | The task given on the command line, if any. **The front end is expected to send it as a `run`.** |
| `resume`            | The person asked for `-r`. The front end is expected to send `run` with `resume: true`.          |
| `config`            | The front end's registered configuration.                                                        |
| `functions`         | What the host itself can be asked through `invoke`.                                              |

The front end answers `{ "protocol": 1, "name": "…" }`, and optionally `config`: the configuration in force, with its own default for each field it was not given. Answering any other protocol version ends the connection.

## The methods

| Method     | Direction        | Kind         | What it does                                                                                            |
| ---------- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| `run`      | Front end → host | Request      | Starts a run. Answered when the run ends, however it ends.                                              |
| `event`    | Host → front end | Notification | Something happened in a run, or a function said something.                                              |
| `steer`    | Front end → host | Request      | Tells a run in progress something. It reaches the model before its next request.                        |
| `cancel`   | Front end → host | Notification | Stops a run, a function, or everything.                                                                 |
| `describe` | Front end → host | Request      | What the provider in use offers, what is in force, and the functions of the extensions.                 |
| `invoke`   | Front end → host | Request      | Calls a function of the provider, the host, or an extension.                                            |
| `ask`      | Host → front end | Request      | A question for the person, from a function or from a tool. Answer `{ "text" }`, or an error to decline. |
| `history`  | Front end → host | Request      | A session's past, as the events of the runs that made it.                                               |
| `recall`   | Front end → host | Request      | What the person asked before in the project's sessions, most recent first, each once.                   |

## `run`

```json
{
	"jsonrpc": "2.0",
	"id": 20,
	"method": "run",
	"params": { "objective": "How much black ink is in stock?" }
}
```

| Param              | Meaning                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `objective`        | The task.                                                                                             |
| `images`           | Pictures given with it, each `{ "media_type", "data" }` in base64.                                    |
| `resume`           | Continue the session's unfinished run instead. Sent **without** an objective or images.               |
| `session`          | The session of the project to run in. Without it, the current one.                                    |
| `new`              | Start a new session. Cannot be combined with `session` or `resume`.                                   |
| `model`, `options` | What to use for this run, among what the provider described. What is left out keeps its stored value. |

A request the host does not start is answered at once with a JSON-RPC **error**: no id, neither a task nor `resume` (or both), an id that is already a run in progress, or a session that cannot run, such as one with no model chosen. A run that starts is answered when it ends with a **result**:

| Field     | Meaning                           |
| --------- | --------------------------------- |
| `status`  | `done`, `failed`, or `cancelled`. |
| `error`   | Why a failed run failed.          |
| `session` | The session it ran in.            |

A session has one run at a time, but a host works in several sessions of a project at once, so several `run` requests can be open. Their ids tell their events apart.

## `event`

Every event has a `type`. `run` is the id of the run request it belongs to and `session` the session of that run; both are absent for what belongs to no run. `invoke` is set instead on what a function says while it works.

| `type`          | Other fields                 | Meaning                                                                                                                    |
| --------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `context`       | `sections`                   | The names of the context sections sent to the model.                                                                       |
| `text`          | `text`                       | A piece of the model's visible answer, or something a function says.                                                       |
| `tool_started`  | `name`, `args`               | The model called a tool.                                                                                                   |
| `tool_progress` | `name`, `text`               | What a call says it is doing, when it says.                                                                                |
| `tool_finished` | `name`, `result`, `failed`   | The call ended.                                                                                                            |
| `turn`          | `usage`, `context`, `window` | One model response: its tokens, how many the conversation now takes, and how many the model holds, when the provider said. |
| `log`           | `text`, `source`             | A diagnostic: the provider's own output, an extension's, or something the host did, such as retrying a request.            |
| `objective`     | `text`, `images`             | In a history only: the task a run was given.                                                                               |
| `steer`         | `text`, `images`             | In a history only: what the person told a run while it worked.                                                             |
| `ended`         | `status`, `text`             | In a history only: how a run ended, and why a failed one failed.                                                           |

Ignore a type or a field you do not know. A live run is over when its `run` request is answered, not when text stops arriving.

## `steer`, `cancel`, and `ask`

- **`steer`** takes `text`, optional `images`, and `run`, the id of the run it is for. Without `run` it goes to the only run in progress, and fails when there is none or more than one. The run's task stays as it was.
- **`cancel`** takes `run` to stop one run, `invoke` to stop one function, or neither to stop every run. A cancelled run still answers its request, with `status: "cancelled"`.
- **`ask`** arrives with `text`, and `secret` when the answer must not be shown while typed or recorded anywhere. `invoke` names the function that asks; otherwise `run`, `session`, and `name` say which tool of which run does. A front end that cannot show a question answers with an error rather than leave it open.

## `describe`, `invoke`, and the host's functions

`describe` answers with the `provider`, the `model` and `options` in force, `offers` (the provider's own [description](/reference/provider-protocol/#initialize): how its model is chosen, its options, fields, and functions), and `extensions`, each extension that has functions with its `name` and `functions`.

`invoke` takes the function's `name`, its `params`, and a `target`: `provider` (the default), `host`, or `extension`, which `extension` then names. A function of the host answers `{ "text", "values", "state" }`: the outcome in words, the values of a function that lists something, and what the front end is attached to after the call (`dir`, `session`, `provider`, `model`), since the call may have changed it.

The host of rumbo 0.9.0 offers these, by `group`:

| Group      | Functions                                                                                                                                                            |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `system`   | `config`, `system-set`, `system-values`, `quit`                                                                                                                      |
| `session`  | `status`, `skills`, `sessions`, `projects`, `open`, `new`, `branch`, `branch-points`, `delete`, `rename`, `prune`, `use`, `session-set`, `session-values`, `compact` |
| `provider` | `providers`, `provider-models`, `provider-show`, `provider-set`, `provider-values`, `provider-add`, `provider-rm`                                                    |

Do not hard-code them. Build the commands, forms, and pickers from the descriptions: a parameter with `values` names the function to call for its choices, a function with `lists` exists only for that, and one with `confirm` cannot be undone, so show its text and call it only once the person agrees. That is what lets a front end work with a provider or an extension it has never seen.

## In Go

The [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.9.0/protocol) package has these types and `DialFrontend`, which answers `initialize` and returns a connection whose methods are the requests above.

**Source:** [`protocol/frontend.go`](https://github.com/LiasCode/rumbo/blob/v0.9.0/protocol/frontend.go) for the wire, [`internal/frontend/frontend.go`](https://github.com/LiasCode/rumbo/blob/v0.9.0/internal/frontend/frontend.go) for the host's side and the two pipes, and [`internal/cli/functions.go`](https://github.com/LiasCode/rumbo/blob/v0.9.0/internal/cli/functions.go) for the host's functions. [Write a front end](/extend/front-end/).
