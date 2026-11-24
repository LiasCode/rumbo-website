---
title: Scrivere un provider
description: Collega rumbo a qualsiasi modello scrivendo un provider, un programma in qualsiasi linguaggio che risponde a richieste JSON-RPC su stdin e stdout con l'Agent Provider Protocol.
---

Un provider trasforma una conversazione nel messaggio successivo dell'assistente. È un programma a sé,
in qualsiasi linguaggio, che parla l'[Agent Provider Protocol](/it/reference/provider-protocol/) sul suo
stdin e stdout. I provider integrati di rumbo sono serviti allo stesso modo, quindi il tuo non ha nulla
in meno.

Scrivine uno per raggiungere un'API di modelli che rumbo non conosce, un gateway aziendale, o un doppio
di test che risponde da uno script.

## La sua forma

I messaggi sono oggetti JSON-RPC 2.0, uno per riga. rumbo avvia il provider come processo figlio e gli
invia:

1. **`initialize`**: il provider risponde con la versione `1` del protocollo, il suo nome e la sua
   configurazione in vigore, e può descrivere i suoi modelli, le sue opzioni e le sue funzioni.
2. **`complete`**, una volta per turno: tutta la conversazione, gli strumenti e le opzioni. Il provider
   risponde con il messaggio successivo dell'assistente, perché si è fermato (ha finito, chiama
   strumenti, il limite di output l'ha tagliato o il modello ha rifiutato) e i token usati. Mentre
   lavora, può inviare testo in notifiche `delta`.
3. **`shutdown`**: il provider risponde e termina.

stdout porta solo messaggi del protocollo. La diagnostica va su stderr, che arriva alla persona.

## Un esempio completo

[examples/provider.py](https://github.com/LiasCode/rumbo/blob/v0.10.0/examples/provider.py) è un provider
completo in un solo file Python, senza alcun modello dietro: chiede una chiamata a uno strumento, poi
ripete l'output dello strumento. Questo è il suo ciclo:

```python
for line in sys.stdin:
    frame = json.loads(line)
    method = frame.get("method")

    if method == "initialize":
        config = frame["params"].get("config") or {}
        functions = [{"name": "greet", "description": "Ask your name, and greet you"}]
        send({"id": frame["id"], "result": {"protocol": 1, "name": "toy", "config": config, "functions": functions}})

    elif method == "complete":
        result = answer(frame["id"], frame["params"])
        result["usage"] = {"input": 0, "output": 0}
        send({"id": frame["id"], "result": result})

    elif method == "invoke":
        send({"id": frame["id"], **greet(frame["id"])})

    elif method == "shutdown":
        send({"id": frame["id"], "result": {}})
        break
```

Sostituisci `answer` con una chiamata al tuo modello, ed è un provider vero. Registralo e usalo:

```sh
rumbo provider add toy python3 /path/to/examples/provider.py
rumbo -p toy -m any "list the files"
```

rumbo avvia un provider quando lo aggiungi, ed è la prova che funziona. In Go, il pacchetto
[`protocol`](https://github.com/LiasCode/rumbo/tree/v0.10.0/protocol) contiene i tipi e `Serve`, un server
pronto all'uso.

## Cosa deve fare un provider

- Rispondere a una richiesta alla volta. Quando rumbo ne ha bisogno di più insieme, avvia altri
  processi, quindi un provider non deve dipendere da nient'altro che dalla richiesta a cui risponde.
- Segnare come transitorio un errore che può riuscire se la richiesta viene inviata di nuovo, come un
  limite di frequenza, e come tale una richiesta che non stava nel contesto del modello. rumbo riprova
  la prima e compatta per la seconda.
- Rispondere entro pochi secondi a una richiesta che gli è stato chiesto di annullare.
- Conservare le proprie credenziali. rumbo non ne conserva nessuna.
- Ignorare i blocchi opachi che non riconosce, ed è questo che permette a una sessione di cambiare
  provider.

## Cosa può fare un provider

- **Descriversi**: come si sceglie il suo modello, le opzioni che accetta con i loro valori predefiniti
  e le funzioni che offre. Ogni interfaccia le mostra come impostazioni e comandi senza conoscerle.
- **Offrire funzioni**, come elencare i suoi modelli o accedere, che possono parlare con la persona
  mentre lavorano: dire cose e fare domande, segnando una risposta come segreta quando lo è.
- **Conservare ciò che gli serve** per continuare una conversazione, come il ragionamento firmato, in
  blocchi opachi che rumbo salva e restituisce senza modifiche.
- **Riportare la dimensione del contesto del modello**, perché rumbo riassuma la conversazione prima che
  si riempia, e **quanto ha letto dalla sua cache**, perché rumbo ti avvisi quando una richiesta l'ha
  mancata.
- **Mostrare al modello le immagini** del risultato di uno strumento.

I [casi d'uso](/it/reference/use-cases/#provider) elencano tutto questo, e il
[protocollo](/it/reference/provider-protocol/) specifica ogni messaggio.
