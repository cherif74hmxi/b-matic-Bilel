# B MATIC — Instructions projet (lues automatiquement par Claude Code)

## Langue
- Réponds **en français**.

## Projet
- Site **B MATIC** (garage auto) : React + Vite + TypeScript + Tailwind + shadcn/ui, React Router.
- Évolution en cours décrite dans **`docs/PROJET-V2.md`** — on avance **phase par phase**.
- Backend prévu (phases ≥ 2) : **Supabase** (Auth, Postgres, Storage).

## Charte graphique (à respecter absolument)
- Thème sombre **néon B MATIC** : dégradé violet/rose/bleu (`--gradient-neon`).
- Polices **Orbitron** (titres) + **Inter** (texte).
- Réutiliser les composants existants : `GlowCard`, `NeonButton`, classes `.btn-main` / `.btn-ghost`.
- Voir `src/index.css` et `tailwind.config.ts` pour les tokens.

## Règles de travail
- **Mobile-first** : chaque page doit être impeccable sur téléphone.
- **RGPD** : pas de cookie de suivi ; consentement sur tout nouveau formulaire ; mettre à jour
  la politique de confidentialité si on collecte de nouvelles données. Secrets **jamais** côté front.
- **Contenus modifiables** (prix, services, assureurs, FAQ…) → dans des fichiers `src/data/*`
  commentés et faciles à éditer, pas en dur dans les composants.
- **Avant chaque commit** : `npm run build` doit passer **sans erreur**. Commits clairs, par sous-tâche.
- **Graphify** : le graphe existe (`graphify-out/`). Interroger le graphe pour localiser le code
  plutôt que tout relire. Lancer `graphify update .` après des changements de structure.
- **En cas de doute ou de choix d'architecture important : s'arrêter et demander** avant de décider.

## Infos
- Pays : **Belgique**. Infos légales dans `src/data/legal.ts` (à compléter).
