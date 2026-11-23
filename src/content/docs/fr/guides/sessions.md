---
title: Sessions
description: Comment rumbo garde votre travail dans des sessions. Continuez-les, reprenez-les, créez des branches, renommez-les, exportez-les et supprimez-les, et rejouez la requête exacte envoyée au modèle par n'importe quel tour.
---

Une session est une conversation liée à un projet : chaque tâche que vous y donnez, ce que le modèle a
répondu et chaque appel d'outil avec son résultat. rumbo la garde comme une liste d'entrées en ajout
seul, ce qui vous permet de la continuer, de la reprendre après un échec, d'en créer une branche et de
rejouer n'importe quelle requête qu'elle a envoyée.

## Projets

Un projet est la racine d'un dépôt Git, ou le répertoire lui-même en dehors d'un dépôt. Les sessions
appartiennent au projet et se retrouvent depuis n'importe quel répertoire à l'intérieur ; une session
travaille toujours dans le répertoire où elle a commencé.

## Continuer et reprendre

```sh
rumbo -c "also document it"       # continue the latest session of this project
rumbo -s <session> "and test it"  # continue a given one
rumbo -r                          # resume the unfinished run of the latest session
```

Une exécution qui a échoué, a été annulée ou a été interrompue parce que son processus est mort reste
inachevée. La reprendre indique au modèle que l'exécution a été interrompue, ferme avec une erreur les
appels d'outils qui ne se sont jamais terminés et continue sans nouvelle tâche.

Chaque exécution se termine par une note dans la session qui dit comment elle s'est terminée : faite,
échouée ou annulée. Un échec n'est jamais seulement à l'écran.

## Plusieurs sessions à la fois

Un même rumbo travaille dans plusieurs sessions d'un projet à la fois, une exécution par session. Dans
l'[interface en terminal](/fr/guides/terminal-ui/), une exécution continue dans sa session pendant que
vous en ouvrez une autre, et la barre latérale vous prévient quand elle se termine. Pendant qu'une
exécution travaille, ce que vous tapez atteint le modèle avant sa requête suivante, sans l'arrêter.

`-single` fait travailler rumbo dans une seule session à la fois.

## Créer une branche

Une branche est une nouvelle session qui commence par une copie d'une autre, telle qu'elle est ou
telle qu'elle était avant l'un de vos messages, et continue à partir de là. La session d'origine reste
telle quelle, et peut continuer à travailler en même temps.

- Dans l'interface en terminal, Maj-Tab remonte dans la conversation ; Entrée sur l'un de vos messages
  le modifie, ou le repose, dans une branche qui commence avant lui.
- `/branch` crée une branche de la session telle qu'elle est.

Une branche ne copie que la conversation. rumbo ne suit pas les fichiers, donc les fichiers restent
tels quels.

## Lister, renommer et supprimer

```sh
rumbo sessions                          # this project's sessions, with how each stands
rumbo sessions -all                     # every project's
rumbo sessions rename <session> <title> # a title of your own
rumbo sessions rm <session>...          # delete sessions and their history
rumbo sessions prune 30d                # list those not used in 30 days; -yes deletes them
```

Une session utilisée par un processus rumbo n'est jamais supprimée. Dans l'interface en terminal,
`/rename`, `/delete` et `/prune` font de même, et la suppression demande d'abord votre accord.

## Compactage

Quand une conversation approche de la limite de contexte du modèle, rumbo demande au modèle de la
résumer, et la requête suivante part de ce résumé. C'est le compactage. Il a lieu à 80 % du contexte
que le fournisseur annonce, ou à 150 000 tokens quand il ne le dit pas ; le
[réglage](/fr/guides/configuration/#réglages-du-système) `compact_at` change la proportion. `/compact`
résume une session quand vous le demandez.

Ce qui précède reste enregistré dans la session. Seule la requête change.

## Ce que contient une session

Chaque session est un répertoire dans `~/.local/share/rumbo/sessions/<id>/` :

- `session.json` dit ce qu'elle est et ce qu'elle a choisi : son fournisseur, son modèle et les options
  réglées pour elle ;
- `entries.jsonl` contient son historique, une entrée par ligne, uniquement par ajout.

```sh
rumbo log <session>             # every entry, as JSON lines
rumbo request <session> [turn]  # the exact request a turn sent the provider
```

Chaque requête est reconstruite à partir des seules entrées, donc `rumbo request` affiche ce qui a été
envoyé, octet par octet. Cela fait d'une session quelque chose que vous pouvez déboguer : quand une
exécution a mal tourné, vous pouvez voir exactement ce que le modèle a reçu.

## Exporter

`/export` dans l'interface en terminal écrit la session en Markdown : ce qui a été demandé, ce que le
modèle a écrit, chaque appel d'outil avec le changement qu'il a fait ou le début de ce qu'il a renvoyé,
et comment chaque exécution s'est terminée. Il écrit `rumbo-<session>.md` dans le répertoire où
travaille la session, ou au chemin que vous indiquez, et jamais par-dessus un fichier existant.
