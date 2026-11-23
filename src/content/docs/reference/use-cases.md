---
title: 'Use cases'
description: 'Everything the rumbo host, its providers, and its front ends must do, can do, and must not do, including the built-in ones.'
---

What each of the three parts of rumbo must do, can do, and must not do. The
host is rumbo itself. Providers and front ends are separate programs that
speak a protocol with it, whether they are built in or written by a user.

[architecture.md](/reference/architecture/) explains how the parts fit together,
[protocol.md](/reference/provider-protocol/) and [frontend-protocol.md](/reference/frontend-protocol/)
specify the messages between them, and the code holds the details.

## Host

The host owns the sessions of one project, the tools, and the loop. It shows
nothing and knows no model API.

### Must

- Keep each session as an append-only list of entries. The only way history
  goes away is deleting a whole session.
- Build every request to the model from the session's entries alone, so a
  stored session reproduces every request it sent.
- Keep the start of each request stable, from the system prompt and the tool
  declarations to the ambient context, so providers can cache it.
- Hold a lock on every session it works in, so no other rumbo process writes
  to it at the same time.
- Close every run with a note saying how it ended: done, failed, or
  cancelled.
- Keep tool results small: read files in windows, shorten long output, and
  save the whole of it to a file the model can search.
- Summarize a conversation before it outgrows the model's context, and
  recover the same way when a request does not fit anyway.
- Reach models only through providers, and people only through front ends,
  the built-in ones included, always over the protocols.
- Leave the terminal to the front end: write nothing to it, and ignore the
  interrupt, which is the front end's to interpret.
- End on SIGTERM and SIGHUP as it does when the front end disconnects: its
  runs cancelled and recorded, its tools and providers stopped.
- Stop the processes the model left running in the background, and remove
  the files the tools saved, when it exits.
- Record nothing a provider's function asks or is told. A secret answer goes
  from the front end to the provider, and nowhere else.
- Check a setting when it is stored, and refuse to start with one that is
  missing, malformed, or misspelled in the configuration file instead of
  guessing, saying where in the file. A setting of a provider, or an option
  a session chooses, is checked against what the provider describes, and a
  provider's configuration by starting the provider with it, before it is
  kept.
- Take every change to a setting the same way, at every level, as
  `name=value`, where an empty value gives the setting back to the level
  under it.
- Keep everything it stores in files a person can read: what the user
  chose in `config.yaml`, and each session in a directory of its own.
- Write to `config.yaml` only what the user chose, never a default, and
  leave what it does not change there as the person wrote it.
- Keep the protocols compatible: what it adds is optional.
- Keep stored data working: what a file holds only grows.

### Can

**Run tasks**

- Work on an objective until the model stops calling tools.
- Work in several sessions of a project at once, with one run per session,
  or in one session at a time when started with `-single`.
- Start a run in the current session, in another session of the project, or
  in a new one.
- Take what the user tells a run while it works, give it to the model before
  its next request, and keep the run going when the model was about to
  finish.
- Cancel one run, or all of them.
- Resume a run that failed, was cancelled, or was cut short by the host
  dying, telling the model it was interrupted.
- Retry a request that failed for a passing reason, such as a rate limit, an
  overloaded server, or a provider process that died, with growing pauses.
- Tell the person when a request missed the provider's cache: when the
  provider read less of it than the request before left there, under the
  same provider and model and since the last compaction or new system
  prompt.
- Continue a response the output limit cut off.
- Stop a run after a number of turns.
- Summarize a session's conversation on request.

**Give the model**

- Four tools: read a file in windows, or look at an image, write a whole
  file, edit one by exact match, and run a bash command, with a timeout or
  in the background.
- The computer tool, when the user turns it on: screenshots of the desktop
  rumbo runs in, and its pointer and keyboard, through what that desktop
  offers. It acts only on the screen its model saw last, and does nothing
  once someone else moves the pointer.
- A guard against replacing a file its model has not read, or that changed
  since it did. Each session keeps its own record of what its model read.
- The environment it works in: the working directory, the platform, and the
  date.
- The user's instructions: the `AGENTS.md` or `CLAUDE.md` files from the
  project's root down to the working directory, and the user's own in
  `~/.config/rumbo/`. A long one is cut, saying where the rest is.
- The user's skills: the name, the description, and the path of each
  `SKILL.md` in `~/.config/rumbo/skills/<name>/`, and in
  `.agents/skills/<name>/` from the project's root down to the working
  directory, where one of the same name replaces the user's. The model reads
  a skill when a task needs it. One without a description in its
  frontmatter is left out, and a long description is cut; a value with a
  colon in it that YAML rejects unquoted is read anyway.
- List the skills the model is told of in a session's directory, and those
  left out, with why: one of the same name replaced it, or its frontmatter
  is missing, unclosed, not valid YAML, or without a description
  (`skills`, and `rumbo skills` in the working directory).

**Sessions**

- Find a project by its git root, from any directory inside it.
- List the sessions of a project, or of every one (`rumbo sessions -all`),
  with how each one stands: how its last run ended, done, failed,
  cancelled, or interrupted when its process died, or that a rumbo process
  is using it; its turns, and the tokens they took. A front end's list
  marks those working in this host.
- List the projects that have sessions, and the sessions of any of them, to
  a front end, so it can show those of every project from one host.
- Continue the latest session (`-c`) or a given one (`-s`), or resume its
  unfinished run (`-r`).
- Open another session, start a new one, and give one a title of the
  person's own (`rename`, `rumbo sessions rename`).
- Delete a session with its history, several by id (`rumbo sessions rm`),
  or those of a project not used in a given time (`prune`, `rumbo sessions
  prune`), only when the person confirms: both list them first, and delete
  them when given `yes` (`-yes`), saying which they deleted. A session a
  rumbo process is using is kept, and a host whose session another process
  deleted says so instead of working in it.
- Branch a session: go on in a new one that starts with a copy of it, as it
  is or as it was before one of the person's messages. The session it came
  from stays as it is, and can go on working at the same time; the files
  are not the session's, and stay as they are.
- Show a session's status: its provider and model, the size of its context,
  what it has spent and how much of its input the provider read from its
  cache, and how its last run stands.
- Keep each session's provider and model, and the values of the provider's
  options chosen in it, from one start to the next, over the system
  settings. `-p`, `-m`, and `-o` choose them for the session, as `use` and
  `session-set` do. A new session starts with the default provider and the
  model set for it, and a session that changes provider takes the model set
  for the new one and leaves its options behind.
- Start without a model, when the provider has none set and the command
  line gives none, so the person can choose one in the front end; a run is
  refused until there is one, saying how to choose it.
- Keep a session where a person can read it, in
  `~/.local/share/rumbo/sessions/<id>/`: `session.json`, what it is and what
  it chose, and `entries.jsonl`, its entries, one to a line. A line a
  process died writing is no entry.
- Print a session's whole record (`rumbo log`), and the exact request any
  of its turns sent the provider, rebuilt from it (`rumbo request`).
- Record with each response the output limit its request set, how long the
  provider took, and the rumbo that sent it; and with each tool result how
  long the tool took. None of it is sent to the model.
- Tell a front end what a session holds, in the events its runs sent, with
  what the person asked and how each run ended, so it can show a session it
  opens.

**Providers**

- Register, set, show, and remove providers. A provider is started
  when it is added, which is the test that it works. The built-in
  `anthropic`, `openai`, and `chatgpt` are there without being registered,
  and cannot be removed; one registered under the name of a built-in takes
  its place. `{self}` stands for rumbo's own executable in a command.
- Keep of each provider and front end only what the user chose for it,
  and for a provider the model new sessions start with. What is not chosen
  is the program's own default, so one a new version changes applies to
  everyone who chose nothing else.
- Start a provider and show each of its settings, its model, the fields of
  its configuration, and its options, with the value that applies and where
  it comes from, its own defaults included, and what it offers, which is
  also the test that it works (`rumbo provider show`, `provider-show`).
- Show everything that is set and what applies, each value with where it
  comes from, without starting anything (`rumbo config`, `config`).
- List the models a provider offers (`rumbo provider models`,
  `provider-models`) and the values its settings take, asking it, so a
  front end can offer them as choices: the models after the provider `use`
  names, and the `name=value` changes of `system-set`, `session-set`, and
  `provider-set`, with those in force marked.
- Keep as many processes of a provider as the requests running at once need,
  and replace one that died.
- Change the provider and the model of a session for its next runs, while a
  run in progress keeps the ones it started with.
- Keep the values of a provider's options in its configuration, with the
  rest of it. A run gets those with every request, the ones chosen in its
  session over them, and those its front end chose for it over both.
- Pass a provider's description to the front end, send the chosen options
  with every request, and relay calls to its functions, understanding none of
  them.
- Relay what a provider's function says to the person and asks of them while
  it works, and the answers back, and give the function up when the person
  does.
- Serve the built-in providers itself (`rumbo provide <name>`), over the same
  protocol as any other.

**Front ends**

- Start a registered front end and give it the terminal, or be started by
  one (`rumbo serve`). Without `-f` or the `frontend` setting it starts `tui`
  in a terminal and `plain` elsewhere.
- Register, configure, show, and remove front ends, and serve the built-in
  `tui` and `plain` itself (`rumbo attach <name>`), which are there without
  being registered.
- Describe functions of its own, which any front end offers as commands
  without knowing them, each saying what it acts on. For the system:
  `config`, `system-set`, and `quit`. For a session: `status`, `skills`,
  `sessions`, `projects`, `open`, `new`, `branch`, `delete`, `rename`,
  `prune`, `use`, `session-set`, and `compact`. For the providers:
  `providers`, `provider-models`, `provider-show`, `provider-set`,
  `provider-add`, and `provider-rm`.
- Mark the functions that are there to list the values a parameter takes,
  so a front end offers their values and not them as commands:
  `system-values`, `branch-points`, `session-values`, and
  `provider-values`.
- Mark the functions that cannot be undone, so a front end asks the person
  to confirm them.
- Answer its own functions, and the provider's description and functions,
  while runs work. Under `-single`, those that change the session or the
  provider wait for the run instead.
- Report each run as events, each naming its run and session: the model's
  text, the tools it calls and what they return, the context sent, the
  tokens spent, and diagnostics.

**System settings**

- Store the system settings, rumbo's own and the same everywhere: the
  provider a new session starts with, the front end, the turn limit, the
  output limit, and the share of the model's context at which to
  summarize. List them with where each value in force comes from
  (`rumbo system`).
- Apply a stored system setting, or a provider's option, to the runs that
  start after it is stored, without starting again, whether a command
  stored it or a person wrote it in the file. The default provider and the
  front end apply from the next start.

### Must not

- Know any kind of work: no project detection, and nothing about
  programming or any other domain.
- Judge the model's work. A run ends when the model stops calling tools,
  and the host runs no checks of its own.
- Send context nobody asked for, beyond the environment, the user's
  instructions, and what the user's skills are for.
- Limit what the agent may do. It acts with the rights of the user who
  started it, inside whatever sandbox the user chose.
- Track the files the model changes. A session keeps the conversation, not
  the disk.
- Call a model API, render anything, or see a provider's credentials.

## Provider

A provider turns a conversation into the next assistant message. It speaks
the Agent Provider Protocol on its stdin and stdout.

### Must

- Answer `initialize` with protocol version 1, its name, and its
  configuration in force, with a default for every field it was not given,
  for a person to see.
- Answer `complete` with the next assistant message, why it stopped (it
  ended, it calls tools, the output limit cut it, or the model refused), and
  what it cost. Every request carries the whole conversation.
- Answer one request at a time. When the host needs more at once, it starts
  more processes.
- Give each tool call the arguments the model produced, as JSON, or as a
  string when they are not valid JSON.
- Mark a failure that can succeed if the request is sent again as transient,
  and a request that did not fit in the model's context as such. Any other
  error ends the run.
- Answer a request it was asked to cancel, normally with an error, within a
  few seconds.
- Answer `shutdown` and exit.
- Write only protocol messages to stdout. Diagnostics go to stderr, which
  reaches the user.
- Hold its own credentials, and keep them where it chooses. The host keeps
  none: one a person types at the provider's question it relays without
  recording.
- Ignore opaque blocks it does not recognize, which is what lets a session
  change provider.

### Can

- Stream the visible text of a response while it is produced.
- Report how many tokens the model's context holds, so the host summarizes
  before it fills.
- Describe how its model is chosen, the options it accepts, each with its
  default, and the functions it offers. The host and the front ends offer
  them without knowing them.
- Offer functions, such as listing its models. One that cannot be undone
  asks to be confirmed, and one that an option names returns the values the
  option accepts.
- Talk with the person while a function works: say things, and ask
  questions, marking an answer secret when it is one, such as the code a
  sign-in gives. The function takes as long as the person does.
- Read what the user chose for it, its configuration, which holds the
  values they set for its options too; the host sends those with every
  request as well, so a provider that reads its options only there gets
  them.
- Keep what it needs to continue a conversation, such as signed reasoning,
  in opaque blocks the host returns unchanged.
- Show the model the images of a tool's result. One whose model API takes
  none there sends the result's text, which says what each image is.
- Cache the start of requests, which the host keeps stable, and report how
  much of each it read from the cache and wrote to it, which is how the
  host tells a request that missed it.

### Must not

- Rely on anything but the request it is answering: the next request of the
  same session may go to another process.

### Built in

- **`anthropic`** reaches the Claude API with `ANTHROPIC_API_KEY`,
  `ANTHROPIC_AUTH_TOKEN`, the key its `login` stored, or the profile from
  `ant auth login`, in that order. It lists the models the account can use,
  offers an `effort` option, keeps the model's thinking in opaque blocks,
  and reports the size of the model's context.
- **`openai`** reaches any server compatible with OpenAI's Chat Completions,
  at the address its configuration gives, with the key in the variable its
  configuration names (`OPENAI_API_KEY` by default), or else the key its
  `login` stored for that address. It lists the server's models, offers an
  `effort` option, sent as `reasoning_effort` only when it or the
  configuration chooses one, and takes the size of the context from its
  configuration, since a server cannot say. With `api` set to `responses`
  in its configuration, as the `openai` registered the first time rumbo
  runs has it, it speaks OpenAI's Responses API instead, which its
  reasoning models need to use tools with an effort: nothing is stored on
  the server, and a model's encrypted reasoning goes back to that model
  alone, in opaque blocks.
- Both offer `login`, which asks for an API key, checks it with a request
  that costs nothing, and keeps it for the server in the user's
  configuration directory (`rumbo/credentials/`), readable only by the user;
  `logout`, which removes it; and `account`, which says which credential is
  in use and where it comes from, without showing it.
- **`chatgpt`** uses the person's ChatGPT plan instead of an API key, as
  OpenAI offers to open-source apps that run where the person does. Its
  `login` signs in with ChatGPT in the browser, which comes back to a
  listener on the loopback, or, from another computer, to an address the
  person pastes; OpenAI registers this installation as its client on the
  way. It keeps what that gives with the other credentials, renews it as it
  expires, one process at a time, and forgets it when it can no longer be
  renewed. Its requests go to OpenAI's Responses API as the plan asks:
  nothing stored, the answer streamed, and no limit on the output. It lists
  the models the plan can use, offers an `effort` option, and says where to
  manage the plan's usage, in `account` and when a usage limit is reached.
  `logout` forgets the sign-in and takes it back on OpenAI's side.
- Anthropic's terms do not let other applications use a Claude
  subscription, so no built-in provider does; `anthropic` takes an API key.

## Front end

A front end is what a person uses to give objectives and follow the work. It
speaks the Agent Frontend Protocol with the host.

### Must

- Answer the host's `initialize` with protocol version 1, its name, and its
  start configuration in force, with a default for every field it was not
  given.
- Run the objective the command line gave, or resume the unfinished run,
  when `initialize` asks for it.
- Ignore event types and fields it does not know.
- Not reuse the id of a run in progress, since it names the run.
- Decide what Ctrl-C means, and cancel through the protocol.
- Show the confirmation a function asks for, and call the function only
  after the person agrees.
- Answer a question a provider's function asks through it, with what the
  person typed or with an error, and neither show nor keep a secret answer.
- Wait for an answer when one request has to take effect before another.

### Can

- Start runs in the current session, in another session, or in a new one,
  and choose the model and the options for one run.
- Follow several runs at once, telling their events apart by run and
  session.
- Show what a session held before it was opened, from its history.
- Bring back to its input what the person asked in any of the project's
  sessions, which the host recalls.
- Give images with a task, or with what it tells a run, such as one pasted
  from the clipboard.
- Tell a run something while it works, and offer it as a new task when the
  run ended first.
- Cancel one run, or all of them.
- Ask what the provider offers and call its functions, call the host's
  functions, and build commands, pickers, and completion from their
  descriptions without knowing them beforehand. A function that lists a
  parameter's values is given what was typed for the parameters before it
  that it takes.
- Show what a provider's function says while it works, ask the person what
  it asks, and give the function up.
- Take what it is attached to, its directory, session, provider, and model,
  from the host's answers instead of remembering it.
- Be started by rumbo, with the terminal and with the protocol on file
  descriptors 3 and 4, or start `rumbo serve` itself and speak on its stdin
  and stdout.
- Read the configuration registered with it.
- End the host by closing the connection.

### Built in

**`tui`**, the terminal UI:

- It takes the whole screen, as rumbo-gui takes a window: a header with
  the project and the session shown; the project's sessions in a sidebar,
  which marks those working and those whose run ended while they were not
  shown; the conversation in a column of its own, which PgUp, PgDn, and
  the mouse's wheel scroll; and under it a composer with the model, how
  full the context is, and what the session spent, over a line that says
  what the keys do. The conversation goes with the screen when it quits.
- What the person said shows in a box on the right, and what the model
  writes as the Markdown it is: headings, lists, quotes, code, bold,
  italics, links, and tables with their columns lined up. A code block
  shows its language and its code alone, so it can be selected and copied
  as it is.
- A tool call shows with a spinner and its time while it works, and then
  as a block that says how it went: an edit with the lines it changed, a
  command with the start of what it printed, or, when it failed, with its
  status and the end of what it printed.
- A run ends with a line that says how it ended, how long it took, and its
  turns and tokens.
- Each session keeps what it showed, and one shown for the first time
  shows what it holds first, told as its runs were shown. A run goes on in
  its session while another is shown: the header counts those runs, and
  when one ends the sidebar marks its session and a line says so.
- The mouse, or Tab on an empty composer, the arrows, and Enter, show a
  session of the sidebar, and Delete deletes the one chosen there, once the
  person agrees. Ctrl-N starts a new session, and Ctrl-B shows or puts
  away the sidebar.
- Enter sends a task. During a run it tells the run what was typed, which
  shows once the model has it, and goes back to the composer if the run
  ended first.
- Ctrl-P opens a palette of its own actions, the project's other sessions,
  and every command, which typing narrows. A command that takes something
  asks for it in a form, where each field offers the values its
  parameter's function lists, asked with what was given for the fields
  before it, and takes any value typed instead. One that cannot be undone
  asks to be agreed to in a dialog, which starts on the button that leaves
  things as they are. The palette also renames, branches, compacts,
  deletes, and copies the id of the session shown.
- The picker, from the palette or a click on the model under the composer,
  changes the provider, the model, and the options of the session, with
  `use` and `session-set`, each change shown as the command it is.
- Beside the conversation, Ctrl-Alt-B shows the session's details: its id
  and how it stands, its folder, its model, how full its context is and
  what it spent, and what the host's `skills` and `status` say, laid out by
  the shape of their lines; and Ctrl-G what changed in the project's
  folder, as Git sees it against the last commit, new files included,
  which it only reads, with Git's optional locks off. Where there is no
  room for both, the panel takes the conversation's place.
- Shift-Tab goes up into the conversation, where Up and Down choose an
  entry and Enter acts on it, as a click on it does: a tool call shows all
  it was given and returned, or goes back to its excerpt; what the person
  asked can be changed, or asked again, in a branch that starts before it
  (`branch` with its `point`); and anything else is copied.
- Dragging the mouse over the conversation or the panel selects its text,
  shown in reverse, within the part the drag started in, and letting go
  copies it, to the clipboard and to the primary selection; the
  conversation holds still while text is selected. Text is copied with
  OSC 52, so it also works over ssh, in the terminals that take it; in
  tmux, with `set-clipboard on`. With Shift, the terminal selects as it
  does elsewhere.
- Its commands are the functions the host and the provider describe, but
  for those there to list a parameter's values, and its own, which come
  before one of theirs of the same name: `/help`, `/copy`, and `/export`.
  `/help` lists the host's by what they act on: the system, the session,
  and the providers.
- `/copy` puts the model's last answer in the clipboard, and `/copy code`
  only its last code block.
- `/export` writes the current session as Markdown, from its history: what
  was asked, what the model wrote, each tool call with the change it made
  or the start of what it returned, and how each run ended. It writes to
  the path given, from the session's directory, or to `rumbo-<session>.md`
  there, and never over a file that exists.
- A slash in the composer opens a menu of the commands, with what each
  does, and after a command, of what its next parameter takes, with what
  the host or the provider says of each value: a session's title, the text
  of a message to branch before. It narrows as one types, by value or by
  what describes it; Up and Down choose, Tab or Enter take, and Escape
  closes it. Enter on a command that needs nothing more sends it, and on
  one that still needs something opens the menu of what it takes next, or
  says what that is: `/open` lists the sessions, and `/use openai` the
  models of `openai`. After `/session-set `, `/provider-set <provider> `,
  and `/system-set `, the menu offers the changes each takes as
  `name=value`, with those in force marked.
- Answers, errors, and diagnostics are marked `[host]` or `[provider
  <name>]`, by where they come from.
- What a provider's function says shows marked as the provider's. Its
  question opens in a dialog with a line of its own for the answer, so
  what was typed in the composer stays; a secret answer shows as dots and
  is kept nowhere, not even in the history.
- The composer takes several lines: Enter sends them, and Alt-Enter,
  Shift-Enter, or Ctrl-J starts a new line. Pasted text keeps its line
  breaks. It grows to ten rows, or a third of a short screen, and then
  scrolls with the cursor.
- Up and Down move through the rows typed, and past them through what was
  entered; Ctrl-R searches it. It starts with what the host recalls of the
  project's sessions, and adds what is entered while it runs, commands
  too, which it keeps nowhere; answers to a question are not in it.
- Ctrl-V reads the image in the desktop's clipboard, with `wl-paste` on
  Wayland, `xclip` on X11, or AppKit on macOS, since a terminal pastes text
  only; the images wait in the composer for what is sent next, and
  Backspace on an empty composer takes the last one away.
- Escape gives up a provider's function in progress, else cancels the run
  of the session shown. Ctrl-C does the same, else clears the composer,
  else quits; Ctrl-D quits on an empty composer.
- The composer edits where the cursor is, with readline's keys: Left,
  Right, Home, and End, or Ctrl-F, Ctrl-A, and Ctrl-E, move in it, and by
  words with Ctrl or Alt and the arrows, or Alt-B and Alt-F; Delete or
  Ctrl-D deletes under the cursor, and Ctrl-W, Ctrl-U, and Ctrl-K delete a
  word back, to the start of the line, and to its end.
- The composer's last row shows the provider and the model, or that there
  is no model yet; how full the context is, as a bar that turns yellow
  past half and red past four fifths; the tokens the session has spent;
  and how the run of the session shown stands. What does not fit leaves,
  the least needed first.
- When a run ends, or a provider's function asks something, while the
  terminal is not in front, it rings the terminal's bell and sends a
  desktop notification, in the terminals that report their focus and take
  OSC 9; in tmux, with `focus-events` on.
- Its start configuration chooses its colors: `theme` is `auto`, which
  shows them unless `NO_COLOR` is set, `color`, or `plain`, which shows
  none; and `color_host`, `color_provider`, `color_code`, `color_success`,
  `color_failure`, `color_warning`, and `color_progress` each take a name,
  such as `cyan` or `bright-blue`, a number of the 256 colors, written as
  text or as a number, `#rrggbb`, or `default`. It says the configuration
  in force, with its defaults, and one it cannot use stops it with what is
  wrong, before it takes the terminal.
- It gives the terminal back as it found it, when it quits or the host
  ends, and leaves in it the command that continues its session,
  `rumbo -s <session>`.

**`plain`**, for pipes and scripts:

- It takes the objective from the command line or from piped input, or
  reads objectives line by line.
- The model's text goes to stdout; progress, the session, and the tokens
  spent go to stderr.
- Ctrl-C cancels the run. It exits with 0 when the run is done, 1 when it
  failed, and 130 when it was cancelled.
