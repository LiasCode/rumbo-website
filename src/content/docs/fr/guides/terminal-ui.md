---
title: Interface en terminal
description: Utilisez l'interface en terminal de rumbo. La conversation en plein écran, une zone de saisie, quelques commandes qu'on y tape, les sessions dans une barre latérale, des panneaux avec les détails de la session et les changements Git, et toutes ses touches.
---

`rumbo` dans un terminal ouvre l'interface en terminal en plein écran : la conversation sur toute la
largeur et, en dessous, une zone de saisie avec le modèle, la branche Git en cours, le dossier (sous
votre répertoire personnel, sous la forme `~/`), le remplissage du contexte et ce que la session a
dépensé. Les sessions démarrées dans ce dossier sont dans une barre latérale, masquée jusqu'à ce que
Ctrl-B l'affiche.

```sh
rumbo                      # open it
rumbo "a task"             # open it and start a task
rumbo -c                   # open the latest session started here
rumbo -s <session>         # open a given one
```

En quittant, elle rend le terminal tel qu'elle l'a trouvé, et y laisse la commande qui continue la
session, `rumbo -s <session>`. Pour garder une conversation, `/export` l'écrit dans un fichier Markdown.

## Suivre une exécution

- Ce que vous avez dit s'affiche dans un cadre à droite, et ce qu'écrit le modèle, en Markdown : titres,
  listes, citations, code, liens et tableaux aux colonnes alignées.
- Un appel d'outil s'affiche avec un indicateur et sa durée pendant qu'il travaille, puis comme un bloc
  qui dit comment il s'est passé : une modification avec les lignes qu'elle a changées, une commande
  avec le début de ce qu'elle a affiché ou, en cas d'échec, son statut et la fin de ce qu'elle a
  affiché.
- L'état de l'exécution, son indicateur et sa durée, s'affiche au-dessus de la zone de saisie.
- Une exécution se termine par une ligne qui indique comment elle s'est terminée, sa durée, ses
  tokens en entrée et en sortie, ce qu'a fourni le cache avec sa part de l'entrée, et ses tours :
  `12.3s · 1.1k in · 810 out · 26.5k cached (96%) · 1 turn`. Une session que vous continuez indique
  aussi la durée de chacune de ses tâches précédentes.
- Entrée pendant une exécution lui transmet ce que vous avez tapé. Cela atteint le modèle avant sa
  requête suivante, sans l'arrêter.
- Quand une exécution se termine alors que le terminal n'est pas au premier plan, il fait sonner la
  cloche et envoie une notification de bureau, dans les terminaux qui signalent leur focus et
  acceptent OSC 9 (dans tmux, avec `focus-events` activé).

## Commandes

Tout est une commande tapée dans la zone de saisie. Une barre oblique sur une ligne vide en commence
une, et Ctrl-P aussi. Une conversation vide montre les quelques commandes par lesquelles commencer.

- **Le menu** liste les commandes, avec un exemple de celle choisie, puis les valeurs qu'accepte son
  mot suivant : `/resume` liste les sessions, `/model ` les fournisseurs et les options, et
  `/model openai/` les modèles d'`openai`. Haut et Bas choisissent, Tab ou Entrée prennent, Échap le
  ferme.
- **Ce qui manque encore à une commande** s'affiche après le curseur, atténué, comme
  `/resume <session>`.
- **Une commande mal tapée** reçoit pour réponse celle que vous vouliez dire.
- **`/help`** liste les commandes selon leur sujet, et les touches ; `/help <command>` dit ce que fait
  l'une d'elles, avec des exemples.
- Une commande irréversible vous demande votre accord dans une boîte de dialogue, qui commence sur le
  bouton qui laisse les choses en l'état.

| Commande                        | Action                                                                                                                     |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `/new`                          | Commencer la tâche suivante dans une nouvelle session                                                                      |
| `/sessions`                     | Lister les sessions de ce dossier, avec leur état et leur dernière utilisation                                             |
| `/resume <session>`             | Aller à une autre session, par son id, son début ou le début de son titre                                                  |
| `/rename <title>`               | Donner à cette session un titre à vous                                                                                     |
| `/branch [message]`             | Continuer dans une [branche](/fr/guides/sessions/#créer-une-branche), avant l'un de vos messages ou à partir de maintenant |
| `/attach <file>`                | Donner un fichier avec ce que vous envoyez ensuite, par son chemin ; le modèle le lit quand il en a besoin                 |
| `/compact`                      | Remplacer dès maintenant la conversation par un résumé                                                                     |
| `/delete [session]`             | Supprimer une session et son historique, après votre accord ; sans session, celle-ci                                       |
| `/copy [code\|id]`              | Copier la dernière réponse du modèle, son dernier bloc de code ou l'id de cette session                                    |
| `/export [path]`                | Écrire cette session en Markdown dans un fichier, sans l'écraser                                                           |
| `/model [provider/model]`       | Changer le modèle et ses options (`option=value`) ; sans eux, ouvrir le sélecteur                                          |
| `/login [extension]`, `/logout` | Se connecter au fournisseur, ou à une extension, et se déconnecter                                                         |
| `/providers`, `/extensions`     | Les lister, les afficher, les configurer, les ajouter et les retirer                                                       |
| `/settings [name=value]`        | Afficher ce qui s'applique ici et d'où vient chaque valeur, ou changer un réglage                                          |
| `/status`, `/changes`           | Afficher les détails de la session, ou ce qui a changé dans le dossier, à côté de la conversation                          |
| `/rumbos [close]`               | Ce qu'utilise le rumbo de chaque session ouverte ; `close` arrête ceux qui ne servent pas                                  |
| `/help [command]`, `/quit`      | Afficher les commandes et les touches, ou quitter rumbo                                                                    |

Les réponses, les erreurs et les diagnostics sont marqués `[host]`, `[provider <name>]` ou
`[extension <name>]`, selon leur provenance.

## Fournisseurs et extensions

`/providers` et `/extensions` fonctionnent de la même façon :

```text
/providers                                list them
/providers openai                         show one: its settings and what it offers
/providers openai base_url=http://localhost:11434/v1
/providers add local {self} provide openai
/providers remove local                   remove one, once you agree
/extensions add docs config={"url":"https://example.com/mcp"} {self} extend mcp
```

Ce qu'offre un programme s'appelle après son nom : `/providers anthropic account` pour le fournisseur
de la session, ou `/extensions notes forget` pour une extension. Chaque mot est complété : les
programmes, les changements qu'accepte chacun sauf ceux déjà donnés, ce qu'offre chacun et ce
qu'acceptent ses fonctions et, pour `add`, la façon dont les programmes présents sont démarrés, ainsi
que le `config=` et le `replaces=` d'une extension. Un mot facultatif, placé avant un mot qui ne l'est
pas, se tape par son nom, sous la forme `name=value`.

`/extensions <name> tools=` choisit les outils d'un serveur MCP parmi tous ceux qu'il a, élément par
élément : d'abord la liste telle qu'elle est choisie, puis chaque outil qui n'y est pas encore, avec
ce qu'il fait ; une virgule continue avec un autre. Voir [Extensions et MCP](/fr/guides/extensions/).

## Modèle et options

`/model`, ou un clic sur le modèle sous la zone de saisie, ouvre le sélecteur. Il change le
fournisseur, le modèle et les options de la session, comme `effort`, et affiche chaque changement
sous la forme du `/model` qu'il est. Tapé en entier, il les change d'un coup :

```text
/model anthropic/claude-opus-5-5 effort=high
/model effort=                     the option back to the provider's value
```

Ce qui précède la barre oblique n'est un fournisseur que s'il en existe un de ce nom, si bien que le
nom d'un modèle peut contenir des barres obliques.

## Sessions

La barre latérale liste les sessions démarrées dans le dossier où rumbo a démarré, espacées d'une
ligne, chacune avec le temps écoulé depuis sa dernière utilisation, comme `5m`, `3h` ou `2d`. Chaque
session est un rumbo à part, que l'interface démarre quand vous affichez la session pour la première
fois et arrête quand vous quittez, si bien qu'une exécution continue dans sa session pendant que vous
en regardez une autre. La barre latérale marque les sessions qui travaillent, celles dont l'exécution
s'est terminée pendant qu'elles n'étaient pas affichées et, d'un anneau, celles pour lesquelles un
rumbo reste ouvert. Le nombre d'exécutions qui travaillent dans d'autres sessions s'affiche sous la
zone de saisie, à droite.

| Touche                   | Action                                             |
| ------------------------ | -------------------------------------------------- |
| Ctrl-B                   | Afficher ou masquer la barre latérale              |
| Tab, zone de saisie vide | Aller à la barre latérale, quand elle est affichée |
| Haut et Bas, k et j      | Choisir une session                                |
| gg et G                  | Choisir la première ou la dernière                 |
| Entrée                   | Afficher la session choisie                        |
| d                        | Supprimer la session choisie, après votre accord   |
| Ctrl-N                   | Démarrer une nouvelle session, dans son rumbo      |

`/sessions` liste les mêmes sessions dans la conversation, et `/resume <session>` va à l'une d'elles.

Les rumbos des sessions que vous avez laissées sans rien à faire sont fermés au-delà des deux
dernières affichées, pour qu'ils ne continuent pas à coûter de la mémoire ; en afficher une à nouveau
démarre son rumbo. `/rumbos` dit ce qu'utilise le rumbo de chaque session ouverte : ses processus,
leur mémoire et leur temps processeur. `/rumbos close` ferme ceux qui ne sont ni affichés ni au
travail.

La session dans laquelle rumbo a démarré est retenue jusqu'à ce que vous quittiez, si bien qu'on ne
peut pas la supprimer de l'intérieur : supprimez-la ensuite, avec `rumbo sessions rm`.

## Panneaux

- **`/status`** ou **Ctrl-Alt-B** affiche les détails de la session à côté de la conversation : son id
  et son état, son dossier, son modèle, le remplissage de son contexte, ce qu'elle a dépensé et les
  skills dont le modèle est informé.
- **`/changes`** ou **Ctrl-G** affiche ce qui a changé dans le dossier de la session selon Git, par
  rapport au dernier commit, nouveaux fichiers compris. Il ne fait que lire.

## Revenir dans la conversation

Maj-Tab remonte dans la conversation, où Entrée agit sur l'entrée choisie, comme un clic :

- sur un appel d'outil, il affiche tout ce qu'il a reçu et renvoyé, ou revient à son extrait ;
- sur l'un de vos messages, il le modifie, ou le repose, dans une [branche](/fr/guides/sessions/#créer-une-branche)
  qui commence avant lui ;
- sur tout le reste, il le copie.

| Touche              | Action                                                                             |
| ------------------- | ---------------------------------------------------------------------------------- |
| Haut et Bas, k et j | Choisir une entrée                                                                 |
| K et J              | Aller à vos messages, vers le haut et vers le bas                                  |
| gg et G             | Aller au début et à la fin                                                         |
| c                   | Copier l'entrée choisie                                                            |
| b                   | Créer une branche depuis votre message qui a commencé la tâche, après votre accord |
| Tab, Échap          | Revenir à la zone de saisie                                                        |

`b` choisit d'abord ce message, et la boîte de dialogue dit ce que garde la branche : la conversation
telle qu'elle était avant lui, avec le message dans la zone de saisie de la branche, pour le modifier
ou l'envoyer à nouveau.

## Copier

Faire glisser la souris sur la conversation ou un panneau sélectionne son texte, et le relâcher le
copie, dans le presse-papiers et dans la sélection primaire. Avec Maj, le terminal sélectionne comme
ailleurs.

Le texte est copié avec OSC 52, qui fonctionne aussi via ssh, et par le bureau sur lequel tourne
rumbo, car un terminal ou un tmux qui n'accepte pas OSC 52 l'ignore sans rien dire : avec `wl-copy`,
`xclip` ou `xsel`, ou `pbcopy`, sinon, dans tmux, par le tampon de tmux. Ce qui est copié dit où il
est allé.

## La zone de saisie

| Touche                              | Action                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| Entrée                              | Envoyer la tâche, ou transmettre ce que vous avez tapé à l'exécution en cours                     |
| Alt-Entrée, Maj-Entrée, Ctrl-J      | Nouvelle ligne                                                                                    |
| Haut, Bas                           | Parcourir les lignes tapées et, au-delà, ce que vous avez envoyé avant                            |
| Ctrl-R                              | Rechercher ce que vous avez envoyé avant, dans n'importe quelle session démarrée dans ce dossier  |
| Ctrl-V                              | Donner les fichiers copiés dans un gestionnaire de fichiers, ou l'image du presse-papiers         |
| Retour arrière, zone de saisie vide | Retirer le dernier fichier donné                                                                  |
| Échap                               | Abandonner une fonction du fournisseur en cours, sinon annuler l'exécution de la session affichée |
| Ctrl-C                              | Comme Échap, sinon vider la zone de saisie, sinon quitter                                         |
| Ctrl-D                              | Quitter, zone de saisie vide                                                                      |
| Pg préc, Pg suiv, la molette        | Faire défiler la conversation                                                                     |

La zone de saisie utilise les touches de readline : Ctrl-A et Ctrl-E, Ctrl-F, Alt-B et Alt-F, Ctrl-W,
Ctrl-U et Ctrl-K.

## Fichiers

Ce que vous envoyez peut emporter des fichiers de tout type : `/attach`, Ctrl-V, ou un fichier déposé
sur le terminal. Le modèle reçoit le chemin de chaque fichier et le lit avec ses outils quand il en a
besoin : rien du fichier n'est gardé dans la session ni envoyé à chaque requête. Les fichiers
attendent au-dessus de la zone de saisie, chacun après une icône de son type, et s'affichent sous
votre message une fois envoyé.

| Moyen             | Donne                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------- |
| `/attach <file>`  | Le fichier à ce chemin, depuis le dossier de la session                               |
| Ctrl-V            | Les fichiers copiés dans un gestionnaire de fichiers, sous Wayland et X11, ou l'image |
| Un fichier déposé | Ce fichier, quand le collage n'est fait que de chemins de fichiers qui existent       |

Ctrl-V lit le presse-papiers du bureau, avec `wl-paste` sous Wayland, `xclip` sous X11 ou AppKit sur
macOS, car un terminal ne colle que du texte. Une image collée est enregistrée dans `~/.rumbo/pasted/`
et donnée par ce chemin. Sous Windows, rumbo ne lit pas encore le presse-papiers, et le dit : utilisez
`/attach`.

## Couleurs

Les couleurs de l'interface sont sa configuration, réglée avec `rumbo frontend set tui` :

```sh
rumbo frontend set tui theme=plain          # auto (the default, which follows NO_COLOR), color, or plain
rumbo frontend set tui color_code=bright-blue
rumbo frontend show tui                     # everything set for it, with the defaults
```

`color_host`, `color_provider`, `color_code`, `color_success`, `color_failure`, `color_warning` et
`color_progress` acceptent chacun un nom comme `cyan` ou `bright-blue`, un numéro parmi les 256
couleurs, `#rrggbb` ou `default`.
