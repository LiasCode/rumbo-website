---
title: Écrire un fournisseur
description: Reliez rumbo à n'importe quel modèle en écrivant un fournisseur, un programme dans n'importe quel langage qui répond à des requêtes JSON-RPC sur stdin et stdout avec l'Agent Provider Protocol.
---

Un fournisseur transforme une conversation en message suivant de l'assistant. C'est un programme à
part entière, dans n'importe quel langage, qui parle l'[Agent Provider Protocol](/fr/reference/provider-protocol/)
sur son stdin et son stdout. Les fournisseurs intégrés de rumbo sont servis de la même façon, donc le
vôtre n'a rien de moins.

Écrivez-en un pour atteindre une API de modèle que rumbo ne connaît pas, une passerelle d'entreprise, ou
un double de test qui répond à partir d'un script.

## Sa forme

Les messages sont des objets JSON-RPC 2.0, un par ligne. rumbo démarre le fournisseur comme processus
enfant et lui envoie :

1. **`initialize`** : le fournisseur répond avec la version `1` du protocole, son nom et sa
   configuration en vigueur, et peut décrire ses modèles, ses options et ses fonctions.
2. **`complete`**, une fois par tour : toute la conversation, les outils et les options. Le
   fournisseur répond avec le message suivant de l'assistant, pourquoi il s'est arrêté (il a terminé,
   il appelle des outils, la limite de sortie l'a coupé ou le modèle a refusé) et les tokens utilisés.
   Pendant qu'il travaille, il peut diffuser du texte dans des notifications `delta`.
3. **`shutdown`** : le fournisseur répond et se termine.

stdout ne transporte que des messages du protocole. Les diagnostics vont sur stderr, qui parvient à la
personne.

## Un exemple complet

[examples/provider.py](https://github.com/LiasCode/rumbo/blob/v0.10.0/examples/provider.py) est un
fournisseur complet dans un seul fichier Python, sans modèle derrière : il demande un appel d'outil,
puis répète la sortie de l'outil. Voici sa boucle :

```python
for line in sys.stdin:
    frame = json.loads(line)
    method = frame.get("method")

    if method == "initialize":
        config = frame["params"].get("config") or {}
        functions = [{"name": "greet", "description": "Ask your name, and greet you"}]
        send({"id": frame["id"], "result": {"protocol": 1, "name": "toy", "config": config, "functions": functions}})

    elif method == "complete":
        result = answer(frame["id"], frame["params"])
        result["usage"] = {"input": 0, "output": 0}
        send({"id": frame["id"], "result": result})

    elif method == "invoke":
        send({"id": frame["id"], **greet(frame["id"])})

    elif method == "shutdown":
        send({"id": frame["id"], "result": {}})
        break
```

Remplacez `answer` par un appel à votre modèle, et c'est un vrai fournisseur. Enregistrez-le et
utilisez-le :

```sh
rumbo provider add toy python3 /path/to/examples/provider.py
rumbo -p toy -m any "list the files"
```

rumbo démarre un fournisseur quand vous l'ajoutez, ce qui prouve qu'il fonctionne. En Go, le paquet
[`protocol`](https://github.com/LiasCode/rumbo/tree/v0.10.0/protocol) contient les types et `Serve`, un
serveur prêt à l'emploi.

## Ce qu'un fournisseur doit faire

- Répondre à une requête à la fois. Quand rumbo en a besoin de plusieurs en même temps, il démarre
  d'autres processus, donc un fournisseur ne doit dépendre de rien d'autre que de la requête à laquelle
  il répond.
- Marquer comme transitoire un échec qui peut réussir si la requête est renvoyée, comme une limite de
  débit, et marquer comme telle une requête qui ne tenait pas dans le contexte du modèle. rumbo réessaie
  la première et compacte pour la seconde.
- Répondre en quelques secondes à une requête qu'on lui a demandé d'annuler.
- Garder ses propres identifiants. rumbo n'en garde aucun.
- Ignorer les blocs opaques qu'il ne reconnaît pas, ce qui permet à une session de changer de
  fournisseur.

## Ce qu'un fournisseur peut faire

- **Se décrire** : comment son modèle est choisi, les options qu'il accepte avec leurs valeurs par
  défaut et les fonctions qu'il propose. Chaque interface les affiche comme réglages et commandes sans
  les connaître.
- **Proposer des fonctions**, comme lister ses modèles ou se connecter, qui peuvent dialoguer avec la
  personne pendant qu'elles travaillent : dire des choses et poser des questions, en marquant une
  réponse comme secrète quand elle l'est.
- **Garder ce dont il a besoin** pour poursuivre une conversation, comme le raisonnement signé, dans
  des blocs opaques que rumbo stocke et renvoie sans les modifier.
- **Indiquer la taille du contexte du modèle**, pour que rumbo résume la conversation avant qu'elle ne
  le remplisse, et **combien il a lu de son cache**, pour que rumbo vous prévienne quand une requête l'a
  manqué.
- **Montrer au modèle les images** du résultat d'un outil.

Les [cas d'usage](/fr/reference/use-cases/#provider) listent tout cela, et le
[protocole](/fr/reference/provider-protocol/) spécifie chaque message.
