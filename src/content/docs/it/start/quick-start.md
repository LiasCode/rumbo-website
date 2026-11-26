---
title: Avvio rapido
description: Scegli un modello, esegui il tuo primo compito con rumbo, apri l'interfaccia da terminale e continua o riprendi una sessione.
---

Questa pagina ti porta da un `rumbo` installato a un compito finito. Se non l'hai ancora installato,
vedi l'[installazione](/it/start/installation/).

## 1. Scegli un provider e un modello

Un provider è il modo in cui rumbo raggiunge un modello. Con una chiave API di Anthropic:

```sh
export ANTHROPIC_API_KEY=...                         # or /login in the terminal UI, or `ant auth login`
rumbo system set default_provider=anthropic          # what new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # and the model they start with there
```

Per un abbonamento ChatGPT invece di una chiave API, un modello locale o OpenAI, vedi
[modelli e provider](/it/guides/providers/).

## 2. Dagli un compito

Vai nel progetto su cui vuoi lavorare e dai un compito a rumbo:

```sh
cd ~/code/my-project
rumbo "add a --json flag to the export command"
```

rumbo apre l'interfaccia da terminale, e il modello lavora con i suoi strumenti finché non smette di
chiamarli. Ogni chiamata a uno strumento compare mentre viene eseguita, e l'esecuzione termina con una
riga che dice come è finita, quanto è durata e quanti turni e token ha usato.

> **Attenzione**
>
> Il modello legge, scrive ed esegue comandi come te, senza chiedere. Leggi prima
> [prima di eseguirlo](/it/start/safety/).

## 3. Vai avanti

```sh
rumbo                                            # the terminal UI; /help lists its commands
rumbo -c "also document it"                      # continue the latest session started here
rumbo -r                                         # resume a run that stopped
rumbo "summarize notes.md" > summary.txt         # piped: plain text out, exit code
```

`rumbo` da solo apre l'interfaccia da terminale a schermo intero: la conversazione e, sotto, un
campo di scrittura con il modello, il ramo Git e quanto è pieno il contesto. Una barra inizia un
comando, come `/model` o `/resume`, e `/help` li elenca tutti; Ctrl-B mostra le sessioni della
cartella. Vedi la guida all'[interfaccia da terminale](/it/guides/terminal-ui/).

## 4. Digli come lavori

Il modello legge le tue istruzioni: il file `AGENTS.md` o `CLAUDE.md` della directory in cui si avvia
rumbo, e i tuoi in `~/.rumbo/`. Avvia rumbo nella radice di un repository per lavorare con la
sua guida. Scrivi lì come va fatto il lavoro e cosa controllare
prima di considerarlo finito. Vedi [istruzioni e skill](/it/guides/instructions-and-skills/).

## Poi

- [Sessioni](/it/guides/sessions/): continua, riprendi, dirama ed esporta il tuo lavoro.
- [Configurazione](/it/guides/configuration/): tutte le impostazioni, cambiate allo stesso modo.
- [Riga di comando](/it/reference/command-line/): tutti i comandi e le opzioni.
