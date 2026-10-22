# Graph Report - b-matic-Bilel  (2026-10-22)

## Corpus Check
- 203 files · ~111,844 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1356 nodes · 3448 edges · 68 communities (60 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd149e81`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- schema.ts
- dependencies
- carousel.tsx
- sidebar.tsx
- hooks/use-toast.ts
- cn
- navigation-menu.tsx
- command.tsx
- devDependencies
- package.json
- compilerOptions
- components.json
- form.tsx
- compilerOptions
- chart.tsx
- AdminDashboard.tsx
- PareBrise.tsx
- compilerOptions
- utils.ts
- Graphify — graphe de connaissances du projet
- Vehicules.tsx
- kpi.ts
- pagination.tsx
- VehiclePhotos.tsx
- scripts
- share.ts
- slug.ts
- conseils.ts
- input-otp.tsx
- Mecanique.tsx
- lucide-react
- AdminActualiteForm.tsx
- VehicleActions.tsx
- AdminVehicules.tsx
- useSeo
- AdminVehiculeForm.tsx
- App.tsx
- @jsquash/webp
- B MATIC — Cahier des charges V2 (évolution du site)
- Reprise.tsx
- navigation-menu.tsx
- README.md
- TrafficChart.tsx
- ContactClickTracker.tsx
- vitest
- leads.ts
- vite-env.d.ts
- dropdown-menu.tsx
- vin.ts
- index.ts
- imageOptimize.ts
- Index.tsx
- drawer.tsx
- aiCopy.ts
- B MATIC — Instructions projet (lues automatiquement par Claude Code)
- sheet.tsx
- eslint.config.js
- registrationScan.ts
- Reprise
- LeadType
- vercel.json
- main.tsx
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- tailwindcss
- @testing-library/jest-dom

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 87 edges
3. `lucide-react` - 57 edges
4. `useSeo()` - 50 edges
5. `react-router-dom` - 37 edges
6. `AnimatedSection()` - 29 edges
7. `VehicleForm()` - 27 edges
8. `thumbPath()` - 22 edges
9. `PostForm()` - 21 edges
10. `AdminDashboard()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `8. Plan par phases` --references--> `Vehicle`  [INFERRED]
  docs/PROJET-V2.md → src/lib/contentModel.ts
- `Architecture` --references--> `AnimatedSection()`  [INFERRED]
  CLAUDE.md → src/components/AnimatedSection.tsx
- `Architecture` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx
- `Architecture` --references--> `NeonButton()`  [INFERRED]
  CLAUDE.md → src/components/NeonButton.tsx
- `6. Améliorations UX` --references--> `RegistrationScanner()`  [INFERRED]
  docs/PROJET-V2.md → src/components/RegistrationScanner.tsx

## Import Cycles
- None detected.

## Communities (68 total, 8 thin omitted)

### Community 0 - "schema.ts"
Cohesion: 0.20
Nodes (22): HeadMeta, conseils, conseilTexte(), pagesSeo, absoluteUrl(), siteUrl, JSON_LD, pageUrl() (+14 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (57): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+49 more)

### Community 2 - "carousel.tsx"
Cohesion: 0.16
Nodes (16): embla-carousel-react, Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+8 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.07
Nodes (30): Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction (+22 more)

### Community 4 - "hooks/use-toast.ts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 5 - "cn"
Cohesion: 0.06
Nodes (56): @radix-ui/react-context-menu, @radix-ui/react-menubar, @radix-ui/react-select, @radix-ui/react-tabs, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink (+48 more)

### Community 6 - "navigation-menu.tsx"
Cohesion: 0.14
Nodes (15): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert, AlertDescription, AlertTitle, alertVariants, Badge() (+7 more)

### Community 7 - "command.tsx"
Cohesion: 0.11
Nodes (19): cmdk, @radix-ui/react-dialog, CarteGriseModal(), Command, CommandDialog(), CommandDialogProps, CommandEmpty, CommandGroup (+11 more)

### Community 8 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+15 more)

### Community 9 - "package.json"
Cohesion: 0.07
Nodes (26): name, private, type, version, autoprefixer, clsx, @dnd-kit/core, @dnd-kit/sortable (+18 more)

### Community 10 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 11 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 12 - "form.tsx"
Cohesion: 0.18
Nodes (14): @radix-ui/react-label, react-hook-form, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+6 more)

### Community 13 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 14 - "chart.tsx"
Cohesion: 0.24
Nodes (11): recharts, ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent (+3 more)

### Community 15 - "AdminDashboard.tsx"
Cohesion: 0.17
Nodes (19): fetchPeriodStats(), fetchTraffic(), AdminDashboard(), chipClass(), CLICK_ICONS, ErrorBox(), fetchKpis(), fetchRecentLeads() (+11 more)

### Community 16 - "PareBrise.tsx"
Cohesion: 0.08
Nodes (36): 4. Pages & fonctionnalités à livrer, Admin (propriétaire, connecté), Public (visiteurs), GiftIllustration(), shapes, AssureurBadge(), AssureursGroup(), InsurerMarquee() (+28 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.05
Nodes (35): @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-slider (+27 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "Vehicules.tsx"
Cohesion: 0.06
Nodes (85): ActualiteDetail, Actualites, VehicleActionsMenuProps, HomeLatest(), SeeAll(), SoldBadge(), VehicleCard(), Chip() (+77 more)

### Community 21 - "kpi.ts"
Cohesion: 0.19
Nodes (14): date-fns, allowedBuckets(), BUCKET_LABELS, day(), defaultBucket(), MAX_HOUR_DAYS, Period, periodDays() (+6 more)

### Community 22 - "pagination.tsx"
Cohesion: 0.15
Nodes (13): @radix-ui/react-slot, react-day-picker, ButtonProps, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis() (+5 more)

### Community 23 - "VehiclePhotos.tsx"
Cohesion: 0.26
Nodes (19): Pending, SortablePhoto(), StagedPhoto, StagedVehiclePhotos(), VehiclePhotos(), thumbPath(), optimizeImage(), bucket() (+11 more)

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 25 - "share.ts"
Cohesion: 0.10
Nodes (25): clipDescription(), escapeAttr(), headTags(), injectHead(), jsonLdScript(), SITE_NAME, FUEL, GET() (+17 more)

### Community 26 - "slug.ts"
Cohesion: 0.36
Nodes (7): isUniqueViolation(), SLUG_MAX, uniqueSlug(), withFreeSlug(), withSuffix(), createVehicle(), updateVehicle()

### Community 27 - "conseils.ts"
Cohesion: 0.21
Nodes (13): ConseilDetail, cadeaux, Conseil, ConseilBloc, conseilsLies(), findConseil(), prixEntretien, prixPlaquettes (+5 more)

### Community 28 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 29 - "Mecanique.tsx"
Cohesion: 0.10
Nodes (36): Mecanique, AdminPageHeader(), AdminPageHeaderProps, rdvHeures, rdvRegles, rdvTextes, findService(), PriceType (+28 more)

### Community 30 - "lucide-react"
Cohesion: 0.20
Nodes (13): Architecture, lucide-react, CookieConsent(), Footer(), Header(), navLinksAfter, navLinksBefore, serviceSubLinks (+5 more)

### Community 31 - "AdminActualiteForm.tsx"
Cohesion: 0.16
Nodes (26): POST_STATUS_LABELS, PostStatus, canDecodeImage(), bucket(), createPost(), PostInput, postPublishBlocker(), removePostCover() (+18 more)

### Community 32 - "VehicleActions.tsx"
Cohesion: 0.24
Nodes (19): PostActionsMenu(), badgeStyles, useVehicleStatusMutation(), VehicleActionsMenu(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription (+11 more)

### Community 33 - "AdminVehicules.tsx"
Cohesion: 0.09
Nodes (42): react-router-dom, @supabase/supabase-js, AdminLayout(), navItems, PostStatusBadge(), AccessDenied(), AdminLoading(), CheckError() (+34 more)

### Community 34 - "useSeo"
Cohesion: 0.13
Nodes (25): Charte graphique (à respecter absolument), 1. Contexte & état actuel, APropos, AnimatedSection(), AnimatedSectionProps, GlowCard(), LegalPage(), LegalPageProps (+17 more)

### Community 35 - "AdminVehiculeForm.tsx"
Cohesion: 0.10
Nodes (29): AiAssistButton(), SlugSuggestion(), Field(), FormSection(), adminInputClass, adminSelectClass, adminTextareaClass, SaveBar() (+21 more)

### Community 37 - "App.tsx"
Cohesion: 0.09
Nodes (23): next-themes, AdminApp, App(), Conseils, Contact, Depannage, MentionsLegales, NotFound (+15 more)

### Community 38 - "@jsquash/webp"
Cohesion: 0.50
Nodes (3): @jsquash/webp, Job, scope

### Community 39 - "B MATIC — Cahier des charges V2 (évolution du site)"
Cohesion: 0.15
Nodes (12): 10. Actions à la charge du propriétaire (hors code), 2. Objectifs, 3. Décisions techniques (actées), 5.1 Offre pare-brise (page `/pare-brise` + bloc sur l'accueil), 5.2 Assureurs partenaires (carrousel, liste dans `src/data/assurances.ts`), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin), 5.4 Promotions (déjà dans `src/data/services.ts`), 5. Contenus spécifiques (+4 more)

### Community 40 - "Reprise.tsx"
Cohesion: 0.14
Nodes (19): repriseChoix, repriseConsentement, repriseEtapes, repriseEtats, repriseIntro, repriseMessages, reprisePhotos, ReprisePhotoSlot (+11 more)

### Community 41 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 43 - "TrafficChart.tsx"
Cohesion: 0.21
Nodes (12): @testing-library/react, METRIC_LABELS, nf, niceMax(), plural(), TrafficChart(), TrafficChartProps, TrafficMetric (+4 more)

### Community 44 - "ContactClickTracker.tsx"
Cohesion: 0.31
Nodes (7): ContactClickTracker(), externalReferrerHost(), PageViewTracker(), classifyContactLink(), CLICK_KIND_LABELS, CLICK_KINDS, insertPublicRow()

### Community 45 - "vitest"
Cohesion: 0.20
Nodes (3): vitest, insertPublicRow, lead

### Community 46 - "leads.ts"
Cohesion: 0.28
Nodes (8): clip(), LEAD_STATUS_LABELS, LEAD_STATUSES, LEAD_TYPE_LABELS, LEAD_TYPES, LeadSubmission, sendLead(), submitLead()

### Community 49 - "dropdown-menu.tsx"
Cohesion: 0.25
Nodes (7): @radix-ui/react-dropdown-menu, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuShortcut(), DropdownMenuSubContent, DropdownMenuSubTrigger

### Community 50 - "vin.ts"
Cohesion: 0.19
Nodes (16): WMI_MAKES, clean(), decodeVin(), knownMakes, makeFromWmi(), mapFuel(), mapGearbox(), mapVpicResult() (+8 more)

### Community 51 - "index.ts"
Cohesion: 0.08
Nodes (27): allowed, BadRequest, callGemini(), callsByUser, cleanRegistration(), cleanSlug(), clientIp(), consumeScanQuota() (+19 more)

### Community 52 - "imageOptimize.ts"
Cohesion: 0.18
Nodes (17): canvasOf(), decode(), Decoded, encodeWebp(), fitWithin(), getWorker(), jobs, MAX_EDGE (+9 more)

### Community 53 - "Index.tsx"
Cohesion: 0.15
Nodes (18): carMask, clamp01(), HeroGarage(), SCENE, accueilConseils, accueilEngagements(), accueilHero, accueilOffresFlash (+10 more)

### Community 54 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 55 - "aiCopy.ts"
Cohesion: 0.18
Nodes (12): sonner, @tanstack/react-query, AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, invokeAiFunction() (+4 more)

### Community 56 - "B MATIC — Instructions projet (lues automatiquement par Claude Code)"
Cohesion: 0.18
Nodes (10): B MATIC — Instructions projet (lues automatiquement par Claude Code), Commands, Graphify, Infos, Langue, Project, Projet, Règles de travail (+2 more)

### Community 57 - "sheet.tsx"
Cohesion: 0.28
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 58 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 59 - "registrationScan.ts"
Cohesion: 0.21
Nodes (15): 6. Améliorations UX, Corner(), DocSketch(), RegistrationScanner(), blobToBase64(), fold(), matchIn(), RawScan (+7 more)

### Community 60 - "Reprise"
Cohesion: 0.17
Nodes (15): Camera(), CarTopView(), outlineProps, Point, Shot, SHOTS, SlotIllustration(), zoneProps (+7 more)

### Community 61 - "LeadType"
Cohesion: 0.40
Nodes (6): ClickKind, PeriodStats, LeadStatus, LeadType, DashboardCounts, Lead

### Community 62 - "vercel.json"
Cohesion: 0.25
Nodes (7): includeFiles, cleanUrls, functions, api/share.ts, headers, redirects, rewrites

### Community 63 - "main.tsx"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

## Knowledge Gaps
- **11 isolated node(s):** `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography`, `@types/node`, `@types/react` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 390 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `utils.ts` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `AdminDashboard.tsx`, `PareBrise.tsx`, `Vehicules.tsx`, `pagination.tsx`, `VehiclePhotos.tsx`, `input-otp.tsx`, `Mecanique.tsx`, `lucide-react`, `AdminActualiteForm.tsx`, `VehicleActions.tsx`, `AdminVehicules.tsx`, `useSeo`, `AdminVehiculeForm.tsx`, `App.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `TrafficChart.tsx`, `ContactClickTracker.tsx`, `dropdown-menu.tsx`, `Index.tsx`, `drawer.tsx`, `sheet.tsx`, `registrationScan.ts`, `Reprise`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **What connects `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `command.tsx`, `package.json`, `AdminDashboard.tsx`, `PareBrise.tsx`, `utils.ts`, `Vehicules.tsx`, `pagination.tsx`, `VehiclePhotos.tsx`, `conseils.ts`, `input-otp.tsx`, `Mecanique.tsx`, `AdminActualiteForm.tsx`, `VehicleActions.tsx`, `AdminVehicules.tsx`, `useSeo`, `AdminVehiculeForm.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `dropdown-menu.tsx`, `Index.tsx`, `sheet.tsx`, `registrationScan.ts`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._