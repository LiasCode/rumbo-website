---
title: Progettazione
description: Perché rumbo è fatto così. Una cronologia in sola aggiunta e rigiocabile, un prefisso stabile per la cache del provider, parti sostituibili e ciò che l'harness lascia fuori di proposito.
---

rumbo è piccolo di proposito. Ogni strumento e ogni riga del prompt di sistema si paga in token a ogni
richiesta, per ogni compito, che lo aiuti o no. Quindi un nuovo strumento, impostazione o campo del
protocollo deve valere quello che costa, e quasi tutto ciò che altri harness aggiungono, rumbo lo lascia
alla shell, al compito e alle tue istruzioni.

## Su cosa si basa la progettazione

**La cronologia è in sola aggiunta.** Una sessione è un elenco di voci che non vengono mai modificate né
eliminate. Cambiare rotta crea un [ramo](/it/guides/sessions/#creare-un-ramo), una nuova sessione che
inizia con una copia delle voci, così la sessione di partenza resta com'era.

**La richiesta è una funzione pura delle voci.** Un solo pezzo di codice trasforma una sessione nella
richiesta inviata al modello, e nulla viene aggiunto lungo la strada. Per questo una sessione salvata
riproduce esattamente ogni richiesta, `rumbo request` stampa una qualsiasi di esse e un'esecuzione morta
riprende da ciò che è stato registrato.

**Il prefisso è stabile.** Il prompt di sistema è costante, le dichiarazioni degli strumenti sono
deterministiche e il contesto viene inviato una volta e poi solo quando cambia. Ogni richiesta estende
la precedente, così il provider ne legge l'inizio dalla sua cache. rumbo verifica che sia così, e ti
avvisa quando una richiesta ha mancato la cache, perché il resto si paga di nuovo.

**Un contesto pieno si compatta, non si taglia.** Vicino al limite del modello, il modello riassume la
conversazione e la richiesta successiva parte da quel riassunto. Un riassunto scritto apposta porta
avanti il lavoro meglio del taglio dei turni vecchi, che le API dei modelli spesso rifiutano.

**Le parti si incontrano su protocolli.** I provider e le interfacce sono programmi separati che parlano
JSON-RPC con l'host, come editor e linguaggi tramite il Language Server Protocol. Quelli integrati
attraversano gli stessi protocolli dei tuoi, e i protocolli crescono soltanto: ciò che si aggiunge è
facoltativo.

**Tutto ciò che rumbo conserva è un file leggibile.** Le tue scelte, in un unico `config.yaml` senza
valori predefiniti, e ogni sessione in una directory propria.

## Cosa l'harness non è

Queste sono scelte, non lacune:

- **Non conosce alcun tipo di lavoro.** Nulla in rumbo riguarda la programmazione o qualsiasi altro
  campo: nessun rilevamento di progetti, nessun comportamento specifico di un linguaggio. Ciò di cui un
  compito ha bisogno viene da te e dalle tue [istruzioni](/it/guides/instructions-and-skills/).
- **Non giudica il lavoro del modello.** Un'esecuzione finisce quando il modello smette di chiamare
  strumenti. rumbo non fa controlli e non rimanda indietro il modello per nulla; controllare il lavoro
  fa parte del compito, e le tue istruzioni dicono come. Misurati sul set di valutazione di rumbo, i
  controlli non hanno mai cambiato un risultato e costavano molto macchinario.
- **Non invia contesto non richiesto**, oltre all'ambiente, alle tue istruzioni e a cosa serve ciascuna
  delle tue skill. Il modello guarda il progetto, e legge una skill, con i suoi strumenti quando ne ha
  bisogno.
- **Non ha un sistema di permessi.** L'agente agisce con i permessi dell'utente che l'ha avviato. Chi ha
  bisogno di limiti esegue rumbo dentro una sandbox di sua scelta. Vedi
  [prima di eseguirlo](/it/start/safety/).
- **Usa un abbonamento solo dove chi lo offre lo permette.** `chatgpt` accede con ChatGPT come OpenAI
  offre alle app open source. I termini di Anthropic riservano un abbonamento Claude alle sue app,
  quindi nessun provider vi accede; `anthropic` usa una chiave API.
- **Non traccia i file.** Una sessione conserva la conversazione, non il disco: non ci sono punti di
  ripristino, e un ramo parte da un punto precedente della conversazione con i file così come sono.

## Misurato, non supposto

Una modifica al ciclo, al prompt di sistema, agli strumenti o al contesto cambia il comportamento del
modello, e i test non possono mostrarlo. Queste modifiche si misurano con un set di valutazione, prima e
dopo, confrontando il tasso di successo, i turni e i token. I test non chiamano mai un modello reale.

## Per approfondire

- [Architettura](/it/reference/architecture/): le parti e come si incastrano.
- [Casi d'uso](/it/reference/use-cases/): cosa ogni parte deve, può e non deve fare.
- [Glossario](/it/reference/glossary/): i termini e cosa significa ciascuno.
