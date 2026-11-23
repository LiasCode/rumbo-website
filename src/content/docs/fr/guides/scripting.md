---
title: Scripts et pipes
description: Lancez rumbo depuis des scripts, des tâches cron et la CI. L'interface plain affiche le texte du modèle sur stdout et la progression sur stderr, et sort avec un code qu'un script peut vérifier.
---

Quand l'entrée ou la sortie de rumbo n'est pas un terminal, ou que vous le demandez avec `-f plain`, il
utilise l'interface `plain` : aucun écran à dessiner, le texte du modèle sur stdout et un code de
sortie.

```sh
rumbo "summarize notes.md" > summary.txt
cat task.md | rumbo                               # the whole input is the task
rumbo -c -f plain "now list what is still missing"
```

## Ce qui va où

- **stdout** reçoit le texte du modèle, et rien d'autre.
- **stderr** reçoit la progression, la session et les tokens dépensés.

Ainsi, `> fichier` garde la réponse, et la progression reste à l'écran.

## La tâche

`plain` prend la tâche de la ligne de commande ; sans tâche, toute l'entrée redirigée est la tâche.
Quand l'entrée est un terminal, il lit les tâches ligne par ligne, chacune étant une exécution à part.

Une tâche donnée en ligne de commande l'emporte sur l'entrée redirigée, qui n'est alors pas lue. Pour
que le modèle travaille sur quelque chose, nommez-le dans la tâche, et le modèle le lira avec ses
outils :

```sh
rumbo "review the changes in git diff HEAD~1 and list what is risky"
```

## Codes de sortie

| Code  | L'exécution                            |
| ----- | -------------------------------------- |
| `0`   | est terminée                           |
| `1`   | a échoué                               |
| `130` | a été annulée, par exemple avec Ctrl-C |

## Les sessions dans les scripts

Une exécution scriptée est une session comme une autre : `rumbo -c` la continue, `rumbo -r` la reprend
si elle a été interrompue, et `rumbo log` et `rumbo request` montrent ce qu'elle a fait et ce qu'elle a
envoyé. Réglez `max_turns` pour borner la durée d'une exécution :

```sh
rumbo system set max_turns=50
```

## Piloter rumbo depuis un programme

Pour piloter rumbo depuis votre propre programme plutôt que depuis un shell, lancez `rumbo serve` et
parlez l'[Agent Frontend Protocol](/fr/reference/frontend-protocol/) sur son stdin et son stdout. Voir
[écrire une interface](/fr/extend/front-end/).
