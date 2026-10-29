# Graph Report - b-matic-Bilel  (2026-10-29)

## Corpus Check
- 194 files · ~165,896 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1259 nodes · 2955 edges · 64 communities (53 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bb4e8760`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UI Cards & Menus Radix
- Dépendances runtime
- Primitives Radix UI
- Instructions projet & RGPD
- Pages & composants animés
- SlotPicker.tsx
- RdvSteps.tsx
- SEO & balises head
- Sidebar & Sheet UI
- AdminActualiteForm.tsx
- lucide-react
- Edge function IA (Gemini)
- Logo & layout admin
- Toasts
- Actualités & accueil
- Admin : en-têtes & statuts
- Routage App.tsx
- posts.ts
- package.json
- Carte grise & dialogues
- DevDependencies & lint
- Actions admin véhicules/articles
- select.tsx
- input-otp.tsx
- Image Open Graph B MATIC (partage social)
- Site, pages & prérendu
- tsconfig.app
- AdminDashboard.tsx
- Conseils & data source unique
- registrationScan.ts
- Alertes & toggles UI
- AnimatedSection.tsx
- components.json shadcn
- Formulaires react-hook-form
- Boutons & calendrier
- PareBrise.tsx
- Carousel
- react
- tsconfig.node
- drawer.tsx
- slug.ts
- ChunkErrorBoundary
- @tanstack/react-query
- aiCopy.ts
- Graphiques recharts
- tsconfig racine
- Sheet UI
- Navigation menu UI
- Scripts npm
- Index.tsx
- Configuration Vercel
- ESLint
- Polices & point d entrée
- Photo hero garage
- Thème & Sonner
- Types Vite
- Aspect ratio UI
- Collapsible UI
- Tailwind
- Setup tests
- Placeholder SVG
- README Lovable

## God Nodes (most connected - your core abstractions)
1. `cn()` - 226 edges
2. `react` - 80 edges
3. `lucide-react` - 52 edges
4. `useSeo()` - 38 edges
5. `react-router-dom` - 30 edges
6. `PostForm()` - 21 edges
7. `AdminDashboard()` - 20 edges
8. `AnimatedSection()` - 19 edges
9. `compilerOptions` - 19 edges
10. `PostActionsMenu()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Logo B MATIC (PNG, public)` --semantically_similar_to--> `Logo B MATIC (WebP, assets)`  [INFERRED] [semantically similar]
  public/logo.png → src/assets/bmatic-logo.webp
- `Mobile-first global` --semantically_similar_to--> `Regles de travail (mobile-first, RGPD, build avant commit)`  [INFERRED] [semantically similar]
  docs/PROJET-V2.md → CLAUDE.md
- `Logo B MATIC (WebP, assets)` --conceptually_related_to--> `Identité visuelle B MATIC : voiture de sport stylisée, circuits et engrenages, dégradé bleu/violet/rose sur fond blanc`  [INFERRED]
  src/assets/bmatic-logo.webp → public/logo.png
- `PrerenderPage` --references--> `injectHead()`  [EXTRACTED]
  vite-plugin-seo.ts → api/_lib/head.ts
- `index.html (point d'entree Vite et meta SEO)` --conceptually_related_to--> `SEO (FAQ, donnees structurees, SEO local)`  [INFERRED]
  index.html → docs/PROJET-V2.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Ajout vehicule assiste (VIN, photos guidees, description IA)** — docs_projet_v2_espace_admin, docs_projet_v2_vin_nhtsa, docs_projet_v2_photos_guidees, docs_projet_v2_assistant_ia [EXTRACTED 1.00]
- **Offre pare-brise (page, donnees, cadeaux, assureurs)** — docs_projet_v2_page_pare_brise, src_data_parebrise, docs_projet_v2_data_assurances, docs_projet_v2_gift_illustration [EXTRACTED 1.00]
- **Stack backend Supabase (Auth, schema, RLS, Edge Functions)** — claude_supabase_backend, claude_supabase_schema, claude_rls_policy, docs_projet_v2_edge_functions [INFERRED 0.85]

## Communities (64 total, 11 thin omitted)

### Community 0 - "UI Cards & Menus Radix"
Cohesion: 0.07
Nodes (48): @radix-ui/react-context-menu, @radix-ui/react-menubar, @radix-ui/react-tabs, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList (+40 more)

### Community 1 - "Dépendances runtime"
Cohesion: 0.03
Nodes (58): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+50 more)

### Community 2 - "Primitives Radix UI"
Cohesion: 0.07
Nodes (19): @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-progress, @radix-ui/react-slider, @radix-ui/react-switch, react-resizable-panels, Avatar (+11 more)

### Community 3 - "Instructions projet & RGPD"
Cohesion: 0.06
Nodes (43): CLAUDE.md (instructions projet B MATIC), Modules src/data (source unique du contenu editable), Formulaires Formspree (Contact, Reprise, Mecanique), src/data/legal.ts (identite legale et contacts), Routage App.tsx et Layout unique, Backend Supabase (Auth, Postgres, Storage, RLS), Schema Supabase (admins, vehicles, vehicle_photos, posts, page_views, leads), Composants UI maison (GlowCard, NeonButton, AnimatedSection) (+35 more)

### Community 4 - "Pages & composants animés"
Cohesion: 0.12
Nodes (25): APropos, Contact, MentionsLegales, PolitiqueConfidentialite, GlowCard(), GlowCardProps, LegalPage(), LegalPageProps (+17 more)

### Community 5 - "SlotPicker.tsx"
Cohesion: 0.16
Nodes (23): AdminPageHeader(), AdminPageHeaderProps, MONTHS, pad(), SlotPicker(), ymd(), rdvHeures, rdvRegles (+15 more)

### Community 6 - "RdvSteps.tsx"
Cohesion: 0.07
Nodes (70): ChoiceButton(), ChoiceGroup(), DocumentsUpload(), errorMessage(), PieceState, GlassDiagram(), vitres, AssuranceStep() (+62 more)

### Community 7 - "SEO & balises head"
Cohesion: 0.08
Nodes (25): clipDescription(), escapeAttr(), HeadMeta, headTags(), injectHead(), jsonLdScript(), SITE_NAME, GET() (+17 more)

### Community 8 - "Sidebar & Sheet UI"
Cohesion: 0.07
Nodes (30): Input, Separator, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent (+22 more)

### Community 9 - "AdminActualiteForm.tsx"
Cohesion: 0.11
Nodes (29): @hookform/resolvers, zod, AiAssistButton(), SlugSuggestion(), Field(), FormSection(), adminInputClass, adminSelectClass (+21 more)

### Community 10 - "lucide-react"
Cohesion: 0.27
Nodes (9): lucide-react, react-router-dom, Conseils, AccordionContent, AccordionItem, AccordionTrigger, horairesResume, RDV_PATH (+1 more)

### Community 11 - "Edge function IA (Gemini)"
Cohesion: 0.07
Nodes (28): allowed, BadRequest, callGemini(), callsByUser, cleanRegistration(), cleanSlug(), clientIp(), consumeScanQuota() (+20 more)

### Community 12 - "Logo & layout admin"
Cohesion: 0.15
Nodes (25): Identité visuelle B MATIC : voiture de sport stylisée, circuits et engrenages, dégradé bleu/violet/rose sur fond blanc, Logo B MATIC (PNG, public), @supabase/supabase-js, Logo B MATIC (WebP, assets), AdminLayout(), navItems, AccessDenied(), AdminLoading() (+17 more)

### Community 13 - "Toasts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 14 - "Actualités & accueil"
Cohesion: 0.24
Nodes (13): ActualiteDetail, Actualites, actualitesSeo, actualitesTextes, autoExcerpt(), formatPostDate(), getPublicPost(), paragraphs() (+5 more)

### Community 15 - "Admin : en-têtes & statuts"
Cohesion: 0.26
Nodes (10): PostStatusBadge(), fmt, ViewsCount(), ContentKind, ContentViews, fetchContentViews(), useContentViews(), listPosts() (+2 more)

### Community 16 - "Routage App.tsx"
Cohesion: 0.20
Nodes (12): AdminApp, App(), legacyRedirects, NotFound, PareBrise, PublicLayout(), publicRoutes, queryClient (+4 more)

### Community 17 - "posts.ts"
Cohesion: 0.19
Nodes (17): Post, POST_STATUS_LABELS, PostStatus, STORAGE_BUCKETS, thumbPath(), bucket(), deletePost(), removePostCover() (+9 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, autoprefixer, clsx, @dnd-kit/core, @dnd-kit/sortable (+18 more)

### Community 19 - "Carte grise & dialogues"
Cohesion: 0.12
Nodes (18): cmdk, @radix-ui/react-dialog, Command, CommandDialog(), CommandDialogProps, CommandEmpty, CommandGroup, CommandInput (+10 more)

### Community 20 - "DevDependencies & lint"
Cohesion: 0.08
Nodes (24): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+16 more)

### Community 21 - "Actions admin véhicules/articles"
Cohesion: 0.15
Nodes (20): PostActionsMenu(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay (+12 more)

### Community 22 - "select.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-select, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 23 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 25 - "Site, pages & prérendu"
Cohesion: 0.23
Nodes (20): conseils, conseilTexte(), absoluteUrl(), siteUrl, JSON_LD, pageUrl(), prerenderPages(), accueilJsonLd() (+12 more)

### Community 26 - "tsconfig.app"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 27 - "AdminDashboard.tsx"
Cohesion: 0.06
Nodes (65): date-fns, @testing-library/react, METRIC_LABELS, nf, niceMax(), plural(), TrafficChart(), TrafficChartProps (+57 more)

### Community 28 - "Conseils & data source unique"
Cohesion: 0.21
Nodes (15): ConseilDetail, ConseilPhoto(), cadeaux, Conseil, CONSEIL_IMAGE_LARGEURS, CONSEIL_IMAGE_TAILLE, ConseilBloc, ConseilImage (+7 more)

### Community 29 - "registrationScan.ts"
Cohesion: 0.07
Nodes (44): @jsquash/webp, Corner(), DocSketch(), RegistrationScanner(), scanTextes, marques, vehiculesData, invokeAiFunction() (+36 more)

### Community 30 - "Alertes & toggles UI"
Cohesion: 0.14
Nodes (15): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert, AlertDescription, AlertTitle, alertVariants, Badge() (+7 more)

### Community 31 - "AnimatedSection.tsx"
Cohesion: 0.27
Nodes (9): AnimatedSection(), AnimatedSectionProps, canRunAmbientMotion(), isLowEndDevice(), prefersReducedMotion(), Ctas(), PareBrise(), Puces() (+1 more)

### Community 32 - "components.json shadcn"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 33 - "Formulaires react-hook-form"
Cohesion: 0.18
Nodes (14): @radix-ui/react-label, react-hook-form, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+6 more)

### Community 34 - "Boutons & calendrier"
Cohesion: 0.15
Nodes (13): @radix-ui/react-slot, react-day-picker, ButtonProps, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis() (+5 more)

### Community 35 - "PareBrise.tsx"
Cohesion: 0.12
Nodes (24): GiftGrid(), FaqCategorie, FaqItem, faqItems, legalInfo, franchiseCondition, pareBriseAssurances, PareBriseCadeau (+16 more)

### Community 36 - "Carousel"
Cohesion: 0.17
Nodes (15): embla-carousel-react, Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+7 more)

### Community 37 - "react"
Cohesion: 0.14
Nodes (15): @radix-ui/react-popover, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, react, CookieConsent(), Footer(), Header(), navLinks (+7 more)

### Community 38 - "tsconfig.node"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 39 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 40 - "slug.ts"
Cohesion: 0.52
Nodes (5): isUniqueViolation(), SLUG_MAX, uniqueSlug(), withFreeSlug(), withSuffix()

### Community 42 - "@tanstack/react-query"
Cohesion: 0.60
Nodes (4): @tanstack/react-query, bucket(), LeadDocuments(), pieceLabel()

### Community 44 - "aiCopy.ts"
Cohesion: 0.28
Nodes (8): AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, Nullable, PostCopyInput, useAiCopy()

### Community 45 - "Graphiques recharts"
Cohesion: 0.24
Nodes (11): recharts, ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent (+3 more)

### Community 48 - "tsconfig racine"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 50 - "Sheet UI"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 52 - "Navigation menu UI"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 54 - "Scripts npm"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 55 - "Index.tsx"
Cohesion: 0.11
Nodes (23): leaflet, HeroBackground(), InsurerLogos(), largeurOptique(), ITINERAIRE_URL, MapEmbed(), q, accueilArguments (+15 more)

### Community 57 - "Configuration Vercel"
Cohesion: 0.25
Nodes (7): includeFiles, cleanUrls, functions, api/share.ts, headers, redirects, rewrites

### Community 58 - "ESLint"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 60 - "Polices & point d entrée"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

### Community 62 - "Photo hero garage"
Cohesion: 0.67
Nodes (4): Hero garage photo (JPG) - modern workshop interior, Homepage hero background: clean, bright modern garage workshop with two vehicles on lifts, mechanic at diagnostic cart, grey/steel palette, polished epoxy floor, skylight, Hero garage photo (WebP mobile), Hero garage photo (WebP desktop)

### Community 64 - "Thème & Sonner"
Cohesion: 0.40
Nodes (4): next-themes, sonner, Toaster(), ToasterProps

## Knowledge Gaps
- **33 isolated node(s):** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `tailwindcss-animate`, `@playwright/test` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 364 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `UI Cards & Menus Radix`, `Primitives Radix UI`, `Pages & composants animés`, `SlotPicker.tsx`, `RdvSteps.tsx`, `Sidebar & Sheet UI`, `AdminActualiteForm.tsx`, `lucide-react`, `Logo & layout admin`, `Toasts`, `Actualités & accueil`, `Routage App.tsx`, `package.json`, `Carte grise & dialogues`, `Actions admin véhicules/articles`, `select.tsx`, `input-otp.tsx`, `AdminDashboard.tsx`, `registrationScan.ts`, `Alertes & toggles UI`, `AnimatedSection.tsx`, `Formulaires react-hook-form`, `Boutons & calendrier`, `Carousel`, `drawer.tsx`, `ChunkErrorBoundary`, `Graphiques recharts`, `Sheet UI`, `Navigation menu UI`, `Index.tsx`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **What connects `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Cards & Menus Radix` be split into smaller, more focused modules?**
  _Cohesion score 0.06708595387840671 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `UI Cards & Menus Radix`, `Primitives Radix UI`, `Pages & composants animés`, `SlotPicker.tsx`, `RdvSteps.tsx`, `Sidebar & Sheet UI`, `AdminActualiteForm.tsx`, `Logo & layout admin`, `Toasts`, `Actualités & accueil`, `Admin : en-têtes & statuts`, `package.json`, `Carte grise & dialogues`, `Actions admin véhicules/articles`, `select.tsx`, `input-otp.tsx`, `AdminDashboard.tsx`, `Conseils & data source unique`, `registrationScan.ts`, `Boutons & calendrier`, `PareBrise.tsx`, `Carousel`, `react`, `@tanstack/react-query`, `Sheet UI`, `Navigation menu UI`, `Index.tsx`?**
  _High betweenness centrality (0.194) - this node is a cross-community bridge._
- **Should `Dépendances runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.034482758620689655 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Dépendances runtime` to `package.json`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `Primitives Radix UI` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._