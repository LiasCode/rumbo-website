---
title: Questions fréquentes
sidebar:
  label: FAQ
description: Réponses sur rumbo. S'il est gratuit, quels modèles il prend en charge, s'il fonctionne avec des modèles locaux ou sous Windows, s'il peut utiliser un abonnement Claude ou ChatGPT, et comment il se compare à d'autres agents.
---

## rumbo est-il gratuit ?

Oui. rumbo est open source sous licence MIT, et n'a ni compte, ni serveur à lui, ni télémétrie. Vous
ne payez que le fournisseur de votre modèle, ou rien avec un modèle local.

## Est-ce un agent de programmation ?

C'est un harnais d'agents généraliste. Vous pouvez l'utiliser pour écrire et modifier du code, puisqu'un
shell et quatre outils de fichiers atteignent tout ce dont un projet a besoin. Mais rien dans rumbo ne
concerne la programmation : il fait ce que demandent votre tâche et vos instructions, comme résumer des
notes, trier des fichiers ou piloter un programme de bureau avec l'[outil `computer`](/fr/guides/computer-use/).

## Avec quels modèles fonctionne-t-il ?

Claude via l'API d'Anthropic, les modèles d'OpenAI via ses API, les modèles d'un abonnement ChatGPT et
tout serveur compatible avec Chat Completions d'OpenAI. Tout autre modèle fonctionne via un
[fournisseur que vous écrivez](/fr/extend/provider/). Voir [modèles et fournisseurs](/fr/guides/providers/).

## Puis-je l'utiliser avec un modèle local ?

Oui. Enregistrez votre serveur, comme Ollama, le serveur de llama.cpp ou vLLM, comme fournisseur avec
son adresse, et choisissez l'un de ses modèles. Voir
[modèles locaux et autres serveurs](/fr/guides/providers/#modèles-locaux-et-autres-serveurs).

## Puis-je utiliser mon abonnement ChatGPT ou Claude ?

Le fournisseur intégré `chatgpt` peut se connecter avec un abonnement ChatGPT. Le fournisseur intégré `anthropic` utilise une clé API, pas un abonnement Claude. Le plugin externe [rumbo-claude](https://github.com/LiasCode/rumbo-claude) documente sa compatibilité, sa procédure de connexion et ses limites.

## Fonctionne-t-il sous Windows ?

Non. rumbo fonctionne sous Linux et macOS.

## Demande-t-il avant d'exécuter une commande ?

Non. rumbo n'a pas de demandes de permission : l'agent agit avec vos droits. Lancez-le dans un
conteneur ou une machine virtuelle pour un travail auquel vous ne faites pas confiance. Voir
[avant de le lancer](/fr/start/safety/).

## Puis-je annuler ce que l'agent a fait à mes fichiers ?

Pas avec rumbo : une session garde la conversation, pas le disque. Utilisez votre gestion de versions.
Ctrl-G dans l'interface en terminal, et le panneau Changes de l'application de bureau, montrent ce que
Git voit changé.

## Où sont mes sessions ?

Chacune est un répertoire dans `~/.local/share/rumbo/sessions/`, avec son historique dans
`entries.jsonl`, une entrée par ligne. Voir [sessions](/fr/guides/sessions/#ce-que-contient-une-session).

## Comment se compare-t-il à d'autres agents ?

rumbo suit [pi](https://pi.dev) dans ce qu'un harnais laisse de côté : quatre outils, un prompt système
court, et ni mode plan, ni sous-agents, ni demandes de permission. Ce qu'il ajoute tient à la façon dont
les pièces se rejoignent : les modèles et les interfaces sont des programmes distincts sur des
protocoles ouverts, toute session rejoue chaque requête qu'elle a envoyée, et un même hôte fait tourner
plusieurs sessions à la fois. Voir [conception](/fr/concepts/design/).

## Puis-je l'utiliser depuis mon éditeur ?

Tout programme qui parle l'[Agent Frontend Protocol](/fr/reference/frontend-protocol/) peut piloter
rumbo, en démarrant `rumbo serve`, comme le ferait une extension d'éditeur. Voir
[écrire une interface](/fr/extend/front-end/).

## Comment signaler un bug ou demander une fonctionnalité ?

Ouvrez une issue sur [GitHub](https://github.com/LiasCode/rumbo/issues).
