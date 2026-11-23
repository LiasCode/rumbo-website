---
title: Script e pipe
description: Esegui rumbo da script, job cron e CI. L'interfaccia plain stampa il testo del modello su stdout e l'avanzamento su stderr, ed esce con un codice che uno script può controllare.
---

Quando l'input o l'output di rumbo non è un terminale, o lo chiedi con `-f plain`, usa l'interfaccia
`plain`: nessuno schermo da disegnare, il testo del modello su stdout e un codice di uscita.

```sh
rumbo "summarize notes.md" > summary.txt
cat task.md | rumbo                               # the whole input is the task
rumbo -c -f plain "now list what is still missing"
```

## Cosa va dove

- **stdout** riceve il testo del modello, e nient'altro.
- **stderr** riceve l'avanzamento, la sessione e i token spesi.

Così `> file` conserva la risposta, e l'avanzamento resta sullo schermo.

## Il compito

`plain` prende il compito dalla riga di comando; senza, tutto l'input in pipe è il compito. Quando
l'input è un terminale, legge i compiti una riga alla volta, ciascuno un'esecuzione a sé.

Un compito dato sulla riga di comando prevale sull'input in pipe, che allora non viene letto. Perché il
modello lavori su qualcosa, nominalo nel compito, e il modello lo leggerà con i suoi strumenti:

```sh
rumbo "review the changes in git diff HEAD~1 and list what is risky"
```

## Codici di uscita

| Codice | L'esecuzione                              |
| ------ | ----------------------------------------- |
| `0`    | è stata completata                        |
| `1`    | è fallita                                 |
| `130`  | è stata annullata, per esempio con Ctrl-C |

## Sessioni negli script

Un'esecuzione da script è una sessione come le altre: `rumbo -c` la continua, `rumbo -r` la riprende se
è stata interrotta, e `rumbo log` e `rumbo request` mostrano cosa ha fatto e cosa ha inviato. Imposta
`max_turns` per limitare quanto può durare un'esecuzione:

```sh
rumbo system set max_turns=50
```

## Pilotare rumbo da un programma

Per pilotare rumbo da un programma tuo invece che da una shell, avvia `rumbo serve` e parla
l'[Agent Frontend Protocol](/it/reference/frontend-protocol/) sul suo stdin e stdout. Vedi
[scrivere un'interfaccia](/it/extend/front-end/).
