---
title: Write a provider
description: Connect rumbo to any model by writing a provider, a program in any language that answers JSON-RPC requests on stdin and stdout with the Agent Provider Protocol.
---

A provider turns a conversation into the next assistant message. It is a program of its own, in
any language, that speaks the [Agent Provider Protocol](/reference/provider-protocol/) on its stdin
and stdout. rumbo's built-in providers are served the same way, so yours gets nothing less.

Write one to reach a model API rumbo does not know, a company gateway, or a test double that
answers from a script.

## The shape of it

Messages are JSON-RPC 2.0 objects, one per line. rumbo starts the provider as a child process and
sends it:

1. **`initialize`**: the provider answers with protocol version `1`, its name, and its
   configuration in force, and can describe its models, its options, and its functions.
2. **`complete`**, once per turn: the whole conversation, the tools, and the options. The provider
   answers with the next assistant message, why it stopped (it ended, it calls tools, the output
   limit cut it, or the model refused), and the tokens it used. While it works, it can stream text
   in `delta` notifications.
3. **`shutdown`**: the provider answers and exits.

stdout carries only protocol messages. Diagnostics go to stderr, which reaches the person.

## A complete example

[examples/provider.py](https://github.com/LiasCode/rumbo/blob/v0.13.0/examples/provider.py) is a whole
provider in one Python file, with no model behind it: it asks for one tool call, then repeats the
tool's output. This is its loop:

```python
for line in sys.stdin:
    frame = json.loads(line)
    method = frame.get("method")

    if method == "initialize":
        config = frame["params"].get("config") or {}
        functions = [{"name": "greet", "description": "Ask your name, and greet you"}]
        send({"id": frame["id"], "result": {"protocol": 1, "name": "toy", "config": config, "functions": functions}})

    elif method == "complete":
        result = answer(frame["id"], frame["params"])
        result["usage"] = {"input": 0, "output": 0}
        send({"id": frame["id"], "result": result})

    elif method == "invoke":
        send({"id": frame["id"], **greet(frame["id"])})

    elif method == "shutdown":
        send({"id": frame["id"], "result": {}})
        break
```

Replace `answer` with a call to your model, and it is a real provider. Register and use it:

```sh
rumbo provider add toy python3 /path/to/examples/provider.py
rumbo -p toy -m any "list the files"
```

rumbo starts a provider when you add it, which is the test that it works. In Go, the
[`protocol`](https://github.com/LiasCode/rumbo/tree/v0.13.0/protocol) package has the types and
`Serve`, a ready-made server.

## What a provider must do

- Answer one request at a time. When rumbo needs more at once, it starts more processes, so a
  provider must not rely on anything but the request it is answering.
- Mark a failure that can succeed if the request is sent again, such as a rate limit, as transient,
  and a request that did not fit in the model's context as such. rumbo retries the first and
  compacts for the second.
- Answer a request it was asked to cancel within a few seconds.
- Hold its own credentials. rumbo keeps none.
- Ignore opaque blocks it does not recognize, which is what lets a session change provider.

## What a provider can do

- **Describe itself**: how its model is chosen, the options it takes with their defaults, and the
  functions it offers. Every front end shows them as settings and commands without knowing them.
- **Offer functions** such as listing its models or signing in, which can talk with the person
  while they work: say things, and ask questions, marking an answer secret when it is one.
- **Keep what it needs** to continue a conversation, such as signed reasoning, in opaque blocks that
  rumbo stores and returns unchanged.
- **Report the size of the model's context**, so rumbo summarizes the conversation before it fills,
  and **how much it read from its cache**, so rumbo can tell you when a request missed it.
- **Show the model the images** of a tool's result.

The [use cases](/reference/use-cases/#provider) list all of it, and the
[protocol](/reference/provider-protocol/) specifies every message.
