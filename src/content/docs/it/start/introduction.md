---
title: Cos'è rumbo?
description: rumbo è un harness per agenti minimale e open source. Dà al modello quattro strumenti e un prompt di sistema breve, e mantiene il modello e l'interfaccia come programmi separati che puoi sostituire.
---

rumbo è un harness per agenti minimale. Dagli un compito e lavora con quattro strumenti, `read`,
`write`, `edit` e `bash` (`powershell` su Windows), più un quinto che usa lo schermo se lo attivi, finché il modello non ha
finito. I modelli dietro di lui e le interfacce davanti sono programmi separati che puoi sostituire.

Non è legato alla programmazione. Non conosce alcun tipo di lavoro: fa ciò che chiedono il tuo compito
e le tue [istruzioni](/it/guides/instructions-and-skills/), che si tratti di sistemare un test che
fallisce, riassumere una cartella di appunti o pilotare un programma desktop.

## Cosa porta di serie

rumbo si usa così com'è installato. Un solo binario porta:

- **Un'interfaccia da terminale completa**: la conversazione in Markdown, un editor che accetta
  pochi comandi, le sessioni in una barra laterale e pannelli. È ciò che `rumbo` apre. Vedi
  l'[interfaccia da terminale](/it/guides/terminal-ui/).
- **Tre provider**: `anthropic` per Claude tramite l'API di Anthropic, `openai` per le API di OpenAI
  e qualsiasi server compatibile con Chat Completions, anche locale, e `chatgpt` per un piano
  ChatGPT. Vedi [modelli e provider](/it/guides/providers/).
- **Un'interfaccia in testo semplice** per [script e pipe](/it/guides/scripting/), e **un'estensione
  per i server MCP**, che aggiungi [una volta per server](/it/guides/extensions/).

## Cosa puoi aggiungere

Altri due sono pubblicati a parte, come [plugin](/it/guides/plugins/) da aggiungere se li vuoi:

| Plugin                                                   | Aggiunge                                                                                                                                 |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [rumbo-claude](https://github.com/LiasCode/rumbo-claude) | Un provider, `claude`, che usa un abbonamento Claude Pro o Max. Non è un'integrazione ufficiale di Anthropic: leggi prima il suo README. |
| [rumbo-gui](https://github.com/LiasCode/rumbo-gui)       | Un'interfaccia, `gui`: una [finestra desktop](/it/guides/desktop-app/) per rumbo. Richiede rumbo 0.12.0 o successivo.                    |

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-claude
rumbo plugin add https://github.com/LiasCode/rumbo-gui
```

rumbo compila un plugin dove lo aggiungi: il primo richiede quindi Go sulla tua macchina, il secondo
Rust.

## Crea i tuoi, e condividili

Ciò che rumbo porta è un punto di partenza, non il prodotto. rumbo è fatto perché **tu scriva i
pezzi che ti mancano**, in qualsiasi linguaggio, con gli stessi protocolli che usano i suoi:

- un'[interfaccia](/it/extend/front-end/), per il tuo modo di lavorare: nel tuo editor, in una chat,
  su una pagina web;
- un [provider](/it/extend/provider/), per il modello che usi;
- un'[estensione](/it/extend/extension/), per gli strumenti che servono al tuo lavoro;
- un [plugin](/it/reference/plugins/), per riunirli con le tue skill.

Se vuoi che altri abbiano ciò che hai fatto, mettilo in un repository Git come plugin: chiunque lo
aggiunge con `rumbo plugin add <indirizzo>`.

## I componenti

- **L'host** è rumbo stesso. Possiede le sessioni, gli strumenti e il ciclo: chiede a un provider il
  messaggio successivo, esegue gli strumenti che il modello chiama e ripete finché il modello non smette
  di chiamarli. Non mostra nulla e non conosce alcuna API di modelli.
- **Un provider** raggiunge un modello. rumbo include provider per l'API di Anthropic, le API di
  OpenAI, un abbonamento ChatGPT e qualsiasi server compatibile con Chat Completions, compresi quelli
  locali. Vedi [modelli e provider](/it/guides/providers/).
- **Un'interfaccia** (front end) è ciò che usi tu: l'[interfaccia da terminale](/it/guides/terminal-ui/),
  un'uscita in testo semplice per [script e pipe](/it/guides/scripting/),
  l'[app desktop](/it/guides/desktop-app/) o una che scrivi tu.

I provider e le interfacce parlano un piccolo protocollo JSON-RPC con l'host tramite pipe, come fa il
Language Server Protocol tra editor e linguaggi. Quelli integrati attraversano gli stessi protocolli di
quelli che [scrivi tu](/it/extend/provider/), quindi tutto ciò che possono fare loro, possono farlo
anche i tuoi.

- [Estensioni e MCP](/it/guides/extensions/) — Aggiungi al modello strumenti di programmi personalizzati o di server Model Context Protocol.
- [Plugin](/it/guides/plugins/) — Installa e distribuisci insieme provider, interfacce, estensioni e skill.

## Cosa lo rende diverso

- **Una cronologia che puoi rigiocare.** Una sessione è un registro in sola aggiunta, una voce per riga
  in un file che puoi leggere. Ogni richiesta inviata al modello si può ricostruire da esso
  (`rumbo request` la stampa), un'esecuzione fallita o interrotta riprende da dove si era fermata
  (`rumbo -r`), e `/branch` riparte da prima di uno qualsiasi dei tuoi messaggi in una nuova sessione,
  mentre la prima resta com'era.
- **Pensato per la cache del provider.** Ogni richiesta estende la precedente finché un riassunto non
  ricomincia la conversazione, così il provider può leggerla dalla sua cache.
- **Un rumbo, una sessione.** Ogni sessione è un processo a sé, con il suo provider e le sue
  estensioni, così le esecuzioni procedono fianco a fianco, e puoi dire qualcosa a un'esecuzione senza
  fermarla.
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
