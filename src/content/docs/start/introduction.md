---
title: What is rumbo?
description: rumbo is a minimal, open-source agent harness. It gives a model four tools and a short system prompt, and keeps the model and the interface as separate programs you can replace.
---

rumbo is a minimal agent harness. Give it a task, and it works through four tools, `read`,
`write`, `edit`, and `bash`, and a fifth that uses the screen if you turn it on, until the model
is done. The models behind it and the interfaces in front of it are separate programs you can
replace.

It is not tied to programming. It knows no kind of work: it does what your task and your
[instructions](/guides/instructions-and-skills/) ask, whether that is fixing a failing test,
summarizing a folder of notes, or driving a desktop program.

## The three parts

- **The host** is rumbo itself. It owns the sessions, the tools, and the loop: it asks a provider
  for the next message, runs the tools the model calls, and repeats until the model stops calling
  tools. It shows nothing and knows no model API.
- **A provider** reaches a model. rumbo has built-in providers for Anthropic's API, OpenAI's APIs,
  a ChatGPT plan, and any server compatible with Chat Completions, local ones included. See
  [models and providers](/guides/providers/).
- **A front end** is what you use: the [terminal UI](/guides/terminal-ui/), a plain printer for
  [scripts and pipes](/guides/scripting/), the [desktop app](/guides/desktop-app/), or one you
  write.

Providers and front ends speak a small JSON-RPC protocol with the host over stdio, like the
Language Server Protocol does between editors and languages. The built-in ones cross the same
protocols as the ones you [write yourself](/extend/provider/), so anything they can do, yours can
too.

## What makes it different

- **History you can replay.** A session is an append-only log, one entry to a line in a file you
  can read. Every request sent to the model can be rebuilt from it (`rumbo request` prints it), a
  run that failed or was cut short resumes where it stopped (`rumbo -r`), and `/branch` goes on
  from before any of your messages in a new session, while the first one stays as it was.
- **Built for the provider's cache.** Each request extends the one before until a summary starts
  the conversation over, so the provider can read it from its cache.
- **One host, many sessions.** Runs go on in other sessions while you work in a new one, and you
  can tell a run something without stopping it.
- **Providers describe themselves.** Their models, options, and functions, down to a sign-in that
  asks you for a code, show up in every front end without the front end knowing them.
- **Small and general.** A short fixed system prompt, nothing about any language or framework, no
  telemetry.

## Where it comes from

- **[pi](https://pi.dev)**, the minimal agent harness Mario Zechner started, for what a harness
  leaves out. Like pi, rumbo gives the model four tools and a short system prompt, and has no plan
  mode, no subagents, and no permission prompts.
- **The [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)**, for
  how the parts meet. Front ends and providers are programs that speak JSON-RPC with the host,
  describe their options and functions when they start, and can be written in any language.

## Next steps

- [Install rumbo](/start/installation/) and [run your first task](/start/quick-start/).
- Read [before you run it](/start/safety/): rumbo acts with your rights, without a sandbox.
- Learn [why rumbo is built this way](/concepts/design/).
