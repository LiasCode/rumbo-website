---
title: Riga di comando
description: Tutti i comandi e le opzioni di rumbo. Esegui compiti, continua e riprendi sessioni, e gestisci sessioni, impostazioni, provider e interfacce dalla shell.
---

`rumbo help` stampa questo elenco, e ogni gruppo di comandi stampa il suo con `help`, come
`rumbo provider help`. Le descrizioni nei blocchi qui sotto sono quelle che stampa rumbo, in
inglese.

## Eseguire compiti

```text
rumbo [flags] [objective]
    work in the current directory, in a front end
rumbo serve [flags]
    be the host for a front end on stdin/stdout
```

| Opzione             | Cosa fa                                                                                                                             |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `-c`                | Continuare l'ultima sessione avviata in questa directory                                                                            |
| `-r`                | Riprendere l'esecuzione incompiuta di quella sessione, senza un nuovo compito                                                       |
| `-s <session>`      | Continuare la sessione indicata                                                                                                     |
| `-p <provider>`     | Provider della sessione (predefinito: l'impostazione `default_provider`)                                                            |
| `-m <model>`        | Modello della sessione (predefinito: il modello impostato per il suo provider)                                                      |
| `-o <name>=<value>` | Un'opzione del provider per la sessione, come `-o effort=high`; si può ripetere, e un valore vuoto la riporta a quella del provider |
| `-f <name>`         | Interfaccia per questo avvio (predefinita: l'impostazione `frontend`; altrimenti `tui` in un terminale, o `plain`)                  |

La sessione conserva ciò che scelgono `-p`, `-m` e `-o`, sopra le impostazioni di sistema. Ogni
`rumbo` lavora in una sessione; un'altra sessione è un altro `rumbo`.

## Sessioni

```text
rumbo sessions [-all] [-json]
    list the sessions of this directory, or of every one; with -json, for a
    program to read
rumbo sessions rename <session> <title>
    give a session a title of your own
rumbo sessions rm <session>...
    delete sessions and their history
rumbo sessions prune [-all] [-yes] <age>
    delete the sessions not used in that long, such as 12h, 30d, or 2w;
    without -yes, only list them
rumbo log <session>
    print a session's entries as JSON lines
rumbo request <session> [turn]
    print the request a turn sent the provider, as it was sent; without a
    turn, the last one
```

Le sessioni usate da un processo rumbo non vengono eliminate. Vedi [sessioni](/it/guides/sessions/).

## Impostazioni

```text
rumbo config
    what is chosen and what applies, each value with where it comes from
rumbo system
    every system setting, its value, and where it comes from
rumbo system set <name>=<value>...
    an empty value gives one back to its default
rumbo skills
    list the skills the model is told of here, and those left out
```

Vedi la [configurazione](/it/guides/configuration/).

## Provider

```text
rumbo provider list
    the providers there are: rumbo's, plugins', and yours
rumbo provider show <name>
    start it, and say each setting, where its value comes from, and what it
    offers
rumbo provider models <name>
    the models it offers, asking it
rumbo provider set <name> <setting>=<value>...
    its model, a field of its configuration, or one of its options; an empty
    value gives one back to its default
rumbo provider add [-config <json>] <name> <command>...
rumbo provider rm <name>
    remove yours, or what you set for rumbo's or a plugin's
```

Un provider è qualsiasi programma che parla l'Agent Provider Protocol sul suo stdin e stdout. `{self}`
come comando sta per l'eseguibile di rumbo. Vedi [modelli e provider](/it/guides/providers/).

## Interfacce

```text
rumbo frontend list
    the front ends there are: rumbo's, plugins', and yours
rumbo frontend show <name>
    how it is started, and what is set for it
rumbo frontend set <name> <field>=<value>...
    a field of its configuration, checked when it starts; an empty value
    gives one back to its default
rumbo frontend add [-config <json>] <name> <command>...
rumbo frontend rm <name>
    remove yours, or what you set for rumbo's or a plugin's
```

Un'interfaccia è qualsiasi programma che parla l'Agent Frontend Protocol sui descrittori di file 3
(lettura) e 4 (scrittura), o su Windows sui due handle che indica `RUMBO_FRONTEND_HANDLES`, e
mantiene il terminale su stdin e stdout. Vedi
[scrivere un'interfaccia](/it/extend/front-end/).

## Programmi integrati e versione

```text
rumbo provide <name>
    run a provider of rumbo's own plugin on stdin/stdout
rumbo attach <name>
    run plain, or a front end of rumbo's own plugin, on descriptors 3/4
    (handles on Windows)
rumbo extend mcp [command...]
    run rumbo's own plugin's extension for an MCP server on stdin/stdout
rumbo version
    print the version
```

`provide` e `attach` sono il modo in cui rumbo avvia i propri provider e le proprie interfacce, tramite
gli stessi protocolli di qualsiasi altro.

## Estensioni e MCP

```text
rumbo extension list
    the extensions you added
rumbo extension show <name>
    start it, and say what is set for it and the tools it gives the model
rumbo extension set <name> <field>=<value>...
    a field of its configuration, or replaces, the tools of rumbo's own it
    takes the place of, checked by starting it; an empty value gives one
    back
rumbo extension add [-config <json>] [-replaces <tools>] <name> <command>...
rumbo extension rm <name>
    remove one
```

Un'estensione è qualsiasi programma che parla l'Agent Extension Protocol sul suo stdin e stdout. Il
plugin proprio di rumbo ne ha una per i server MCP, aggiunta una volta per ciascuno come
`{self} extend mcp <the server's command>`. Vedi [estensioni e MCP](/it/guides/extensions/).

## Plugin

```text
rumbo plugin list
    rumbo's own plugin, and those you added
rumbo plugin show <name>
    where it is, and what it brings
rumbo plugin add [-replaces <tools>] <source>
    a directory, or the address of a Git repository
rumbo plugin update <name>
    bring one added from an address up to date
rumbo plugin rm <name>
    take one out, with what you set for what it brought
```

Un plugin è una directory, o un repository Git, con un `plugin.yaml` che nomina i programmi che porta,
e le sue skill in `skills/`. Quello di rumbo, `rumbo`, è integrato e sempre presente. Vedi
[plugin](/it/guides/plugins/).
