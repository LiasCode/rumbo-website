---
title: Instructions and skills
description: Tell rumbo's agent how you work with AGENTS.md and CLAUDE.md files, and give it skills in the Agent Skills format that it reads only when a task needs them.
---

rumbo sends the model little it did not ask for: the environment it works in, your instructions,
and what each of your skills is for. Everything else about a task the model finds out with its
tools. Instructions and skills are where you tell it how work should be done.

## Instructions

The model reads the `AGENTS.md` or `CLAUDE.md` files:

- of the project, from its root down to the directory you are in;
- yours, in `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` on macOS), which apply
  everywhere.

Write there what a task cannot show by itself: how you want work done, which commands check it, and
what must never happen.

```markdown title="AGENTS.md"
# Agent guide

- Run `make check` before saying a change is done, and report what it printed.
- Never commit; I review and commit myself.
- Write to me in Spanish; code and comments in English.
```

Your instructions win over rumbo's: what you say in the conversation first, then your `AGENTS.md`.
A long file is cut, saying where the rest is, so the model can read it.

## Skills

A skill is instructions for one kind of task, in the [Agent Skills](https://agentskills.io)
format: a directory with a `SKILL.md` whose frontmatter has a `name` and a `description` of what it
is for and when to use it.

```markdown title="~/.config/rumbo/skills/meeting-notes/SKILL.md"
---
name: meeting-notes
description: Write meeting notes in my format. Use for any summary of a meeting.
---

One heading per topic, decisions first, then who does what by when.
```

Skills go in:

- `~/.config/rumbo/skills/<name>/` (`~/Library/Application Support/rumbo/skills/` on macOS), yours;
- `.agents/skills/<name>/` in a project, from its root down to where you are. A project's skill
  replaces one of yours with the same name.
- `skills/<name>/` in a [plugin](/guides/plugins/) you added. One of yours with the same name replaces
  it.

Only the name, the description, and the path are sent with every request. The model reads the
skill when a task needs it, so a skill costs a line until it is used.

```sh
rumbo skills    # the skills the model is told of here, and those left out, with why
```

`/skills` in the terminal UI says the same. A skill is left out when one of the same name replaced
it, or when its frontmatter is missing, unclosed, not valid YAML, or has no description.

## The environment

The model is also told the directory it works in, the platform, and the date. That is all of it:
rumbo does no project detection and sends nothing about any language or framework.
