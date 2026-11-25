---
title: Instructions et skills
description: Dites à l'agent de rumbo comment vous travaillez avec des fichiers AGENTS.md et CLAUDE.md, et donnez-lui des skills au format Agent Skills qu'il ne lit que quand une tâche en a besoin.
---

rumbo envoie au modèle peu de choses qu'il n'a pas demandées : l'environnement où il travaille, vos
instructions et ce à quoi sert chacune de vos skills. Tout le reste sur une tâche, le modèle le
découvre avec ses outils. Les instructions et les skills sont l'endroit où vous lui dites comment le
travail doit être fait.

## Instructions

Le modèle lit les fichiers `AGENTS.md` ou `CLAUDE.md` :

- du répertoire où rumbo a démarré, la racine de la session, et d'aucun au-dessus ;
- les vôtres, dans `~/.config/rumbo/` (`~/Library/Application Support/rumbo/` sur macOS), qui
  s'appliquent partout.

Écrivez-y ce qu'une tâche ne peut pas montrer d'elle-même : comment vous voulez que le travail soit
fait, quelles commandes le vérifient et ce qui ne doit jamais arriver.

```markdown title="AGENTS.md"
# Agent guide

- Run `make check` before saying a change is done, and report what it printed.
- Never commit; I review and commit myself.
- Write to me in Spanish; code and comments in English.
```

Démarré dans un sous-répertoire d'un dépôt, rumbo ne lit que le guide de ce sous-répertoire, pas celui
de la racine : démarrez-le à la racine pour travailler avec le guide du dépôt.

Vos instructions l'emportent sur celles de rumbo : d'abord ce que vous dites dans la conversation,
puis votre `AGENTS.md`. Un fichier long est coupé, en indiquant où se trouve la suite, pour que le
modèle puisse la lire.

## Skills

Une skill est un ensemble d'instructions pour un type de tâche, au format
[Agent Skills](https://agentskills.io) : un répertoire avec un `SKILL.md` dont le frontmatter a un
`name` et une `description` de ce à quoi elle sert et quand l'utiliser.

```markdown title="~/.config/rumbo/skills/meeting-notes/SKILL.md"
---
name: meeting-notes
description: Write meeting notes in my format. Use for any summary of a meeting.
---

One heading per topic, decisions first, then who does what by when.
```

Les skills se placent dans :

- `~/.config/rumbo/skills/<name>/` (`~/Library/Application Support/rumbo/skills/` sur macOS), les
  vôtres ;
- `.agents/skills/<name>/` dans le répertoire où rumbo a démarré, et dans aucun au-dessus. Sa skill
  remplace l'une des vôtres portant le même nom.
- `skills/<name>/` dans un [plugin](/fr/guides/plugins/) que vous avez ajouté. L'une des vôtres
  portant le même nom la remplace.

Seuls le nom, la description et le chemin sont envoyés avec chaque requête. Le modèle lit la skill
quand une tâche en a besoin, donc une skill coûte une ligne tant qu'elle n'est pas utilisée.

```sh
rumbo skills    # the skills the model is told of here, and those left out, with why
```

Dans l'interface en terminal, `/status` montre la même chose à côté de la conversation. Une skill est écartée quand une autre du même
nom l'a remplacée, ou quand son frontmatter manque, n'est pas fermé, n'est pas du YAML valide ou n'a pas
de description.

## L'environnement

Le modèle est aussi informé du répertoire où il travaille, de la plateforme et de la date. C'est tout :
rumbo ne détecte pas les projets et n'envoie rien sur aucun langage ni framework.
