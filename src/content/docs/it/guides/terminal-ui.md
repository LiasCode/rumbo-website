---
title: Interfaccia da terminale
description: Usa l'interfaccia da terminale di rumbo. Le sessioni in una barra laterale, la conversazione, un campo di scrittura, una palette di comandi, pannelli con i dettagli della sessione e le modifiche di Git, e tutti i suoi tasti.
---

`rumbo` in un terminale apre l'interfaccia da terminale a schermo intero: un'intestazione con il
progetto e la sessione mostrata, le sessioni del progetto in una barra laterale, la conversazione in
una colonna propria e, sotto, un campo di scrittura con il modello, quanto è pieno il contesto e quanto
ha speso la sessione.

```sh
rumbo                      # open it
rumbo "a task"             # open it and start a task
rumbo -c                   # open the latest session of this project
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
- Un'esecuzione termina con una riga che dice com'è finita, quanto è durata e i suoi turni e token.
- Invio durante un'esecuzione le dice ciò che hai scritto. Arriva al modello prima della sua richiesta
  successiva, senza fermarla.
- Quando un'esecuzione termina mentre il terminale non è in primo piano, suona il campanello e invia una
  notifica desktop, nei terminali che segnalano il focus e accettano OSC 9 (in tmux, con `focus-events`
  attivo).

## Sessioni

Ogni sessione conserva ciò che ha mostrato, e un'esecuzione continua nella sua sessione mentre ne guardi
un'altra. La barra laterale segna le sessioni che stanno lavorando e quelle la cui esecuzione è finita
mentre non erano mostrate.

| Tasto                            | Cosa fa                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| Tab (campo vuoto), frecce, Invio | Mostrare una sessione della barra laterale                              |
| Canc                             | Eliminare la sessione scelta nella barra laterale, dopo il tuo consenso |
| Ctrl-N                           | Iniziare una nuova sessione                                             |
| Ctrl-B                           | Mostrare o nascondere la barra laterale                                 |

## Comandi

- **Ctrl-P** apre una palette con le azioni proprie dell'interfaccia, le altre sessioni del progetto e
  tutti i comandi, filtrati mentre scrivi. Un comando che ha bisogno di qualcosa lo chiede in un modulo,
  e uno che non si può annullare ti chiede il consenso in una finestra di dialogo.
- **Una barra** nel campo di scrittura apre un menu dei comandi, con ciò che fa ciascuno, e poi dei
  valori accettati dal parametro successivo: `/open` elenca le sessioni, `/use openai` i modelli di
  `openai`.
- **`/help`** li elenca tutti: quelli dell'host, raggruppati in base a cosa agiscono (il sistema, la
  sessione e i provider), quelli del provider e quelli propri dell'interfaccia.

I comandi vengono da ciò che descrivono l'host e il provider, quindi le funzioni di un provider, come
`/login`, compaiono senza che l'interfaccia le conosca. Quelli propri dell'interfaccia sono `/help`,
`/copy` (l'ultima risposta del modello, o `/copy code` per il suo ultimo blocco di codice) e `/export`
(la sessione come Markdown).

I comandi di un’estensione riportano il suo nome registrato, per esempio `/notes-forget`. L’output è contrassegnato da `[extension]` o `[extension <name>]`. Vedi [Estensioni e MCP](/it/guides/extensions/).

## Modello e opzioni

Un clic sul modello sotto il campo di scrittura, o Model and options nella palette, apre il selettore.
Cambia il provider, il modello e le opzioni della sessione, come `effort`, e mostra ogni modifica come il
comando che è.

## Pannelli

- **Ctrl-Alt-B** mostra i dettagli della sessione accanto alla conversazione: il suo id e il suo stato,
  la sua cartella, il suo modello, quanto è pieno il suo contesto, quanto ha speso e le skill di cui il
  modello viene informato.
- **Ctrl-G** mostra cosa è cambiato nella cartella del progetto secondo Git, rispetto all'ultimo commit,
  file nuovi compresi. Si limita a leggere.

## Tornare indietro nella conversazione

Maiusc-Tab sale nella conversazione, dove Su e Giù scelgono una voce e Invio agisce su di essa, come un
clic:

- su una chiamata a uno strumento, mostra tutto ciò che ha ricevuto e restituito, o torna al suo
  estratto;
- su un tuo messaggio, lo modifica, o lo ripropone, in un [ramo](/it/guides/sessions/#creare-un-ramo)
  che inizia prima di esso;
- su qualsiasi altra cosa, la copia.

Trascinare il mouse sulla conversazione o su un pannello ne seleziona il testo, e rilasciandolo lo
copia, negli appunti e nella selezione primaria. Usa OSC 52, quindi funziona anche via ssh nei terminali
che lo accettano (in tmux, con `set-clipboard on`). Con Maiusc, il terminale seleziona come altrove.

## Il campo di scrittura

| Tasto                               | Cosa fa                                                                                                   |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Invio                               | Inviare il compito, o dire all'esecuzione in corso ciò che hai scritto                                    |
| Alt-Invio, Maiusc-Invio, Ctrl-J     | Nuova riga                                                                                                |
| Su, Giù                             | Muoversi tra le righe scritte e, oltre, tra ciò che hai inviato prima                                     |
| Ctrl-R                              | Cercare ciò che hai inviato prima, in qualsiasi sessione del progetto                                     |
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
