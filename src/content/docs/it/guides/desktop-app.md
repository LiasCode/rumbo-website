---
title: App desktop
description: rumbo-gui è una finestra desktop per rumbo. Tutti i progetti e le sessioni in un posto, ogni sessione come una conversazione, un diff di ciò che è cambiato e le impostazioni di rumbo, senza terminale.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) è una finestra desktop per rumbo: tutti i progetti e
le sessioni in un posto, ogni sessione come una conversazione, e le impostazioni di rumbo, senza
terminale. È un'interfaccia come le altre, scritta in Rust con
[GPUI](https://github.com/zed-industries/zed), e parla lo stesso
[Agent Frontend Protocol](/it/reference/frontend-protocol/) dell'interfaccia da terminale.

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

## Come funziona con rumbo

- **Ogni progetto aperto ha il suo `rumbo serve`**, quindi le sue esecuzioni continuano mentre guardi
  un altro progetto o un'altra sessione.
- **Tutto è di rumbo.** Le sessioni, le impostazioni e i provider vivono in rumbo; la finestra conserva
  solo le proprie preferenze, come il tema e i progetti fissati.
- **Niente è scritto nel codice.** I comandi, i moduli e i selettori vengono da ciò che descrivono rumbo
  e il provider, quindi una nuova funzione compare da sola.
- **I file sono tuoi.** Li legge soltanto, per mostrare ciò che Git vede cambiato, e Open in Editor passa
  il progetto al tuo editor.

## Installazione

rumbo-gui si compila dai sorgenti, con Rust, e ha bisogno di rumbo installato a parte: una versione
successiva alla 0.5.

```sh
git clone https://github.com/LiasCode/rumbo-gui
cd rumbo-gui
cargo build --release      # the binary is target/release/rumbo-gui
install -Dm644 rumbo-gui.desktop ~/.local/share/applications/rumbo-gui.desktop
```

Metti in `Exec`, nel file `.desktop`, il percorso del binario se non è nel tuo `PATH`.

## Uso

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]
```

`DIR` è il primo progetto da aprire, e `FLAGS` vengono passati a `rumbo serve`, come `-c` o `-p`.
`--rumbo` indica l'eseguibile di rumbo quando non è nel tuo `PATH`.

rumbo può anche avviare la finestra da sé, come avvia la sua interfaccia da terminale. La finestra
allora lavora solo nel progetto di quel rumbo, e si chiude con lui:

```sh
rumbo frontend add gui /path/to/rumbo-gui --attached
rumbo -f gui "a task"      # or: rumbo system set frontend=gui
```

Il suo [README](https://github.com/LiasCode/rumbo-gui#readme) elenca tutti i tasti.
