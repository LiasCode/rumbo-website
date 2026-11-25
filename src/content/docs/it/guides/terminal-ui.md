---
title: Interfaccia da terminale
description: Usa l'interfaccia da terminale di rumbo. La conversazione a schermo intero, un campo di scrittura, pochi comandi che vi si scrivono, le sessioni in una barra laterale, pannelli con i dettagli della sessione e le modifiche di Git, e tutti i suoi tasti.
---

`rumbo` in un terminale apre l'interfaccia da terminale a schermo intero: la conversazione da un lato
all'altro e, sotto, un campo di scrittura con il modello, il ramo Git in uso, la cartella (sotto la
tua home come `~/`), quanto è pieno il contesto e quanto ha speso la sessione. Le sessioni avviate in
quella cartella sono in una barra laterale, nascosta finché Ctrl-B non la mostra.

```sh
rumbo                      # open it
rumbo "a task"             # open it and start a task
rumbo -c                   # open the latest session started here
rumbo -s <session>         # open a given one
```

Quando esce, restituisce il terminale come l'ha trovato e vi lascia il comando che continua la
sessione, `rumbo -s <session>`. Per conservare una conversazione, `/export` la scrive in un file
Markdown.

## Seguire un'esecuzione

- Ciò che hai detto compare in un riquadro a destra, e ciò che scrive il modello, come Markdown: titoli,
  elenchi, citazioni, codice, link e tabelle con le colonne allineate.
- Una chiamata a uno strumento compare con un indicatore e il suo tempo mentre lavora, e poi come un
  blocco che dice com'è andata: una modifica con le righe che ha cambiato, un comando con l'inizio di
  ciò che ha stampato o, se è fallito, il suo stato e la fine di ciò che ha stampato.
- Come procede l'esecuzione, il suo indicatore e il suo tempo, compare sopra il campo di scrittura.
- Un'esecuzione termina con una riga che dice com'è finita, quanto è durata, i suoi token in entrata
  e in uscita, ciò che ha dato la cache con la sua parte dell'entrata, e i suoi turni:
  `12.3s · 1.1k in · 810 out · 26.5k cached (96%) · 1 turn`. Una sessione che continui dice anche
  quanto è durato ciascuno dei suoi compiti precedenti.
- Invio durante un'esecuzione le dice ciò che hai scritto. Arriva al modello prima della sua richiesta
  successiva, senza fermarla.
- Quando un'esecuzione termina mentre il terminale non è in primo piano, suona il campanello e invia una
  notifica desktop, nei terminali che segnalano il focus e accettano OSC 9 (in tmux, con `focus-events`
  attivo).

## Comandi

Tutto è un comando scritto nel campo di scrittura. Una barra su una riga vuota ne inizia uno, e
anche Ctrl-P. Una conversazione vuota mostra i pochi comandi da cui partire.

- **Il menu** elenca i comandi, con un esempio di quello scelto, e poi i valori che accetta la sua
  parola successiva: `/resume` elenca le sessioni, `/model ` i provider e le opzioni, e
  `/model openai/` i modelli di `openai`. Su e Giù scelgono, Tab o Invio prendono, Esc lo chiude.
- **Ciò che manca ancora a un comando** compare dopo il cursore, attenuato, come `/resume <session>`.
- **Un comando scritto male** riceve come risposta quello che intendevi.
- **`/help`** elenca i comandi per argomento, e i tasti; `/help <command>` dice cosa fa uno di essi,
  con esempi.
- Un comando che non si può annullare ti chiede di confermare in una finestra di dialogo, che parte
  dal pulsante che lascia le cose come sono.

| Comando                         | Cosa fa                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `/new`                          | Iniziare il compito successivo in una nuova sessione                                                      |
| `/sessions`                     | Elencare le sessioni di questa cartella, con il loro stato e quando è stata usata l'ultima volta ciascuna |
| `/resume <session>`             | Andare a un'altra sessione, per il suo id, il suo inizio o l'inizio del suo titolo                        |
| `/rename <title>`               | Dare a questa sessione un titolo tuo                                                                      |
| `/branch [message]`             | Continuare in un [ramo](/it/guides/sessions/#creare-un-ramo), prima di un tuo messaggio o da adesso       |
| `/compact`                      | Sostituire subito la conversazione con un riassunto                                                       |
| `/delete [session]`             | Eliminare una sessione e la sua cronologia, dopo la tua conferma; senza, questa                           |
| `/copy [code\|id]`              | Copiare l'ultima risposta del modello, il suo ultimo blocco di codice o l'id della sessione               |
| `/export [path]`                | Scrivere questa sessione come Markdown in un file, senza sovrascriverlo                                   |
| `/model [provider/model]`       | Cambiare il modello e le sue opzioni (`option=value`); senza, aprire il selettore                         |
| `/login [extension]`, `/logout` | Accedere al provider, o a un'estensione, e uscirne                                                        |
| `/providers`, `/extensions`     | Elencarli, mostrarli, configurarli, aggiungerli e rimuoverli                                              |
| `/settings [name=value]`        | Mostrare ciò che si applica qui e da dove viene ogni valore, o cambiare un'impostazione                   |
| `/status`, `/changes`           | Mostrare i dettagli della sessione, o cosa è cambiato nella cartella, accanto alla conversazione          |
| `/rumbos [close]`               | Ciò che usa il rumbo di ogni sessione aperta; `close` chiude quelli non in uso                            |
| `/help [command]`, `/quit`      | Mostrare i comandi e i tasti, o uscire da rumbo                                                           |

Risposte, errori e diagnostica sono marcati `[host]`, `[provider <name>]` o `[extension <name>]`,
secondo la loro provenienza.

## Provider ed estensioni

`/providers` ed `/extensions` funzionano allo stesso modo:

```text
/providers                                list them
/providers openai                         show one: its settings and what it offers
/providers openai base_url=http://localhost:11434/v1
/providers add local {self} provide openai
/providers remove local                   remove one, once you agree
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
```

Ciò che offre un programma si chiama dopo il suo nome: `/providers anthropic account` per il
provider della sessione, o `/extensions notes forget` per un'estensione. Ogni parola viene
completata: i programmi, le modifiche che accetta ciascuno tranne quelle già date, ciò che offre
ciascuno e ciò che accettano le sue funzioni e, per `add`, come si avviano i programmi presenti, e il
`config=` e il `replaces=` di un'estensione. Una parola facoltativa, prima di una che non lo è, si
scrive per nome, come `name=value`.

`/extensions <name> tools=` sceglie gli strumenti di un server MCP tra tutti quelli che ha, elemento
per elemento: prima l'elenco come è scelto ora, poi ogni strumento che non c'è ancora, con ciò che
fa; una virgola continua con un altro. Vedi [Estensioni e MCP](/it/guides/extensions/).

## Modello e opzioni

`/model`, o un clic sul modello sotto il campo di scrittura, apre il selettore. Cambia il provider, il
modello e le opzioni della sessione, come `effort`, e mostra ogni modifica come il `/model` che è.
Scritto per intero, li cambia insieme:

```text
/model anthropic/claude-opus-5-5 effort=high
/model effort=                     the option back to the provider's value
```

Ciò che precede la barra è un provider solo quando ne esiste uno con quel nome, quindi il nome di un
modello può contenere barre.

## Sessioni

La barra laterale elenca le sessioni avviate nella cartella in cui è stato avviato rumbo, a una riga
di distanza, ciascuna con quanto tempo fa è stata usata, come `5m`, `3h` o `2d`. Ogni sessione è un
rumbo a sé, che l'interfaccia avvia quando mostri la sessione per la prima volta e chiude quando esci,
così un'esecuzione continua nella sua sessione mentre ne guardi un'altra. La barra laterale segna le
sessioni che stanno lavorando, quelle la cui esecuzione è terminata mentre non erano mostrate e, con
un anello, quelle per cui resta aperto un rumbo. Quante esecuzioni lavorano in altre sessioni compare
sotto il campo di scrittura, a destra.

| Tasto                   | Cosa fa                                            |
| ----------------------- | -------------------------------------------------- |
| Ctrl-B                  | Mostrare o nascondere la barra laterale            |
| Tab, con il campo vuoto | Andare alla barra laterale, quando è mostrata      |
| Su e Giù, k e j         | Scegliere una sessione                             |
| gg e G                  | Scegliere la prima o l'ultima                      |
| Invio                   | Mostrare la sessione scelta                        |
| d                       | Eliminare la sessione scelta, dopo la tua conferma |
| Ctrl-N                  | Avviare una nuova sessione, in un rumbo a sé       |

`/sessions` elenca le stesse sessioni nella conversazione, e `/resume <session>` va a una di esse.

I rumbo delle sessioni che hai lasciato senza niente da fare vengono chiusi oltre le ultime due
mostrate, perché non continuino a costare memoria; mostrarne di nuovo una avvia il suo rumbo.
`/rumbos` dice cosa usa il rumbo di ogni sessione aperta: i suoi processi, la loro memoria e il loro
tempo di processore. `/rumbos close` chiude quelli né mostrati né al lavoro.

La sessione in cui è stato avviato rumbo resta trattenuta finché non esci, quindi non si può
eliminare dall'interno: eliminala dopo, con `rumbo sessions rm`.

## Pannelli

- **`/status`** o **Ctrl-Alt-B** mostra i dettagli della sessione accanto alla conversazione: il suo
  id e il suo stato, la sua cartella, il suo modello, quanto è pieno il suo contesto, quanto ha speso
  e le skill di cui il modello è informato.
- **`/changes`** o **Ctrl-G** mostra cosa è cambiato nella cartella della sessione secondo Git,
  rispetto all'ultimo commit, inclusi i file nuovi. Legge soltanto.

## Tornare indietro nella conversazione

Maiusc-Tab sale nella conversazione, dove Invio agisce sulla voce scelta, come un clic:

- su una chiamata a uno strumento, mostra tutto ciò che ha ricevuto e restituito, o torna al suo
  estratto;
- su un tuo messaggio, lo modifica, o lo ripropone, in un [ramo](/it/guides/sessions/#creare-un-ramo)
  che inizia prima di esso;
- su qualsiasi altra cosa, la copia.

| Tasto           | Cosa fa                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| Su e Giù, k e j | Scegliere una voce                                                                   |
| K e J           | Andare ai tuoi messaggi, verso l'alto e verso il basso                               |
| gg e G          | Andare all'inizio e alla fine                                                        |
| c               | Copiare la voce scelta                                                               |
| b               | Creare un ramo dal tuo messaggio con cui è iniziato il compito, dopo la tua conferma |
| Tab, Esc        | Tornare al campo di scrittura                                                        |

`b` sceglie prima quel messaggio, e la finestra di dialogo dice cosa conserva il ramo: la
conversazione com'era prima di esso, con il messaggio nel campo di scrittura del ramo, per
modificarlo o inviarlo di nuovo.

## Copiare

Trascinare il mouse sulla conversazione o su un pannello ne seleziona il testo, e rilasciandolo lo
copia, negli appunti e nella selezione primaria. Con Maiusc, il terminale seleziona come altrove.

Il testo si copia con OSC 52, che funziona anche via ssh, e attraverso il desktop su cui gira rumbo,
perché un terminale o un tmux che non accetta OSC 52 lo scarta senza dire nulla: con `wl-copy`,
`xclip` o `xsel`, o `pbcopy`, altrimenti, in tmux, attraverso il buffer di tmux. Ciò che viene
copiato dice dove è andato.

## Il campo di scrittura

| Tasto                               | Cosa fa                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Invio                               | Inviare il compito, o dire all'esecuzione in corso ciò che hai scritto                                    |
| Alt-Invio, Maiusc-Invio, Ctrl-J     | Nuova riga                                                                                                |
| Su, Giù                             | Muoversi tra le righe scritte e, oltre, tra ciò che hai inviato prima                                     |
| Ctrl-R                              | Cercare ciò che hai inviato prima, in qualsiasi sessione avviata in questa cartella                       |
| Ctrl-V                              | Incollare l'immagine negli appunti, che parte con ciò che invii dopo                                      |
| Backspace con il campo vuoto        | Togliere l'ultima immagine incollata                                                                      |
| Esc                                 | Abbandonare una funzione del provider in corso, altrimenti annullare l'esecuzione della sessione mostrata |
| Ctrl-C                              | Come Esc, altrimenti svuotare il campo, altrimenti uscire                                                 |
| Ctrl-D                              | Uscire, con il campo vuoto                                                                                |
| PagSu, PagGiù, la rotella del mouse | Scorrere la conversazione                                                                                 |

Il campo usa i tasti di readline: Ctrl-A e Ctrl-E, Ctrl-F, Alt-B e Alt-F, Ctrl-W, Ctrl-U e Ctrl-K.
Incollare un'immagine legge gli appunti del desktop con `wl-paste` su Wayland, `xclip` su X11 o AppKit su
macOS, perché un terminale incolla solo testo.

## Colori

I colori dell'interfaccia sono la sua configurazione, impostata con `rumbo frontend set tui`:

```sh
rumbo frontend set tui theme=plain          # auto (the default, which follows NO_COLOR), color, or plain
rumbo frontend set tui color_code=bright-blue
rumbo frontend show tui                     # everything set for it, with the defaults
```

`color_host`, `color_provider`, `color_code`, `color_success`, `color_failure`, `color_warning` e
`color_progress` accettano ciascuno un nome come `cyan` o `bright-blue`, un numero tra i 256 colori,
`#rrggbb` o `default`.
