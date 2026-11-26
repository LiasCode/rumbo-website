---
title: App desktop
description: rumbo-gui è una finestra desktop per rumbo. Tutti i progetti e le sessioni in un posto, ogni sessione come una conversazione, un diff di ciò che è cambiato e le impostazioni di rumbo, senza terminale.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) è una finestra desktop per rumbo: tutti i progetti e
le sessioni in un posto, ogni sessione come una conversazione, e le impostazioni di rumbo, senza
terminale. È un'interfaccia come le altre, scritta in Rust con
[GPUI](https://github.com/zed-industries/zed), e parla la
versione 2 dell'Agent Frontend Protocol, quindi richiede rumbo 0.10.0 o 0.11.0: rumbo 0.12.0 parla
la [versione 3](/it/reference/frontend-protocol/).

## Cosa puoi fare

- **Lavorare nelle sessioni.** Cercale, aprine una con Ctrl-K o da Ctrl-1 a Ctrl-9, e rinominala,
  diramala, compattala, esportala come Markdown o eliminala dal suo menu. Tutti i progetti sono nella
  barra laterale, con le sessioni dalla più recente; fissa in alto quelli che usi di più.
- **Andare avanti e indietro**, come in un browser, tra le sessioni, i progetti e le impostazioni
  visitate, con Alt-Sinistra e Alt-Destra o i pulsanti avanti e indietro del mouse.
- **Seguire un'esecuzione.** La risposta del modello come Markdown, ogni chiamata a uno strumento con ciò
  che ha cambiato in un file e quanto è durata l'esecuzione; dille qualcosa mentre lavora, o annullala.
- **Mostrare un'immagine al modello.** Ctrl-V incolla nel campo di scrittura l'immagine negli appunti.
- **Cambiare idea.** Modifica un messaggio, o riproponilo, in un ramo che inizia prima di esso.
- **Rivedere il lavoro.** Il pannello Changes mostra il diff della cartella del progetto; il pannello
  Files, i suoi file, ciascuno segnato con ciò che ne dice Git; il pannello Details, quanto è pieno il
  contesto del modello, i token spesi e le skill di cui il modello viene informato.
- **Lasciare esecuzioni al lavoro.** Le esecuzioni continuano in altre sessioni e progetti, e la
  finestra, o il desktop se lo attivi, ti avvisa quando una finisce.

> **rumbo-gui richiede rumbo 0.10.0 o 0.11.0**, che parlano la versione 2 del protocollo dell'interfaccia e hanno `rumbo sessions -json`. rumbo 0.12.0 parla la versione 3, in cui una persona dà file per percorso invece di immagini, e rifiuta rumbo-gui finché non parla anch'esso la versione 3. Qualsiasi altro rumbo viene rifiutato quando la finestra lo avvia, e lei lo dice.

## Come funziona con rumbo

Ogni sessione aperta ha un host, un `rumbo serve` che la finestra avvia, e la finestra trova le sessioni con `rumbo sessions -json`. Le esecuzioni proseguono in background; chiudere la finestra annulla quelle degli host che ha avviato.

## Installazione

È un plugin, che rumbo compila dove lo aggiungi, quindi richiede `cargo`, di Rust, su quella macchina. Poi scegli `gui` per un avvio:

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-gui
rumbo -f gui
```

## Uso

La finestra funziona anche da sola, e avvia i rumbo che le servono:

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]   # --rumbo: l'eseguibile di rumbo, quando non è nel PATH
```

[rumbo-gui README](https://github.com/LiasCode/rumbo-gui#readme)
