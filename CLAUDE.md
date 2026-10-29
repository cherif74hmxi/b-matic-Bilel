# B MATIC — Instructions projet (lues automatiquement par Claude Code)

## Langue
- Réponds **en français**.

## Projet
- Site **B MATIC** (garage auto) : React + Vite + TypeScript + Tailwind + shadcn/ui, React Router.
- Évolution en cours décrite dans **`docs/PROJET-V2.md`** — on avance **phase par phase**.
- Backend : **Supabase** (Auth, Postgres, Storage), en place depuis la Phase 2 (voir *Supabase* plus bas).

## Charte graphique (à respecter absolument)
- Esprit **« leader du marché »** (Carglass, 123 Pare-Brise…) aux **couleurs du logo** :
  fond blanc, beaucoup d'air, très lisible, pro et rassurant. Pas de site sombre.
- **Couleur de marque : le violet du logo** (`primary`, #7B39EB) appliqué partout pareil :
  boutons/CTA, liens, icônes (dans un carré `bg-primary-soft`), sur-titres `.eyebrow`, mots
  accentués des titres, petits aplats (`bg-primary-soft`), bloc CTA final. Un accent fort
  par section.
- **Accent secondaire : le cyan du logo** (`highlight`, assombri) : coches, `.pill-highlight`.
- Mots accentués d'un titre : les écrire entre **[crochets]** dans `src/data/*`
  (rendu par `accentuer()` de `src/lib/accent.tsx`).
- **Jamais de dégradé sur un texte** (`.text-gradient-neon` n'est plus utilisé ; le logo garde
  le sien). Pas de lueurs (glow).
- Polices **Orbitron** (titres) + **Inter** (texte, boutons, navigation).
- Réutiliser les composants existants : `GlowCard`, `NeonButton`, classes `.btn-main`
  (violet plein) / `.btn-ghost` (contour violet).
- **Deux thèmes, clair par défaut** : bouton soleil / lune du menu (`ThemeToggle`), choix
  mémorisé dans localStorage (`src/lib/theme.ts`, préférence d'affichage = pas de consentement),
  appliqué avant l'affichage par le script en tête de `index.html` (même clé, testé).
  Sombre = `data-theme="sombre"` sur `<html>` (tokens dans `src/index.css`).
- **Toujours des tokens, jamais de couleur en dur** (`bg-background`, `text-foreground`,
  `bg-card`, `border-border`/`border-input`…) pour que les deux thèmes suivent.
  Aplats pleins avec texte blanc (boutons, bloc CTA, créneau choisi) → **`brand`**
  (violet exact du logo dans les deux thèmes). Textes, icônes, bordures et fonds doux →
  **`primary`** (éclairci en sombre pour rester lisible). Exceptions voulues : tuiles blanches
  des logos assureurs, bouton blanc du bloc CTA.
- Carte du centre : `MapEmbed` (iframe Google Maps affichée directement, adresse
  `src/data/legal.ts` → `mapsQuery`) + bouton « Itinéraire ».
- Images : `public/conseils/` (WebP 480→1600 + JPG pour l'OG), `public/assureurs/` (logos
  rognés, affichés par `InsurerLogos`), `public/cadeaux/` (photos détourées, carrousel `GiftCarousel`). Logos en bandeau défilant.
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

- **Routing**: `src/App.tsx` declares every route (French slugs such as `/pare-brise`, `/rendez-vous`, `/actualites`, `/conseils`, `/contact`, `/mentions-legales`, `/politique-de-confidentialite`; old slugs redirect via `legacyRedirects` and `vercel.json`) inside a single `Layout` (Header / main / Footer / CookieConsent). To add a page, create it in `src/pages/`, register the route in `App.tsx`, and add a link in `Header`/`Footer` if needed.
- **Path alias**: `@/` → `src/` (configured in both `vite.config.ts` and `vitest.config.ts`).
- **Data modules (`src/data/`) are the single source of truth for editable content**:
  - `legal.ts`: company identity, contact info (email/phone/WhatsApp), host and GDPR authority. Used by Contact, Footer, MentionsLegales and PolitiqueConfidentialite. The `[ ... ]` placeholders are meant to be filled in by the business owner. `country` (`"BE"`/`"FR"`) selects the supervisory authority.
  - `rendezvous.ts`: texts and choices of the multi-step quote/booking form (`/rendez-vous`, page `RendezVous.tsx`, steps in `components/rdv/`, logic in `lib/rendezvous.ts`). Slot rules are in `rdv.ts`, insurers in `assurances.ts`.
- **Forms**: Contact and RendezVous post to Formspree and to `leads` (Supabase). Every form has a mandatory GDPR consent checkbox. The booking form reserves the slot through the `book_rdv` RPC. No document is collected (no upload, no registration-document scan): the vehicle is entered by hand (plate, or make + model + year) and the garage contacts the insurer itself.
- **UI**: `src/components/ui/` holds generated shadcn/ui primitives, so avoid hand-editing them. The site's own look comes from the custom components `GlowCard`, `NeonButton` and `AnimatedSection` (an IntersectionObserver fade-in with a `delay` prop), plus the Tailwind theme tokens `neon-{blue,purple,pink,cyan}`, `text-gradient-neon`, `font-heading`/`font-body` and the `glow-pulse` animation, defined in `tailwind.config.ts` and `src/index.css`. Pages tend to use raw Tailwind and these components more than shadcn primitives.
- `CookieConsent` stores the user's choice in `localStorage` (inside try/catch).

## Supabase

- Client: `src/lib/supabase.ts` (single instance, plus `STORAGE_BUCKETS`). It reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` from `.env` (gitignored; template in `.env.example`) and throws if they are missing. Only the public (publishable) key may ever be used in the front end.
- Schema: `supabase/schema.sql` (re-runnable; run it in the Supabase SQL Editor). Tables are `admins`, `vehicles`, `vehicle_photos`, `posts`, `page_views` and `leads`, plus the public buckets `vehicle-photos` and `post-images`.
- RLS: visitors can read published content (vehicles `published`/`sold`, posts `published`) and can only *insert* into `page_views` and `leads`. All writes require `public.is_admin()`, meaning the user is listed in `public.admins`. Insert leads **without** `.select()`, because visitors cannot read them back.

## Graphify

A knowledge graph of the codebase is committed in `graphify-out/` (see `GRAPHIFY.md`). Prefer querying it (`/graphify`, `graphify query "..."`, `graphify explain "<Node>"`) over reading many files. After significant code changes, run `graphify update .` to rebuild it. This step is local and uses no LLM.
