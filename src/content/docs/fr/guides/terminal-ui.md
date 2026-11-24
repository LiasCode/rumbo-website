---
title: Interface en terminal
description: Utilisez l'interface en terminal de rumbo. Les sessions dans une barre latérale, la conversation, une zone de saisie, une palette de commandes, des panneaux avec les détails de la session et les changements Git, et toutes ses touches.
---

`rumbo` dans un terminal ouvre l'interface en terminal en plein écran : un en-tête avec le dossier et la
session affichée, les sessions démarrées dans ce dossier dans une barre latérale, la conversation dans sa propre
colonne et, en dessous, une zone de saisie avec le modèle, le remplissage du contexte et ce que la
session a dépensé.

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
- Une exécution se termine par une ligne qui indique comment elle s'est terminée, sa durée, ses tours
  et ses tokens.
- Entrée pendant une exécution lui transmet ce que vous avez tapé. Cela atteint le modèle avant sa
  requête suivante, sans l'arrêter.
- Quand une exécution se termine alors que le terminal n'est pas au premier plan, il fait sonner la
  cloche et envoie une notification de bureau, dans les terminaux qui signalent leur focus et
  acceptent OSC 9 (dans tmux, avec `focus-events` activé).

## Sessions

La barre latérale liste les sessions démarrées dans le dossier où rumbo a démarré. Chacune est un
rumbo à part, que l'interface démarre quand vous affichez la session pour la première fois et arrête
quand vous quittez, si bien qu'une exécution continue dans sa session pendant que vous en regardez une
autre. La barre latérale marque les sessions qui travaillent, celles dont l'exécution s'est terminée
pendant qu'elles n'étaient pas affichées et, d'un anneau, celles pour lesquelles un rumbo reste ouvert.

| Touche                                     | Action                                        |
| ------------------------------------------ | --------------------------------------------- |
| Tab (zone de saisie vide), flèches, Entrée | Afficher une session de la barre latérale     |
| Ctrl-N                                     | Démarrer une nouvelle session, dans son rumbo |
| Ctrl-B                                     | Afficher ou masquer la barre latérale         |

Les rumbos des sessions que vous avez laissées sans rien à faire sont fermés au-delà des deux
dernières affichées, pour qu'ils ne continuent pas à coûter de la mémoire ; en afficher une à nouveau
démarre son rumbo. `/rumbos` dit ce qu'utilise le rumbo de chaque session ouverte, et « Close the
rumbos not in use », dans la palette, les ferme tous.

`/delete`, ou « Delete this session » dans la palette, supprime la session affichée après votre
accord. La session dans laquelle rumbo a démarré est retenue jusqu'à ce que vous quittiez :
supprimez-la ensuite, avec `rumbo sessions rm`.

## Commandes

- **Ctrl-P** ouvre une palette avec les actions propres à l'interface, les autres sessions du dossier et
  toutes les commandes, que la saisie filtre. Une commande qui a besoin de quelque chose le demande dans
  un formulaire, et une commande irréversible vous demande votre accord dans une boîte de dialogue.
- **Une barre oblique** dans la zone de saisie ouvre un menu des commandes, avec ce que fait chacune,
  puis des valeurs acceptées par son paramètre suivant : `/use` liste les fournisseurs, `/use openai` les
  modèles d'`openai`. Un paramètre facultatif se tape par son nom, sous la forme `name=value` :
  `/extension-add docs config={"url":"https://example.com/mcp"} {self} extend mcp`.
- **`/help`** les liste toutes : celles de l'hôte, regroupées selon ce sur quoi elles agissent (le
  système, la session, les fournisseurs et les extensions), celles du fournisseur et celles de l'interface.

Les commandes viennent de ce que décrivent l'hôte et le fournisseur, si bien que les fonctions d'un
fournisseur, comme `/login`, apparaissent sans que l'interface les connaisse. Celles de l'interface
sont `/help`, `/copy` (la dernière réponse du modèle, ou `/copy code` pour son dernier bloc de code),
`/export` (la session en Markdown), `/rumbos` et `/delete`. `/processes` montre les processus que le
rumbo où vous êtes fait tourner, chacun sous celui qui l'a démarré, avec la mémoire et le temps
processeur qu'il utilise.

Les commandes d’une extension portent son nom enregistré, par exemple `/notes-forget`, dès qu’elle est ajoutée. Sa sortie est marquée `[extension]` ou `[extension <name>]`. Voir [Extensions et MCP](/fr/guides/extensions/).

## Modèle et options

Un clic sur le modèle sous la zone de saisie, ou Model and options dans la palette, ouvre le
sélecteur. Il change le fournisseur, le modèle et les options de la session, comme `effort`, et
affiche chaque changement sous la forme de la commande qu'il est.

## Panneaux

- **Ctrl-Alt-B** affiche les détails de la session à côté de la conversation : son id et son état, son
  dossier, son modèle, le remplissage de son contexte, ce qu'elle a dépensé et les skills dont le
  modèle est informé.
- **Ctrl-G** affiche ce qui a changé dans le dossier de la session selon Git, par rapport au dernier
  commit, nouveaux fichiers compris. Il ne fait que lire.

## Revenir dans la conversation

Maj-Tab remonte dans la conversation, où Haut et Bas choisissent une entrée et Entrée agit dessus,
comme un clic :

- sur un appel d'outil, il affiche tout ce qu'il a reçu et renvoyé, ou revient à son extrait ;
- sur l'un de vos messages, il le modifie, ou le repose, dans une [branche](/fr/guides/sessions/#créer-une-branche)
  qui commence avant lui ;
- sur tout le reste, il le copie.

Faire glisser la souris sur la conversation ou un panneau sélectionne son texte, et le relâcher le
copie, dans le presse-papiers et dans la sélection primaire. Il utilise OSC 52, donc cela fonctionne
aussi via ssh dans les terminaux qui l'acceptent (dans tmux, avec `set-clipboard on`). Avec Maj, le
terminal sélectionne comme ailleurs.

## La zone de saisie

| Touche                              | Action                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------- |
| Entrée                              | Envoyer la tâche, ou transmettre ce que vous avez tapé à l'exécution en cours                     |
| Alt-Entrée, Maj-Entrée, Ctrl-J      | Nouvelle ligne                                                                                    |
| Haut, Bas                           | Parcourir les lignes tapées et, au-delà, ce que vous avez envoyé avant                            |
| Ctrl-R                              | Rechercher ce que vous avez envoyé avant, dans n'importe quelle session démarrée dans ce dossier  |
| Ctrl-V                              | Coller l'image du presse-papiers, qui part avec ce que vous envoyez ensuite                       |
| Retour arrière, zone de saisie vide | Retirer la dernière image collée                                                                  |
| Échap                               | Abandonner une fonction du fournisseur en cours, sinon annuler l'exécution de la session affichée |
| Ctrl-C                              | Comme Échap, sinon vider la zone de saisie, sinon quitter                                         |
| Ctrl-D                              | Quitter, zone de saisie vide                                                                      |
| Pg préc, Pg suiv, la molette        | Faire défiler la conversation                                                                     |

La zone de saisie utilise les touches de readline : Ctrl-A et Ctrl-E, Ctrl-F, Alt-B et Alt-F, Ctrl-W,
Ctrl-U et Ctrl-K. Coller une image lit le presse-papiers du bureau avec `wl-paste` sous Wayland,
`xclip` sous X11 ou AppKit sur macOS, car un terminal ne colle que du texte.

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
