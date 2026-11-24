---
title: Agent Frontend Protocol
description: Version 2 of the protocol between a front end and the rumbo host, as rumbo 0.10.0 speaks it. Both ways of connecting, one host per session, every method, every event, and the functions the host offers, from the source.
---

A front end is the program a person uses: it sends tasks and shows what happens. It speaks **JSON-RPC 2.0, one object per line**, with the host. Lines that are not JSON are skipped.

This page describes **version 2, in rumbo 0.10.0**. rumbo 0.9.0 spoke version 1, in which one host worked in several sessions of a project. A host and a front end that speak different versions refuse each other in `initialize`.

## Two ways to connect

| Who starts whom                                               | The front end reads | The front end writes | The terminal                               |
| ------------------------------------------------------------- | ------------------- | -------------------- | ------------------------------------------ |
| **Attached.** `rumbo -f <name>` starts a registered front end | File descriptor 3   | File descriptor 4    | Stays the front end's, on stdin and stdout |
| **Standalone.** The front end starts `rumbo serve`            | The host's stdout   | The host's stdin     | Whatever the front end does with its own   |

The frames are the same either way, and in both **the host speaks first**. [Watch the two side by side](/#run-trace).

Attached, the host waits for the front end to exit and exits with its code. Standalone, closing the host's stdin ends it. Either way, when the connection closes the host cancels the run in progress, records how it ended, and stops its providers and extensions.

## `initialize`

The host's first frame is a request, and nothing else happens until the front end answers it.

| The host says       | Meaning                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| `protocol`          | `2`.                                                                                             |
| `dir`               | The directory the session works in, which is its root.                                           |
| `session`           | The host's session; absent until the first run of a new one.                                     |
| `title`             | What the session is called; absent with `session`.                                               |
| `provider`, `model` | What the session uses.                                                                           |
| `objective`         | The task given on the command line, if any. **The front end is expected to send it as a `run`.** |
| `resume`            | The person asked for `-r`. The front end is expected to send `run` with `resume: true`.          |
| `config`            | The front end's registered configuration.                                                        |
| `functions`         | What the host itself can be asked through `invoke`.                                              |

The front end answers `{ "protocol": 2, "name": "…" }`, and optionally `config`: the configuration in force, with its own default for each field it was not given. Answering any other protocol version ends the connection, and the host says why.

## One host, one session

A host is one session: the one `initialize` names, or a new one, which its first run makes. Every run works in it, one at a time, and the host's functions act on it. A front end that wants another session starts another `rumbo serve`: with `-s` and an id to continue one, such as the session a `branch` made, or with neither for a new one. Each host is a process of its own, with its own providers and extensions, so a front end that shows several sessions holds one connection to each, groups them by the `dir` each says, and closes those it no longer needs.

It learns the sessions there are from `rumbo sessions -json`, which prints those of its working directory, or with `-all` those of every one, most recently used first:

```json
[
	{
		"session": "5af9fb0b",
		"title": "How much black ink is in stock?",
		"dir": "/home/me/shop",
		"used": "2026-11-25T00:17:26+01:00",
		"state": "done",
		"in_use": false,
		"turns": 2
	}
]
```

`parent`, when there is one, is the session a branch came from; `state` is how the last run ended: `new`, `done`, `failed`, `cancelled`, or `interrupted`; and `in_use` says whether a rumbo process holds the session now. Fields may be added.

## The methods

| Method      | Direction        | Kind         | What it does                                                                                            |
| ----------- | ---------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| `run`       | Front end → host | Request      | Starts a run. Answered when the run ends, however it ends.                                              |
| `event`     | Host → front end | Notification | Something happened in a run, or a function said something.                                              |
| `steer`     | Front end → host | Request      | Tells a run in progress something. It reaches the model before its next request.                        |
| `cancel`    | Front end → host | Notification | Stops a run, a function, or everything.                                                                 |
| `describe`  | Front end → host | Request      | What the provider in use offers, what is in force, and the functions of the extensions.                 |
| `invoke`    | Front end → host | Request      | Calls a function of the provider, the host, or an extension.                                            |
| `ask`       | Host → front end | Request      | A question for the person, from a function or from a tool. Answer `{ "text" }`, or an error to decline. |
| `history`   | Front end → host | Request      | The session's past, as the events of the runs that made it.                                             |
| `recall`    | Front end → host | Request      | What the person asked before in the sessions of the host's directory, most recent first, each once.     |
| `processes` | Front end → host | Request      | The processes the host has running, and what each uses.                                                 |

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
| `model`, `options` | What to use for this run, among what the provider described. What is left out keeps its stored value. |

A request the host does not start is answered at once with a JSON-RPC **error**: no id, neither a task nor `resume` (or both), an id that is already a run in progress, a run sent while another works or while the session is being compacted, or a session that cannot run, such as one with no model chosen. A run that starts is answered when it ends with a **result**:

| Field     | Meaning                           |
| --------- | --------------------------------- |
| `status`  | `done`, `failed`, or `cancelled`. |
| `error`   | Why a failed run failed.          |
| `session` | The session it ran in.            |

Other requests can be sent while the run works, without waiting for its result. A version 1 `run` named a `session` or asked for a `new` one; version 2 has neither, since the run always goes to the host's session.

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

- **`steer`** takes `text`, optional `images`, and `run`, the id of the run it is for. Without `run` it goes to the run in progress, and fails when there is none. The run's task stays as it was.
- **`cancel`** takes `run` to stop one run, `invoke` to stop one function, or neither to stop the run in progress. A cancelled run still answers its request, with `status: "cancelled"`.
- **`ask`** arrives with `text`, and `secret` when the answer must not be shown while typed or recorded anywhere. `invoke` names the function that asks; otherwise `run`, `session`, and `name` say which tool of which run does. A front end that cannot show a question answers with an error rather than leave it open.

## `describe`, `invoke`, and the host's functions

`describe` answers with the `provider`, the `model` and `options` in force, `offers` (the provider's own [description](/reference/provider-protocol/#initialize): how its model is chosen, its options, fields, and functions), and `extensions`, each extension that has functions with its `name` and `functions`.

`invoke` takes the function's `name`, its `params`, and a `target`: `provider` (the default), `host`, or `extension`, which `extension` then names. A function of the host answers `{ "text", "values", "state" }`: the outcome in words, the values of a function that lists something, and what the front end is attached to after the call (`dir`, `session`, `title`, `provider`, `model`), since the call may have changed it. `branch` answers with the session it made as its one value, and the host stays in its own: another host goes on in the branch, started with `-s` and that id.

The host of rumbo 0.10.0 offers these, by `group`:

| Group       | Functions                                                                                                         |
| ----------- | ----------------------------------------------------------------------------------------------------------------- |
| `system`    | `config`, `system-set`, `system-values`, `processes`, `quit`                                                      |
| `session`   | `status`, `skills`, `branch`, `branch-points`, `rename`, `use`, `session-set`, `session-values`, `compact`        |
| `provider`  | `providers`, `provider-models`, `provider-show`, `provider-set`, `provider-values`, `provider-add`, `provider-rm` |
| `extension` | `extensions`, `extension-show`, `extension-set`, `extension-values`, `extension-add`, `extension-rm`              |

The `session` group acts on the host's session alone: version 1's `sessions`, `projects`, `open`, `new`, `delete`, and `prune` are gone, and sessions are listed, renamed, and deleted with `rumbo sessions`. A change to an extension applies to the runs that start after it, and may change the functions the extensions offer, so ask `describe` again before offering them. The functions are answered while a run works, but `compact`, and `branch` without a `point`, answer with an error then.

Do not hard-code them. Build the commands, forms, and pickers from the descriptions: a parameter with `values` names the function to call for its choices, a function with `lists` exists only for that, and one with `confirm` cannot be undone, so show its text and call it only once the person agrees. That is what lets a front end work with a provider or an extension it has never seen.

## `processes`

```json
{ "jsonrpc": "2.0", "id": 6, "method": "processes", "params": {} }
```

The answer is `{ "processes": [...] }`, the host first and each other process after the one that started it. Each has `pid`, `parent`, `role`, `name` for a provider or an extension, `command` (the program's name, without its arguments), `memory` in bytes, and `cpu`, the processor time used since it started, in seconds, as the system's `ps` reports them.

| `role`                  | The process                                                                       |
| ----------------------- | --------------------------------------------------------------------------------- |
| `host`                  | The host itself.                                                                  |
| `frontend`              | The front end, when the host started it. One that started the host is not listed. |
| `provider`, `extension` | The provider or extension `name` names, or a process it started.                  |
| `background`            | What the model left running with `bash`.                                          |
| `command`               | Anything else the host started for the moment, such as the command a tool runs.   |

Do not take a role you do not know for an error; more may be added. A front end that holds several hosts asks each, to say what they cost and close those nobody uses. The host's `processes` function shows the same to a person.

## In Go

The [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.10.0/protocol) package has these types and `DialFrontend`, which answers `initialize` and returns a connection whose methods are the requests above.

**Source:** [`protocol/frontend.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/protocol/frontend.go) for the wire, [`internal/frontend/frontend.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/internal/frontend/frontend.go) for the host's side and the two pipes, and [`internal/cli/functions.go`](https://github.com/LiasCode/rumbo/blob/v0.10.0/internal/cli/functions.go) for the host's functions. [Write a front end](/extend/front-end/).
