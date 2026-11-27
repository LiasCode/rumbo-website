---
title: Conception
description: Pourquoi rumbo est conçu ainsi. Un historique en ajout seul et rejouable, un préfixe stable pour le cache du fournisseur, des pièces remplaçables et ce que le harnais laisse de côté exprès.
---

rumbo est petit exprès. Chaque outil et chaque ligne du prompt système se paie en tokens à chaque
requête, pour chaque tâche, que cela l'aide ou non. Un nouvel outil, réglage ou champ de protocole doit
donc valoir ce qu'il coûte, et la plupart de ce que d'autres harnais ajoutent, rumbo le laisse au shell,
à la tâche et à vos instructions.

## Ce sur quoi repose la conception

**L'historique est en ajout seul.** Une session est une liste d'entrées qui ne sont jamais modifiées ni
supprimées. Changer de cap crée une [branche](/fr/guides/sessions/#créer-une-branche), une nouvelle
session qui commence par une copie des entrées, si bien que la session d'origine reste telle quelle.

**La requête est une fonction pure des entrées.** Un seul morceau de code transforme une session en
requête envoyée au modèle, et rien n'est ajouté en chemin. Une session enregistrée reproduit donc
exactement chaque requête, `rumbo request` affiche n'importe laquelle, et une exécution morte reprend à
partir de ce qui a été enregistré.

**Le préfixe est stable.** Le prompt système est constant, les déclarations d'outils sont
déterministes, et le contexte est envoyé une fois puis seulement quand il change. Chaque requête
prolonge la précédente, si bien que le fournisseur lit son début depuis son cache. rumbo vérifie que
c'est le cas, et vous prévient quand une requête a manqué le cache, car le reste est payé à nouveau.

**Un contexte plein est compacté, pas tronqué.** Près de la limite du modèle, le modèle résume la
conversation et la requête suivante part de ce résumé. Un résumé écrit dans ce but porte le travail
mieux que la coupe d'anciens tours, que les API de modèles rejettent souvent.

**Les pièces se rencontrent sur des protocoles.** Les fournisseurs et les interfaces sont des
programmes distincts qui parlent JSON-RPC avec l'hôte, comme les éditeurs et les langages via le
Language Server Protocol. Ceux intégrés traversent les mêmes protocoles que les vôtres, et les
protocoles ne font que grandir : ce qui est ajouté est facultatif.

**Tout ce que rumbo garde est un fichier lisible.** Vos choix, dans un seul `config.yaml` sans valeur
par défaut, et chaque session dans son propre répertoire.

## Ce que le harnais n'est pas

Ce sont des choix, pas des manques :

- **Il ne connaît aucun type de travail.** Rien dans rumbo ne concerne la programmation ni aucun autre
  domaine : pas de détection de projet, pas de comportement propre à un langage. Ce dont une tâche a
  besoin vient de vous et de vos [instructions](/fr/guides/instructions-and-skills/).
- **Il ne juge pas le travail du modèle.** Une exécution se termine quand le modèle cesse d'appeler des
  outils. rumbo ne fait aucune vérification et ne renvoie jamais le modèle au travail ; vérifier le
  travail fait partie de la tâche, et vos instructions disent comment. Mesurées sur le jeu
  d'évaluation de rumbo, les vérifications n'ont jamais changé un résultat et coûtaient beaucoup de
  mécanique.
- **Il n'envoie pas de contexte non demandé**, au-delà de l'environnement, de vos instructions et de ce
  à quoi sert chacune de vos skills. Le modèle examine le projet, et lit une skill, avec ses outils
  quand il en a besoin.
- **Il n'a pas de système de permissions.** L'agent agit avec les droits de l'utilisateur qui l'a
  lancé. Qui a besoin de limites lance rumbo dans un bac à sable de son choix. Voir
  [avant de le lancer](/fr/start/safety/).
- **Il ne suit pas les fichiers.** Une session garde la conversation, pas le disque : il n'y a pas de
  points de restauration, et une branche part d'un point antérieur de la conversation avec les fichiers
  tels qu'ils sont.

## Mesuré, pas supposé

Un changement de la boucle, du prompt système, des outils ou du contexte change le comportement du
modèle, et les tests ne peuvent pas le montrer. Ces changements sont mesurés avec un jeu d'évaluation,
avant et après, en comparant le taux de réussite, les tours et les tokens. Les tests n'appellent jamais
un vrai modèle.

## Pour aller plus loin

- [Architecture](/fr/reference/architecture/) : les pièces et comment elles s'assemblent.
- [Cas d'usage](/fr/reference/use-cases/) : ce que chaque pièce doit, peut et ne doit pas faire.
- [Glossaire](/fr/reference/glossary/) : les termes et le sens de chacun.
