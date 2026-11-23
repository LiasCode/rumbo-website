---
title: Démarrage rapide
description: Choisissez un modèle, lancez votre première tâche avec rumbo, ouvrez l'interface en terminal, et continuez ou reprenez une session.
---

Cette page vous mène d'un `rumbo` installé à une tâche terminée. Si vous ne l'avez pas encore
installé, voir l'[installation](/fr/start/installation/).

## 1. Choisir un fournisseur et un modèle

Un fournisseur est la façon dont rumbo atteint un modèle. Avec une clé d'API Anthropic :

```sh
export ANTHROPIC_API_KEY=...                         # or /login in the terminal UI, or `ant auth login`
rumbo system set default_provider=anthropic          # what new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # and the model they start with there
```

Pour un abonnement ChatGPT au lieu d'une clé d'API, un modèle local ou OpenAI, voir
[modèles et fournisseurs](/fr/guides/providers/).

## 2. Lui donner une tâche

Allez dans le projet sur lequel vous voulez travailler, et donnez une tâche à rumbo :

```sh
cd ~/code/my-project
rumbo "add a --json flag to the export command"
```

rumbo ouvre l'interface en terminal, et le modèle travaille avec ses outils jusqu'à ce qu'il cesse de
les appeler. Chaque appel d'outil s'affiche pendant qu'il s'exécute, et l'exécution se termine par une
ligne qui indique comment elle s'est terminée, combien de temps elle a pris et les tours et tokens
utilisés.

:::caution
Le modèle lit, écrit et exécute des commandes en votre nom, sans demander. Lisez d'abord
[avant de le lancer](/fr/start/safety/).
:::

## 3. Continuer

```sh
rumbo                                            # the terminal UI; /help lists its commands
rumbo -c "also document it"                      # continue the latest session
rumbo -r                                         # resume a run that stopped
rumbo "summarize notes.md" > summary.txt         # piped: plain text out, exit code
```

`rumbo` seul ouvre l'interface en terminal en plein écran : les sessions du projet dans une barre
latérale, la conversation et, en dessous, une zone de saisie avec le modèle et le remplissage de son
contexte. Ctrl-P ouvre toutes les commandes. Voir le guide de l'[interface en terminal](/fr/guides/terminal-ui/).

## 4. Lui dire comment vous travaillez

Le modèle lit vos instructions : les fichiers `AGENTS.md` ou `CLAUDE.md` de la racine du projet jusqu'à
l'endroit où vous êtes, et les vôtres dans `~/.config/rumbo/`. Écrivez-y comment le travail doit être
fait, et ce qu'il faut vérifier avant de le considérer comme terminé. Voir
[instructions et skills](/fr/guides/instructions-and-skills/).

## Ensuite

- [Sessions](/fr/guides/sessions/) : continuez, reprenez, créez des branches et exportez votre travail.
- [Configuration](/fr/guides/configuration/) : tous les réglages, modifiés de la même façon.
- [Ligne de commande](/fr/reference/command-line/) : toutes les commandes et options.
