---
title: Design
description: Why rumbo is built the way it is. A replayable append-only history, a stable prefix for the provider's cache, replaceable parts, and what the harness deliberately leaves out.
---

rumbo is small on purpose. Every tool and every line of system prompt is paid for in tokens on each
request, by every task, whether it helps that task or not. So a new tool, setting, or protocol field
must pay for itself, and most of what other harnesses add, rumbo leaves to the shell, the task, and
your instructions.

## What the design depends on

**History is append-only.** A session is a list of entries that are never edited or deleted.
Changing course makes a [branch](/guides/sessions/#branch), a new session that starts with a copy of
the entries, so the session you came from stays as it was.

**The request is a pure function of the entries.** One piece of code turns a session into the
request sent to the model, and nothing is added on the way. A stored session therefore reproduces
every request exactly, `rumbo request` prints any of them, and a run that died resumes from what
was recorded.

**The prefix is stable.** The system prompt is constant, the tool declarations are deterministic,
and the context is sent once and then only when it changes. Each request extends the one before, so
the provider reads the start of it from its cache. rumbo checks that it does, and tells you when a
request missed the cache, since the rest is paid for again.

**A full context is compacted, not trimmed.** Near the model's limit, the model summarizes the
conversation and the next request starts from that summary. A summary written for the purpose
carries the work better than cutting old turns, which model APIs often reject.

**The parts meet at protocols.** Providers and front ends are separate programs that speak JSON-RPC
with the host, as editors and languages do through the Language Server Protocol. The built-in ones
cross the same protocols as yours, and the protocols only grow: what is added is optional.

**Everything rumbo keeps is a file you can read.** What you chose, in one `config.yaml` that holds
no defaults, and each session in a directory of its own.

## What the harness is not

These are decisions, not gaps:

- **It knows no kind of work.** Nothing in rumbo is about programming or any other domain: no
  project detection, no language-specific behavior. What a task needs comes from you and your
  [instructions](/guides/instructions-and-skills/).
- **It does not judge the model's work.** A run ends when the model stops calling tools. rumbo runs
  no checks and sends the model back for nothing; checking the work is part of the task, and your
  instructions say how. Measured over rumbo's evaluation set, checks never changed an outcome, and
  cost a great deal of machinery.
- **It sends no context unasked**, beyond the environment, your instructions, and what each of your
  skills is for. The model looks at the project, and reads a skill, with its tools when it needs to.
- **It has no permission system.** The agent acts with the rights of the user who started it.
  Someone who needs limits runs rumbo inside a sandbox of their choice. See
  [before you run it](/start/safety/).
- **It signs in to a plan only where a provider implements it.** `chatgpt` signs in with a ChatGPT
  plan. `anthropic` takes API credentials and has no subscription sign-in. Any other way in is a
  provider of its own, added like any other.
- **It does not track files.** A session keeps the conversation, not the disk: there are no restore
  points, and a branch starts from an earlier point of the conversation with the files as they are.

## Measured, not guessed

A change to the loop, the system prompt, the tools, or the context changes how the model behaves,
and tests cannot show that. Such changes are measured with an evaluation set, before and after,
comparing the pass rate, the turns, and the tokens. Tests never call a real model.

## Read further

- [Architecture](/reference/architecture/): the parts and how they fit.
- [Use cases](/reference/use-cases/): what each part must, can, and must not do.
- [Glossary](/reference/glossary/): the terms, and what each means.
