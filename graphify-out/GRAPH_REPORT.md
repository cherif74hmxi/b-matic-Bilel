# Graph Report - b-matic-Bilel  (2026-10-22)

## Corpus Check
- 202 files · ~106,299 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1352 nodes · 3432 edges · 59 communities (55 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c1240f13`
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
- useSeo
- pagination.tsx
- VehiclePhotos.tsx
- scripts
- share.ts
- slug.ts
- conseils.ts
- input-otp.tsx
- Mecanique.tsx
- react
- AdminActualiteForm.tsx
- VehicleActions.tsx
- AdminVehicules.tsx
- seo.ts
- AdminVehiculeForm.tsx
- App.tsx
- @jsquash/webp
- B MATIC — Cahier des charges V2 (évolution du site)
- Reprise.tsx
- navigation-menu.tsx
- README.md
- Conseils.tsx
- avatar.tsx
- vite-env.d.ts
- select.tsx
- vin.ts
- index.ts
- imageOptimize.ts
- Index.tsx
- drawer.tsx
- aiCopy.ts
- B MATIC — Instructions projet (lues automatiquement par Claude Code)
- sheet.tsx
- registrationScan.ts
- Reprise
- vercel.json

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
- `6. Améliorations UX` --references--> `RegistrationScanner()`  [INFERRED]
  docs/PROJET-V2.md → src/components/RegistrationScanner.tsx
- `Architecture` --references--> `AnimatedSection()`  [INFERRED]
  CLAUDE.md → src/components/AnimatedSection.tsx
- `Public (visiteurs)` --references--> `GiftIllustration()`  [INFERRED]
  docs/PROJET-V2.md → src/components/GiftIllustration.tsx
- `Architecture` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx
- `Charte graphique (à respecter absolument)` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx

## Import Cycles
- None detected.

## Communities (59 total, 4 thin omitted)

### Community 0 - "schema.ts"
Cohesion: 0.23
Nodes (19): HeadMeta, pagesSeo, absoluteUrl(), siteUrl, JSON_LD, pageUrl(), PrerenderPage, prerenderPages() (+11 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (57): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+49 more)

### Community 2 - "carousel.tsx"
Cohesion: 0.17
Nodes (15): embla-carousel-react, Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+7 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.07
Nodes (32): @radix-ui/react-separator, @radix-ui/react-tooltip, Input, Separator, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup (+24 more)

### Community 4 - "hooks/use-toast.ts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 5 - "cn"
Cohesion: 0.06
Nodes (54): @radix-ui/react-context-menu, @radix-ui/react-dropdown-menu, @radix-ui/react-tabs, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList (+46 more)

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
Cohesion: 0.06
Nodes (31): name, private, type, version, autoprefixer, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+23 more)

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
Cohesion: 0.05
Nodes (63): date-fns, @testing-library/react, vitest, METRIC_LABELS, nf, niceMax(), plural(), TrafficChart() (+55 more)

### Community 16 - "PareBrise.tsx"
Cohesion: 0.10
Nodes (31): PareBrise, GiftIllustration(), shapes, AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur (+23 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.05
Nodes (33): clsx, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-slider (+25 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "Vehicules.tsx"
Cohesion: 0.06
Nodes (76): 8. Plan par phases, Vehicules, VehicleActionsMenuProps, SortablePhoto(), SoldBadge(), VehicleCard(), Chip(), FilterOptions (+68 more)

### Community 21 - "useSeo"
Cohesion: 0.18
Nodes (18): ActualiteDetail, Actualites, AnimatedSection(), HomeLatest(), SeeAll(), actualitesSeo, actualitesTextes, ensureMeta() (+10 more)

### Community 22 - "pagination.tsx"
Cohesion: 0.15
Nodes (13): @radix-ui/react-slot, react-day-picker, ButtonProps, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis() (+5 more)

### Community 23 - "VehiclePhotos.tsx"
Cohesion: 0.26
Nodes (15): Pending, StagedPhoto, StagedVehiclePhotos(), bucket(), deleteVehiclePhoto(), GUIDED_SLOTS, insertionIndex(), MAX_PHOTOS (+7 more)

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 25 - "share.ts"
Cohesion: 0.10
Nodes (25): clipDescription(), escapeAttr(), headTags(), injectHead(), jsonLdScript(), SITE_NAME, FUEL, GET() (+17 more)

### Community 26 - "slug.ts"
Cohesion: 0.43
Nodes (6): isUniqueViolation(), SLUG_MAX, uniqueSlug(), withFreeSlug(), withSuffix(), createVehicle()

### Community 27 - "conseils.ts"
Cohesion: 0.19
Nodes (15): ConseilDetail, cadeaux, Conseil, ConseilBloc, conseils, conseilsLies(), conseilTexte(), findConseil() (+7 more)

### Community 28 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 29 - "Mecanique.tsx"
Cohesion: 0.12
Nodes (33): rdvHeures, rdvRegles, rdvTextes, findService(), PriceType, Service, serviceCategories, ServiceCategory (+25 more)

### Community 30 - "react"
Cohesion: 0.19
Nodes (14): lucide-react, MentionsLegales, PolitiqueConfidentialite, LegalPage(), LegalPageProps, legalInfo, supervisoryAuthority, ensureCanonical() (+6 more)

### Community 31 - "AdminActualiteForm.tsx"
Cohesion: 0.16
Nodes (29): AiAssistButton(), SlugSuggestion(), Field(), FormSection(), autoExcerpt(), Post, canDecodeImage(), optimizeImage() (+21 more)

### Community 32 - "VehicleActions.tsx"
Cohesion: 0.24
Nodes (21): PostActionsMenu(), badgeStyles, useVehicleStatusMutation(), VehicleActionsMenu(), VehiclePhotos(), AlertDialogAction, AlertDialogCancel, AlertDialogContent (+13 more)

### Community 33 - "AdminVehicules.tsx"
Cohesion: 0.09
Nodes (41): @supabase/supabase-js, AdminLayout(), navItems, AdminPageHeader(), AdminPageHeaderProps, PostStatusBadge(), AccessDenied(), AdminLoading() (+33 more)

### Community 34 - "seo.ts"
Cohesion: 0.15
Nodes (14): APropos, Contact, GlowCard(), GlowCardProps, NeonButton(), NeonButtonProps, occasionsSeo, notFoundSeo (+6 more)

### Community 35 - "AdminVehiculeForm.tsx"
Cohesion: 0.11
Nodes (25): adminInputClass, adminSelectClass, adminTextareaClass, SaveBar(), StagedBatch, StagedFile, stashUploads(), store (+17 more)

### Community 37 - "App.tsx"
Cohesion: 0.07
Nodes (35): Architecture, @fontsource/inter, @fontsource/orbitron, next-themes, react-dom, react-router-dom, AdminApp, App() (+27 more)

### Community 38 - "@jsquash/webp"
Cohesion: 0.50
Nodes (3): @jsquash/webp, Job, scope

### Community 39 - "B MATIC — Cahier des charges V2 (évolution du site)"
Cohesion: 0.12
Nodes (16): 10. Actions à la charge du propriétaire (hors code), 1. Contexte & état actuel, 2. Objectifs, 3. Décisions techniques (actées), 4. Pages & fonctionnalités à livrer, 5.1 Offre pare-brise (page `/pare-brise` + bloc sur l'accueil), 5.2 Assureurs partenaires (carrousel, liste dans `src/data/assurances.ts`), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin) (+8 more)

### Community 40 - "Reprise.tsx"
Cohesion: 0.14
Nodes (19): Reprise, repriseChoix, repriseConsentement, repriseEtapes, repriseEtats, repriseIntro, repriseMessages, reprisePhotos (+11 more)

### Community 41 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 43 - "Conseils.tsx"
Cohesion: 0.24
Nodes (10): @radix-ui/react-accordion, Conseils, AccordionContent, AccordionItem, AccordionTrigger, FaqCategorie, FaqItem, faqItems (+2 more)

### Community 44 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 49 - "select.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-select, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

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
Cohesion: 0.21
Nodes (12): AuroraBackground(), accueilConseils, accueilEngagements(), accueilHero, accueilOffresFlash, accueilPromotions, accueilServices, pareBriseAccueil (+4 more)

### Community 54 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 55 - "aiCopy.ts"
Cohesion: 0.16
Nodes (13): sonner, @tanstack/react-query, AI_ENABLED, AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy (+5 more)

### Community 56 - "B MATIC — Instructions projet (lues automatiquement par Claude Code)"
Cohesion: 0.17
Nodes (11): B MATIC — Instructions projet (lues automatiquement par Claude Code), Charte graphique (à respecter absolument), Commands, Graphify, Infos, Langue, Project, Projet (+3 more)

### Community 57 - "sheet.tsx"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 59 - "registrationScan.ts"
Cohesion: 0.23
Nodes (14): Corner(), DocSketch(), RegistrationScanner(), repriseScan, blobToBase64(), fold(), matchIn(), SCAN_ENABLED (+6 more)

### Community 60 - "Reprise"
Cohesion: 0.17
Nodes (15): Camera(), CarTopView(), outlineProps, Point, Shot, SHOTS, SlotIllustration(), zoneProps (+7 more)

### Community 62 - "vercel.json"
Cohesion: 0.25
Nodes (7): includeFiles, cleanUrls, functions, api/share.ts, headers, redirects, rewrites

## Knowledge Gaps
- **11 isolated node(s):** `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography`, `@types/node`, `@types/react` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 390 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `utils.ts` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `AdminDashboard.tsx`, `PareBrise.tsx`, `Vehicules.tsx`, `useSeo`, `pagination.tsx`, `VehiclePhotos.tsx`, `input-otp.tsx`, `Mecanique.tsx`, `react`, `AdminActualiteForm.tsx`, `VehicleActions.tsx`, `AdminVehicules.tsx`, `seo.ts`, `AdminVehiculeForm.tsx`, `App.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `Conseils.tsx`, `avatar.tsx`, `select.tsx`, `drawer.tsx`, `sheet.tsx`, `registrationScan.ts`, `Reprise`?**
  _High betweenness centrality (0.229) - this node is a cross-community bridge._
- **What connects `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `command.tsx`, `package.json`, `AdminDashboard.tsx`, `PareBrise.tsx`, `utils.ts`, `Vehicules.tsx`, `useSeo`, `pagination.tsx`, `VehiclePhotos.tsx`, `conseils.ts`, `input-otp.tsx`, `Mecanique.tsx`, `AdminActualiteForm.tsx`, `VehicleActions.tsx`, `AdminVehicules.tsx`, `seo.ts`, `AdminVehiculeForm.tsx`, `App.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `Conseils.tsx`, `select.tsx`, `Index.tsx`, `aiCopy.ts`, `sheet.tsx`, `registrationScan.ts`?**
  _High betweenness centrality (0.160) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06585365853658537 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._