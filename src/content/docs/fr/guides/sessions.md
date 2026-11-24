---
title: Sessions
description: Comment rumbo garde votre travail dans des sessions. Continuez-les, reprenez-les, créez des branches, renommez-les, exportez-les et supprimez-les, et rejouez la requête exacte envoyée au modèle par n'importe quel tour.
---

Une session est une conversation liée au répertoire où elle a commencé : chaque tâche que vous y donnez, ce que le modèle a
répondu et chaque appel d'outil avec son résultat. rumbo la garde comme une liste d'entrées en ajout
seul, ce qui vous permet de la continuer, de la reprendre après un échec, d'en créer une branche et de
rejouer n'importe quelle requête qu'elle a envoyée.

## À quel répertoire appartient une session

Une session appartient au répertoire dans lequel rumbo a démarré, sa racine, et y travaille d'où que
vous la continuiez. rumbo ne cherche pas de dépôt Git autour : démarrée dans un sous-répertoire, la
session est celle de ce sous-répertoire et ne lit que ses [instructions](/fr/guides/instructions-and-skills/).
Démarrez rumbo à la racine d'un dépôt pour travailler avec son guide.

## Continuer et reprendre

```sh
rumbo -c "also document it"       # continue the latest session started here
rumbo -s <session> "and test it"  # continue a given one
rumbo -r                          # resume the unfinished run of the latest session
```

Une exécution qui a échoué, a été annulée ou a été interrompue parce que son processus est mort reste
inachevée. La reprendre indique au modèle que l'exécution a été interrompue, ferme avec une erreur les
appels d'outils qui ne se sont jamais terminés et continue sans nouvelle tâche.

Chaque exécution se termine par une note dans la session qui dit comment elle s'est terminée : faite,
échouée ou annulée. Un échec n'est jamais seulement à l'écran.

## Un rumbo, une session

Chaque `rumbo` que vous démarrez travaille dans une session, avec son propre fournisseur et ses propres
extensions, comme un processus à part. Une autre session est un autre `rumbo` : démarrez-en un pour
une nouvelle session, `rumbo -c` pour la dernière du répertoire, ou `rumbo -s <session>` pour
n'importe laquelle. Plusieurs tournent côte à côte.

L'[interface en terminal](/fr/guides/terminal-ui/) affiche plusieurs sessions en démarrant un rumbo
pour chacune que vous ouvrez : une exécution continue dans sa session pendant que vous en regardez une
autre, et la barre latérale vous prévient quand elle se termine. Pendant qu'une exécution travaille, ce
que vous tapez atteint le modèle avant sa requête suivante, sans l'arrêter.

## Créer une branche

Une branche est une nouvelle session qui commence par une copie d'une autre, telle qu'elle est ou
telle qu'elle était avant l'un de vos messages, et continue à partir de là. La session d'origine reste
telle quelle, et peut continuer à travailler en même temps.

- Dans l'interface en terminal, Maj-Tab remonte dans la conversation ; Entrée sur l'un de vos messages
  le modifie, ou le repose, dans une branche qui commence avant lui.
- `/branch` crée une branche de la session telle qu'elle est, et dit quelle session est la branche.

Le rumbo qui a créé une branche reste dans sa session, et un autre continue dans la branche :
l'interface en terminal le démarre et l'affiche, et ailleurs `rumbo -s <session>` le fait. Une branche
s'intitule « Branch » suivi du titre de la session d'origine, pour qu'une liste les distingue.

Une branche ne copie que la conversation. rumbo ne suit pas les fichiers, donc les fichiers restent
tels quels.

## Lister, renommer et supprimer

```sh
rumbo sessions                          # the sessions started here, with how each stands
rumbo sessions -all                     # those of every directory
rumbo sessions -json                    # the same, for a program to read
rumbo sessions rename <session> <title> # a title of your own
rumbo sessions rm <session>...          # delete sessions and their history
rumbo sessions prune 30d                # list those not used in 30 days; -yes deletes them
```

Une session utilisée par un processus rumbo n'est jamais supprimée. Dans l'interface en terminal,
`/rename` donne un titre à la session affichée, et `/delete` la supprime une fois que vous êtes
d'accord. La session dans laquelle rumbo a démarré est retenue jusqu'à ce que vous quittiez :
supprimez-la ensuite, avec `rumbo sessions rm`.

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
