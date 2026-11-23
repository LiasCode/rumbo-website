---
title: 'Glossary'
description: 'The terms rumbo uses, from session and entry to provider, front end, and compaction, and what each means.'
---

**Objective.** What the user asks for in one message, in words, and the
images given with them. A run works on one objective.

**Run.** The work from an objective until the model stops calling tools, or
the run fails or is cancelled. A session holds one or more runs.

**Steer.** What the user says to a run while it works. It reaches the model
before the next request, as the user's words, and leaves the objective as it
was. A steer that comes as the model finishes keeps the run going.

**Session.** A conversation bound to a project directory, stored as a list of
entries. It keeps its provider, its model, and the values of the provider's
options chosen in it.

**Branch.** A session that starts with a copy of another one's entries, up
to now or to just before one of the person's messages, and goes on from
there. The session it came from is left as it was. A branch copies the
conversation only; the files are as they are.

**Entry.** One immutable record in a session. Kinds: `system` (prompt and tool
declarations in force), `context` (ambient sections that changed), `user` (an
objective), `steer`, `assistant` (a model response), `tool_result`, `harness` (a
message from the harness to the model, such as being told a run was
interrupted), `compaction`, and `note`.

**Note.** An entry that records what happened to a run without being part of
the conversation: how it ended (`done`, `failed`, `cancelled`), or a retried
request. The model never sees notes.

**Unfinished run.** A run whose last note is not `done`: it failed, was
cancelled, or was interrupted, which leaves no note because its process
died. It can be resumed.

**Resume.** To continue an unfinished run without a new objective. The model
is told the run was interrupted, and calls that never finished are closed
with an error result.

**Context window.** How many tokens a model's context holds. The provider
reports it, and the host summarizes the conversation before it fills.

**Compaction.** Replacing the conversation the model sees with a summary of
it, when the context is nearly full. It is an entry like any other: what came
before stays stored and the request is rebuilt from the summary on.

**Transient failure.** A failed request that can succeed if the same request
is sent again later: an error the provider marks so, or the provider process
dying, since another process takes its place. The host retries it; any other
failure ends the run.

**Transcript.** The interpretation of a session's entries as the request sent
to the model.

**Turn.** One request to the provider and its response: the model's answer,
or a summary. A session's turns are counted from 1.

**Cache miss.** A response whose provider read less from its cache than the
request before left there, as the usage of both says: what the earlier one
read from the cache and wrote to it is the start the next one repeats. Under
another provider or model, or after a compaction or a new system prompt,
the cache holds nothing for the request, and nothing is missed.

**Provider.** A program that produces assistant messages by speaking the Agent
Provider Protocol. It owns the connection to a model and its credentials.

**Description.** What a provider says about itself: how its model is
chosen, the options it accepts, the fields of its configuration, and the
functions it can be asked. The host passes it on, and checks against it a
value a person sets, without knowing what any of it means.

**Option.** A value a provider accepts with a request, beyond the model,
such as how thorough to be. Which options exist is the provider's decision.
The value a user sets for the provider is a field of its configuration; a
session can choose another, which it keeps and which wins in it.

**Setting.** Anything a person can set, at any level: a system setting; a
provider's model, a field of its configuration, or one of its options; a
field of a front end's configuration; or an option a session chooses. Each
is changed the same way, as `name=value`, where an empty value gives it back
to the level under it: the session's to the provider's, the provider's to
its own default.

**Source.** Where the value of a setting in force comes from: the session
that chose it, `config.yaml`, rumbo's own default, how rumbo has a built-in
program, or the program's own default, which only the program knows.

**Configuration file.** `config.yaml`, in rumbo's directory of the user's
configuration: what the user chose, and nothing else. It holds the system
settings, the programs the user registered, and what they chose for each
program. A person can edit it; a default is never written to it.

**System setting.** A setting of rumbo itself, the same everywhere: the
provider a new session starts with, the front end, the turn limit, the
output limit, and when to summarize. It applies to the runs that start
after it is stored. What a session chooses for itself is kept with the
session and wins there; what a provider takes is kept with the provider,
and so is the model a new session that uses it starts with.

**Function.** An operation offered through `invoke`: by a provider, such as
listing its models, or by the host, such as changing session or quitting. A
front end learns both from descriptions and knows neither beforehand. A
function of the host says what it acts on: the system, a session, or the
providers, and one there to list the values a parameter takes says so, for
a front end to offer its values and not it as a command. A provider's
function can talk with the person while it works, saying things and asking
questions, whose answers may be secret.

**Agent Provider Protocol.** The JSON-RPC contract between the host and a
provider.

**Host.** The rumbo process that owns the sessions of a project, the tools,
and the loop. It sits between a front end and the providers and speaks a
protocol to each.

**Current session.** The session of a host that a run goes to when it names
none, and that the host's functions act on unless told otherwise.

**Front end.** The program a person uses to give objectives and follow the
work: a terminal UI, a plain printer, an editor extension. It speaks the Agent
Frontend Protocol with the host.

**Agent Frontend Protocol.** The JSON-RPC contract between a front end and
the host.

**Event.** A notification from the host to the front end about a run: text,
a tool call, token usage, a log line.

**History.** What a session holds, told to a front end in the same events as
the runs that made it, plus what the person asked and how each run ended. It
lets a front end show a session it opens as if it had followed every run.

**Recall.** What the person asked in the project's sessions, objectives and
steers, newest first and each once, which a front end brings back to its
input. It is read from the sessions, so it keeps nothing of its own.

**Program.** A provider or front end rumbo can start: a name, the command
that starts it, and its configuration, which for a provider holds the values
of its options too; a provider also has the model a new session that uses it
starts with. The built-in ones are always there; the user registers others.
Only what the user chose is kept of a configuration: what is not chosen is
the program's own default, which the program says when it starts.

**Tool.** An action the model can request: `read`, `write`, `edit`, `bash`,
and `computer` when the user turns it on. A tool's result is text, and may
show images too.

**Computer tool.** The tool that sees and uses the desktop rumbo runs in:
screenshots, the pointer, and the keyboard. Its coordinates are pixels of
the last screenshot it showed.

**Ambient context.** What the harness tells the model without being asked:
the environment it runs in, the user's instructions, and the user's skills.

**Instructions.** The `AGENTS.md` or `CLAUDE.md` files of the project and of
the user. They are where the user says how work should be done.

**Skill.** Instructions for one kind of task, kept by the user or the
project in a directory with a `SKILL.md`, in the
[Agent Skills](https://agentskills.io) format. The model is told only what
each one is for, and reads the rest when a task needs it.

**Collector.** The source of one section of ambient context.

**Section.** A named piece of ambient context: `environment`,
`instructions`, or `skills`. A new
version of a section replaces the previous one.

**Project.** The directory tree the work belongs to, identified by its root:
the top of the git repository, or the directory itself outside one.

**Opaque block.** Provider-owned data inside an assistant message that the
host stores and replays without reading.

**Observer.** The interface through which the loop reports a run. The front
end connection implements it by sending events.
