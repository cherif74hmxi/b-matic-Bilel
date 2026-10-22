# B MATIC — Cahier des charges V2 (évolution du site)

> Document de référence pour faire évoluer le site B MATIC de **site vitrine**
> vers une **application web** avec espace d'administration, base de données,
> annonces de véhicules, actualités, assistance IA et SEO renforcé.
>
> **Lis aussi `GRAPHIFY.md`** et reconstruis le graphe (`graphify update .`) avant de coder.
> **Travaille PHASE PAR PHASE** (voir §8). Ne commence pas une phase sans avoir validé la précédente.

---

## 1. Contexte & état actuel

- Stack actuelle : **React + Vite + TypeScript + Tailwind + shadcn/ui**, React Router.
- Site **100% front-end** (pas de backend). Formulaires envoyés via **Formspree**.
- **Charte graphique (à conserver absolument)** : thème sombre néon B MATIC —
  dégradé violet/rose/bleu (`--gradient-neon`), polices **Orbitron** (titres) + **Inter** (texte),
  composants `GlowCard`, `NeonButton`, classes `.btn-main` / `.btn-ghost`. Voir `src/index.css` et `tailwind.config.ts`.
- **RGPD déjà en place** : politique de confidentialité, mentions légales, bannière cookies,
  consentements. Les nouvelles fonctionnalités doivent rester conformes (voir §7).
- Pays d'exploitation : **Belgique** (tél +32, assureurs belges). `src/data/legal.ts` → `country: "BE"`.

## 2. Objectifs

1. Un site qui s'inspire de la structure de **sparkauto.be** (garage + detailing) **mais dans la DA néon B MATIC**.
2. Mettre en avant les **promotions** et l'**offre pare-brise / assurances** (voir §5).
3. Donner au **propriétaire** un **espace admin** pour publier des **véhicules à vendre** et des **actualités**,
   avec **assistance IA** et **gain de temps** (VIN, photos guidées).
4. **100% pensé mobile** (mobile-first), au-delà du simple responsive.
5. **Renforcer le référencement (SEO)** — FAQ, données structurées, SEO local.

## 3. Décisions techniques (actées)

- **Backend : Supabase** (offre gratuite) → Auth (connexion admin), base PostgreSQL,
  Storage (photos), Row Level Security. Le propriétaire devra créer un projet Supabase
  et fournir `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (clé publique, OK côté front).
- **Secrets** (clé IA, clé service) : **jamais** côté front. Les opérations sensibles passent par des
  **Supabase Edge Functions**. La clé IA et la `service_role` restent côté serveur.
- **Assistant IA admin** (descriptions véhicules/actus) : via une Edge Function appelant un LLM.
  Recommandé **Google Gemini** (palier gratuit puis coût minime, faible volume car usage proprio seul).
  Le proprio fournit une `GEMINI_API_KEY` (stockée en secret Supabase).
- **Chatbot client** : **reporté** (phase ultérieure). Préparer la FAQ de façon à pouvoir l'alimenter plus tard.
- **Pré-remplissage VIN** : API **NHTSA vPIC** (gratuite, sans clé : `https://vpic.nhtsa.dot.gov/api/`).
  ⚠️ Couverture **best-effort** pour les véhicules européens (marque/modèle/année souvent OK,
  finition/options partielles). Toujours laisser le proprio **compléter/corriger**. Ne pas promettre l'exactitude.
- **Analytics / KPI** : **sans cookie** (respect RGPD) → journaliser les vues de page dans une table
  Supabase (pas de service tiers, pas de cookie). Pas de Google Analytics par défaut.
- **Déploiement cible** (plus tard) : front sur Vercel/Netlify (gratuit), backend sur Supabase.

## 4. Pages & fonctionnalités à livrer

### Public (visiteurs)
- **Accueil** repensé (inspiration sparkauto, DA B MATIC) : hero, services, mise en avant
  **promotions** et **offre pare-brise**, preuve sociale, CTA RDV/contact. Mobile-first.
- **Pare-brise & Assurances** (page `/pare-brise`, ancienne adresse `/pare-brise-assurances` redirigée, voir §5).
  Contenu dans `src/data/parebrise.ts`, cadeaux en **illustrations maison** (`GiftIllustration`, pas de
  photos produits ni de logos) et **carrousel défilant** des assureurs (badges texte, structure
  prête à recevoir des logos via `src/data/assurances.ts`).
- **Conseils** (nouvelle page `/conseils`, inspiration `sparkauto.be/conseils`) : **grille d'articles**
  (vignette + titre + extrait) + **pages détail** `/conseils/:slug` avec données structurées **`Article`**.
  Articles éditables dans `src/data/conseils.ts`. **Remplace l'ancienne page FAQ** ; les questions
  fréquentes sont repliées en bas de `/conseils` (accordéon) et conservent le balisage **schema.org
  FAQPage** (combiné à un `ItemList` dans un même `@graph`) pour le SEO. Données dans `src/data/faq.ts`.
- **Véhicules à vendre** : liste + **page détail** façon **autohero** (galerie photos, caractéristiques,
  prix, CTA contact/WhatsApp). Données structurées `Vehicle`/`Car`.
- **Actualités** : liste + page détail (blog du garage).
- Pages existantes conservées/améliorées : Mécanique (réservation), Reprise (à simplifier, §6), Contact, À propos, Dépannage.

### Admin (propriétaire, connecté)
- **Connexion sécurisée** (Supabase Auth).
- **Tableau de bord KPI** : nb de visites (total + 30 derniers jours), nb de véhicules publiés,
  nb d'actualités, nb de demandes reçues (contact / RDV / reprise). Idées bonus : pages les plus vues,
  dernières demandes. (À affiner, proposer d'autres KPI utiles à un garage.)
- **Gestion des véhicules** (CRUD) :
  - Ajout guidé avec **emplacements photos par angle** façon **leboncoin** (voir §5.3).
  - **Pré-remplissage par VIN** (NHTSA) : le proprio tape le VIN → marque/modèle/année/moteur se remplissent, il complète.
  - **Bouton "Générer la description" (IA)** : propose titre + description commerciale à partir des infos saisies.
  - Champs : marque, modèle, année, km, carburant, boîte, puissance, prix, description, photos, statut (brouillon/publié/vendu).
- **Gestion des actualités** (CRUD) : titre, contenu, image(s), date, statut. **Assistant IA** pour proposer titre + description.
- Les deux (véhicules & actus) accessibles depuis le **même espace admin**, via onglets distincts.

## 5. Contenus spécifiques

### 5.1 Offre pare-brise (page `/pare-brise` + bloc sur l'accueil)
- Contenu **entièrement** dans `src/data/parebrise.ts` (la page ne fait que l'afficher).
  Données structurées **Service + FAQPage** ; mot-clé cible **« remplacement pare-brise Liège »**.
- Accroche : **« Votre pare-brise remplacé. Franchise offerte + jusqu'à 300 € ou un cadeau. »**
- Sous-titre : Liège et **jusqu'à 70 km autour** · 0 € à avancer · Toutes assurances · 7j/7.
- **Cadeaux** (le client en choisit UN) : Jusqu'à 300 € · GTA 6 + FC 27 · Nintendo Switch 2 · iPad ·
  Trottinette électrique · Jusqu'à 4 pneus · Air Fryer Ninja · Aspirateur Tineco
  (illustrations maison, sans photos produits ni logos).
- Compris : franchise offerte · 0 € à avancer · toutes assurances · jusqu'à 300 € ou un cadeau · ouvert 7j/7 (10h–19h).
- Au centre (Ans, 7j/7 10h–19h) **ou** à domicile/au travail. Zone : Liège, Ans, Herstal, Seraing, Flémalle,
  Saint-Nicolas, Grâce-Hollogne, Visé, Verviers, Huy, Waremme (+70 km autour de Liège).
- Qualité : vitrages **conformes à la norme européenne 43R**, capteurs compris, pose garantie.
- Liberté de choix du réparateur ; FAQ de 8 questions (schema FAQPage).
- CTA : « Réserver mon créneau » / « Obtenir mon devis et mon cadeau » → `/mecanique` + téléphone **+32 470 85 35 51**.
- Mention légale (petits caractères) :
  *« Devis écrit remis avant toute intervention. La prise en charge dépend de votre contrat et de l'accord de votre assureur. Cadeau ou montant selon le remplacement effectué et la prise en charge bris de glace. »*

### 5.2 Assureurs partenaires (carrousel, liste dans `src/data/assurances.ts`)
Ethias · P&V Assurances · Belfius Assurance · BNP Paribas Fortis Assurance · CBC Assurance · KBC Assurance
— **et toutes les autres assurances** (liste facilement extensible).
> À COMPLÉTER par le proprio si besoin (ex. AXA, Baloise, AG…).

### 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin)
Photo de couverture · 3/4 avant gauche · 3/4 arrière droit · Intérieur conducteur · Intérieur passager ·
Profil gauche · Détail extérieur · Détail équipement 1 · Détail équipement 2 · Roue · Coffre · (+ ajouter d'autres).
Glisser-déposer, réordonnancement, 1 photo marquée "couverture".

### 5.4 Promotions (déjà dans `src/data/services.ts`)
Réutiliser la catégorie "Promotions" : Entretien 149 € · Plaquettes 99 € · Entretien + Plaquettes 239 €.
Les mettre en avant sur l'accueil.

## 6. Améliorations UX
- **Reprise refaite (fait)** : écran de choix « Scanner ma carte grise (~30 s, recommandé) » /
  « Remplir à la main (~2-3 min) » ; scan Gemini via l'Edge Function `generate-copy` (action
  `registration`, publique sous quotas en base : migration `scan_quota`, IP hachée 24 h) ; champs
  techniques uniquement, photo non conservée ; photos du véhicule guidées (facultatives) ;
  envoi Formspree + `leads`. Module réutilisé dans l'admin (`RegistrationScanner`).
- **Formulaire de reprise** : le simplifier (il est jugé trop long). Idées : moins d'étapes,
  **pré-remplissage VIN** (NHTSA), **ajout de photos façon leboncoin**, validation en temps réel,
  **100% mobile-first**. Garder l'envoi des demandes (Formspree ou table Supabase).
- **Mobile-first global** : revoir chaque page pour une expérience mobile impeccable
  (cibles tactiles ≥ 44px, pas de scroll horizontal, menus adaptés, images optimisées).

## 7. Contraintes transverses (à respecter à chaque phase)
- **Conserver la DA néon B MATIC** et réutiliser les composants existants.
- **RGPD** : toute nouvelle collecte de données → mise à jour de la politique de confidentialité ;
  analytics **sans cookie** ; consentement sur tout nouveau formulaire ; secrets jamais exposés.
- **Sécurité** : Row Level Security Supabase (public = lecture des contenus publiés uniquement ;
  écriture = admin authentifié). Pas de clé secrète dans le front. Valider/échapper les entrées.
- **Qualité** : `npm run build` doit passer sans erreur avant chaque commit. Commits clairs, par phase.
- **Graphify** : après chaque phase, `graphify update .`.
- **Skills à exploiter** (installées) : `/office-hours` et `/spec` (cadrage), `database-schema-designer`
  (schéma BDD), `api-endpoint-scaffolder`, `react-component-generator`, `responsive-layout-builder`,
  `/review` et `code-review-pro` (avant commit), `/qa` (tests navigateur), `accessibility-auditor`,
  `/impeccable` (finitions), et les skills **SEO** (`local-seo-optimizer`, `seo-optimizer`, `seo-geo`,
  `seo-keyword-cluster-builder`, `review-response-writer`) pour la phase SEO.

## 8. Plan par phases

> Faire valider chaque phase (build OK + revue) avant la suivante. Demander avant tout choix d'architecture important.

- **Phase 0 — Cadrage** : lire ce doc + `GRAPHIFY.md`, reconstruire le graphe, puis `/office-hours` ou `/spec`
  pour produire un plan détaillé de la Phase 1. Concevoir (sans l'implémenter encore) le **schéma de BDD**
  (`database-schema-designer`) : tables `vehicles`, `vehicle_photos`, `posts`, `page_views`, `leads` (demandes).
- **Phase 1 — Vitrine (sans backend, visible vite)** :
  1. Accueil repensé (inspiration sparkauto, DA B MATIC, mise en avant promos + pare-brise).
     **Condensé** (5 sections, ~5 CTA clés), fond d'ambiance **Aurora néon** (CSS léger) et CTA
     « Offre pare-brise » **scintillant**. Toute animation respecte **`prefers-reduced-motion`**.
  2. Page **Pare-brise & Assurances** (§5.1, §5.2) : cadeaux en illustrations maison + carrousel assureurs.
  3. Page **Conseils** (`/conseils` + `/conseils/:slug`, schema `Article`) **remplaçant la FAQ** ;
     bloc Questions fréquentes conservé en bas avec schema **FAQPage** (§4).
  4. **Mobile-first** sur l'ensemble. Barre d'action mobile : **WhatsApp** (numéro belge
     confirmé `+32 470 85 35 51`, source unique `src/data/legal.ts`) + Prendre RDV.
  → Finitions `/impeccable`, SEO on-page de base, build OK, commit.
- **Phase 2 — Fondations backend** : projet Supabase, schéma BDD, Storage (photos), Auth,
  variables d'environnement, RLS. (Le proprio crée le projet Supabase et fournit les clés.)
- **Phase 3 — Espace admin** : connexion, CRUD véhicules (photos guidées + VIN + description IA),
  CRUD actualités (assist IA), tableau de bord KPI.
- **Phase 4 — Pages publiques dynamiques** : liste + détail véhicules (façon autohero), liste + détail actualités,
  données structurées SEO (`Vehicle`, `LocalBusiness`/`AutoRepair`).
- **Phase 5 — UX** : simplification du formulaire de reprise (VIN + photos + mobile).
  (Option chatbot client : à cette étape ou plus tard.)
- **Phase 6 — SEO & qualité** : FAQ/structured data complètes, sitemap, meta/Open Graph, SEO local
  (Google Business Profile), performance, accessibilité (`accessibility-auditor`), puis déploiement.

## 9. Références visuelles / fonctionnelles
- Structure générale & FAQ : https://sparkauto.be/ et https://sparkauto.be/conseils/
- Page détail véhicule (cible) : autohero.com (galerie + specs + prix + CTA).
- Ajout photos guidé (cible) : parcours "déposer une annonce" de leboncoin (angles imposés).
- Offre pare-brise & visuel promo : fournis par le proprio (voir §5.1).

## 10. Actions à la charge du propriétaire (hors code)
- Créer un **compte + projet Supabase** (gratuit) → fournir URL + clé anon.
- Créer une **clé API Gemini** (pour l'assistant IA admin) → à mettre en secret Supabase.
- Fournir : **logos des assureurs**, **vraies photos** du garage/véhicules (ajoutées via l'admin),
  compléter les infos légales dans `src/data/legal.ts`, confirmer la liste des assureurs.
