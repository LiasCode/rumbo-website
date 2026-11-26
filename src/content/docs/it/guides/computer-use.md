---
title: Controllo del desktop
description: Attiva lo strumento computer di rumbo perché il modello faccia screenshot e usi il puntatore e la tastiera del tuo desktop, su Hyprland, Sway, X11 o macOS.
---

Una shell avvia programmi, ma non può mostrare al modello ciò che disegnano né premere i loro pulsanti.
Lo strumento `computer` sì: il modello fa screenshot del desktop su cui gira rumbo e usa il suo
puntatore e la sua tastiera. È disattivato finché non lo attivi.

```sh
rumbo system set computer=on
```

> **Avvertenza**
>
> Con lo strumento attivo, il modello agisce su ciò che ha il focus, con il tuo puntatore e la tua
> tastiera. Leggi [prima di eseguirlo](/it/start/safety/), e dagli un desktop suo quando puoi.

## Di cosa ha bisogno

| Desktop                                  | Serve                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Compositor wlroots, come Hyprland e Sway | `grim`                                                                                                            |
| X11                                      | `xdotool`, e `maim` o ImageMagick                                                                                 |
| macOS                                    | Registrazione schermo, Accessibilità e Automazione di System Events, consentiti per il programma che esegue rumbo |

Su macOS lo strumento è scritto, ma non è ancora stato provato. Su Windows non c'è ancora uno schermo
su cui agire: con `computer=on` lo strumento lo dice.

## Come si comporta

- **Mostra il monitor in uso**, in screenshot di al massimo 1280×800, e riporta le coordinate del
  modello sullo schermo.
- **Agisce solo sullo schermo che il modello ha visto per ultimo.** Quando muovi tu il puntatore, o
  passi a un altro monitor, non fa più nulla finché il modello non fa un nuovo screenshot. Muovere il
  mouse è il modo per riprenderti il desktop.
- **La sua tastiera è americana**, qualunque sia il tuo layout, e scrive comunque i caratteri che a una
  tastiera del genere mancano.

## Quanto costa

Uno screenshot resta nella conversazione, come qualsiasi risultato di uno strumento, e viene inviato di
nuovo con ogni richiesta successiva: circa 1.400 token ogni volta, finché la conversazione non viene
compattata.

## Senza cedere il tuo desktop

Per tenere il modello lontano da ciò che stai facendo, dagli un display suo: uno Sway avviato con
`WLR_BACKENDS=headless` non mostra nulla sul tuo desktop, e un `Xwayland :N` in modalità rootful dà a X11
un server proprio. Esegui rumbo con quel display nel suo ambiente.
