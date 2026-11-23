---
title: 'Architecture'
description: 'How rumbo is built: the agent loop, providers, tools, ambient context, the session store, and the rules the design depends on.'
---

rumbo is a loop around a model, and the things the loop depends on. Each
dependency is an interface, so any of them can be replaced without touching the
others. Two of them cross a process boundary through a protocol, which is what
lets users bring their own: the front end a person uses, and the provider that
reaches the model.

![The front end process speaks the Agent Frontend Protocol with the host process, rumbo, whose agent loop reports to an Observer and depends on Provider, Tool, Collector, and Store; the Provider speaks the Agent Provider Protocol with the provider process.](/diagrams/architecture.svg)

The host is the only part that is always rumbo. It owns the sessions, the
tools, and the loop; it shows nothing and knows no model API. It is not tied
to one kind of work: what a task is about comes from the user and from the
user's instructions, not from the host.

## The parts

**Agent loop** (`internal/agent`). Records the objective, asks the provider
for a message, runs the tool calls in it, and repeats until the model stops
calling tools. Before each request it records what the user said to the run
meanwhile, from its `Inbox`. Around that it retries requests that fail for a
passing reason, continues responses cut by the output limit, compacts a full
context, and records how the run ended. The loop knows only interfaces.

**Provider** (`internal/provider`, `protocol`). The only way to reach a model.
The host starts provider processes and speaks the Agent Provider Protocol to
each. A process answers one request at a time, so the host keeps a pool of
them per provider and starts another when every one is busy; any of them can
answer any request, since every request carries the whole conversation.
Each session uses the provider chosen for it, and keeps it from one start of
rumbo to the next. The built-in providers
(`internal/providers`) are served by the same binary through `rumbo provide
<name>` and get no shortcut: they cross the same protocol as a provider a
user writes. Credentials belong to the provider, which keeps them where it
chooses; the host keeps none, and relays one a person types at a
provider's question without recording it. A provider also describes
itself: the options it accepts and the functions it can be asked, such as
listing its models, and its default for each option and each field of its
configuration, which the host shows and does not store. The host stores
the chosen values, sends them with every request, and relays function
calls, and what a function says to the person and asks of them
while it works, without knowing what any of them mean.

**Tools** (`internal/tool`). What the model can do: read, write, and edit
files, and run commands. The set is small because every declared tool costs
tokens on every request, and a shell already reaches everything else. A
result is text, and may show the model images as well: `read` shows an
image file as an image, with text that says what it is for a provider that
cannot send it. `internal/picture` prepares every image the model is shown,
a tool's or one a person gives with a task, at a size a model sees whole
and in a form every model API reads. The tools keep a little state. Each session has its own record of the files its
model has seen, so a model cannot replace a file whole without knowing what
is in it, even one another session's model read. The processes left running
in the background, and the files the tools save for the model, are the
host's: they go when it exits.

**Screen** (`internal/computer`). The desktop rumbo runs in, for the
computer tool, which is declared only when the user turns on the `computer`
setting: a shell starts programs, but cannot show the model what they draw
or press their buttons. It finds out which desktop it is in and acts
through what that desktop offers: on a wlroots compositor such as Hyprland
or Sway, the compositor's virtual pointer and keyboard (spoken by a small
Wayland client of its own, `internal/computer/wayland`) and grim's
screenshots; on X11, xdotool; on macOS, Quartz events through osascript and
screencapture. Its keyboard is a US one whatever the person's layout, each
key with the code of the key it is, and a character such a keyboard lacks
is typed on a key given it for the moment. The tool shows the model
screenshots of at most 1280×800 and maps the model's coordinates to the
screen, and it acts only on the screen the model saw last: when the monitor
in use changes, or someone else moves the pointer, it does nothing until
the model looks again.

**Ambient context** (`internal/ambient`). The little the model is told
without asking: the environment it runs in, the user's instruction files,
and the user's skills. Of a skill the model is told only what it is for and
where it is; it reads the skill when a task needs it. Each collector
produces a named section. Everything else about a task the model finds out
with its tools, when it needs it.

**Store** (`internal/store`). Settings, registered programs, sessions, and
entries, all in files a person can read. What the user chose is one file,
`config.yaml`, next to their instructions and skills: they can edit it, and
rumbo changes it one value at a time, leaving the rest as it was, comments
included. It holds no default, so a value that is there is one somebody set.
Each session is a directory of its own in the user's data: what the session
is, and its entries, one to a line, only ever appended.

**Transcript** (`internal/transcript`). Defines what entries mean and rebuilds
the model request from them. This is the single place that decides what the
model sees. It also tells a session's history to front ends, in the events
its runs sent, and what the person asked, which front ends bring back.

**Project** (`internal/project`). Says where the project a directory belongs
to starts.

**Front end** (`internal/frontend`, `protocol`). The only way a person
reaches the loop. The host sends it events and receives objectives, steers,
and cancellations over the Agent Frontend Protocol. Inside the host, the
connection gives each run an `Observer` and an `Inbox`, so what a run does
reaches the front end naming the run and its session. The built-in front ends
(`internal/frontends`) are served by the same binary through `rumbo attach
<name>` and cross the same protocol as one a user writes. A front end either
is started by the host, which leaves it the terminal, or starts the host
itself with `rumbo serve`, as an editor would. What a person can do beyond
giving a task, such as changing session or provider, the host offers as
described functions, so a front end has commands for them without knowing
them, exactly as it does for a provider's.

**Command line** (`internal/cli`). Parses arguments, reads the settings, and
wires the parts. It is the only place that knows the implementations. What
rumbo starts with is read when it starts, and what a run uses when the run
starts, so a stored change applies to the next run.
Configuration has three levels, kept apart. The system settings are
rumbo's own, the same everywhere. A session keeps what it chose, which wins
over them there: its provider, its model, and values of the provider's
options. A provider has the model a new session that uses it starts with,
and one configuration: what it starts with, and the values of its options,
which it gets with every request under those a session chose. The built-in
programs are there without being registered; what the user chooses for one
is all that is kept of it. Every level is changed the same way, as
`name=value`, where an empty value gives a setting back to the level under
it (`changes.go`), and every value is checked before it is kept: a
provider's against what the provider describes, and by starting it with
the change. What a system setting is, what a provider's options are, and
what a registered program is each have one owner there (`settings.go`,
`options.go`, `programs.go`), and so has what a person is shown of all of
it, each value with where it comes from (`view.go`). The commands and the
host's functions, each named for the level it acts on, are two ways into
the same code, so configuring from a terminal and from a front end cannot
drift apart.

## Rules the design depends on

**History is append-only.** Entries are never edited or deleted. Changes to
the system prompt or to the ambient context are new entries. Going back to
an earlier point makes a branch: a new session that starts with a copy of
the entries up to it, so its first request is one the provider has seen.

**The request is a pure function of the entries.** `transcript.Build` is the
only code that turns a session into a request. Nothing else is added on the
way to the provider, so a stored session reproduces every request exactly,
and `rumbo request` prints any of them. Anything that should influence the
model must be an entry first.

**The prefix is stable.** The system prompt is constant, tool declarations
are deterministic, and ambient context is sent once and then only as changed
sections. Each request therefore extends the previous one, which is what lets
providers cache the prefix. The host checks that they do: a response that
read less from the cache than the request before left there is a cache miss,
and the person is told, since the rest is paid for again.

**The harness adds as little as it can.** The system prompt is short,
and the only context sent unasked is the environment, the user's
instructions, and what each of the user's skills is for. Whatever else the
harness sent would be paid for on every
request, by every task, whether it helped that task or not.

**A full context is compacted, not trimmed.** The provider reports how many
tokens the model's context holds, and the conversation is summarized at 80%
of that, or at 150,000 tokens when the provider does not say. The
`compact_at` setting changes the share. When the limit is reached the model is asked to
summarize, and a compaction entry makes the next request start from the
ambient context and that summary alone. A request that does not fit anyway is
recovered the same way, without the step that tipped it over. No recent turns are kept alongside it: turns replayed after a
rewritten beginning are what model APIs reject, and a summary written for the
purpose carries the work better than a cut. The entries before the compaction
stay in the session; only the request changes.

**Every run leaves its ending in the session.** A run closes with a note:
done, failed, or cancelled. A run without one was killed. That is what makes
resuming possible, and why a failure is never only on the screen.

**One process per session.** The host holds a lock on each session it works
in, so two processes cannot interleave entries into a history that neither of
them sent.

**A host works in several sessions.** They are sessions of one project, and
each has one run at a time. A run goes to the current session unless it
names another or asks for a new one, so a front end that knows nothing of
sessions works as if there were only one. Started with `-single`, the host
works in one session at a time.

**Tool output is bounded.** A result stays in the context and is paid for on
every later request, so results are kept small: a file is read in windows,
and long command output is reduced to its beginning and end, with the whole
of it saved to a file the model can search while the host lasts.

**The host is driven only through the protocol.** It ignores the terminal's
interrupt and writes nothing to the terminal. A front end decides what Ctrl-C
means and cancels with a message; diagnostics, including the provider's
stderr, reach the user as events. A request to stop the process, SIGTERM or
SIGHUP, is not the front end's to interpret: the host ends as it does when
the front end disconnects, with its runs cancelled and recorded, and its
tools and providers stopped.

**The model decides when the work is done.** A run ends when the model stops
calling tools. The harness does not judge the result; checking the work is
part of the task, and the user's instructions say how.

**A project is its root.** Sessions belong to the top of the git repository,
and are found from any directory inside it. A session still works in the
directory it was started in. Settings are not the project's: they are the
same everywhere.
