---
title: Application de bureau
description: rumbo-gui est une fenêtre de bureau pour rumbo. Tous les projets et sessions au même endroit, chaque session comme une conversation, un diff de ce qui a changé et les réglages de rumbo, sans terminal.
---

[rumbo-gui](https://github.com/LiasCode/rumbo-gui) est une fenêtre de bureau pour rumbo : tous les
projets et sessions au même endroit, chaque session comme une conversation, et les réglages de rumbo,
sans terminal. C'est une interface comme une autre, écrite en Rust avec
[GPUI](https://github.com/zed-industries/zed), qui parle le même
[Agent Frontend Protocol](/fr/reference/frontend-protocol/) que l'interface en terminal.

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

## Comment il fonctionne avec rumbo

- **Chaque projet ouvert a son propre `rumbo serve`**, donc ses exécutions continuent pendant que vous
  regardez un autre projet ou une autre session.
- **Tout appartient à rumbo.** Les sessions, les réglages et les fournisseurs vivent dans rumbo ; la
  fenêtre ne garde que ses propres préférences, comme son thème et les projets épinglés.
- **Rien n'est codé en dur.** Les commandes, formulaires et sélecteurs viennent de ce que décrivent
  rumbo et le fournisseur, donc une nouvelle fonction apparaît d'elle-même.
- **Les fichiers sont à vous.** Il ne fait que les lire, pour montrer ce que Git voit changé, et Open in
  Editor passe le projet à votre éditeur.

## Installation

rumbo-gui se compile depuis les sources, avec Rust, et a besoin de rumbo installé à part : une version
postérieure à 0.5.

```sh
git clone https://github.com/LiasCode/rumbo-gui
cd rumbo-gui
cargo build --release      # the binary is target/release/rumbo-gui
install -Dm644 rumbo-gui.desktop ~/.local/share/applications/rumbo-gui.desktop
```

Mettez dans `Exec`, dans le fichier `.desktop`, le chemin du binaire s'il n'est pas dans votre `PATH`.

## Utilisation

```sh
rumbo-gui [--rumbo PATH] [DIR] [-- FLAGS]
```

`DIR` est le premier projet à ouvrir, et `FLAGS` sont passés à `rumbo serve`, comme `-c` ou `-p`.
`--rumbo` indique l'exécutable de rumbo quand il n'est pas dans votre `PATH`.

rumbo peut aussi lancer la fenêtre lui-même, comme il lance son interface en terminal. La fenêtre ne
travaille alors que dans le projet de ce rumbo, et se ferme avec lui :

```sh
rumbo frontend add gui /path/to/rumbo-gui --attached
rumbo -f gui "a task"      # or: rumbo system set frontend=gui
```

Son [README](https://github.com/LiasCode/rumbo-gui#readme) liste toutes les touches.
