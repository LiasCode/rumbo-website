---
title: Écrire une extension
description: Écrivez une extension rumbo dans n'importe quel langage. Un programme qui déclare des outils sur stdin et stdout, répond à leurs appels, et peut ajouter du contexte, des commandes, des questions et des écoutes.
---

Une extension est votre propre programme, dans n'importe quel langage, qui parle l'[Agent Extension Protocol](/fr/reference/extension-protocol/) avec l'hôte rumbo : du JSON-RPC 2.0, un objet par ligne, sur son stdin et son stdout. Écrivez-en une pour donner au modèle un outil que rumbo n'a pas, pour vous placer entre le modèle et un outil qu'il a, ou pour savoir ce que font les exécutions.

## Sa forme

1. **`initialize`** : l'hôte parle en premier. L'extension répond avec la version `1` du protocole, son nom et ce qu'elle déclare : `tools`, `sections`, `functions` et `events`, tous facultatifs.
2. **`call`**, une fois par usage d'un de ses outils : le `name` de l'outil, les `args` donnés par le modèle, le `dir` où travaille la session et la `session`. L'extension répond avec `text`, et `is_error` quand l'appel a échoué.
3. **`shutdown`** : l'extension répond et se termine.

stdout ne porte que des messages du protocole. Les diagnostics vont sur stderr, qui parvient à la personne.

## Un exemple complet

[examples/extension.py](https://github.com/LiasCode/rumbo/blob/v0.12.0/examples/extension.py) est une extension entière dans un seul fichier Python. Elle garde des notes : un outil pour en retenir une, une section qui les dit toutes au modèle, et une commande qui les oublie. Voici comment elle répond à un appel :

```python
def call(params):
    """Run one tool. `args` is what the model gave; `dir` is where the session works."""
    if params["name"] == "remember":
        text = params["args"].get("text", "").strip()

        if not text:
            # A failed call says how to recover: the model reads it and tries again.
            return {"text": "text is empty; give the note to keep", "is_error": True}

        notes.append(text)

        return {"text": "kept"}

    return {"text": "there is no tool " + params["name"], "is_error": True}
```

Enregistrez-la, et regardez ce que le modèle recevra :

```sh
rumbo extension add notes python3 /path/to/examples/extension.py
rumbo extension show notes
```

```text
notes: python3 /path/to/examples/extension.py
configuration: {}
sections, told to the model when a run starts: notes
commands, in a front end: /notes-forget
tools, declared to the model in every request (161 bytes):
  remember  Keep a note for later in this rumbo.
```

En Go, le paquet [`protocol`](https://github.com/LiasCode/rumbo/tree/v0.12.0/protocol) fournit les types et `ServeExtension`, un serveur tout fait.

## Ce qu'une extension doit faire

- Répondre à `initialize`, et à chaque `call` vers un outil qu'elle a déclaré.
- Nommer ses outils avec des lettres, des chiffres, `_` et `-`, 64 au plus, et donner à chacun un JSON Schema de ses arguments.
- Garder courte la description de chaque outil. Elle est envoyée au modèle avec chaque requête.
- Signaler un appel échoué avec `is_error` et un texte qui dit au modèle comment s'en sortir.
- S'attendre à des appels de plusieurs sessions, et à plusieurs à la fois : rumbo garde un seul processus d'une extension pour toutes.

## Ce qu'une extension peut faire

- **Dire quelque chose au modèle quand une exécution commence**, en déclarant des `sections`. L'hôte demande le texte de chacune ; elle a 10 secondes pour répondre, et 8 000 octets au plus sont transmis.
- **Proposer des commandes à la personne**, en déclarant des `functions`. L'interface en terminal appelle `forget`, d'une extension enregistrée sous `notes`, par `/extensions notes forget`.
- **Lister les valeurs d'un champ de sa configuration**, avec une fonction du nom du champ marquée `lists`. L'interface en terminal complète le champ avec elles, comme elle le fait pour `tools` avec l'extension `mcp`.
- **Parler avec la personne** pendant qu'un outil ou une commande travaille : `delta` dit quelque chose, et `ask` pose une question, dont la réponse peut être marquée secrète.
- **Appeler les outils de rumbo** pendant qu'elle répond à un appel : c'est ainsi qu'une extension qui remplace `bash` transmet ce qu'elle laisse passer. [examples/guard.py](https://github.com/LiasCode/rumbo/blob/v0.12.0/examples/guard.py) le fait.
- **Être informée de ce que font les exécutions**, en déclarant les `events` qu'elle veut, comme `ended`.
- **Dire que ce qu'elle déclare a changé**, avec `changed`, comme lorsqu'une connexion lui donne des outils.

Une extension ne change aucun message, aucun outil d'une autre extension, ni le moment où une exécution se termine.

## La distribuer

Un programme s'ajoute avec `rumbo extension add`. Pour le distribuer avec des skills, un fournisseur ou une interface, et que rumbo le compile là où il est installé, faites-en un [plugin](/fr/reference/plugins/).

Les [cas d'usage](/fr/reference/use-cases/#extension) listent ce qu'une extension doit et peut faire, et le [protocole](/fr/reference/extension-protocol/) spécifie chaque message.
