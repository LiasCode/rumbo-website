---
title: Plugin
description: Installa, ispeziona, aggiorna e rimuovi i plugin di rumbo, che riuniscono provider, interfacce, estensioni e skill da una cartella o da un repository Git.
---

Un plugin porta più cose insieme: provider, interfacce, estensioni e skill. È una cartella, o un repository Git, con un `plugin.yaml` che le nomina. Una volta aggiunto, ciò che porta è lì come ciò che rumbo ha di serie, e si imposta allo stesso modo.

## Aggiungerne uno

```sh
rumbo plugin add https://example.com/team/ink-plugin.git   # un repository Git, che rumbo copia
rumbo plugin add ~/code/ink-plugin                         # una cartella, usata dove si trova
```

Aggiungere un plugin lo compila, se il suo manifesto dice come, e poi avvia ogni provider e ogni estensione che porta, il che verifica che funzioni. Un plugin che non supera la prova non viene aggiunto. Poi rumbo dice cosa ha portato:

```text
added the plugin notes, which brings:
  the extension notes
  the skill meeting-notes
```

> La compilazione di un plugin e i suoi programmi vengono eseguiti come te, con i tuoi permessi. Aggiungi quelli del cui codice ti fidi.

## Vedere cosa hai

```sh
rumbo plugin list          # il plugin proprio di rumbo, e quelli che hai aggiunto
rumbo plugin show notes    # dove si trova, e cosa porta
rumbo plugin show rumbo    # ciò che arriva con rumbo: i suoi provider e la sua interfaccia da terminale
```

## Impostare ciò che ha portato

I programmi di un plugin si impostano come tutti gli altri, per tipo e per nome:

```sh
rumbo extension set notes <field>=<value>
rumbo provider set house-model model=<model>
rumbo frontend set panel <field>=<value>
```

Ciò che imposti prevale sulla configurazione data dal plugin. `rumbo skills` elenca le sue skill insieme alle tue.

## Aggiornare e rimuovere

```sh
rumbo plugin update notes   # un plugin aggiunto da Git: scarica, compila e lo prova di nuovo
rumbo plugin rm notes       # lo toglie, con ciò che hai impostato per quello che portava
```

Un aggiornamento che non compila più o non si avvia più torna a ciò che il plugin era. Un plugin aggiunto da una cartella viene letto così com'è ogni volta, quindi non c'è nulla da aggiornare. Rimuovere un plugin elimina la copia che rumbo conserva di un repository, e mai la tua cartella.

## Quando un plugin sostituisce uno strumento

Un'estensione di un plugin può chiedere di prendere il posto di uno strumento di rumbo, come `bash`. L'aggiunta del plugin allora si ferma e lo dice, e tu acconsenti nominando gli strumenti:

```sh
rumbo plugin add -replaces bash <source>
```

Un aggiornamento che chiede di sostituire più di quanto hai accettato viene rifiutato.

## Prossimi passi

- Il [manifesto di un plugin](/it/reference/plugins/) dice tutto ciò che un `plugin.yaml` può contenere.
- [`examples/plugin`](https://github.com/LiasCode/rumbo/tree/v0.9.0/examples/plugin) è uno da cui partire.
- L'[applicazione desktop](/it/guides/desktop-app/) è distribuita come plugin.
