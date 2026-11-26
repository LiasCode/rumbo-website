---
title: Qu'est-ce que rumbo ?
description: rumbo est un harnais d'agents minimal et open source. Il donne au modèle quatre outils et un prompt système court, et garde le modèle et l'interface comme des programmes distincts que vous pouvez remplacer.
---

rumbo est un harnais d'agents minimal. Donnez-lui une tâche, et il travaille avec quatre outils,
`read`, `write`, `edit` et `bash` (`powershell` sous Windows), plus un cinquième qui utilise l'écran si vous l'activez, jusqu'à ce
que le modèle ait fini. Les modèles derrière lui et les interfaces devant lui sont des programmes
distincts que vous pouvez remplacer.

Il n'est pas lié à la programmation. Il ne connaît aucun type de travail : il fait ce que demandent
votre tâche et vos [instructions](/fr/guides/instructions-and-skills/), qu'il s'agisse de corriger un
test qui échoue, de résumer un dossier de notes ou de piloter un programme de bureau.

## Ce qu'il apporte d'origine

rumbo s'utilise tel qu'il est installé. Un seul binaire apporte :

- **Une interface en terminal complète** : la conversation en Markdown, un éditeur qui accepte
  quelques commandes, les sessions dans une barre latérale et des panneaux. C'est ce qu'ouvre
  `rumbo`. Voir l'[interface en terminal](/fr/guides/terminal-ui/).
- **Trois fournisseurs** : `anthropic` pour Claude par l'API d'Anthropic, `openai` pour les API
  d'OpenAI et tout serveur compatible avec Chat Completions, y compris local, et `chatgpt` pour une
  offre ChatGPT. Voir [modèles et fournisseurs](/fr/guides/providers/).
- **Une interface en texte brut** pour les [scripts et pipes](/fr/guides/scripting/), et **une
  extension pour les serveurs MCP**, que vous ajoutez [une fois par serveur](/fr/guides/extensions/).

## Ce que vous pouvez ajouter

Deux autres sont publiés à part, comme [plugins](/fr/guides/plugins/) à ajouter si vous les voulez :

| Plugin                                                   | Ajoute                                                                                                                                                 |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [rumbo-claude](https://github.com/LiasCode/rumbo-claude) | Un fournisseur, `claude`, qui utilise un abonnement Claude Pro ou Max. Ce n'est pas une intégration officielle d'Anthropic : lisez d'abord son README. |
| [rumbo-gui](https://github.com/LiasCode/rumbo-gui)       | Une interface, `gui` : une [fenêtre de bureau](/fr/guides/desktop-app/) pour rumbo. Il lui faut rumbo 0.10.0 ou 0.11.0, pas encore 0.12.0.             |

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-claude
rumbo plugin add https://github.com/LiasCode/rumbo-gui
```

rumbo compile un plugin là où vous l'ajoutez : le premier demande donc Go sur votre machine, et le
second Rust.

## Créez les vôtres, et partagez-les

Ce que rumbo apporte est un point de départ, pas le produit. rumbo est fait pour que **vous écriviez
les pièces qui vous manquent**, dans n'importe quel langage, avec les mêmes protocoles que les
siennes :

- une [interface](/fr/extend/front-end/), pour votre façon de travailler : dans votre éditeur, dans
  un chat, sur une page web ;
- un [fournisseur](/fr/extend/provider/), pour le modèle que vous utilisez ;
- une [extension](/fr/extend/extension/), pour les outils dont votre travail a besoin ;
- un [plugin](/fr/reference/plugins/), pour les réunir avec vos skills.

Si vous voulez que d'autres aient ce que vous avez fait, mettez-le dans un dépôt Git sous forme de
plugin : chacun l'ajoute avec `rumbo plugin add <adresse>`.

## Les composants

- **L'hôte** est rumbo lui-même. Il possède les sessions, les outils et la boucle : il demande le
  message suivant à un fournisseur, exécute les outils que le modèle appelle et recommence jusqu'à ce
  que le modèle n'en appelle plus. Il n'affiche rien et ne connaît aucune API de modèle.
- **Un fournisseur** atteint un modèle. rumbo intègre des fournisseurs pour l'API d'Anthropic, les API
  d'OpenAI, un abonnement ChatGPT et tout serveur compatible avec Chat Completions, y compris les
  serveurs locaux. Voir [modèles et fournisseurs](/fr/guides/providers/).
- **Une interface** (front end) est ce que vous utilisez : l'[interface en terminal](/fr/guides/terminal-ui/),
  une sortie en texte brut pour les [scripts et pipes](/fr/guides/scripting/),
  l'[application de bureau](/fr/guides/desktop-app/) ou une que vous écrivez.

Les fournisseurs et les interfaces parlent un petit protocole JSON-RPC avec l'hôte par des tubes, comme le
Language Server Protocol entre éditeurs et langages. Ceux intégrés traversent les mêmes protocoles que
ceux que vous [écrivez vous-même](/fr/extend/provider/), donc tout ce qu'ils peuvent faire, les vôtres
le peuvent aussi.

- [Extensions et MCP](/fr/guides/extensions/) — Ajoutez au modèle les outils de vos programmes ou de serveurs Model Context Protocol.
- [Plugins](/fr/guides/plugins/) — Installez et distribuez ensemble fournisseurs, interfaces, extensions et skills.

## Ce qui le distingue

- **Un historique rejouable.** Une session est un journal en ajout seul, une entrée par ligne dans un
  fichier que vous pouvez lire. Chaque requête envoyée au modèle peut être reconstruite à partir de lui
  (`rumbo request` l'affiche), une exécution qui a échoué ou a été interrompue reprend là où elle
  s'est arrêtée (`rumbo -r`), et `/branch` repart d'avant n'importe lequel de vos messages dans une
  nouvelle session, tandis que la première reste telle quelle.
- **Conçu pour le cache du fournisseur.** Chaque requête prolonge la précédente jusqu'à ce qu'un
  résumé recommence la conversation, si bien que le fournisseur peut la lire depuis son cache.
- **Un rumbo, une session.** Chaque session est un processus à part, avec son fournisseur et ses
  extensions, si bien que les exécutions avancent côte à côte, et vous pouvez dire quelque chose à une
  exécution sans l'arrêter.
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
