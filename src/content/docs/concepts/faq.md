---
title: Frequently asked questions
sidebar:
  label: FAQ
description: Answers about rumbo. Is it free, which models it supports, whether it runs local models or on Windows, whether it can use a Claude or ChatGPT subscription, and how it compares with other agents.
---

## Is rumbo free?

Yes. rumbo is open source under the MIT license, and has no account, no server of its own, and no
telemetry. You pay only your model's provider, or nothing with a local model.

## Is it a coding agent?

It is a general agent harness. You can use it to write and change code, since a shell and four file
tools reach everything a project needs. But nothing in rumbo is about
programming: it does what your task and your instructions ask, such as summarizing notes, sorting
files, or driving a desktop program with the [computer tool](/guides/computer-use/).

## Which models does it work with?

Claude through Anthropic's API, OpenAI's models through its APIs, the models of a ChatGPT plan, and
any server compatible with OpenAI's Chat Completions. Any other model works through a
[provider you write](/extend/provider/). See [models and providers](/guides/providers/).

## Can I run it with a local model?

Yes. Register your server, such as Ollama, llama.cpp's server, or vLLM, as a provider with its
address, and choose one of its models. See
[local models and other servers](/guides/providers/#local-models-and-other-servers).

## Can I use my ChatGPT or Claude subscription?

A ChatGPT plan, yes: the built-in `chatgpt` provider signs in with ChatGPT, as OpenAI offers
open-source apps. A Claude subscription, no: Anthropic's terms do not let other applications use
one, so the `anthropic` provider takes an API key.

## Does it run on Windows?

No. rumbo runs on Linux and macOS.

## Does it ask before running a command?

No. rumbo has no permission prompts: the agent acts with your rights. Run it in a container or a
virtual machine for work you do not trust. See [before you run it](/start/safety/).

## Can I undo what the agent did to my files?

Not with rumbo: a session keeps the conversation, not the disk. Use your version control. The
terminal UI's Ctrl-G, and the desktop app's Changes panel, show what Git sees changed.

## Where are my sessions?

Each is a directory in `~/.local/share/rumbo/sessions/`, with its history in `entries.jsonl`, one
entry to a line. See [sessions](/guides/sessions/#what-a-session-holds).

## How does it compare with other agents?

rumbo follows [pi](https://pi.dev) in what a harness leaves out: four tools, a short system prompt,
and no plan mode, subagents, or permission prompts. What it adds is in how the parts meet: models
and interfaces are separate programs on open protocols, any session replays every request it sent,
and one host runs several sessions at once. See [design](/concepts/design/).

## Can I use it from my editor?

Any program that speaks the [Agent Frontend Protocol](/reference/frontend-protocol/) can drive
rumbo, by starting `rumbo serve`, as an editor extension would. See
[write a front end](/extend/front-end/).

## How do I report a bug or ask for a feature?

Open an issue on [GitHub](https://github.com/LiasCode/rumbo/issues).
