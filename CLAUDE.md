# B MATIC — Instructions projet (lues automatiquement par Claude Code)

## Langue
- Réponds **en français**.

## Projet
- Site **B MATIC** (garage auto) : React + Vite + TypeScript + Tailwind + shadcn/ui, React Router.
- Évolution en cours décrite dans **`docs/PROJET-V2.md`** — on avance **phase par phase**.
- Backend : **Supabase** (Auth, Postgres, Storage), en place depuis la Phase 2 (voir *Supabase* plus bas).

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

---

# Technical reference

## Project

Marketing/booking website for **B MATIC**, a car garage (mechanics, towing, vehicle buy-back, detailing). The project was scaffolded with Lovable (Vite + React 18 + TypeScript + shadcn/ui + Tailwind). All UI copy, comments and data are in **French**, so keep new text in French. The existing forms post directly to Formspree; Supabase is the backend for the V2 features (admin, vehicles, posts, analytics, leads).

## Commands

npm and bun lockfiles both exist; npm works.

```bash
npm run dev          # Vite dev server on port 8080
npm run build        # production build
npm run build:dev    # development-mode build (enables lovable-tagger)
npm run lint         # eslint .
npm test             # vitest run (jsdom, globals, setup in src/test/setup.ts)
npm run test:watch
npx vitest run src/test/example.test.ts   # single file
npx vitest run -t "test name"             # single test by name
```

Tests must match `src/**/*.{test,spec}.{ts,tsx}`. `playwright.config.ts` uses Lovable's preset (`lovable-agent-playwright-config`). No e2e tests exist yet.

## Architecture

- **Routing**: `src/App.tsx` declares every route (French slugs such as `/a-propos`, `/reprise`, `/mecanique`, `/depannage`, `/mentions-legales`, `/politique-de-confidentialite`) inside a single `Layout` (Header / main / Footer / CookieConsent). To add a page, create it in `src/pages/`, register the route in `App.tsx`, and add a link in `Header`/`Footer` if needed.
- **Path alias**: `@/` → `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).
- **Data modules (`src/data/`) are the single source of truth for editable content**:
  - `legal.ts`: company identity, contact info (email/phone/WhatsApp), host and GDPR authority. Used by Contact, Footer, MentionsLegales and PolitiqueConfidentialite. The `[ ... ]` placeholders are meant to be filled in by the business owner. `country` (`"BE"`/`"FR"`) selects the supervisory authority.
  - `services.ts`: the service catalogue for the booking page (`/mecanique`). `priceType` is `"fixe"`, `"from"` or `"devis"`, and it drives how prices are displayed and submitted. Most prices are marked "À CONFIRMER".
  - `vehicules.ts`: make/model data for the buy-back form (`/reprise`).
- **Forms**: Contact, Reprise and Mecanique `fetch` Formspree endpoints directly. Each form manages its own `{ status, message }` state with a mandatory GDPR consent checkbox. Mecanique sends `FormData` when a registration-document file (carte grise: JPG/PNG/PDF, ≤5 MB) is attached, and JSON otherwise.
- **UI**: `src/components/ui/` holds generated shadcn/ui primitives, so avoid hand-editing them. The site's own look comes from the custom components `GlowCard`, `NeonButton` and `AnimatedSection` (an IntersectionObserver fade-in with a `delay` prop), plus the Tailwind theme tokens `neon-{blue,purple,pink,cyan}`, `text-gradient-neon`, `font-heading`/`font-body` and the `glow-pulse` animation, defined in `tailwind.config.ts` and `src/index.css`. Pages tend to use raw Tailwind and these components more than shadcn primitives.
- `CookieConsent` stores the user's choice in `localStorage` (inside try/catch).

## Supabase

- Client: `src/lib/supabase.ts` (single instance, plus `STORAGE_BUCKETS`). It reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from `.env` (gitignored; template in `.env.example`) and throws if they are missing. Only the public (publishable) key may ever be used in the front end.
- Schema: `supabase/schema.sql` (re-runnable; run it in the Supabase SQL Editor). Tables are `admins`, `vehicles`, `vehicle_photos`, `posts`, `page_views` and `leads`, plus the public buckets `vehicle-photos` and `post-images`.
- RLS: visitors can read published content (vehicles `published`/`sold`, posts `published`) and can only *insert* into `page_views` and `leads`. All writes require `public.is_admin()`, meaning the user is listed in `public.admins`. Insert leads **without** `.select()`, because visitors cannot read them back.

## Graphify

A knowledge graph of the codebase is committed in `graphify-out/` (see `GRAPHIFY.md`). Prefer querying it (`/graphify`, `graphify query "..."`, `graphify explain "<Node>"`) over reading many files. After significant code changes, run `graphify update .` to rebuild it. This step is local and uses no LLM.
