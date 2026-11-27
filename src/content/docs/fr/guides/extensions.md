---
title: Extensions et MCP
description: Donnez au modèle vos propres outils dans rumbo, depuis un programme à vous ou un serveur Model Context Protocol. Enregistrer, inspecter, se connecter, limiter et remplacer des outils.
---

Une extension est un programme qui donne au modèle d'autres outils, en plus des quatre de rumbo. Vous l'enregistrez une fois, et toutes les exécutions lancées ensuite ont ses outils, dans chaque projet. rumbo la démarre quand une exécution en a besoin pour la première fois et en garde un seul processus tant qu'il tourne.

## Ajouter un serveur MCP

rumbo fournit l'extension pour les serveurs [Model Context Protocol](https://modelcontextprotocol.io). Ajoutez-la une fois par serveur, sous le nom de votre choix :

```sh
# Un serveur démarré par une commande
rumbo extension add files {self} extend mcp npx -y @modelcontextprotocol/server-filesystem "$HOME/notes"

# Un serveur joint par une URL
rumbo extension add -config '{"url":"https://example.com/mcp"}' docs {self} extend mcp
```

`{self}` désigne l'exécutable de rumbo. rumbo démarre l'extension quand vous l'ajoutez, ce qui vérifie qu'elle fonctionne, et dit quels outils le modèle reçoit.

| Champ       | Ce qu'il fait                                                                              |
| ----------- | ------------------------------------------------------------------------------------------ |
| `url`       | L'adresse d'un serveur joint en HTTP, à la place d'une commande.                           |
| `tools`     | Les noms des outils donnés au modèle, séparés par des virgules. Sans lui, tous.            |
| `prefix`    | Se place devant le nom de chaque outil, pour que ceux de deux serveurs ne se heurtent pas. |
| `token_env` | Le **nom** de la variable d'environnement qui contient votre jeton, jamais le jeton.       |
| `client_id` | Pour un serveur dont l'autorisation n'enregistre pas les clients d'elle-même.              |

### Se connecter

Un serveur à une URL qui demande une connexion démarre sans outils et avec une fonction `login`. Enregistrée sous `docs`, dans l'interface en terminal :

| Commande       | Fait                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| `/login docs`  | Ouvre la connexion dans votre navigateur. En ssh, collez l'adresse sur laquelle le navigateur termine. |
| `/logout docs` | Oublie la connexion.                                                                                   |

La connexion est conservée avec les autres identifiants de rumbo, lisible par vous seul, et renouvelée quand elle expire. Les outils du serveur sont ceux du modèle dès l'exécution suivante.

## Voir ce qu'une extension apporte, et ce qu'elle coûte

```sh
rumbo extension list             # les extensions que vous avez ajoutées
rumbo extension show files       # sa configuration, ses outils, et les octets qu'ils ajoutent à chaque requête
rumbo extension set files tools=read_text_file,list_directory prefix=notes_
rumbo extension set files tools= # une valeur vide rend le champ à sa valeur par défaut
rumbo extension rm files
```

Depuis n'importe quelle interface, les fonctions de l'hôte font de même ; dans l'interface en terminal, `/extensions` les liste, les affiche, les configure, les ajoute et les retire. Un changement s'applique aux exécutions qui démarrent ensuite, et l'interface en terminal propose ce qu'offre une extension dès qu'elle est ajoutée :

```text
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
/extensions files tools=read_text_file,list_directory
```

Après `/extensions files tools=`, le menu propose tous les outils du serveur, avec ce que fait chacun, élément par élément : l'extension `mcp` les liste avec une fonction à elle, `tools`.

Le nom, la description et le schéma de chaque outil sont envoyés au modèle avec **chaque requête**, que la tâche s'en serve ou non. `show` dit combien d'octets cela fait. Donnez au modèle les outils dont une tâche a besoin, avec `tools`, plutôt que tout ce qu'un serveur possède.

## Remplacer un outil de rumbo

Une extension peut prendre la place de `read`, `write`, `edit` ou `bash`, pour exécuter les commandes dans un conteneur ou demander avant certaines. Elle ne le fait jamais par son seul nom. C'est vous qui le dites :

```sh
rumbo extension add -replaces bash guard python3 /path/to/examples/guard.py
rumbo extension set guard replaces=       # rend bash à rumbo
```

[`examples/guard.py`](https://github.com/LiasCode/rumbo/blob/v0.13.0/examples/guard.py) demande avant tout `rm -rf`, dans une boîte de dialogue, et transmet tout le reste au `bash` de rumbo.

Sous Windows, l'outil shell de rumbo est `powershell`, qui lance Windows PowerShell : une extension y
prend sa place avec `-replaces powershell`.

## Ce qu'une extension fait d'autre

- **Elle dit quelque chose au modèle quand une exécution commence**, dans une section à elle, comme les notes qu'elle garde. Elle est envoyée une fois, puis seulement quand elle change.
- **Elle vous propose des commandes**, appelées après son nom, comme `/extensions notes forget` dans l'interface en terminal.
- **Elle vous pose une question** pendant qu'un de ses outils travaille.
- **Elle écoute** ce que font les exécutions, pour vous prévenir ou compter ce qu'elles coûtent.

> Une extension s'exécute en votre nom, avec vos droits, et le serveur MCP qu'elle démarre aussi. Ajoutez celles dont vous jugez le code digne de confiance.

## Ensuite

- [Écrivez une extension](/fr/extend/extension/) à vous, dans n'importe quel langage.
- Les [plugins](/fr/guides/plugins/) réunissent des extensions avec des fournisseurs, des interfaces et des skills.
- Le [protocole des extensions](/fr/reference/extension-protocol/) contient tous les messages.
