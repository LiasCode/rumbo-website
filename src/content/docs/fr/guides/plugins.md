---
title: Plugins
description: Installez, inspectez, mettez à jour et retirez des plugins rumbo, qui réunissent fournisseurs, interfaces, extensions et skills depuis un dossier ou un dépôt Git.
---

Un plugin apporte plusieurs choses à la fois : des fournisseurs, des interfaces, des extensions et des skills. C'est un dossier, ou un dépôt Git, avec un `plugin.yaml` qui les nomme. Une fois ajouté, ce qu'il apporte est là comme ce que rumbo a d'origine, et se règle de la même façon.

## En ajouter un

```sh
rumbo plugin add https://example.com/team/ink-plugin.git   # un dépôt Git, que rumbo copie
rumbo plugin add ~/code/ink-plugin                         # un dossier, utilisé là où il est
```

Ajouter un plugin le compile, si son manifeste dit comment, puis démarre chaque fournisseur et chaque extension qu'il apporte, ce qui vérifie qu'il fonctionne. Un plugin qui échoue n'est pas ajouté. rumbo dit ensuite ce qu'il a apporté :

```text
added the plugin notes, which brings:
  the extension notes
  the skill meeting-notes
```

> La compilation d'un plugin et ses programmes s'exécutent en votre nom, avec vos droits. Ajoutez ceux dont vous jugez le code digne de confiance.

## Voir ce que vous avez

```sh
rumbo plugin list          # le plugin propre à rumbo, et ceux que vous avez ajoutés
rumbo plugin show notes    # où il se trouve, et ce qu'il apporte
rumbo plugin show rumbo    # ce qui vient avec rumbo : ses fournisseurs et son interface en terminal
```

## Régler ce qu'il a apporté

Les programmes d'un plugin se règlent comme les autres, par leur type et leur nom :

```sh
rumbo extension set notes <field>=<value>
rumbo provider set house-model model=<model>
rumbo frontend set panel <field>=<value>
```

Ce que vous réglez passe avant la configuration que donne le plugin. `rumbo skills` liste ses skills avec les vôtres.

## Mettre à jour et retirer

```sh
rumbo plugin update notes   # un plugin ajouté depuis Git : récupère, compile et l'essaie de nouveau
rumbo plugin rm notes       # le retire, avec ce que vous avez réglé pour ce qu'il apportait
```

Une mise à jour qui ne compile plus ou ne démarre plus revient à ce que le plugin était. Un plugin ajouté depuis un dossier est lu tel quel à chaque fois : il n'y a rien à mettre à jour. Retirer un plugin supprime la copie que rumbo garde d'un dépôt, et jamais votre propre dossier.

## Quand un plugin remplace un outil

Une extension d'un plugin peut demander à prendre la place d'un outil de rumbo, comme `bash`. L'ajout du plugin s'arrête alors et le dit, et vous acceptez en nommant les outils :

```sh
rumbo plugin add -replaces bash <source>
```

Une mise à jour qui demande à remplacer plus que ce que vous avez accepté est refusée. Sous Windows,
l'outil shell est `powershell` et rumbo n'a pas de `bash` : un plugin qui demande à remplacer `bash`
y est refusé, en disant quels outils rumbo a.

## Ensuite

- Le [manifeste d'un plugin](/fr/reference/plugins/) dit tout ce qu'un `plugin.yaml` peut contenir.
- [`examples/plugin`](https://github.com/LiasCode/rumbo/tree/v0.13.0/examples/plugin) est un modèle à copier.
- L'[application de bureau](/fr/guides/desktop-app/) est distribuée comme un plugin.
