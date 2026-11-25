---
title: Sessioni
description: Come rumbo conserva il tuo lavoro in sessioni. Continuale, riprendile, diramale, rinominale, esportale ed eliminale, e rigioca la richiesta esatta che qualsiasi turno ha inviato al modello.
---

Una sessione è una conversazione legata alla directory in cui è iniziata: ogni compito che vi dai, ciò che ha risposto il
modello e ogni chiamata a uno strumento con il suo risultato. rumbo la conserva come un elenco di voci
in sola aggiunta, ed è questo che ti permette di continuarla, riprenderla dopo un errore, diramarla e
rigiocare qualsiasi richiesta che ha inviato.

## A quale directory appartiene una sessione

Una sessione appartiene alla directory in cui è stato avviato rumbo, la sua radice, e lavora lì da
dovunque tu la continui. rumbo non cerca un repository Git attorno: avviata in una sottodirectory, la
sessione è di quella sottodirectory e legge solo le sue [istruzioni](/it/guides/instructions-and-skills/).
Avvia rumbo nella radice di un repository per lavorare con la sua guida.

## Continuare e riprendere

```sh
rumbo -c "also document it"       # continue the latest session started here
rumbo -s <session> "and test it"  # continue a given one
rumbo -r                          # resume the unfinished run of the latest session
```

Un'esecuzione fallita, annullata o interrotta perché il suo processo è morto resta incompiuta.
Riprenderla dice al modello che l'esecuzione è stata interrotta, chiude con un errore le chiamate a
strumenti mai terminate e continua senza un nuovo compito.

Ogni esecuzione termina con una nota nella sessione che dice com'è finita: completata, fallita o
annullata. Un errore non resta mai solo sullo schermo.

## Un rumbo, una sessione

Ogni `rumbo` che avvii lavora in una sessione, con il proprio provider e le proprie estensioni, come un
processo a sé. Un'altra sessione è un altro `rumbo`: avviane uno per una nuova sessione, `rumbo -c`
per l'ultima della directory, o `rumbo -s <session>` per una qualsiasi. Più rumbo funzionano fianco a
fianco.

L'[interfaccia da terminale](/it/guides/terminal-ui/) mostra più sessioni avviando un rumbo per
ognuna che apri: un'esecuzione continua nella sua sessione mentre ne guardi un'altra, e la barra
laterale ti avvisa quando finisce. Mentre un'esecuzione lavora, ciò che scrivi arriva al modello prima
della sua richiesta successiva, senza fermarla.

## Creare un ramo

Un ramo è una nuova sessione che inizia con una copia di un'altra, così com'è o com'era prima di uno dei
tuoi messaggi, e prosegue da lì. La sessione di partenza resta com'era, e può continuare a lavorare
nello stesso momento.

- Nell'interfaccia da terminale, Maiusc-Tab sale nella conversazione; Invio su uno dei tuoi messaggi lo
  modifica, o lo ripropone, in un ramo che inizia prima di esso, e `b` crea un ramo dal messaggio con
  cui è iniziato il compito scelto, dopo il tuo consenso.
- `/branch` dirama la sessione così com'è, e dice quale sessione è il ramo; `/branch <n>` lo fa
  iniziare prima del tuo messaggio numero `n`, che finisce nel campo di scrittura del ramo.

Il rumbo che ha creato un ramo resta nella sua sessione, e un altro prosegue nel ramo: l'interfaccia
da terminale lo avvia e lo mostra, e altrove lo fa `rumbo -s <session>`. Un ramo si intitola "Branch"
seguito dal titolo della sessione da cui viene, così un elenco li distingue.

Un ramo copia solo la conversazione. rumbo non traccia i file, quindi i file restano come sono.

## Elencare, rinominare ed eliminare

```sh
rumbo sessions                          # the sessions started here, with how each stands
rumbo sessions -all                     # those of every directory
rumbo sessions -json                    # the same, for a program to read
rumbo sessions rename <session> <title> # a title of your own
rumbo sessions rm <session>...          # delete sessions and their history
rumbo sessions prune 30d                # list those not used in 30 days; -yes deletes them
```

Una sessione che un processo rumbo sta usando non viene mai eliminata. Nell'interfaccia da terminale,
`/sessions` elenca le sessioni della cartella, `/rename` dà un titolo alla sessione mostrata, e
`/delete [session]` la elimina, o elimina quella nominata, dopo il tuo consenso. La
sessione in cui è stato avviato rumbo resta trattenuta finché non esci: eliminala dopo, con
`rumbo sessions rm`.

## Compattazione

Quando una conversazione si avvicina al limite di contesto del modello, rumbo chiede al modello di
riassumerla, e la richiesta successiva parte da quel riassunto. Questa è la compattazione. Avviene
all'80% del contesto che il provider dichiara, o a 150.000 token quando non lo dice;
l'[impostazione](/it/guides/configuration/#impostazioni-di-sistema) `compact_at` cambia la quota.
`/compact` riassume una sessione quando lo chiedi.

Ciò che c'era prima resta salvato nella sessione. Cambia solo la richiesta.

## Cosa contiene una sessione

Ogni sessione è una directory in `~/.local/share/rumbo/sessions/<id>/`:

- `session.json` dice cos'è e cosa ha scelto: il suo provider, il suo modello e le opzioni impostate per
  lei;
- `entries.jsonl` contiene la sua cronologia, una voce per riga, solo in aggiunta.

```sh
rumbo log <session>             # every entry, as JSON lines
rumbo request <session> [turn]  # the exact request a turn sent the provider
```

Ogni richiesta viene ricostruita solo dalle voci, quindi `rumbo request` stampa ciò che è stato
inviato, byte per byte. Questo fa di una sessione qualcosa che puoi analizzare: quando un'esecuzione è
andata male, puoi vedere esattamente cosa ha ricevuto il modello.

## Esportare

`/export` nell'interfaccia da terminale scrive la sessione come Markdown: ciò che è stato chiesto, ciò
che ha scritto il modello, ogni chiamata a uno strumento con la modifica fatta o l'inizio di ciò che ha
restituito, e com'è finita ogni esecuzione e quanto è durata. Scrive `rumbo-<session>.md` nella directory in cui lavora la
sessione, o nel percorso che indichi, e mai sopra un file esistente.
