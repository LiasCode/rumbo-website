---
title: Ligne de commande
description: Toutes les commandes et options de rumbo. Lancez des tâches, continuez et reprenez des sessions, et gérez sessions, réglages, fournisseurs et interfaces depuis le shell.
---

`rumbo help` affiche cette liste, et chaque groupe de commandes affiche la sienne quand on le lance sans
arguments, comme `rumbo provider`. Les descriptions des blocs ci-dessous sont celles qu'affiche rumbo,
en anglais.

## Lancer des tâches

```text
rumbo [flags] [objective]      work in the current directory, in a front end
rumbo serve [flags]            be the host for a front end on stdin/stdout
```

| Option              | Effet                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `-c`                | Continuer la dernière session démarrée dans ce répertoire                                                                                  |
| `-r`                | Reprendre l'exécution inachevée de cette session, sans nouvelle tâche                                                                      |
| `-s <session>`      | Continuer la session indiquée                                                                                                              |
| `-p <provider>`     | Fournisseur de la session (par défaut : le réglage `default_provider`)                                                                     |
| `-m <model>`        | Modèle de la session (par défaut : le modèle réglé pour son fournisseur)                                                                   |
| `-o <name>=<value>` | Une option du fournisseur pour la session, comme `-o effort=high` ; peut être répétée, et une valeur vide la ramène à celle du fournisseur |
| `-f <name>`         | Interface pour ce lancement (par défaut : le réglage `frontend` ; sinon `tui` dans un terminal, ou `plain`)                                |

La session garde ce que choisissent `-p`, `-m` et `-o`, par-dessus les réglages du système. Chaque
`rumbo` travaille dans une session ; une autre session est un autre `rumbo`.

## Sessions

```text
rumbo sessions [-all] [-json]             list the sessions of this directory, or of every one;
                                          with -json, for a program to read
rumbo sessions rename <session> <title>   give a session a title of your own
rumbo sessions rm <session>...            delete sessions and their history
rumbo sessions prune [-all] [-yes] <age>  delete the sessions not used in that long, such as
                                          12h, 30d, or 2w; without -yes, only list them
rumbo log <session>                       print a session's entries as JSON lines
rumbo request <session> [turn]            print the request a turn sent the provider, as it was
                                          sent; without a turn, the last one
```

Les sessions utilisées par un processus rumbo ne sont pas supprimées. Voir [sessions](/fr/guides/sessions/).

## Réglages

```text
rumbo config                              what is chosen and what applies, each value with
                                          where it comes from
rumbo system                              every system setting, its value, and where it comes from
rumbo system set <name>=<value>...        an empty value gives one back to its default
rumbo skills                              the skills the model is told of here, and those left out
```

Voir la [configuration](/fr/guides/configuration/).

## Fournisseurs

```text
rumbo provider list                                the providers there are, built in and yours
rumbo provider show <name>                         start it, and say each setting, where its value
                                                   comes from, and what it offers
rumbo provider models <name>                       the models it offers, asking it
rumbo provider set <name> <setting>=<value>...     its model, a field of its configuration, or one
                                                   of its options; an empty value gives one back
                                                   to its default
rumbo provider add [-config <json>] <name> <command>...
rumbo provider rm <name>                           remove one you added, or what you set for a
                                                   built-in one
```

Un fournisseur est tout programme qui parle l'Agent Provider Protocol sur son stdin et son stdout.
`{self}` comme commande désigne l'exécutable de rumbo. Voir
[modèles et fournisseurs](/fr/guides/providers/).

## Interfaces

```text
rumbo frontend list                                the front ends there are, built in and yours
rumbo frontend show <name>                         how it is started, and what is set for it
rumbo frontend set <name> <field>=<value>...       a field of its configuration, checked when it
                                                   starts; an empty value gives one back to its
                                                   default
rumbo frontend add [-config <json>] <name> <command>...
rumbo frontend rm <name>                           remove one you added, or what you set for a
                                                   built-in one
```

Une interface est tout programme qui parle l'Agent Frontend Protocol sur les descripteurs de fichier 3
(lecture) et 4 (écriture), et garde le terminal sur stdin et stdout. Voir
[écrire une interface](/fr/extend/front-end/).

## Programmes intégrés et version

```text
rumbo provide <name>           run a built-in provider on stdin/stdout
rumbo attach <name>            run a built-in front end on descriptors 3/4
rumbo extend mcp [command...]  run the built-in MCP extension on stdin/stdout
rumbo version                  print the version
```

`provide` et `attach` sont la façon dont rumbo démarre ses propres fournisseurs et interfaces, via les
mêmes protocoles que n'importe quels autres.

## Extensions et MCP

```text
rumbo extension list
rumbo extension show <name>
rumbo extension add [-config <json>] [-replaces <tools>] <name> <command>...
rumbo extension set <name> <field>=<value>...
rumbo extension rm <name>
```

[Extensions et MCP](/fr/guides/extensions/)

## Plugins

```text
rumbo plugin list
rumbo plugin show <name>
rumbo plugin add [-replaces <tools>] <source>
rumbo plugin update <name>
rumbo plugin rm <name>
```

[Plugins](/fr/guides/plugins/)
