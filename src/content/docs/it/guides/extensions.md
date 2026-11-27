---
title: Estensioni e MCP
description: Dai al modello strumenti tuoi in rumbo, da un programma che scrivi o da un server Model Context Protocol. Registrare, ispezionare, accedere, limitare e sostituire gli strumenti.
---

Un'estensione è un programma che dà al modello altri strumenti, oltre ai quattro di rumbo. La registri una volta, e tutte le esecuzioni avviate dopo hanno i suoi strumenti, in ogni progetto. rumbo la avvia quando un'esecuzione ne ha bisogno per la prima volta e ne mantiene un solo processo finché è in funzione.

## Aggiungere un server MCP

rumbo include l'estensione per i server [Model Context Protocol](https://modelcontextprotocol.io). Aggiungila una volta per ogni server, con il nome che preferisci:

```sh
# Un server avviato con un comando
rumbo extension add files {self} extend mcp npx -y @modelcontextprotocol/server-filesystem "$HOME/notes"

# Un server raggiunto a un URL
rumbo extension add -config '{"url":"https://example.com/mcp"}' docs {self} extend mcp
```

`{self}` indica l'eseguibile di rumbo. rumbo avvia l'estensione quando la aggiungi, il che verifica che funzioni, e dice quali strumenti riceve il modello.

| Campo       | Cosa fa                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| `url`       | L'indirizzo di un server raggiunto via HTTP, al posto di un comando.                |
| `tools`     | I nomi degli strumenti dati al modello, separati da virgole. Senza, tutti.          |
| `prefix`    | Va davanti al nome di ogni strumento, perché quelli di due server non si scontrino. |
| `token_env` | Il **nome** della variabile d'ambiente che contiene un tuo token, mai il token.     |
| `client_id` | Per un server la cui autorizzazione non registra i client da sola.                  |

### Accedere

Un server a un URL che richiede l'accesso parte senza strumenti e con una funzione `login`. Registrata come `docs`, nell'interfaccia da terminale:

| Comando        | Fa                                                                                  |
| -------------- | ----------------------------------------------------------------------------------- |
| `/login docs`  | Apre l'accesso nel browser. Via ssh, incolla l'indirizzo su cui il browser termina. |
| `/logout docs` | Dimentica l'accesso.                                                                |

L'accesso è conservato con le altre credenziali di rumbo, leggibile solo da te, e rinnovato quando scade. Gli strumenti del server sono del modello dall'esecuzione successiva.

## Vedere cosa offre un'estensione, e quanto costa

```sh
rumbo extension list             # le estensioni che hai aggiunto
rumbo extension show files       # la sua configurazione, i suoi strumenti e i byte che aggiungono a ogni richiesta
rumbo extension set files tools=read_text_file,list_directory prefix=notes_
rumbo extension set files tools= # un valore vuoto riporta il campo al suo valore predefinito
rumbo extension rm files
```

Da qualsiasi interfaccia, le funzioni dell'host fanno lo stesso; nell'interfaccia da terminale, `/extensions` le elenca, le mostra, le configura, le aggiunge e le rimuove. Una modifica vale per le esecuzioni che iniziano dopo, e l'interfaccia da terminale offre ciò che offre un'estensione appena viene aggiunta:

```text
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
/extensions files tools=read_text_file,list_directory
```

Dopo `/extensions files tools=`, il menu offre tutti gli strumenti del server, con ciò che fa ciascuno, elemento per elemento: l'estensione `mcp` li elenca con una funzione propria, `tools`.

Il nome, la descrizione e lo schema di ogni strumento sono inviati al modello con **ogni richiesta**, che il compito li usi o no. `show` dice quanti byte sono. Dai al modello gli strumenti che servono a un compito, con `tools`, invece di tutto ciò che ha un server.

## Sostituire uno strumento di rumbo

Un'estensione può prendere il posto di `read`, `write`, `edit` o `bash`, per eseguire i comandi in un container o chiedere prima di alcuni. Non lo fa mai solo per il nome. Lo dici tu:

```sh
rumbo extension add -replaces bash guard python3 /path/to/examples/guard.py
rumbo extension set guard replaces=       # restituisce bash a rumbo
```

[`examples/guard.py`](https://github.com/LiasCode/rumbo/blob/v0.13.0/examples/guard.py) chiede prima di ogni `rm -rf`, in una finestra di dialogo, e passa tutto il resto al `bash` di rumbo.

Su Windows lo strumento della shell di rumbo è `powershell`, che esegue Windows PowerShell:
un'estensione ne prende il posto lì con `-replaces powershell`.

## Cos'altro fa un'estensione

- **Dice qualcosa al modello quando inizia un'esecuzione**, in una sezione sua, come le note che conserva. Viene inviata una volta, e di nuovo solo quando cambia.
- **Ti offre comandi**, che si chiamano dopo il suo nome, come `/extensions notes forget` nell'interfaccia da terminale.
- **Ti chiede qualcosa** mentre uno dei suoi strumenti lavora.
- **Ascolta** ciò che fanno le esecuzioni, per avvisarti o contare quanto costano.

> Un'estensione viene eseguita come te, con i tuoi permessi, e così il server MCP che avvia. Aggiungi quelle del cui codice ti fidi.

## Prossimi passi

- [Scrivi un'estensione](/it/extend/extension/) tua, in qualsiasi linguaggio.
- I [plugin](/it/guides/plugins/) riuniscono estensioni con provider, interfacce e skill.
- Il [protocollo delle estensioni](/it/reference/extension-protocol/) contiene tutti i messaggi.
