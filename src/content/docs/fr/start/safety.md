---
title: Avant de le lancer
description: rumbo donne au modèle vos droits, sans bac à sable ni demandes de permission. Ce que cela implique, où vont vos données et comment exécuter en sécurité un travail auquel vous ne faites pas confiance.
---

rumbo n'a pas de système de permissions. C'est un choix, pas un manque : l'agent agit avec les droits
de l'utilisateur qui l'a lancé, et limiter ce qu'il peut faire est laissé à un bac à sable de votre
choix.

## Ce que le modèle peut faire

- **Il agit en votre nom.** Il lit, écrit et exécute des commandes en votre nom, sans demander et sans
  bac à sable.
- **Ce qu'il lit peut l'orienter.** L'`AGENTS.md` d'un projet, ses fichiers ou la sortie d'une
  commande peuvent contenir des instructions. Travaillez sur du code auquel vous ne faites pas
  confiance dans un conteneur ou une machine virtuelle.
- **Avec l'outil `computer` activé, il utilise votre écran.** Il prend des captures et utilise le
  pointeur et le clavier du bureau où tourne rumbo. L'outil est désactivé tant que vous ne
  l'[activez](/fr/guides/computer-use/) pas.

## Ce que rumbo garde

- **Les sessions gardent ce que le modèle a vu**, y compris les secrets dans la sortie des commandes,
  dans `~/.local/share/rumbo/sessions/`, lisible par vous seul.
- **Une clé d'API donnée au `/login` d'un fournisseur intégré** est gardée dans
  `~/.config/rumbo/credentials/` (`~/Library/Application Support/rumbo/credentials/` sur macOS),
  lisible par vous seul, et donc aussi par le modèle.
- **Un secret demandé par un fournisseur**, comme un code de connexion, va de l'interface au
  fournisseur et n'est enregistré nulle part, pas même dans la session.

## Ce qui atteint le réseau

rumbo lui-même ne contacte aucun serveur et n'a aucune télémétrie. Seuls vos fournisseurs et les
commandes du modèle atteignent le réseau.

## L'exécuter dans un bac à sable

Comme rumbo est un binaire unique qui garde son état dans des fichiers, il tourne dans l'isolation que
vous utilisez déjà : un conteneur, une machine virtuelle ou un compte utilisateur séparé. Donnez-lui
le projet, les identifiants de son fournisseur, et rien d'autre.
