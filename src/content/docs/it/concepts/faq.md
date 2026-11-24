---
title: Domande frequenti
sidebar:
  label: FAQ
description: Risposte su rumbo. Se è gratuito, quali modelli supporta, se funziona con modelli locali o su Windows, se può usare un abbonamento Claude o ChatGPT e come si confronta con altri agenti.
---

## rumbo è gratuito?

Sì. rumbo è open source con licenza MIT, e non ha account, né server propri, né telemetria. Paghi solo
il provider del tuo modello, o nulla con un modello locale.

## È un agente per programmare?

È un harness per agenti generale. Puoi usarlo per scrivere e modificare codice, perché una shell e
quattro strumenti per i file arrivano a tutto ciò di cui un progetto ha bisogno. Ma nulla in rumbo
riguarda la programmazione: fa ciò che chiedono il tuo compito e le tue istruzioni, come riassumere
appunti, riordinare file o pilotare un programma desktop con lo [strumento `computer`](/it/guides/computer-use/).

## Con quali modelli funziona?

Claude tramite l'API di Anthropic, i modelli di OpenAI tramite le sue API, i modelli di un abbonamento
ChatGPT e qualsiasi server compatibile con Chat Completions di OpenAI. Qualsiasi altro modello funziona
tramite un [provider che scrivi tu](/it/extend/provider/). Vedi [modelli e provider](/it/guides/providers/).

## Posso usarlo con un modello locale?

Sì. Registra il tuo server, come Ollama, il server di llama.cpp o vLLM, come provider con il suo
indirizzo, e scegli uno dei suoi modelli. Vedi
[modelli locali e altri server](/it/guides/providers/#modelli-locali-e-altri-server).

## Posso usare il mio abbonamento ChatGPT o Claude?

Il provider integrato `chatgpt` permette di accedere con un abbonamento ChatGPT. Il provider integrato `anthropic` usa una chiave API, non un abbonamento Claude. Il plugin esterno [rumbo-claude](https://github.com/LiasCode/rumbo-claude) documenta compatibilità, accesso e limitazioni.

## Funziona su Windows?

No. rumbo funziona su Linux e macOS.

## Chiede prima di eseguire un comando?

No. rumbo non ha richieste di permesso: l'agente agisce con i tuoi permessi. Eseguilo in un container o
in una macchina virtuale per un lavoro di cui non ti fidi. Vedi [prima di eseguirlo](/it/start/safety/).

## Posso annullare ciò che l'agente ha fatto ai miei file?

Non con rumbo: una sessione conserva la conversazione, non il disco. Usa il tuo controllo di versione.
Ctrl-G nell'interfaccia da terminale, e il pannello Changes dell'app desktop, mostrano ciò che Git vede
cambiato.

## Dove sono le mie sessioni?

Ciascuna è una directory in `~/.local/share/rumbo/sessions/`, con la sua cronologia in `entries.jsonl`,
una voce per riga. Vedi [sessioni](/it/guides/sessions/#cosa-contiene-una-sessione).

## Come si confronta con altri agenti?

rumbo segue [pi](https://pi.dev) in ciò che un harness lascia fuori: quattro strumenti, un prompt di
sistema breve e niente modalità di pianificazione, subagenti o richieste di permesso. Ciò che aggiunge
sta nel modo in cui le parti si incontrano: modelli e interfacce sono programmi separati su protocolli
aperti, ogni sessione rigioca ogni richiesta che ha inviato e un solo host esegue più sessioni alla
volta. Vedi [progettazione](/it/concepts/design/).

## Posso usarlo dal mio editor?

Qualsiasi programma che parli l'[Agent Frontend Protocol](/it/reference/frontend-protocol/) può pilotare
rumbo, avviando `rumbo serve`, come farebbe un'estensione per l'editor. Vedi
[scrivere un'interfaccia](/it/extend/front-end/).

## Come segnalo un bug o chiedo una funzione?

Apri una issue su [GitHub](https://github.com/LiasCode/rumbo/issues).
