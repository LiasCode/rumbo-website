---
title: Contrôle du bureau
description: Activez l'outil computer de rumbo pour que le modèle prenne des captures d'écran et utilise le pointeur et le clavier de votre bureau, sur Hyprland, Sway, X11 ou macOS.
---

Un shell lance des programmes, mais ne peut pas montrer au modèle ce qu'ils dessinent ni appuyer sur
leurs boutons. L'outil `computer` le peut : le modèle prend des captures du bureau où tourne rumbo et
utilise son pointeur et son clavier. Il est désactivé tant que vous ne l'activez pas.

```sh
rumbo system set computer=on
```

> **Avertissement**
>
> Avec l'outil activé, le modèle agit sur ce qui a le focus, avec votre pointeur et votre clavier. Lisez
> [avant de le lancer](/fr/start/safety/), et donnez-lui un bureau à lui quand vous le pouvez.

## Ce dont il a besoin

| Bureau                                       | Besoin                                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Compositeurs wlroots, comme Hyprland et Sway | `grim`                                                                                                                   |
| X11                                          | `xdotool`, et `maim` ou ImageMagick                                                                                      |
| macOS                                        | Enregistrement de l'écran, Accessibilité et Automatisation de System Events, autorisés pour le programme qui lance rumbo |

Sur macOS, l'outil est écrit mais n'a pas encore été essayé. Sous Windows, il n'y a pas encore
d'écran sur lequel agir : avec `computer=on`, l'outil le dit.

## Comment il se comporte

- **Il montre le moniteur utilisé**, en captures d'au plus 1280×800, et reporte les coordonnées du
  modèle sur l'écran.
- **Il n'agit que sur l'écran que le modèle a vu en dernier.** Quand vous bougez vous-même le pointeur,
  ou passez à un autre moniteur, il ne fait plus rien jusqu'à ce que le modèle prenne une nouvelle
  capture. Bouger la souris est votre façon de reprendre le bureau.
- **Son clavier est un clavier américain**, quelle que soit votre disposition, et il tape quand même
  les caractères qui manquent à un tel clavier.

## Ce que cela coûte

Une capture reste dans la conversation, comme tout résultat d'outil, et est renvoyée avec chaque
requête suivante : environ 1 400 tokens à chaque fois, jusqu'au compactage de la conversation.

## Sans céder votre bureau

Pour tenir le modèle à l'écart de ce que vous faites, donnez-lui un affichage à lui : un Sway lancé avec
`WLR_BACKENDS=headless` n'affiche rien sur votre bureau, et un `Xwayland :N` en mode rootful donne à
X11 son propre serveur. Lancez rumbo avec cet affichage dans son environnement.
