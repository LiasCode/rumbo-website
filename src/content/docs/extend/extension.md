---
title: Write an extension
description: Write a rumbo extension in any language. A program that declares tools on stdin and stdout, answers the calls to them, and can add context, commands, questions, and listeners.
---

An extension is your own program, in any language, that speaks the [Agent Extension Protocol](/reference/extension-protocol/) with the rumbo host: JSON-RPC 2.0, one object per line, on its stdin and stdout. Write one to give the model a tool rumbo does not have, to stand between the model and a tool it does have, or to hear what the runs do.

## Its shape

1. **`initialize`**: the host speaks first. The extension answers with protocol version `1`, its name, and what it declares: `tools`, `sections`, `functions`, and `events`, each optional.
2. **`call`**, once for each use of one of its tools: the tool's `name`, the `args` the model gave, the `dir` the session works in, and the `session`. The extension answers with `text`, and `is_error` when the call failed.
3. **`shutdown`**: the extension answers and exits.

stdout carries only protocol messages. Diagnostics go to stderr, which reaches the person.

## A complete example

[examples/extension.py](https://github.com/LiasCode/rumbo/blob/v0.12.0/examples/extension.py) is a whole extension in one Python file. It keeps notes: a tool to remember one, a section that tells the model all of them, and a command that forgets them. This is how it answers a call:

```python
def call(params):
    """Run one tool. `args` is what the model gave; `dir` is where the session works."""
    if params["name"] == "remember":
        text = params["args"].get("text", "").strip()

        if not text:
            # A failed call says how to recover: the model reads it and tries again.
            return {"text": "text is empty; give the note to keep", "is_error": True}

        notes.append(text)

        return {"text": "kept"}

    return {"text": "there is no tool " + params["name"], "is_error": True}
```

Register it, and look at what the model will be given:

```sh
rumbo extension add notes python3 /path/to/examples/extension.py
rumbo extension show notes
```

```text
notes: python3 /path/to/examples/extension.py
configuration: {}
sections, told to the model when a run starts: notes
commands, in a front end: /notes-forget
tools, declared to the model in every request (161 bytes):
  remember  Keep a note for later in this rumbo.
```

In Go, the [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.12.0/protocol) package has the types and `ServeExtension`, a ready-made server.

## What an extension must do

- Answer `initialize`, and every `call` to a tool it declared.
- Name its tools with letters, digits, `_`, and `-`, at most 64, and give each a JSON Schema for its arguments.
- Keep each tool's description short. It is sent to the model with every request.
- Say a failed call with `is_error` and a text that tells the model how to recover.
- Expect calls from several sessions, and several at once: rumbo keeps one process of an extension for all of them.

## What an extension can do

- **Tell the model something when a run starts**, by declaring `sections`. The host asks for each one's text; it has 10 seconds to answer, and at most 8,000 bytes are told.
- **Offer the person commands**, by declaring `functions`. The terminal UI calls `forget`, of an extension registered as `notes`, as `/extensions notes forget`.
- **List the values of a configuration field**, with a function of the field's name marked `lists`. The terminal UI completes the field with them, as it does `tools` for the `mcp` extension.
- **Talk with the person** while a tool or a command works: `delta` says something, and `ask` asks a question, whose answer can be marked secret.
- **Call rumbo's own tools** while it answers a call, which is how one that replaces `bash` passes on what it lets through. [examples/guard.py](https://github.com/LiasCode/rumbo/blob/v0.12.0/examples/guard.py) does.
- **Be told what the runs do**, by declaring the `events` it wants, such as `ended`.
- **Say that what it declares changed**, with `changed`, as when a sign-in gives it tools.

An extension changes no message, no other extension's tool, and not when a run ends.

## Ship it

One program is added with `rumbo extension add`. To ship it with skills, a provider, or a front end, and have rumbo build it where it is installed, make it a [plugin](/reference/plugins/).

The [use cases](/reference/use-cases/#extension) list what an extension must and can do, and the [protocol](/reference/extension-protocol/) specifies every message.
