---
title: Write a front end
description: Build your own interface for rumbo, an editor extension, a bot, or a web app, by speaking the Agent Frontend Protocol, JSON-RPC over stdio, with the rumbo host.
---

A front end is what a person uses to give tasks and follow the work. It is a program of its own,
in any language, that speaks the [Agent Frontend Protocol](/reference/frontend-protocol/) with the
rumbo host. The terminal UI, the plain printer, and the [desktop app](/guides/desktop-app/) are all
front ends, and none of them gets a shortcut.

Write one to bring rumbo into an editor, a chat bot, a web page, or a workflow of your own.

## Two ways to connect

Messages are JSON-RPC 2.0 objects, one per line, the same either way:

| Who starts whom                                         | The front end reads from | The front end writes to |
| ------------------------------------------------------- | ------------------------ | ----------------------- |
| rumbo starts a registered front end (`rumbo -f <name>`) | file descriptor 3        | file descriptor 4       |
| The front end starts `rumbo serve`, as an editor would  | the host's stdout        | the host's stdin        |

A front end rumbo starts keeps the terminal on stdin and stdout, so it can draw and read keys
freely. Closing the connection ends the host: it cancels the run in progress, records it, and
stops its providers.

A host is one session. To show several, as the terminal UI does, start a `rumbo serve` for each,
with `-s <session>` to continue one, and find them with `rumbo sessions -json`.

[Compare the two launch directions in the interactive trace.](/#run-trace)

## The shape of it

1. **`initialize`**: the host speaks first, with the directory, the session, the provider, and the
   model the front end is attached to, and the task given on the command line, if any.
2. **`run`**: the front end sends a task. The host answers when the run is over: done, failed, or
   cancelled.
3. **`event`** notifications report the run while it works: the model's text, the tool calls and
   their results, the tokens spent, and diagnostics.
4. **`steer`** tells a run something while it works, and **`cancel`** stops it.

A front end can also ask the host what it and the provider offer (`describe`), call their functions
(`invoke`), show what a session held before it was opened (`history`), and bring back what the
person asked before (`recall`), and say what the host's processes use (`processes`).

## A complete example

[examples/frontend.py](https://github.com/LiasCode/rumbo/blob/v0.10.0/examples/frontend.py) is a whole
front end in one Python file: it asks for tasks with `input()` and prints events as they arrive.

```python
def run(objective, request_id):
    """Send one objective and show events until the host answers the request."""
    send({"id": request_id, "method": "run", "params": {"objective": objective}})

    for line in from_host:
        frame = json.loads(line)

        if frame.get("method") == "event":
            show(frame["params"])
        elif frame.get("id") == request_id and "method" not in frame:
            if "error" in frame:
                print(frame["error"]["message"])
                return

            result = frame["result"]
            print(f"\n[{result['status']}] {result.get('error', '')}")
            return
```

Register and use it:

```sh
rumbo frontend add simple python3 /path/to/examples/frontend.py
rumbo -f simple
```

In Go, the [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.10.0/protocol) package has the
types and `DialFrontend`, a ready-made connection.

## Commands without knowing them

Everything a person can do beyond giving a task, such as changing model or settings, the
host offers as described functions, and so does each provider. A front end builds its commands,
forms, and pickers from those descriptions, so it works with a provider it has never seen, and
gains a new function without a change. A function that cannot be undone says so, for the front end
to ask the person first; a provider's function can ask the person a question, whose answer may be
secret and must then be neither shown nor kept.

The [use cases](/reference/use-cases/#front-end) list what a front end must and can do, and the
[protocol](/reference/frontend-protocol/) specifies every message.
