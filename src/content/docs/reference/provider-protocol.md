---
title: 'Agent Provider Protocol'
description: 'The Agent Provider Protocol: the JSON-RPC contract between the rumbo host and a provider, the program that reaches a model.'
---

Version 1.

The protocol connects the rumbo host to a **provider**: a program that turns a
conversation into the next assistant message. It plays the role the Language
Server Protocol plays for editors: the host does not know how a provider
reaches its model, and a provider written once works with any host.

The Go types are in the [`protocol`](https://github.com/LiasCode/rumbo/tree/main/protocol) package, which also contains
`Serve`, a ready-made server for providers written in Go.
[examples/provider.py](https://github.com/LiasCode/rumbo/blob/main/examples/provider.py) is a provider in Python.

## Transport

- The host starts the provider as a child process.
- Messages are JSON-RPC 2.0 objects, **one per line**, UTF-8, on the
  provider's stdin (host to provider) and stdout (provider to host).
- stdout carries only protocol messages. Diagnostics go to stderr, which the
  host shows to the user.
- The host sends one `complete` at a time.

## Lifecycle

![The host sends initialize and the provider answers; for each complete, the provider sends zero or more delta notifications, then the result; more completes follow, until the host sends shutdown, the provider answers, and exits.](/diagrams/provider-lifecycle.svg)

## Methods

### `initialize` (request)

```json
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocol": 1, "config": {} } }
```

`config` is what the user chose for the provider (`rumbo provider set`,
or its `config` in rumbo's `config.yaml`), as JSON. Its meaning is the
provider's own. A value the user set for one of the provider's options is a
field of it too, under the option's name; the host sends it in the `options`
of every request as well, unless the session or the run chose another, so a
provider may read its options in either place. Credentials should not be in
it: read them from the environment or from the provider's own storage.

Result: `{"protocol":1,"name":"my-provider","config":{"base_url":"https://example"}}`.
The host refuses a provider that answers with a different protocol version.

`config` in the result is the configuration in force: the one given, with
the provider's own default for every field it was not given. A provider
says it, so that every field has a value the user can see: `rumbo provider
show` prints it next to what was chosen. The host stores none of it. Only
what the user chose is kept, so a default the provider changes reaches
everyone who chose nothing else.

The result may also carry what the provider says about itself. See
[Describing the provider](#describing-the-provider).

### `complete` (request)

```json
{"jsonrpc":"2.0","id":2,"method":"complete","params":{
  "model": "some-model",
  "system": "You are an agent running in rumbo...",
  "messages": [ ... ],
  "tools": [{"name":"bash","description":"...","schema":{ JSON Schema }}],
  "max_tokens": 0
}}
```

- `messages` is the whole conversation, every time. Roles alternate between
  `user` and `assistant`, starting with `user`.
- `max_tokens` of `0` or absent means the provider's default.
- `options`, when present, is an object with the values chosen for the
  options the provider described. Answer with an error for a value or a name
  you do not accept: the host does not check them.

Result:

```json
{"message":{"role":"assistant","content":[ ... ]},
 "stop":"end",
 "usage":{"input":1200,"output":85,"cache_read":0,"cache_write":0},
 "context_window":200000}
```

`context_window` is how many tokens the model's context holds. It is
optional, and worth sending when the provider knows it: the host uses it to
summarize the conversation before the context fills, which matters most for
models with small contexts. Without it the host works to a fixed limit.

In `usage`, `cache_read` is how much of the request came from the
provider's cache, `cache_write` how much of it was written there, and
`input` the rest. The host expects the next request to read at least the
two together, and tells the person when it reads less.

`stop` is one of:

| Value        | Meaning                                              |
| ------------ | ---------------------------------------------------- |
| `end`        | The model finished its message.                      |
| `tool_calls` | The message contains tool calls for the host to run. |
| `max_tokens` | The output limit cut the message.                    |
| `refusal`    | The model declined the request.                      |

A failure is a JSON-RPC error; its `message` is shown to the user.

An error with `code` `1` is **transient**: a rate limit, an overloaded
server, a dropped connection. The host waits and sends the same request
again, a few times, with growing pauses. Use it only for failures that can
succeed unchanged later; any other code ends the run at once.

```json
{ "jsonrpc": "2.0", "id": 2, "error": { "code": 1, "message": "429 rate limited" } }
```

An error with `code` `2` says the request **did not fit** in the model's
context. The host summarizes the conversation, leaving out the last step,
which is what tipped it over, and sends the shorter request. A second such
error in a row ends the run.

### `invoke` (request)

```json
{ "jsonrpc": "2.0", "id": 3, "method": "invoke", "params": { "name": "models", "params": {} } }
```

Calls one of the functions the provider described. The result is whatever
JSON the function returns; the host passes it to whoever asked, unread. A
provider that described no functions answers with an error.

A function can talk with the person while it works, as a login does when it
says where to sign in and asks for the code it gets back. What it says is a
`delta` with the id of the `invoke`, and what it asks is an `ask`. It can
take as long as the person does; the host sets no limit, and sends `cancel`
when the person gives up. In Go, a provider whose functions talk implements
`DialogInvoker` instead of `Invoker`.

### `delta` (notification, provider to host)

```json
{ "jsonrpc": "2.0", "method": "delta", "params": { "id": 2, "text": "Let me look" } }
```

Visible text of the running request `id`, for display. Optional. For a
`complete` it is a piece of the answer, and the result is the authoritative
message. For an `invoke` it is something the function says to the person,
shown as it arrives.

### `ask` (request, provider to host)

```json
{
	"jsonrpc": "2.0",
	"id": 1,
	"method": "ask",
	"params": { "id": 3, "text": "Paste the code the page shows", "secret": true }
}
```

A question for the person, from the function of the running `invoke` `id`.
The request's own id is the provider's to choose, an integer. The host asks
the front end and answers with what the person typed:

```json
{ "jsonrpc": "2.0", "id": 1, "result": { "text": "4711-0815" } }
```

or with an error when the person declines, the function is cancelled, or
nobody can be asked, such as when the question belongs to no `invoke` in
progress. With `secret` the answer, such as a password, is not shown while
it is typed, and the host and the front end record it nowhere.

### `cancel` (notification, host to provider)

```json
{ "jsonrpc": "2.0", "method": "cancel", "params": { "id": 2 } }
```

Abort request `id`: a completion, or a function. The provider must still
answer the request, normally with an error. The host kills a provider that
does not answer within a few seconds.

### `shutdown` (request)

Answer with `{}` and exit.

## Describing the provider

A provider can say what may be chosen and asked of it. The host knows
nothing of what it means: it hands the description to the front end, sends
the chosen values back with every `complete`, and relays `invoke`. It does
read the description for one thing, to check a value a person sets before
keeping it: a name the provider does not describe is refused, and a value is
read as its `type` says and must be one of its `enum`. That is how a front
end offers a provider's settings without knowing the provider, and how a
provider adds a setting without anything else changing.

The description travels in the `initialize` result. Every part is optional.

```json
{
	"protocol": 1,
	"name": "my-provider",
	"model": { "type": "string", "values": "models", "description": "Model to use" },
	"options": [
		{
			"name": "effort",
			"type": "string",
			"enum": ["low", "high"],
			"default": "low",
			"description": "How thorough the model is"
		},
		{ "name": "web", "type": "boolean", "description": "Let the model search the web" }
	],
	"fields": [
		{
			"name": "base_url",
			"type": "string",
			"default": "https://example",
			"description": "Where the server listens"
		}
	],
	"functions": [{ "name": "models", "description": "List the available models" }]
}
```

**An option** is one value the provider accepts with a request:

| Field         | Meaning                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | The key it has in `options`.                                                                                                                                                                      |
| `type`        | `string`, `number`, or `boolean`.                                                                                                                                                                 |
| `description` | For a person choosing it.                                                                                                                                                                         |
| `enum`        | The accepted values of a string option, when they are fixed.                                                                                                                                      |
| `values`      | The name of a function that returns the accepted values, when they are not.                                                                                                                       |
| `default`     | What applies when nothing is chosen, for a person to see. It may be empty when that means the model decides. The host stores no default, and sends an option only when a value was chosen for it. |
| `optional`    | For a parameter of a function: it may be left out. Optional parameters come last.                                                                                                                 |

This is a small subset of JSON Schema on purpose: a front end can offer it
without a validator.

**`model`** describes the model the same way, without a `name`. The model is
not an option: it stays the `model` field of `complete`, because every
provider has one and the host records it with each answer. The model a new
session starts with is kept by the host, with what the person set for the
provider, and is not part of its `config`.

**`fields`** describe the fields of the provider's `config` besides its
options, the same way, each with its `default`: what a person can set for
the provider, which it reads when it starts. A person sets a field and an
option alike, and the host checks both against what describes them. A
field the provider does not describe can still be set when the `config` in
force names it, and is read as the value it has there; one neither names is
refused. The host also starts the provider with the changed `config` before
keeping it, so a value the provider refuses at `initialize` is not kept.

**A function** has a `name`, a `description`, and `params`, a list of options
describing its arguments. What it does and returns is the provider's own. A
function that cannot be undone adds `confirm`, a sentence saying what it
does; a front end shows it and calls the function only after the person
agrees.

One convention ties the two together. A function that an option names in
`values` returns the accepted values in this shape, so a front end can build
a picker from any provider:

```json
{ "values": [{ "value": "big-1", "label": "Big 1", "description": "Slow and careful" }] }
```

Only `value` is required. A front end calls it with what was given for the
parameters before the option, those the function takes as its own, so the
values of one parameter can depend on another.

## Content blocks

A message's `content` is a list of blocks.

| `type`        | Fields                                           | Appears in |
| ------------- | ------------------------------------------------ | ---------- |
| `text`        | `text`, and `images` in a user message           | both roles |
| `tool_call`   | `id`, `name`, `args` (JSON)                      | assistant  |
| `tool_result` | `id` (of the call), `text`, `is_error`, `images` | user       |
| `opaque`      | `data` (any JSON)                                | assistant  |

**`text`.** In a user message, `images` are pictures the person gave with
what they said, such as a pasted screenshot, in the form a tool's result
uses below; the text may then be empty. They go to the model with the text.

**`tool_call`.** `args` should be the JSON object the model produced. If the
model produced something that is not valid JSON, send it as a JSON string: the
host rejects it and tells the model.

**`tool_result`.** Every `tool_call` of an assistant message has a
`tool_result` in the next user message, before any text.

`images`, when present, are what the result shows the model, such as a
screenshot: a list of `{"media_type": "image/png", "data": "<base64>"}`,
where the type is `image/png`, `image/jpeg`, `image/gif`, or `image/webp`.
The text always says what each image is, so a provider whose model API
takes no images in a tool result sends the text alone, and the model still
knows what it was not shown.

**`opaque`.** State the provider needs back to continue the conversation, such
as signed reasoning. The host stores it and returns it in place, unread and
unchanged. A provider ignores opaque blocks it does not recognize, which is
what makes switching providers mid-session safe.

An opaque block is treated as valid only after the exact conversation that
produced it. When the host changes what comes before, it does not send the
block back: after a compaction nothing earlier is replayed at all, and after
a change of system prompt the earlier opaque blocks are left out.

## What the host guarantees

- **Append-only history.** The `messages` of a request extend those of the
  previous request in the session; earlier content never changes. `system` and
  `tools` are stable across a session. A provider can cache the prefix. The
  one exception is a compaction: when the context is nearly full, the host
  starts the conversation over from a summary, and the prefix is new from
  there on.
- **Summaries come through `complete`.** To compact, the host sends the
  conversation with one more instruction and takes the text of the answer as
  the summary. A provider needs nothing special for it.
- **Complete tool results.** A call interrupted before it finished gets an
  error result, so the history is always valid.
