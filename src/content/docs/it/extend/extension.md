---
title: Scrivere un’estensione
description: Scrivi un'estensione di rumbo in qualsiasi linguaggio. Un programma che dichiara strumenti su stdin e stdout, risponde alle loro chiamate e può aggiungere contesto, comandi, domande e ascolto.
---

Un'estensione è un tuo programma, in qualsiasi linguaggio, che parla l'[Agent Extension Protocol](/it/reference/extension-protocol/) con l'host di rumbo: JSON-RPC 2.0, un oggetto per riga, sul suo stdin e sul suo stdout. Scrivine una per dare al modello uno strumento che rumbo non ha, per metterti tra il modello e uno che ha, o per sapere cosa fanno le esecuzioni.

## La sua forma

1. **`initialize`**: l'host parla per primo. L'estensione risponde con la versione `1` del protocollo, il suo nome e ciò che dichiara: `tools`, `sections`, `functions` ed `events`, tutti facoltativi.
2. **`call`**, una volta per ogni uso di uno dei suoi strumenti: il `name` dello strumento, gli `args` dati dal modello, la `dir` in cui lavora la sessione e la `session`. L'estensione risponde con `text`, e con `is_error` quando la chiamata è fallita.
3. **`shutdown`**: l'estensione risponde e termina.

stdout porta solo messaggi del protocollo. La diagnostica va su stderr, che arriva alla persona.

## Un esempio completo

[examples/extension.py](https://github.com/LiasCode/rumbo/blob/v0.9.0/examples/extension.py) è un'estensione intera in un solo file Python. Conserva delle note: uno strumento per ricordarne una, una sezione che le dice tutte al modello e un comando che le dimentica. Ecco come risponde a una chiamata:

```python
def call(params):
    """Run one tool. `args` is what the model gave; `dir` is where the session works."""
    if params["name"] == "remember":
        text = params["args"].get("text", "").strip()

        if not text:
            # A failed call says how to recover: the model reads it and tries again.
            return {"text": "text is empty; give the note to keep", "is_error": True}

        notes.append(text)

        return {"text": "kept"}

    return {"text": "there is no tool " + params["name"], "is_error": True}
```

Registrala, e guarda cosa riceverà il modello:

```sh
rumbo extension add notes python3 /path/to/examples/extension.py
rumbo extension show notes
```

```text
notes: python3 /path/to/examples/extension.py
configuration: {}
sections, told to the model when a run starts: notes
commands, in a front end: /notes-forget
tools, declared to the model in every request (161 bytes):
  remember  Keep a note for later in this rumbo.
```

In Go, il pacchetto [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.9.0/protocol) ha i tipi e `ServeExtension`, un server già pronto.

## Cosa deve fare un'estensione

- Rispondere a `initialize`, e a ogni `call` verso uno strumento che ha dichiarato.
- Dare ai suoi strumenti nomi fatti di lettere, cifre, `_` e `-`, al massimo 64, e a ciascuno un JSON Schema dei suoi argomenti.
- Tenere breve la descrizione di ogni strumento. Viene inviata al modello con ogni richiesta.
- Segnalare una chiamata fallita con `is_error` e un testo che dica al modello come rimediare.
- Aspettarsi chiamate da più sessioni, e più di una alla volta: rumbo mantiene un solo processo di un'estensione per tutte.

## Cosa può fare un'estensione

- **Dire qualcosa al modello quando inizia un'esecuzione**, dichiarando `sections`. L'host chiede il testo di ciascuna; ha 10 secondi per rispondere, e ne vengono trasmessi al massimo 8.000 byte.
- **Offrire comandi alla persona**, dichiarando `functions`. Un'interfaccia mostra `forget`, di un'estensione registrata come `notes`, come `/notes-forget`.
- **Parlare con la persona** mentre uno strumento o un comando lavora: `delta` dice qualcosa, e `ask` fa una domanda, la cui risposta può essere segnata come segreta.
- **Chiamare gli strumenti di rumbo** mentre risponde a una chiamata: è così che un'estensione che sostituisce `bash` inoltra ciò che lascia passare. [examples/guard.py](https://github.com/LiasCode/rumbo/blob/v0.9.0/examples/guard.py) lo fa.
- **Sapere cosa fanno le esecuzioni**, dichiarando gli `events` che vuole, come `ended`.
- **Dire che ciò che dichiara è cambiato**, con `changed`, come quando un accesso le dà degli strumenti.

Un'estensione non cambia alcun messaggio, né lo strumento di un'altra estensione, né il momento in cui un'esecuzione finisce.

## Distribuirla

Un programma si aggiunge con `rumbo extension add`. Per distribuirlo con skill, un provider o un'interfaccia, e farlo compilare da rumbo dove viene installato, fanne un [plugin](/it/reference/plugins/).

I [casi d'uso](/it/reference/use-cases/#extension) elencano ciò che un'estensione deve e può fare, e il [protocollo](/it/reference/extension-protocol/) specifica ogni messaggio.
