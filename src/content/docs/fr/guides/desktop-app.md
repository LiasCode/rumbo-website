---
title: Application de bureau
description: rumbo-gui est une fenêtre de bureau pour rumbo. Tous les projets et sessions au même endroit, chaque session comme une conversation, un diff de ce qui a changé et les réglages de rumbo, sans terminal.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) est une fenêtre de bureau pour rumbo : tous les
projets et sessions au même endroit, chaque session comme une conversation, et les réglages de rumbo,
sans terminal. C'est une interface comme une autre, écrite en Rust avec
[GPUI](https://github.com/zed-industries/zed), qui parle la
[version 3 de l'Agent Frontend Protocol](/fr/reference/frontend-protocol/), et il lui faut donc
rumbo 0.12.0 ou ultérieur.

## Ce que vous pouvez faire

- **Travailler dans des sessions.** Cherchez-les, ouvrez-en une avec Ctrl-K ou de Ctrl-1 à Ctrl-9, et
  renommez-la, créez-en une branche, compactez-la, exportez-la en Markdown ou supprimez-la depuis son
  menu. Tous les projets sont dans la barre latérale, leurs sessions de la plus récente à la plus
  ancienne ; épinglez en haut ceux que vous utilisez le plus.
- **Revenir en arrière et avancer**, comme dans un navigateur, entre les sessions, projets et réglages
  visités, avec Alt-Gauche et Alt-Droite ou les boutons précédent et suivant de la souris.
- **Suivre une exécution.** La réponse du modèle en Markdown, chaque appel d'outil avec ce qu'il a
  changé dans un fichier et la durée de l'exécution ; dites-lui quelque chose pendant qu'elle
  travaille, ou annulez-la.
- **Montrer une image au modèle.** Ctrl-V colle l'image du presse-papiers dans la zone de saisie.
- **Changer d'avis.** Modifiez un message, ou reposez-le, dans une branche qui commence avant lui.
- **Relire le travail.** Le panneau Changes montre le diff du dossier du projet ; le panneau Files, ses
  fichiers, chacun marqué de ce qu'en dit Git ; le panneau Details, le remplissage du contexte du
  modèle, les tokens dépensés et les skills dont le modèle est informé.
- **Laisser des exécutions tourner.** Les exécutions continuent dans d'autres sessions et projets, et
  la fenêtre, ou le bureau si vous l'activez, vous prévient quand l'une se termine.

> **rumbo-gui a besoin de rumbo 0.12.0 ou ultérieur**, qui parle la version 3 du protocole d'interface, où une personne donne des fichiers par leur chemin, et possède `rumbo sessions -json`. Tout autre rumbo est refusé quand la fenêtre le démarre, et elle le dit. Une image collée dans la fenêtre est enregistrée dans `~/.cache/rumbo-gui/pasted/` et donnée par ce chemin.

## Comment il fonctionne avec rumbo

Chaque session ouverte a son hôte, un `rumbo serve` que la fenêtre démarre, et la fenêtre trouve les sessions avec `rumbo sessions -json`. Les exécutions continuent en arrière-plan ; fermer la fenêtre annule celles des hôtes qu’elle a lancés.

## Installation

C'est un plugin, que rumbo compile là où vous l'ajoutez : il lui faut donc `cargo`, de Rust, sur cette machine. Choisissez ensuite `gui` pour un lancement :

```sh
rumbo plugin add https://github.com/LiasCode/rumbo-gui
rumbo -f gui
```

## Utilisation

La fenêtre fonctionne aussi seule, et lance les rumbos dont elle a besoin :

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]   # --rumbo : l'exécutable de rumbo, quand il n'est pas dans le PATH
```

[rumbo-gui README](https://github.com/LiasCode/rumbo-gui#readme)
