---
title: Prima di eseguirlo
description: rumbo dà al modello i tuoi permessi, senza sandbox né richieste di permesso. Cosa significa, dove vanno i tuoi dati e come eseguire in sicurezza un lavoro di cui non ti fidi.
---

rumbo non ha un sistema di permessi. È una scelta, non una lacuna: l'agente agisce con i permessi
dell'utente che l'ha avviato, e limitare ciò che può fare è lasciato a una sandbox di tua scelta.

## Cosa può fare il modello

- **Agisce come te.** Legge, scrive ed esegue comandi come te, senza chiedere e senza sandbox.
- **Ciò che legge può guidarlo.** L'`AGENTS.md` di un progetto, i suoi file o l'output di un comando
  possono contenere istruzioni. Lavora su codice di cui non ti fidi dentro un container o una macchina
  virtuale.
- **Con lo strumento `computer` attivo, usa il tuo schermo.** Fa screenshot e usa il puntatore e la
  tastiera del desktop su cui gira rumbo. Lo strumento è disattivato finché non lo
  [attivi](/it/guides/computer-use/).

## Cosa conserva rumbo

- **Le sessioni conservano ciò che il modello ha visto**, compresi i segreti nell'output dei comandi,
  in `~/.rumbo/sessions/`, leggibile solo da te.
- **Una chiave API data al `/login` di un provider integrato** viene conservata in
  `~/.rumbo/credentials/`,
  leggibile solo da te, e quindi anche dal modello.
- **Un segreto chiesto da un provider**, come un codice di accesso, va dall'interfaccia al provider e
  non viene registrato da nessuna parte, nemmeno nella sessione.

## Cosa raggiunge la rete

rumbo di per sé non contatta alcun server e non ha telemetria. Solo i tuoi provider e i comandi del
modello raggiungono la rete.

## Eseguirlo in una sandbox

Poiché rumbo è un unico binario che conserva il suo stato in file, gira dentro l'isolamento che usi
già: un container, una macchina virtuale o un account utente separato. Dagli il progetto, le
credenziali del suo provider e nient'altro.
