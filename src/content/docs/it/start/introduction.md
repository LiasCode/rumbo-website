---
title: Cos'è rumbo?
description: rumbo è un harness per agenti minimale e open source. Dà al modello quattro strumenti e un prompt di sistema breve, e mantiene il modello e l'interfaccia come programmi separati che puoi sostituire.
---

rumbo è un harness per agenti minimale. Dagli un compito e lavora con quattro strumenti, `read`,
`write`, `edit` e `bash`, più un quinto che usa lo schermo se lo attivi, finché il modello non ha
finito. I modelli dietro di lui e le interfacce davanti sono programmi separati che puoi sostituire.

Non è legato alla programmazione. Non conosce alcun tipo di lavoro: fa ciò che chiedono il tuo compito
e le tue [istruzioni](/it/guides/instructions-and-skills/), che si tratti di sistemare un test che
fallisce, riassumere una cartella di appunti o pilotare un programma desktop.

## Le tre parti

- **L'host** è rumbo stesso. Possiede le sessioni, gli strumenti e il ciclo: chiede a un provider il
  messaggio successivo, esegue gli strumenti che il modello chiama e ripete finché il modello non smette
  di chiamarli. Non mostra nulla e non conosce alcuna API di modelli.
- **Un provider** raggiunge un modello. rumbo include provider per l'API di Anthropic, le API di
  OpenAI, un abbonamento ChatGPT e qualsiasi server compatibile con Chat Completions, compresi quelli
  locali. Vedi [modelli e provider](/it/guides/providers/).
- **Un'interfaccia** (front end) è ciò che usi tu: l'[interfaccia da terminale](/it/guides/terminal-ui/),
  un'uscita in testo semplice per [script e pipe](/it/guides/scripting/),
  l'[app desktop](/it/guides/desktop-app/) o una che scrivi tu.

I provider e le interfacce parlano un piccolo protocollo JSON-RPC con l'host su stdio, come fa il
Language Server Protocol tra editor e linguaggi. Quelli integrati attraversano gli stessi protocolli di
quelli che [scrivi tu](/it/extend/provider/), quindi tutto ciò che possono fare loro, possono farlo
anche i tuoi.

## Cosa lo rende diverso

- **Una cronologia che puoi rigiocare.** Una sessione è un registro in sola aggiunta, una voce per riga
  in un file che puoi leggere. Ogni richiesta inviata al modello si può ricostruire da esso
  (`rumbo request` la stampa), un'esecuzione fallita o interrotta riprende da dove si era fermata
  (`rumbo -r`), e `/branch` riparte da prima di uno qualsiasi dei tuoi messaggi in una nuova sessione,
  mentre la prima resta com'era.
- **Pensato per la cache del provider.** Ogni richiesta estende la precedente finché un riassunto non
  ricomincia la conversazione, così il provider può leggerla dalla sua cache.
- **Un host, molte sessioni.** Le esecuzioni continuano in altre sessioni mentre lavori in una nuova, e
  puoi dire qualcosa a un'esecuzione senza fermarla.
- **I provider si descrivono da soli.** I loro modelli, opzioni e funzioni, fino a un accesso che ti
  chiede un codice, compaiono in ogni interfaccia senza che l'interfaccia li conosca.
- **Piccolo e generale.** Un prompt di sistema breve e fisso, niente su alcun linguaggio o framework, e
  nessuna telemetria.

## Da dove viene

- **[pi](https://pi.dev)**, l'harness per agenti minimale avviato da Mario Zechner, per ciò che un
  harness lascia fuori. Come pi, rumbo dà al modello quattro strumenti e un prompt di sistema breve, e
  non ha modalità di pianificazione, né subagenti, né richieste di permesso.
- **Il [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)**, per il
  modo in cui le parti si incontrano. Le interfacce e i provider sono programmi che parlano JSON-RPC con
  l'host, descrivono le loro opzioni e funzioni all'avvio e si possono scrivere in qualsiasi linguaggio.

## Prossimi passi

- [Installa rumbo](/it/start/installation/) e [esegui il tuo primo compito](/it/start/quick-start/).
- Leggi [prima di eseguirlo](/it/start/safety/): rumbo agisce con i tuoi permessi, senza sandbox.
- Scopri [perché rumbo è fatto così](/it/concepts/design/).
