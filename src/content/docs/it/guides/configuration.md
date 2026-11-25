---
title: Configurazione
description: Configura rumbo con nome=valore su tre livelli, il sistema, un provider e una sessione, tutto conservato in un unico config.yaml che puoi leggere e modificare.
---

Ogni impostazione di rumbo si cambia allo stesso modo, come `nome=valore`, e un valore vuoto la riporta
al suo valore predefinito. Ciò che imposti viene conservato in un unico file, `config.yaml`, che contiene
solo le tue scelte.

```sh
rumbo config                     # everything that is set and what applies, with where each value comes from
rumbo system set computer=on     # a system setting
rumbo provider set openai effort=high
rumbo frontend set tui theme=plain
rumbo system set max_turns=      # an empty value: back to the default
```

Ciò che un programma non accetta viene rifiutato prima di essere conservato: un nome che non ha o un
valore che non ammette.

## Tre livelli

La configurazione ha tre livelli, separati:

- **Il sistema** è proprio di rumbo, uguale ovunque: quale provider e quale interfaccia avviare, e i
  limiti di un'esecuzione.
- **Un provider** ha il modello con cui inizia una nuova sessione che lo usa, e una configurazione, che
  contiene anche i valori delle sue opzioni.
- **Una sessione** conserva ciò che ha scelto: il suo provider, il suo modello e valori delle opzioni del
  provider. Ciò che una sessione ha scelto prevale, in essa, su quello del provider.

Nulla si imposta per progetto. Le impostazioni sono le stesse in ogni directory, e ciò che cambia da un
lavoro all'altro è la sessione.

## Impostazioni di sistema

| Impostazione       | Predefinito                               | Cosa fa                                                                                  |
| ------------------ | ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `default_provider` | non impostato; lo sceglie `-p`            | Il provider con cui inizia una nuova sessione, con il modello di quel provider           |
| `frontend`         | `tui` in un terminale, altrimenti `plain` | L'interfaccia da avviare                                                                 |
| `max_turns`        | `150`                                     | Risposte del modello dopo le quali un'esecuzione si ferma; `0` per nessun limite         |
| `max_tokens`       | il limite proprio del provider            | Limite di token in uscita per risposta                                                   |
| `compact_at`       | `80%`                                     | Quota del contesto del modello alla quale la conversazione viene riassunta; `0%` per mai |
| `computer`         | `off`                                     | `on` dà al modello lo [strumento `computer`](/it/guides/computer-use/)                   |

```sh
rumbo system                     # the system settings, each with where its value comes from
rumbo system set compact_at=70%
```

Un'impostazione di sistema si applica alle esecuzioni che iniziano dopo che è stata salvata, senza
riavviare rumbo. `default_provider` e `frontend` si applicano dall'avvio successivo.

## Impostazioni di provider e interfacce

```sh
rumbo provider show anthropic              # its model, configuration, and options, with their defaults
rumbo provider set anthropic model=claude-opus-5-5 effort=high
rumbo frontend show tui
rumbo frontend set tui color_code=cyan
```

Quali campi e opzioni accetta un programma lo decide lui, e lo dichiara all'avvio; rumbo verifica un
valore rispetto a questo, e avvia il programma con la modifica, prima di conservarlo.

## Impostazioni della sessione

```sh
rumbo -p openai -m <model> -o effort=low "a task"   # choose for a new session
```

Nell'interfaccia da terminale:

```text
/model openai/<model>     the provider and model of this session
/model effort=low         an option, for this session only
/model effort=            back to the provider's value
/settings                 what applies here, and where each value comes from
```

Un'esecuzione conserva ciò con cui è iniziata; una modifica si applica alla successiva.

## Il file di configurazione

`config.yaml` si trova in `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` su macOS). Contiene
solo le tue scelte, mai un valore predefinito, e puoi modificarlo: rumbo lo cambia un valore alla volta
e conserva i tuoi commenti.

```yaml
system:
  default_provider: anthropic
providers:
  anthropic:
    model: claude-opus-5-5
    config:
      effort: high # every session, unless it chooses another with -o
```

rumbo si rifiuta di avviarsi con un'impostazione mancante, malformata o scritta male nel file, e dice
dove si trova, invece di tirare a indovinare.

## Variabili d'ambiente

| Variabile         | Cosa cambia                                                                  |
| ----------------- | ---------------------------------------------------------------------------- |
| `RUMBO_CONFIG`    | Il file di configurazione da usare al posto di `config.yaml`                 |
| `RUMBO_DATA`      | La directory dei dati di rumbo, che contiene le sessioni                     |
| `XDG_CONFIG_HOME` | Directory di base di `rumbo/config.yaml` su Linux                            |
| `XDG_DATA_HOME`   | Directory di base dei dati `rumbo/` su Linux e macOS                         |
| `NO_COLOR`        | L'interfaccia da terminale non mostra colori, con il suo `theme` predefinito |

I provider leggono le proprie, come `ANTHROPIC_API_KEY` e `OPENAI_API_KEY`. Vedi
[modelli e provider](/it/guides/providers/).
