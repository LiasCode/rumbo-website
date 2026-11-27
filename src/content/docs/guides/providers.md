---
title: Models and providers
description: Use rumbo with Claude through Anthropic's API, OpenAI's APIs, a ChatGPT plan, or a local model on Ollama, llama.cpp, or vLLM, and register a provider of your own.
---

A provider is how rumbo reaches a model. It is a separate program that speaks the
[Agent Provider Protocol](/reference/provider-protocol/) with rumbo, and it owns the connection to
the model and its credentials. rumbo has three built in, and you can add any other.

```sh
rumbo provider list              # the providers there are, built in and yours
rumbo provider models <name>     # the models one offers
rumbo provider show <name>       # its settings, their values, and where each comes from
```

## Choosing the model

A new session starts with the default provider and the model set for it. A session keeps the
provider and model it uses from one start to the next.

```sh
rumbo system set default_provider=anthropic          # the provider new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # the model they start with there
rumbo -p openai -m <model> "a task"                  # another one, for this session
```

In the terminal UI, `/model <provider>/<model>` changes them for the session, `/model` alone opens
the picker that lists them, and `/providers` lists, shows, sets up, adds, and removes providers.

## Anthropic

The `anthropic` provider reaches the Claude API. It takes, in this order, `ANTHROPIC_API_KEY`,
`ANTHROPIC_AUTH_TOKEN`, the key its `/login` stored, or the profile from `ant auth login`.

```sh
export ANTHROPIC_API_KEY=...
rumbo -p anthropic
```

It lists the models your account can use, offers an `effort` option, and keeps the model's thinking
so it can continue it.

> The built-in `anthropic` provider uses API credentials. It does not implement Claude subscription sign-in.
> For a Claude Pro or Max subscription there is the external plugin
> [rumbo-claude](https://github.com/LiasCode/rumbo-claude), which brings a provider, `claude`. It is not an
> official Anthropic integration: read its README first.

## OpenAI

The `openai` provider reaches OpenAI's Responses API with `OPENAI_API_KEY`, or the key its
`/login` stored. Its reasoning models need the Responses API to use tools with an effort. Nothing
is stored on OpenAI's server.

```sh
export OPENAI_API_KEY=...
rumbo -p openai
```

## ChatGPT plan

The `chatgpt` provider uses your ChatGPT plan instead of an API key, as OpenAI offers to open-source
apps that run where you do.

```sh
rumbo -p chatgpt                           # then /login signs in with ChatGPT, and /model chatgpt/ lists the plan's models
rumbo provider set chatgpt model=<model>   # the one new sessions there start with
```

`/login` opens a sign-in in the browser, which comes back to rumbo on this machine; from another
computer, paste the address the browser ends on. Its usage counts against your plan, which you
manage in your ChatGPT settings; its `account` function says where.

## Local models and other servers

Any server compatible with OpenAI's Chat Completions works through the `openai` program, local ones
included, such as Ollama, llama.cpp's server, or vLLM. Register it under a name of its own:

```sh
rumbo provider add -config '{"base_url":"http://localhost:11434/v1"}' local '{self}' provide openai
rumbo provider models local                                         # the models the server offers
rumbo provider set local model=qwen3-coder context_window=32768     # a server cannot say its context size
rumbo -p local "fix the failing test"                               # the session keeps its provider and model
```

`{self}` stands for rumbo's own executable. A provider added this way speaks Chat Completions, as
most servers do, unless you give it `api=responses`. The API key is read from the variable its
configuration names, `OPENAI_API_KEY` by default, or from what its `/login` stored for that
address.

## Signing in

The built-in providers offer three functions for their credentials, which a front end offers as
commands. In the terminal UI, they are of the session's provider:

| Command                     | Does                                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`                    | `anthropic` and `openai` ask for an API key, check it with a request that costs nothing, and keep it; `chatgpt` signs in with ChatGPT |
| `/logout`                   | Forget the key or the sign-in                                                                                                         |
| `/providers <name> account` | Say which credential is in use and where it comes from, without showing it                                                            |

Keys are kept in `~/.rumbo/credentials/`, readable only by you. A secret you type at a
provider's question goes to the provider alone, and is recorded nowhere.

## Options

A provider says which options it takes. The built-in ones offer `effort`, how hard the model
thinks. Set it for every session of a provider, or for one:

```sh
rumbo provider set anthropic effort=high   # every session that uses anthropic
rumbo -o effort=low "a quick task"          # this session only
rumbo provider set anthropic effort=        # back to the provider's default
```

In the terminal UI, `/model effort=low` sets it for the session. See
[configuration](/guides/configuration/) for how the levels fit.

## A provider of your own

Any program that answers `initialize` and `complete` on its stdin and stdout is a provider, in any
language:

```sh
rumbo provider add mine /path/to/my-provider
rumbo -p mine -m some-model "..."
```

rumbo starts it when you add it, which is the test that it works. See
[write a provider](/extend/provider/).
