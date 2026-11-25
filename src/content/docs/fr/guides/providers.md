---
title: Modèles et fournisseurs
description: Utilisez rumbo avec Claude via l'API d'Anthropic, les API d'OpenAI, un abonnement ChatGPT ou un modèle local sur Ollama, llama.cpp ou vLLM, et enregistrez votre propre fournisseur.
---

Un fournisseur est la façon dont rumbo atteint un modèle. C'est un programme distinct qui parle
l'[Agent Provider Protocol](/fr/reference/provider-protocol/) avec rumbo, et qui possède la connexion
au modèle et ses identifiants. rumbo en intègre trois, et vous pouvez en ajouter n'importe quel autre.

```sh
rumbo provider list              # the providers there are, built in and yours
rumbo provider models <name>     # the models one offers
rumbo provider show <name>       # its settings, their values, and where each comes from
```

## Choisir le modèle

Une nouvelle session commence avec le fournisseur par défaut et le modèle réglé pour lui. Une session
garde le fournisseur et le modèle qu'elle utilise d'un démarrage à l'autre.

```sh
rumbo system set default_provider=anthropic          # the provider new sessions start with
rumbo provider set anthropic model=claude-opus-5-5   # the model they start with there
rumbo -p openai -m <model> "a task"                  # another one, for this session
```

Dans l'interface en terminal, `/model <provider>/<model>` les change pour la session, `/model` seul
ouvre le sélecteur qui les liste, et `/providers` liste, affiche, configure, ajoute et retire les
fournisseurs.

## Anthropic

Le fournisseur `anthropic` atteint l'API de Claude. Il prend, dans cet ordre, `ANTHROPIC_API_KEY`,
`ANTHROPIC_AUTH_TOKEN`, la clé enregistrée par son `/login` ou le profil de `ant auth login`.

```sh
export ANTHROPIC_API_KEY=...
rumbo -p anthropic
```

Il liste les modèles que votre compte peut utiliser, propose une option `effort` et garde le
raisonnement du modèle pour pouvoir le poursuivre.

> Le fournisseur intégré `anthropic` utilise des identifiants API. Il ne propose pas de connexion via un abonnement Claude.

## OpenAI

Le fournisseur `openai` atteint la Responses API d'OpenAI avec `OPENAI_API_KEY`, ou la clé enregistrée
par son `/login`. Ses modèles de raisonnement ont besoin de la Responses API pour utiliser des outils
avec un niveau d'effort. Rien n'est stocké sur le serveur d'OpenAI.

```sh
export OPENAI_API_KEY=...
rumbo -p openai
```

## Abonnement ChatGPT

Le fournisseur `chatgpt` utilise votre abonnement ChatGPT au lieu d'une clé d'API, comme OpenAI le
propose aux applications open source qui tournent chez vous.

```sh
rumbo -p chatgpt                           # then /login signs in with ChatGPT, and /model chatgpt/ lists the plan's models
rumbo provider set chatgpt model=<model>   # the one new sessions there start with
```

`/login` ouvre une connexion dans le navigateur, qui revient à rumbo sur cette machine ; depuis une
autre machine, collez l'adresse sur laquelle le navigateur s'arrête. Son usage est décompté de votre
abonnement, que vous gérez dans les réglages de ChatGPT ; sa fonction `account` vous dit où.

## Modèles locaux et autres serveurs

Tout serveur compatible avec Chat Completions d'OpenAI fonctionne via le programme `openai`, y compris
les serveurs locaux comme Ollama, le serveur de llama.cpp ou vLLM. Enregistrez-le sous un nom à lui :

```sh
rumbo provider add -config '{"base_url":"http://localhost:11434/v1"}' local '{self}' provide openai
rumbo provider models local                                         # the models the server offers
rumbo provider set local model=qwen3-coder context_window=32768     # a server cannot say its context size
rumbo -p local "fix the failing test"                               # the session keeps its provider and model
```

`{self}` désigne l'exécutable de rumbo lui-même. Un fournisseur ajouté ainsi parle Chat Completions,
comme la plupart des serveurs, sauf si vous lui donnez `api=responses`. La clé d'API est lue dans la
variable que nomme sa configuration, `OPENAI_API_KEY` par défaut, ou dans ce que son `/login` a
enregistré pour cette adresse.

## Se connecter

Les fournisseurs intégrés proposent trois fonctions, qu'une interface propose comme des commandes.
Dans l'interface en terminal, ce sont celles du fournisseur de la session :

| Commande                    | Action                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/login`                    | `anthropic` et `openai` demandent une clé d'API, la vérifient avec une requête gratuite et la gardent ; `chatgpt` se connecte avec ChatGPT |
| `/logout`                   | Oublier la clé ou la connexion                                                                                                             |
| `/providers <name> account` | Dire quel identifiant est utilisé et d'où il vient, sans l'afficher                                                                        |

Les clés sont gardées dans `~/.config/rumbo/credentials/`, lisibles par vous seul. Un secret que vous
tapez à la question d'un fournisseur va au seul fournisseur et n'est enregistré nulle part.

## Options

Un fournisseur dit quelles options il accepte. Ceux intégrés proposent `effort`, l'intensité de la
réflexion du modèle. Réglez-la pour toutes les sessions d'un fournisseur, ou pour une seule :

```sh
rumbo provider set anthropic effort=high   # every session that uses anthropic
rumbo -o effort=low "a quick task"          # this session only
rumbo provider set anthropic effort=        # back to the provider's default
```

Dans l'interface en terminal, `/model effort=low` la règle pour la session. Voir la
[configuration](/fr/guides/configuration/) pour comprendre comment les niveaux s'articulent.

## Votre propre fournisseur

Tout programme qui répond à `initialize` et `complete` sur son stdin et son stdout est un fournisseur,
dans n'importe quel langage :

```sh
rumbo provider add mine /path/to/my-provider
rumbo -p mine -m some-model "..."
```

rumbo le démarre quand vous l'ajoutez, ce qui prouve qu'il fonctionne. Voir
[écrire un fournisseur](/fr/extend/provider/).
