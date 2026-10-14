# Graphify — graphe de connaissances du projet

Ce projet utilise [Graphify](https://github.com/Graphify-Labs/graphify) : le code est
transformé en un **graphe de connaissances interrogeable**, pour que les assistants IA
(Claude Code, etc.) répondent en **interrogeant le graphe** au lieu de relire tous les
fichiers — ce qui consomme beaucoup moins de tokens, surtout à mesure que le projet grossit.

Le graphe est **versionné** dans `graphify-out/` (seul `graphify-out/cache/` est ignoré).

## Installation sur ta machine (une seule fois)

```bash
uv tool install graphifyy      # installe la CLI « graphify »
graphify install               # installe la skill /graphify dans ton Claude Code
```

(Besoin de `uv` : https://docs.astral.sh/uv/ — ou `pipx install graphifyy`.)

## Utilisation au quotidien

- Dans Claude Code, pose tes questions normalement : la skill `/graphify` interroge le
  graphe automatiquement. Tu peux aussi l'invoquer explicitement avec `/graphify .`.
- En ligne de commande :
  ```bash
  graphify query "où est gérée la soumission des formulaires ?"
  graphify explain "Mecanique"
  graphify god-nodes          # les fichiers/concepts les plus centraux
  ```

## Reconstruire le graphe après des changements de code

L'extraction du code est **100 % locale, sans LLM (0 token)** :

```bash
graphify update .
```

À lancer après avoir ajouté/modifié du code (ex. nouvelles fonctionnalités : gestion
d'utilisateurs, authentification, base de données…). Tu peux aussi laisser Graphify
surveiller le dossier en continu :

```bash
graphify watch .
```

## Voir le graphe

Ouvre `graphify-out/graph.html` dans un navigateur pour une vue interactive, ou lis
`graphify-out/GRAPH_REPORT.md` pour un résumé des concepts clés.
