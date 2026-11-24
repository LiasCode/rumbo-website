---
title: Scrivere un'interfaccia
description: Costruisci la tua interfaccia per rumbo, un'estensione per l'editor, un bot o un'app web, parlando l'Agent Frontend Protocol, JSON-RPC su stdio, con l'host di rumbo.
---

Un'interfaccia (front end) è ciò che una persona usa per dare compiti e seguire il lavoro. È un
programma a sé, in qualsiasi linguaggio, che parla l'[Agent Frontend Protocol](/it/reference/frontend-protocol/)
con l'host di rumbo. L'interfaccia da terminale, l'uscita in testo semplice e
l'[app desktop](/it/guides/desktop-app/) sono tutte interfacce, e nessuna ha scorciatoie.

Scrivine una per portare rumbo in un editor, un bot di chat, una pagina web o un tuo flusso di lavoro.

## Due modi di collegarsi

I messaggi sono oggetti JSON-RPC 2.0, uno per riga, uguali in entrambi i casi:

| Chi avvia chi                                             | L'interfaccia legge da   | L'interfaccia scrive su  |
| --------------------------------------------------------- | ------------------------ | ------------------------ |
| rumbo avvia un'interfaccia registrata (`rumbo -f <name>`) | il descrittore di file 3 | il descrittore di file 4 |
| L'interfaccia avvia `rumbo serve`, come farebbe un editor | lo stdout dell'host      | lo stdin dell'host       |

Un'interfaccia avviata da rumbo mantiene il terminale su stdin e stdout, quindi può disegnare e leggere
i tasti liberamente. Chiudere la connessione termina l'host: annulla l'esecuzione in corso, la registra
e ferma i suoi provider.

Un host è una sessione. Per mostrarne più d'una, come fa l'interfaccia da terminale, avvia un
`rumbo serve` per ciascuna, con `-s <session>` per continuarne una, e trovale con
`rumbo sessions -json`.

[Confronta le due direzioni di avvio nella traccia interattiva.](/it/#run-trace)

## La sua forma

1. **`initialize`**: l'host parla per primo, con la directory, la sessione, il provider e il modello a
   cui l'interfaccia è collegata, e il compito dato sulla riga di comando, se c'è.
2. **`run`**: l'interfaccia invia un compito. L'host risponde quando l'esecuzione è finita: completata,
   fallita o annullata.
3. Le notifiche **`event`** riportano l'esecuzione mentre lavora: il testo del modello, le chiamate a
   strumenti e i loro risultati, i token spesi e la diagnostica.
4. **`steer`** dice qualcosa a un'esecuzione mentre lavora, e **`cancel`** la ferma.

Un'interfaccia può anche chiedere all'host cosa offrono lui e il provider (`describe`), chiamare le loro
funzioni (`invoke`), mostrare cosa conteneva una sessione prima che venisse aperta (`history`) e
richiamare ciò che la persona ha chiesto prima (`recall`) e dire cosa usano i processi dell'host
(`processes`).

## Un esempio completo

[examples/frontend.py](https://github.com/LiasCode/rumbo/blob/v0.10.0/examples/frontend.py) è
un'interfaccia completa in un solo file Python: chiede compiti con `input()` e stampa gli eventi man mano
che arrivano.

```python
def run(objective, request_id):
    """Send one objective and show events until the host answers the request."""
    send({"id": request_id, "method": "run", "params": {"objective": objective}})

    for line in from_host:
        frame = json.loads(line)

        if frame.get("method") == "event":
            show(frame["params"])
        elif frame.get("id") == request_id and "method" not in frame:
            if "error" in frame:
                print(frame["error"]["message"])
                return

            result = frame["result"]
            print(f"\n[{result['status']}] {result.get('error', '')}")
            return
```

Registrala e usala:

```sh
rumbo frontend add simple python3 /path/to/examples/frontend.py
rumbo -f simple
```

In Go, il pacchetto [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.10.0/protocol) contiene i tipi
e `DialFrontend`, una connessione pronta all'uso.

## Comandi senza conoscerli

Tutto ciò che una persona può fare oltre a dare un compito, come cambiare modello o
impostazioni, l'host lo offre come funzioni descritte, e così ogni provider. Un'interfaccia costruisce i
suoi comandi, moduli e selettori a partire da quelle descrizioni, quindi funziona con un provider che
non ha mai visto e guadagna una nuova funzione senza modifiche. Una funzione che non si può annullare lo
dice, perché l'interfaccia chieda prima alla persona; una funzione di un provider può fare una domanda
alla persona, la cui risposta può essere segreta e allora non va né mostrata né conservata.

I [casi d'uso](/it/reference/use-cases/#front-end) elencano cosa un'interfaccia deve e può fare, e il
[protocollo](/it/reference/frontend-protocol/) specifica ogni messaggio.
