---
title: Before you run it
description: rumbo gives the model your rights, without a sandbox or permission prompts. What that means, where your data goes, and how to run untrusted work safely.
---

rumbo has no permission system. That is a decision, not a gap: the agent acts with the rights of
the user who started it, and limiting what it may do is left to a sandbox of your choice.

## What the model can do

- **It acts as you.** It reads, writes, and runs commands as you, without asking and without a
  sandbox.
- **What it reads can steer it.** A project's `AGENTS.md`, its files, or the output of a command
  can carry instructions. Work on code you do not trust inside a container or a virtual machine.
- **With the computer tool on, it uses your screen.** It takes screenshots and uses the pointer
  and the keyboard of the desktop rumbo runs in. The tool is off until you
  [turn it on](/guides/computer-use/).

## What rumbo keeps

- **Sessions keep what the model saw**, secrets in command output included, in
  `~/.rumbo/sessions/`, readable only by you.
- **An API key you give a built-in provider's `/login`** is kept in
  `~/.rumbo/credentials/`, readable only by you, and so by the model too.
- **A secret a provider asks for**, such as a sign-in code, goes from the front end to the
  provider and is recorded nowhere, not even in the session.

## What reaches the network

rumbo itself contacts no server, and has no telemetry. Only your providers and the model's
commands reach the network.

## Running it in a sandbox

Since rumbo is one binary that keeps its state in files, it runs inside whatever isolation you
already use: a container, a virtual machine, or a separate user account. Give it the project, the
credentials of its provider, and nothing else.
