---
title: Configuration
description: Configurez rumbo avec nom=valeur à trois niveaux, le système, un fournisseur et une session, le tout gardé dans un seul config.yaml que vous pouvez lire et modifier.
---

Chaque réglage de rumbo se modifie de la même façon, sous la forme `nom=valeur`, et une valeur vide le
ramène à sa valeur par défaut. Ce que vous réglez est gardé dans un seul fichier, `config.yaml`, qui ne
contient que vos choix.

```sh
rumbo config                     # everything that is set and what applies, with where each value comes from
rumbo system set computer=on     # a system setting
rumbo provider set openai effort=high
rumbo frontend set tui theme=plain
rumbo system set max_turns=      # an empty value: back to the default
```

Ce qu'un programme n'accepte pas est refusé avant d'être gardé : un nom qu'il n'a pas ou une valeur
qu'il n'admet pas.

## Trois niveaux

La configuration a trois niveaux, séparés :

- **Le système** est propre à rumbo, identique partout : quel fournisseur et quelle interface démarrer,
  et les limites d'une exécution.
- **Un fournisseur** a le modèle avec lequel démarre une nouvelle session qui l'utilise, et une
  configuration, qui contient aussi les valeurs de ses options.
- **Une session** garde ce qu'elle a choisi : son fournisseur, son modèle et des valeurs des options du
  fournisseur. Ce qu'une session a choisi l'emporte sur ce du fournisseur dans cette session.

Rien ne se règle par projet. Les réglages sont les mêmes dans tous les répertoires, et ce qui change
d'un travail à l'autre, c'est la session.

## Réglages du système

| Réglage            | Par défaut                            | Effet                                                                                     |
| ------------------ | ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `default_provider` | non réglé ; `-p` en choisit un        | Le fournisseur avec lequel démarre une nouvelle session, avec le modèle de ce fournisseur |
| `frontend`         | `tui` dans un terminal, sinon `plain` | L'interface à démarrer                                                                    |
| `max_turns`        | `150`                                 | Réponses du modèle après lesquelles une exécution s'arrête ; `0` pour aucune limite       |
| `max_tokens`       | la limite propre au fournisseur       | Limite de tokens de sortie par réponse                                                    |
| `compact_at`       | `80%`                                 | Part du contexte du modèle à laquelle la conversation est résumée ; `0%` pour jamais      |
| `computer`         | `off`                                 | `on` donne au modèle l'[outil `computer`](/fr/guides/computer-use/)                       |

```sh
rumbo system                     # the system settings, each with where its value comes from
rumbo system set compact_at=70%
```

Un réglage du système s'applique aux exécutions qui démarrent après son enregistrement, sans relancer
rumbo. `default_provider` et `frontend` s'appliquent au démarrage suivant.

## Réglages des fournisseurs et des interfaces

```sh
rumbo provider show anthropic              # its model, configuration, and options, with their defaults
rumbo provider set anthropic model=claude-opus-5-5 effort=high
rumbo frontend show tui
rumbo frontend set tui color_code=cyan
```

Les champs et options qu'accepte un programme sont sa propre décision, et il les annonce au démarrage ;
rumbo vérifie une valeur par rapport à cela, et démarre le programme avec le changement, avant de la
garder.

## Réglages de la session

```sh
rumbo -p openai -m <model> -o effort=low "a task"   # choose for a new session
```

Dans l'interface en terminal :

```text
/model openai/<model>     the provider and model of this session
/model effort=low         an option, for this session only
/model effort=            back to the provider's value
/settings                 what applies here, and where each value comes from
```

Une exécution garde ce avec quoi elle a démarré ; un changement s'applique à la suivante.

## Le fichier de configuration

`config.yaml` se trouve dans `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` sur macOS). Il
ne contient que vos choix, jamais de valeur par défaut, et vous pouvez le modifier : rumbo le change une
valeur à la fois et conserve vos commentaires.

```yaml
system:
  default_provider: anthropic
providers:
  anthropic:
    model: claude-opus-5-5
    config:
      effort: high # every session, unless it chooses another with -o
```

rumbo refuse de démarrer avec un réglage manquant, mal formé ou mal orthographié dans le fichier, et dit
où il se trouve, au lieu de deviner.

## Variables d'environnement

| Variable          | Ce qu'elle change                                                              |
| ----------------- | ------------------------------------------------------------------------------ |
| `RUMBO_CONFIG`    | Le fichier de configuration à utiliser à la place de `config.yaml`             |
| `RUMBO_DATA`      | Le répertoire des données de rumbo, qui contient les sessions                  |
| `XDG_CONFIG_HOME` | Répertoire de base de `rumbo/config.yaml` sous Linux                           |
| `XDG_DATA_HOME`   | Répertoire de base des données `rumbo/` sous Linux et macOS                    |
| `NO_COLOR`        | L'interface en terminal n'affiche pas de couleurs, avec son `theme` par défaut |

Les fournisseurs lisent les leurs, comme `ANTHROPIC_API_KEY` et `OPENAI_API_KEY`. Voir
[modèles et fournisseurs](/fr/guides/providers/).
