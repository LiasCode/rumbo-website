---
title: Modelli e provider
description: Usa rumbo con Claude tramite l'API di Anthropic, le API di OpenAI, un abbonamento ChatGPT o un modello locale su Ollama, llama.cpp o vLLM, e registra un provider tuo.
---

Un provider è il modo in cui rumbo raggiunge un modello. È un programma separato che parla
l'[Agent Provider Protocol](/it/reference/provider-protocol/) con rumbo, e possiede la connessione al
modello e le sue credenziali. rumbo ne include tre, e puoi aggiungerne qualsiasi altro.

```sh
rumbo provider list              # the providers there are, built in and yours
rumbo provider models <name>     # the models one offers
rumbo provider show <name>       # its settings, their values, and where each comes from
```

## Scegliere il modello

Una nuova sessione inizia con il provider predefinito e il modello impostato per lui. Una sessione
conserva il provider e il modello che usa da un avvio all'altro.

```sh
rumbo system set default_provider=anthropic          # the provider new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # the model they start with there
rumbo -p openai -m <model> "a task"                  # another one, for this session
```

Nell'interfaccia da terminale, `/model <provider>/<model>` li cambia per la sessione, `/model` da
solo apre il selettore che li elenca, e `/providers` elenca, mostra, configura, aggiunge e rimuove i
provider.

## Anthropic

Il provider `anthropic` raggiunge l'API di Claude. Usa, in quest'ordine, `ANTHROPIC_API_KEY`,
`ANTHROPIC_AUTH_TOKEN`, la chiave salvata dal suo `/login` o il profilo di `ant auth login`.

```sh
export ANTHROPIC_API_KEY=...
rumbo -p anthropic
```

Elenca i modelli che il tuo account può usare, offre un'opzione `effort` e conserva il ragionamento del
modello per poterlo continuare.

> Il provider integrato `anthropic` usa credenziali API. Non implementa l’accesso tramite un abbonamento Claude.

## OpenAI

Il provider `openai` raggiunge la Responses API di OpenAI con `OPENAI_API_KEY`, o con la chiave salvata
dal suo `/login`. I suoi modelli di ragionamento hanno bisogno della Responses API per usare strumenti
con un livello di impegno. Nulla viene salvato sul server di OpenAI.

```sh
export OPENAI_API_KEY=...
rumbo -p openai
```

## Abbonamento ChatGPT

Il provider `chatgpt` usa il tuo abbonamento ChatGPT invece di una chiave API, come OpenAI offre alle
app open source che girano dove sei tu.

```sh
rumbo -p chatgpt                           # then /login signs in with ChatGPT, and /model chatgpt/ lists the plan's models
rumbo provider set chatgpt model=<model>   # the one new sessions there start with
```

`/login` apre un accesso nel browser, che torna a rumbo su questa macchina; da un'altra macchina,
incolla l'indirizzo su cui si ferma il browser. Il suo uso conta sul tuo abbonamento, che gestisci nelle
impostazioni di ChatGPT; la sua funzione `account` ti dice dove.

## Modelli locali e altri server

Qualsiasi server compatibile con Chat Completions di OpenAI funziona tramite il programma `openai`,
compresi quelli locali come Ollama, il server di llama.cpp o vLLM. Registralo con un nome suo:

```sh
rumbo provider add -config '{"base_url":"http://localhost:11434/v1"}' local '{self}' provide openai
rumbo provider models local                                         # the models the server offers
rumbo provider set local model=qwen3-coder context_window=32768     # a server cannot say its context size
rumbo -p local "fix the failing test"                               # the session keeps its provider and model
```

`{self}` sta per l'eseguibile di rumbo stesso. Un provider aggiunto così parla Chat Completions, come la
maggior parte dei server, a meno che tu non gli dia `api=responses`. La chiave API viene letta dalla
variabile indicata nella sua configurazione, `OPENAI_API_KEY` per impostazione predefinita, o da ciò
che il suo `/login` ha salvato per quell'indirizzo.

## Accedere

I provider integrati offrono tre funzioni, che un'interfaccia offre come comandi.
Nell'interfaccia da terminale, sono quelle del provider della sessione:

| Comando                     | Cosa fa                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/login`                    | `anthropic` e `openai` chiedono una chiave API, la verificano con una richiesta che non costa nulla e la conservano; `chatgpt` accede con ChatGPT |
| `/logout`                   | Dimenticare la chiave o l'accesso                                                                                                                 |
| `/providers <name> account` | Dire quale credenziale è in uso e da dove viene, senza mostrarla                                                                                  |

Le chiavi sono conservate in `~/.config/rumbo/credentials/`, leggibili solo da te. Un segreto che scrivi
alla domanda di un provider va solo al provider e non viene registrato da nessuna parte.

## Opzioni

Un provider dice quali opzioni accetta. Quelli integrati offrono `effort`, quanto pensa il modello.
Impostala per tutte le sessioni di un provider, o per una sola:

```sh
rumbo provider set anthropic effort=high   # every session that uses anthropic
rumbo -o effort=low "a quick task"          # this session only
rumbo provider set anthropic effort=        # back to the provider's default
```

Nell'interfaccia da terminale, `/model effort=low` la imposta per la sessione. Vedi la
[configurazione](/it/guides/configuration/) per capire come si combinano i livelli.

## Un provider tuo

Qualsiasi programma che risponde a `initialize` e `complete` sul suo stdin e stdout è un provider, in
qualsiasi linguaggio:

```sh
rumbo provider add mine /path/to/my-provider
rumbo -p mine -m some-model "..."
```

rumbo lo avvia quando lo aggiungi, ed è la prova che funziona. Vedi
[scrivere un provider](/it/extend/provider/).
