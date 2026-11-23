---
title: Qu'est-ce que rumbo ?
description: rumbo est un harnais d'agents minimal et open source. Il donne au modèle quatre outils et un prompt système court, et garde le modèle et l'interface comme des programmes distincts que vous pouvez remplacer.
---

rumbo est un harnais d'agents minimal. Donnez-lui une tâche, et il travaille avec quatre outils,
`read`, `write`, `edit` et `bash`, plus un cinquième qui utilise l'écran si vous l'activez, jusqu'à ce
que le modèle ait fini. Les modèles derrière lui et les interfaces devant lui sont des programmes
distincts que vous pouvez remplacer.

Il n'est pas lié à la programmation. Il ne connaît aucun type de travail : il fait ce que demandent
votre tâche et vos [instructions](/fr/guides/instructions-and-skills/), qu'il s'agisse de corriger un
test qui échoue, de résumer un dossier de notes ou de piloter un programme de bureau.

## Les trois parties

- **L'hôte** est rumbo lui-même. Il possède les sessions, les outils et la boucle : il demande le
  message suivant à un fournisseur, exécute les outils que le modèle appelle et recommence jusqu'à ce
  que le modèle n'en appelle plus. Il n'affiche rien et ne connaît aucune API de modèle.
- **Un fournisseur** atteint un modèle. rumbo intègre des fournisseurs pour l'API d'Anthropic, les API
  d'OpenAI, un abonnement ChatGPT et tout serveur compatible avec Chat Completions, y compris les
  serveurs locaux. Voir [modèles et fournisseurs](/fr/guides/providers/).
- **Une interface** (front end) est ce que vous utilisez : l'[interface en terminal](/fr/guides/terminal-ui/),
  une sortie en texte brut pour les [scripts et pipes](/fr/guides/scripting/),
  l'[application de bureau](/fr/guides/desktop-app/) ou une que vous écrivez.

Les fournisseurs et les interfaces parlent un petit protocole JSON-RPC avec l'hôte sur stdio, comme le
Language Server Protocol entre éditeurs et langages. Ceux intégrés traversent les mêmes protocoles que
ceux que vous [écrivez vous-même](/fr/extend/provider/), donc tout ce qu'ils peuvent faire, les vôtres
le peuvent aussi.

## Ce qui le distingue

- **Un historique rejouable.** Une session est un journal en ajout seul, une entrée par ligne dans un
  fichier que vous pouvez lire. Chaque requête envoyée au modèle peut être reconstruite à partir de lui
  (`rumbo request` l'affiche), une exécution qui a échoué ou a été interrompue reprend là où elle
  s'est arrêtée (`rumbo -r`), et `/branch` repart d'avant n'importe lequel de vos messages dans une
  nouvelle session, tandis que la première reste telle quelle.
- **Conçu pour le cache du fournisseur.** Chaque requête prolonge la précédente jusqu'à ce qu'un
  résumé recommence la conversation, si bien que le fournisseur peut la lire depuis son cache.
- **Un hôte, plusieurs sessions.** Les exécutions continuent dans d'autres sessions pendant que vous
  travaillez dans une nouvelle, et vous pouvez dire quelque chose à une exécution sans l'arrêter.
- **Les fournisseurs se décrivent eux-mêmes.** Leurs modèles, options et fonctions, jusqu'à une
  connexion qui vous demande un code, apparaissent dans chaque interface sans que l'interface les
  connaisse.
- **Petit et généraliste.** Un prompt système court et fixe, rien sur aucun langage ni framework, et
  aucune télémétrie.

## D'où il vient

- **[pi](https://pi.dev)**, le harnais d'agents minimal lancé par Mario Zechner, pour ce qu'un harnais
  laisse de côté. Comme pi, rumbo donne au modèle quatre outils et un prompt système court, et n'a ni
  mode plan, ni sous-agents, ni demandes de permission.
- **Le [Language Server Protocol](https://microsoft.github.io/language-server-protocol/)**, pour la
  façon dont les parties se rejoignent. Les interfaces et les fournisseurs sont des programmes qui
  parlent JSON-RPC avec l'hôte, décrivent leurs options et fonctions au démarrage et peuvent être
  écrits dans n'importe quel langage.

## Étapes suivantes

- [Installez rumbo](/fr/start/installation/) et [lancez votre première tâche](/fr/start/quick-start/).
- Lisez [avant de le lancer](/fr/start/safety/) : rumbo agit avec vos droits, sans bac à sable.
- Découvrez [pourquoi rumbo est conçu ainsi](/fr/concepts/design/).
