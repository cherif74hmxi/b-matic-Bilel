# Graph Report - b-matic-Bilel  (2026-10-29)

## Corpus Check
- 214 files · ~122,234 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1374 nodes · 3473 edges · 74 communities (65 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- UI Cards & Menus Radix
- Dépendances runtime
- Primitives Radix UI
- Instructions projet & RGPD
- Pages & composants animés
- Rendez-vous & fonds visuels
- Catalogue véhicules & filtres
- SEO & balises head
- Sidebar & Sheet UI
- Formulaires admin
- Footer, horaires & cadeaux
- Edge function IA (Gemini)
- Logo & layout admin
- Toasts
- Actualités & accueil
- Admin : en-têtes & statuts
- Routage App.tsx
- Articles & assistant IA
- package.json
- Carte grise & dialogues
- DevDependencies & lint
- Actions admin véhicules/articles
- Photos véhicules
- Formulaire de reprise
- Fiche véhicule & galerie
- Site, pages & prérendu
- tsconfig.app
- Tableau de bord admin
- Conseils & data source unique
- Optimisation images WebP
- Alertes & toggles UI
- Décodage VIN
- components.json shadcn
- Formulaires react-hook-form
- Boutons & calendrier
- KPI & périodes
- Carousel
- Header & navigation
- tsconfig.node
- Prise de photos guidées
- Hero accueil
- Scanner carte grise
- Graphique de trafic
- Leads
- Génération de texte IA
- Graphiques recharts
- Modèle véhicule & contenu
- Suivi des clics & vues
- tsconfig racine
- Tests unitaires
- Sheet UI
- Slugs & création véhicule
- Navigation menu UI
- Drawer UI
- Scripts npm
- Assureurs
- Breadcrumb UI
- Configuration Vercel
- ESLint
- Input OTP
- Polices & point d entrée
- Avatar UI
- Photo hero garage
- Worker WebP
- Thème & Sonner
- Types Vite
- Aspect ratio UI
- Collapsible UI
- Tailwind
- Setup tests
- Placeholder SVG
- README Lovable

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 86 edges
3. `lucide-react` - 57 edges
4. `useSeo()` - 50 edges
5. `react-router-dom` - 37 edges
6. `AnimatedSection()` - 28 edges
7. `VehicleForm()` - 27 edges
8. `thumbPath()` - 22 edges
9. `PostForm()` - 21 edges
10. `AdminDashboard()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Logo B MATIC (PNG, public)` --semantically_similar_to--> `Logo B MATIC (WebP, assets)`  [INFERRED] [semantically similar]
  public/logo.png → src/assets/bmatic-logo.webp
- `Mobile-first global` --semantically_similar_to--> `Regles de travail (mobile-first, RGPD, build avant commit)`  [INFERRED] [semantically similar]
  docs/PROJET-V2.md → CLAUDE.md
- `Image Open Graph B MATIC (partage social)` --semantically_similar_to--> `Fond hero : atelier garage neon vide`  [INFERRED] [semantically similar]
  public/og-image.jpg → src/assets/hero-bg.webp
- `Logo B MATIC (WebP, assets)` --conceptually_related_to--> `Identité visuelle B MATIC : voiture de sport stylisée, circuits et engrenages, dégradé bleu/violet/rose sur fond blanc`  [INFERRED]
  src/assets/bmatic-logo.webp → public/logo.png
- `PrerenderPage` --references--> `injectHead()`  [EXTRACTED]
  vite-plugin-seo.ts → api/_lib/head.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Stack backend Supabase (Auth, schema, RLS, Edge Functions)** — claude_supabase_backend, claude_supabase_schema, claude_rls_policy, docs_projet_v2_edge_functions [INFERRED 0.85]
- **Offre pare-brise (page, donnees, cadeaux, assureurs)** — docs_projet_v2_page_pare_brise, src_data_parebrise, docs_projet_v2_data_assurances, docs_projet_v2_gift_illustration [EXTRACTED 1.00]
- **Ajout vehicule assiste (VIN, photos guidees, description IA)** — docs_projet_v2_espace_admin, docs_projet_v2_vin_nhtsa, docs_projet_v2_photos_guidees, docs_projet_v2_assistant_ia [EXTRACTED 1.00]

## Communities (74 total, 9 thin omitted)

### Community 0 - "UI Cards & Menus Radix"
Cohesion: 0.06
Nodes (52): @radix-ui/react-context-menu, @radix-ui/react-dropdown-menu, @radix-ui/react-menubar, @radix-ui/react-select, Card, CardContent, CardDescription, CardFooter (+44 more)

### Community 1 - "Dépendances runtime"
Cohesion: 0.04
Nodes (57): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+49 more)

### Community 2 - "Primitives Radix UI"
Cohesion: 0.05
Nodes (37): clsx, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-slider (+29 more)

### Community 3 - "Instructions projet & RGPD"
Cohesion: 0.06
Nodes (41): CLAUDE.md (instructions projet B MATIC), Formulaires Formspree (Contact, Reprise, Mecanique), Routage App.tsx et Layout unique, Backend Supabase (Auth, Postgres, Storage, RLS), Schema Supabase (admins, vehicles, vehicle_photos, posts, page_views, leads), Composants UI maison (GlowCard, NeonButton, AnimatedSection), PROJET-V2.md (cahier des charges V2), Actions a la charge du proprietaire (+33 more)

### Community 4 - "Pages & composants animés"
Cohesion: 0.11
Nodes (31): react-router-dom, APropos, Contact, Depannage, AnimatedSection(), AnimatedSectionProps, GlowCard(), GlowCardProps (+23 more)

### Community 5 - "Rendez-vous & fonds visuels"
Cohesion: 0.11
Nodes (37): Image Open Graph B MATIC (partage social), Fond hero : atelier garage neon vide, Fond mecanique : voiture de sport et mecanicien sous neons, rdvHeures, rdvRegles, rdvTextes, findService(), PriceType (+29 more)

### Community 6 - "Catalogue véhicules & filtres"
Cohesion: 0.10
Nodes (36): Vehicules, Chip(), FilterOptions, Group(), nf, VehicleFiltersPanel(), accueilDerniers, filtresKmMax (+28 more)

### Community 7 - "SEO & balises head"
Cohesion: 0.09
Nodes (27): clipDescription(), escapeAttr(), HeadMeta, headTags(), injectHead(), jsonLdScript(), SITE_NAME, FUEL (+19 more)

### Community 8 - "Sidebar & Sheet UI"
Cohesion: 0.07
Nodes (30): Input, Separator, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent (+22 more)

### Community 9 - "Formulaires admin"
Cohesion: 0.10
Nodes (29): Field(), FormSection(), adminInputClass, adminSelectClass, adminTextareaClass, SaveBar(), StagedBatch, StagedFile (+21 more)

### Community 10 - "Footer, horaires & cadeaux"
Cohesion: 0.11
Nodes (27): GiftIllustration(), shapes, horaires, horairesResume, legalInfo, GiftIllustrationKey, pareBriseAssurances, PareBriseCadeau (+19 more)

### Community 11 - "Edge function IA (Gemini)"
Cohesion: 0.08
Nodes (27): allowed, BadRequest, callGemini(), callsByUser, cleanRegistration(), cleanSlug(), clientIp(), consumeScanQuota() (+19 more)

### Community 12 - "Logo & layout admin"
Cohesion: 0.15
Nodes (26): Identité visuelle B MATIC : voiture de sport stylisée, circuits et engrenages, dégradé bleu/violet/rose sur fond blanc, Logo B MATIC (PNG, public), @supabase/supabase-js, Logo B MATIC (WebP, assets), AdminLayout(), navItems, AccessDenied(), AdminLoading() (+18 more)

### Community 13 - "Toasts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 14 - "Actualités & accueil"
Cohesion: 0.14
Nodes (25): Actualites, HomeLatest(), SeeAll(), actualitesSeo, actualitesTextes, useNoIndex(), dateFr, formatPostDate() (+17 more)

### Community 15 - "Admin : en-têtes & statuts"
Cohesion: 0.16
Nodes (21): @tanstack/react-query, AdminPageHeader(), AdminPageHeaderProps, PostStatusBadge(), VehicleStatusBadge(), fmt, ViewsCount(), ContentKind (+13 more)

### Community 16 - "Routage App.tsx"
Cohesion: 0.10
Nodes (20): ActualiteDetail, AdminApp, App(), ConseilDetail, Conseils, Mecanique, MentionsLegales, NotFound (+12 more)

### Community 17 - "Articles & assistant IA"
Cohesion: 0.18
Nodes (24): AiAssistButton(), SlugSuggestion(), autoExcerpt(), Post, POST_STATUS_LABELS, PostStatus, thumbPath(), optimizeImage() (+16 more)

### Community 18 - "package.json"
Cohesion: 0.08
Nodes (24): name, private, type, version, autoprefixer, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+16 more)

### Community 19 - "Carte grise & dialogues"
Cohesion: 0.11
Nodes (20): cmdk, @radix-ui/react-dialog, Exemple de carte grise (certificat d'immatriculation), CarteGriseModal(), Command, CommandDialog(), CommandDialogProps, CommandEmpty (+12 more)

### Community 20 - "DevDependencies & lint"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+15 more)

### Community 21 - "Actions admin véhicules/articles"
Cohesion: 0.26
Nodes (17): PostActionsMenu(), badgeStyles, useVehicleStatusMutation(), VehicleActionsMenu(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription (+9 more)

### Community 22 - "Photos véhicules"
Cohesion: 0.24
Nodes (20): AddTile(), Pending, SortablePhoto(), StagedPhoto, StagedVehiclePhotos(), VehiclePhotos(), canDecodeImage(), takeUploads() (+12 more)

### Community 23 - "Formulaire de reprise"
Cohesion: 0.14
Nodes (19): repriseChoix, repriseConsentement, repriseEtapes, repriseEtats, repriseIntro, repriseMessages, reprisePhotos, ReprisePhotoSlot (+11 more)

### Community 24 - "Fiche véhicule & galerie"
Cohesion: 0.27
Nodes (17): SoldBadge(), VehicleCard(), NavButton(), Track(), VehicleGallery(), occasionsTextes, formatKm(), formatPrice() (+9 more)

### Community 25 - "Site, pages & prérendu"
Cohesion: 0.25
Nodes (18): Conseil, absoluteUrl(), siteUrl, JSON_LD, pageUrl(), prerenderPages(), accueilJsonLd(), adresse() (+10 more)

### Community 26 - "tsconfig.app"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 27 - "Tableau de bord admin"
Cohesion: 0.17
Nodes (19): fetchPeriodStats(), fetchTraffic(), AdminDashboard(), chipClass(), CLICK_ICONS, ErrorBox(), fetchKpis(), fetchRecentLeads() (+11 more)

### Community 28 - "Conseils & data source unique"
Cohesion: 0.19
Nodes (15): Modules src/data (source unique du contenu editable), src/data/legal.ts (identite legale et contacts), cadeaux, ConseilBloc, conseils, conseilsLies(), conseilTexte(), findConseil() (+7 more)

### Community 29 - "Optimisation images WebP"
Cohesion: 0.18
Nodes (17): canvasOf(), decode(), Decoded, encodeWebp(), fitWithin(), getWorker(), jobs, MAX_EDGE (+9 more)

### Community 30 - "Alertes & toggles UI"
Cohesion: 0.14
Nodes (15): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert, AlertDescription, AlertTitle, alertVariants, Badge() (+7 more)

### Community 31 - "Décodage VIN"
Cohesion: 0.19
Nodes (16): WMI_MAKES, clean(), decodeVin(), knownMakes, makeFromWmi(), mapFuel(), mapGearbox(), mapVpicResult() (+8 more)

### Community 32 - "components.json shadcn"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 33 - "Formulaires react-hook-form"
Cohesion: 0.18
Nodes (14): @radix-ui/react-label, react-hook-form, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+6 more)

### Community 34 - "Boutons & calendrier"
Cohesion: 0.17
Nodes (14): @radix-ui/react-slot, react-day-picker, ButtonProps, buttonVariants, Calendar(), CalendarProps, Pagination(), PaginationContent (+6 more)

### Community 35 - "KPI & périodes"
Cohesion: 0.19
Nodes (14): date-fns, allowedBuckets(), BUCKET_LABELS, day(), defaultBucket(), MAX_HOUR_DAYS, Period, periodDays() (+6 more)

### Community 36 - "Carousel"
Cohesion: 0.17
Nodes (15): embla-carousel-react, Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+7 more)

### Community 37 - "Header & navigation"
Cohesion: 0.20
Nodes (11): lucide-react, navLinksAfter, navLinksBefore, serviceSubLinks, AccordionContent, AccordionItem, AccordionTrigger, FaqCategorie (+3 more)

### Community 38 - "tsconfig.node"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 39 - "Prise de photos guidées"
Cohesion: 0.18
Nodes (14): Camera(), CarTopView(), outlineProps, Point, Shot, SHOTS, SlotIllustration(), zoneProps (+6 more)

### Community 40 - "Hero accueil"
Cohesion: 0.22
Nodes (12): HeroBackground(), accueilConseils, accueilEngagements(), accueilHero, accueilOffresFlash, accueilPromotions, accueilServices, pareBriseAccueil (+4 more)

### Community 41 - "Scanner carte grise"
Cohesion: 0.26
Nodes (13): Corner(), DocSketch(), RegistrationScanner(), blobToBase64(), fold(), matchIn(), SCAN_ENABLED, ScanError (+5 more)

### Community 42 - "Graphique de trafic"
Cohesion: 0.21
Nodes (12): @testing-library/react, METRIC_LABELS, nf, niceMax(), plural(), TrafficChart(), TrafficChartProps, TrafficMetric (+4 more)

### Community 43 - "Leads"
Cohesion: 0.18
Nodes (13): ClickKind, PeriodStats, clip(), LEAD_STATUS_LABELS, LEAD_STATUSES, LEAD_TYPE_LABELS, LEAD_TYPES, LeadStatus (+5 more)

### Community 44 - "Génération de texte IA"
Cohesion: 0.18
Nodes (12): sonner, AI_ENABLED, AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, invokeAiFunction() (+4 more)

### Community 45 - "Graphiques recharts"
Cohesion: 0.24
Nodes (11): recharts, ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent (+3 more)

### Community 46 - "Modèle véhicule & contenu"
Cohesion: 0.32
Nodes (9): VehicleActionsMenuProps, FUEL_LABELS, GEARBOX_LABELS, STORAGE_BUCKETS, Vehicle, VEHICLE_STATUS_LABELS, VehicleStatus, supabase (+1 more)

### Community 47 - "Suivi des clics & vues"
Cohesion: 0.31
Nodes (7): ContactClickTracker(), externalReferrerHost(), PageViewTracker(), classifyContactLink(), CLICK_KIND_LABELS, CLICK_KINDS, insertPublicRow()

### Community 48 - "tsconfig racine"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 49 - "Tests unitaires"
Cohesion: 0.20
Nodes (3): vitest, insertPublicRow, lead

### Community 50 - "Sheet UI"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 51 - "Slugs & création véhicule"
Cohesion: 0.31
Nodes (8): postPublishBlocker(), isUniqueViolation(), SLUG_MAX, uniqueSlug(), withFreeSlug(), withSuffix(), createVehicle(), updateVehicle()

### Community 52 - "Navigation menu UI"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 53 - "Drawer UI"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 54 - "Scripts npm"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 55 - "Assureurs"
Cohesion: 0.39
Nodes (6): AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur, assureurs

### Community 56 - "Breadcrumb UI"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 57 - "Configuration Vercel"
Cohesion: 0.25
Nodes (7): includeFiles, cleanUrls, functions, api/share.ts, headers, redirects, rewrites

### Community 58 - "ESLint"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 59 - "Input OTP"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 60 - "Polices & point d entrée"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

### Community 61 - "Avatar UI"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 62 - "Photo hero garage"
Cohesion: 0.67
Nodes (4): Hero garage photo (JPG) - modern workshop interior, Homepage hero background: clean, bright modern garage workshop with two vehicles on lifts, mechanic at diagnostic cart, grey/steel palette, polished epoxy floor, skylight, Hero garage photo (WebP mobile), Hero garage photo (WebP desktop)

### Community 63 - "Worker WebP"
Cohesion: 0.50
Nodes (3): @jsquash/webp, Job, scope

### Community 64 - "Thème & Sonner"
Cohesion: 0.50
Nodes (3): next-themes, Toaster(), ToasterProps

## Knowledge Gaps
- **30 isolated node(s):** `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography`, `@types/node`, `@types/react` (+25 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 382 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Primitives Radix UI` to `UI Cards & Menus Radix`, `Pages & composants animés`, `Rendez-vous & fonds visuels`, `Catalogue véhicules & filtres`, `Sidebar & Sheet UI`, `Formulaires admin`, `Footer, horaires & cadeaux`, `Logo & layout admin`, `Toasts`, `Actualités & accueil`, `Admin : en-têtes & statuts`, `Routage App.tsx`, `Articles & assistant IA`, `package.json`, `Carte grise & dialogues`, `Actions admin véhicules/articles`, `Photos véhicules`, `Formulaire de reprise`, `Fiche véhicule & galerie`, `Tableau de bord admin`, `Alertes & toggles UI`, `Formulaires react-hook-form`, `Boutons & calendrier`, `Carousel`, `Header & navigation`, `Prise de photos guidées`, `Scanner carte grise`, `Graphique de trafic`, `Graphiques recharts`, `Suivi des clics & vues`, `Sheet UI`, `Navigation menu UI`, `Drawer UI`, `Breadcrumb UI`, `Input OTP`, `Avatar UI`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **What connects `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography` to the rest of the system?**
  _30 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Cards & Menus Radix` be split into smaller, more focused modules?**
  _Cohesion score 0.06412583182093164 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Header & navigation` to `UI Cards & Menus Radix`, `Primitives Radix UI`, `Pages & composants animés`, `Rendez-vous & fonds visuels`, `Catalogue véhicules & filtres`, `Sidebar & Sheet UI`, `Formulaires admin`, `Footer, horaires & cadeaux`, `Logo & layout admin`, `Toasts`, `Actualités & accueil`, `Admin : en-têtes & statuts`, `Articles & assistant IA`, `package.json`, `Carte grise & dialogues`, `Actions admin véhicules/articles`, `Photos véhicules`, `Formulaire de reprise`, `Fiche véhicule & galerie`, `Tableau de bord admin`, `Conseils & data source unique`, `Boutons & calendrier`, `Carousel`, `Hero accueil`, `Scanner carte grise`, `Sheet UI`, `Navigation menu UI`, `Breadcrumb UI`, `Input OTP`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Should `Dépendances runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `Dépendances runtime` to `package.json`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Should `Primitives Radix UI` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._