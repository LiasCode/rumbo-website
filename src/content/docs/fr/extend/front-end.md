---
title: Écrire une interface
description: Construisez votre propre interface pour rumbo, une extension d'éditeur, un bot ou une application web, en parlant l'Agent Frontend Protocol, du JSON-RPC sur stdio, avec l'hôte rumbo.
---

Une interface (front end) est ce qu'une personne utilise pour donner des tâches et suivre le travail.
C'est un programme à part entière, dans n'importe quel langage, qui parle
l'[Agent Frontend Protocol](/fr/reference/frontend-protocol/) avec l'hôte rumbo. L'interface en
terminal, la sortie en texte brut et l'[application de bureau](/fr/guides/desktop-app/) sont toutes des
interfaces, et aucune n'a de raccourci.

Écrivez-en une pour amener rumbo dans un éditeur, un bot de discussion, une page web ou votre propre
flux de travail.

## Deux façons de se connecter

Les messages sont des objets JSON-RPC 2.0, un par ligne, identiques dans les deux cas :

| Qui démarre qui                                               | L'interface lit depuis      | L'interface écrit vers      |
| ------------------------------------------------------------- | --------------------------- | --------------------------- |
| rumbo démarre une interface enregistrée (`rumbo -f <name>`)   | le descripteur de fichier 3 | le descripteur de fichier 4 |
| L'interface démarre `rumbo serve`, comme le ferait un éditeur | le stdout de l'hôte         | le stdin de l'hôte          |

Une interface démarrée par rumbo garde le terminal sur stdin et stdout, elle peut donc dessiner et
lire les touches librement. Fermer la connexion termine l'hôte : il annule les exécutions en cours, les
enregistre et arrête ses fournisseurs.

## Sa forme

1. **`initialize`** : l'hôte parle en premier, avec le répertoire, la session, le fournisseur et le
   modèle auxquels l'interface est rattachée, et la tâche donnée en ligne de commande, s'il y en a une.
2. **`run`** : l'interface envoie une tâche. L'hôte répond quand l'exécution est terminée : faite,
   échouée ou annulée.
3. Les notifications **`event`** rendent compte de l'exécution pendant qu'elle travaille : le texte du
   modèle, les appels d'outils et leurs résultats, les tokens dépensés et les diagnostics.
4. **`steer`** dit quelque chose à une exécution pendant qu'elle travaille, et **`cancel`** l'arrête.

Une interface peut aussi demander à l'hôte ce que lui et le fournisseur proposent (`describe`), appeler
leurs fonctions (`invoke`), montrer ce que contenait une session avant son ouverture (`history`) et
rappeler ce que la personne a demandé auparavant (`recall`).

## Un exemple complet

[examples/frontend.py](https://github.com/LiasCode/rumbo/blob/main/examples/frontend.py) est une
interface complète dans un seul fichier Python : elle demande des tâches avec `input()` et affiche les
événements à mesure qu'ils arrivent.

```python
def run(objective, request_id):
    """Send one objective and show events until the host answers the request."""
    send({"id": request_id, "method": "run", "params": {"objective": objective}})

    for line in from_host:
        frame = json.loads(line)

        if frame.get("method") == "event":
            show(frame["params"])
        elif frame.get("id") == request_id:
            result = frame["result"]
            print(f"\n[{result['status']}] {result.get('error', '')}")
            return
```

Enregistrez-la et utilisez-la :

```sh
rumbo frontend add simple python3 /path/to/examples/frontend.py
rumbo -f simple
```

En Go, le paquet [`protocol`](https://github.com/LiasCode/rumbo/tree/main/protocol) contient les types
et `DialFrontend`, une connexion prête à l'emploi.

## Des commandes sans les connaître

Tout ce qu'une personne peut faire en dehors de donner une tâche, comme changer de session, de modèle
ou de réglages, l'hôte le propose sous forme de fonctions décrites, et chaque fournisseur aussi. Une
interface construit ses commandes, formulaires et sélecteurs à partir de ces descriptions, si bien
qu'elle fonctionne avec un fournisseur qu'elle n'a jamais vu et gagne une nouvelle fonction sans aucun
changement. Une fonction irréversible le signale, pour que l'interface demande d'abord à la personne ;
une fonction d'un fournisseur peut poser une question à la personne, dont la réponse peut être secrète
et ne doit alors être ni affichée ni gardée.

Les [cas d'usage](/fr/reference/use-cases/#front-end) listent ce qu'une interface doit et peut faire,
et le [protocole](/fr/reference/frontend-protocol/) spécifie chaque message.
