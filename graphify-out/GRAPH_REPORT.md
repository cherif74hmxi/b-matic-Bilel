# Graph Report - b-matic-Bilel  (2026-10-22)

## Corpus Check
- 155 files · ~79,202 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1044 nodes · 2368 edges · 61 communities (52 shown, 9 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 22 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1aec4ea4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- lucide-react
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
- Mecanique.tsx
- select.tsx
- breadcrumb.tsx
- drawer.tsx
- scripts
- vite.config.ts
- B MATIC — Cahier des charges V2 (évolution du site)
- eslint.config.js
- input-otp.tsx
- sonner.tsx
- react
- AdminActualiteForm.tsx
- VehiclePhotos.tsx
- AdminApp.tsx
- AnimatedSection
- AdminVehiculeForm.tsx
- App.tsx
- imageOptimize.ts
- main.tsx
- react-router-dom
- navigation-menu.tsx
- README.md
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- tailwindcss
- @testing-library/jest-dom
- vite-env.d.ts
- Index.tsx
- vin.ts
- index.ts
- vehicles.ts
- pagination.tsx
- useSeo
- aiCopy.ts
- B MATIC — Instructions projet (lues automatiquement par Claude Code)
- sheet.tsx
- vitest
- ChunkErrorBoundary
- PageViewTracker.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 80 edges
3. `lucide-react` - 47 edges
4. `react-router-dom` - 30 edges
5. `AnimatedSection()` - 23 edges
6. `useSeo()` - 23 edges
7. `VehicleForm()` - 23 edges
8. `VehiclePhotos()` - 19 edges
9. `compilerOptions` - 19 edges
10. `GlowCard()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `AnimatedSection()`  [INFERRED]
  CLAUDE.md → src/components/AnimatedSection.tsx
- `Architecture` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx
- `Charte graphique (à respecter absolument)` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx
- `1. Contexte & état actuel` --references--> `GlowCard()`  [INFERRED]
  docs/PROJET-V2.md → src/components/GlowCard.tsx
- `Architecture` --references--> `NeonButton()`  [INFERRED]
  CLAUDE.md → src/components/NeonButton.tsx

## Import Cycles
- None detected.

## Communities (61 total, 9 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.24
Nodes (10): lucide-react, @radix-ui/react-accordion, Conseils, AccordionContent, AccordionItem, AccordionTrigger, FaqCategorie, FaqItem (+2 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (57): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+49 more)

### Community 2 - "carousel.tsx"
Cohesion: 0.17
Nodes (15): embla-carousel-react, Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+7 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.07
Nodes (30): Input, Separator, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent (+22 more)

### Community 4 - "hooks/use-toast.ts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 5 - "cn"
Cohesion: 0.07
Nodes (44): @radix-ui/react-context-menu, @radix-ui/react-menubar, @radix-ui/react-tabs, react-resizable-panels, Card, CardContent, CardDescription, CardFooter (+36 more)

### Community 6 - "navigation-menu.tsx"
Cohesion: 0.14
Nodes (15): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert, AlertDescription, AlertTitle, alertVariants, Badge() (+7 more)

### Community 7 - "command.tsx"
Cohesion: 0.13
Nodes (18): @radix-ui/react-dialog, CarteGriseModal(), Command, CommandDialog(), CommandDialogProps, CommandEmpty, CommandGroup, CommandInput (+10 more)

### Community 8 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+15 more)

### Community 9 - "package.json"
Cohesion: 0.08
Nodes (25): name, private, type, version, autoprefixer, clsx, cmdk, @dnd-kit/core (+17 more)

### Community 10 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 11 - "components.json"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 12 - "form.tsx"
Cohesion: 0.19
Nodes (13): @radix-ui/react-label, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext, FormItemContextValue (+5 more)

### Community 13 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 14 - "chart.tsx"
Cohesion: 0.24
Nodes (11): recharts, ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent (+3 more)

### Community 15 - "AdminDashboard.tsx"
Cohesion: 0.07
Nodes (48): date-fns, AdminPageHeader(), AdminPageHeaderProps, PostStatusBadge(), fmt, ViewsCount(), ContentKind, ContentViews (+40 more)

### Community 16 - "PareBrise.tsx"
Cohesion: 0.15
Nodes (14): AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur, assureurs, pareBriseAccroche, PareBriseAvantage (+6 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.07
Nodes (27): @radix-ui/react-avatar, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-slider (+19 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "Mecanique.tsx"
Cohesion: 0.20
Nodes (14): Mecanique, findService(), Service, DAYS, durLabel(), HEURES, longDate(), Mecanique() (+6 more)

### Community 21 - "select.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-select, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 22 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (7): Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 23 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 25 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): lovable-tagger, vite, @vitejs/plugin-react-swc

### Community 26 - "B MATIC — Cahier des charges V2 (évolution du site)"
Cohesion: 0.10
Nodes (20): 10. Actions à la charge du propriétaire (hors code), 1. Contexte & état actuel, 2. Objectifs, 3. Décisions techniques (actées), 4. Pages & fonctionnalités à livrer, 5.1 Offre pare-brise (à mettre en avant, page dédiée + accueil), 5.2 Assureurs partenaires (à afficher, logos/noms), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin) (+12 more)

### Community 27 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 28 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 29 - "sonner.tsx"
Cohesion: 0.50
Nodes (3): next-themes, Toaster(), ToasterProps

### Community 30 - "react"
Cohesion: 0.27
Nodes (9): Architecture, CookieConsent(), Footer(), Header(), navLinksAfter, navLinksBefore, serviceSubLinks, Layout() (+1 more)

### Community 31 - "AdminActualiteForm.tsx"
Cohesion: 0.14
Nodes (29): @hookform/resolvers, react-hook-form, zod, canDecodeImage(), optimizeImage(), autoExcerpt(), bucket(), createPost() (+21 more)

### Community 32 - "VehiclePhotos.tsx"
Cohesion: 0.08
Nodes (58): @radix-ui/react-dropdown-menu, sonner, @tanstack/react-query, PostActionsMenu(), Camera(), CarTopView(), outlineProps, Point (+50 more)

### Community 33 - "AdminApp.tsx"
Cohesion: 0.17
Nodes (22): AdminLayout(), navItems, AccessDenied(), AdminLoading(), CheckError(), Panel(), RequireAdmin(), AdminCheck (+14 more)

### Community 34 - "AnimatedSection"
Cohesion: 0.15
Nodes (19): APropos, Contact, Depannage, Reprise, AnimatedSection(), AnimatedSectionProps, GlowCard(), GlowCardProps (+11 more)

### Community 35 - "AdminVehiculeForm.tsx"
Cohesion: 0.14
Nodes (21): Field(), FormSection(), adminInputClass, adminSelectClass, adminTextareaClass, VehicleStatusBadge(), listVehiclePhotos(), normalizeVin() (+13 more)

### Community 37 - "App.tsx"
Cohesion: 0.19
Nodes (12): react-router-dom, AdminApp, App(), NotFound, PareBrise, PolitiqueConfidentialite, PublicLayout(), publicRoutes (+4 more)

### Community 38 - "imageOptimize.ts"
Cohesion: 0.13
Nodes (19): @jsquash/webp, canvasOf(), decode(), Decoded, encodeWebp(), fitWithin(), getWorker(), jobs (+11 more)

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

### Community 40 - "react-router-dom"
Cohesion: 0.22
Nodes (7): MentionsLegales, LegalPage(), LegalPageProps, legalInfo, supervisoryAuthority, MentionsLegales(), PolitiqueConfidentialite()

### Community 41 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 49 - "Index.tsx"
Cohesion: 0.18
Nodes (12): AuroraBackground(), blobs, PriceType, serviceCategories, ServiceCategory, canRunAmbientMotion(), isLowEndDevice(), prefersReducedMotion() (+4 more)

### Community 50 - "vin.ts"
Cohesion: 0.14
Nodes (21): marques, vehiculesData, WMI_MAKES, Fuel, Gearbox, clean(), decodeVin(), knownMakes (+13 more)

### Community 51 - "index.ts"
Cohesion: 0.15
Nodes (10): allowed, BadRequest, callsByUser, Input, int(), MAX_CALLS, parseInput(), PostData (+2 more)

### Community 52 - "vehicles.ts"
Cohesion: 0.16
Nodes (15): @supabase/supabase-js, isUniqueViolation(), SLUG_MAX, uniqueSlug(), withFreeSlug(), withSuffix(), STORAGE_BUCKETS, createVehicle() (+7 more)

### Community 53 - "pagination.tsx"
Cohesion: 0.15
Nodes (13): @radix-ui/react-slot, react-day-picker, ButtonProps, Calendar(), CalendarProps, Pagination(), PaginationContent, PaginationEllipsis() (+5 more)

### Community 54 - "useSeo"
Cohesion: 0.24
Nodes (10): ConseilDetail, Conseil, conseils, findConseil(), ensureCanonical(), ensureMeta(), SeoOptions, useNoIndex() (+2 more)

### Community 55 - "aiCopy.ts"
Cohesion: 0.19
Nodes (11): AiAssistButton(), AI_ENABLED, AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, Nullable (+3 more)

### Community 56 - "B MATIC — Instructions projet (lues automatiquement par Claude Code)"
Cohesion: 0.17
Nodes (11): B MATIC — Instructions projet (lues automatiquement par Claude Code), Charte graphique (à respecter absolument), Commands, Graphify, Infos, Langue, Project, Projet (+3 more)

### Community 57 - "sheet.tsx"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 58 - "vitest"
Cohesion: 0.25
Nodes (3): vitest, insertPublicRow, lead

### Community 60 - "PageViewTracker.tsx"
Cohesion: 0.70
Nodes (3): externalReferrerHost(), PageViewTracker(), insertPublicRow()

## Knowledge Gaps
- **12 isolated node(s):** `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography`, `@testing-library/react`, `@types/node` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 349 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `utils.ts` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `AdminDashboard.tsx`, `Mecanique.tsx`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `input-otp.tsx`, `react`, `AdminActualiteForm.tsx`, `VehiclePhotos.tsx`, `AdminApp.tsx`, `AnimatedSection`, `AdminVehiculeForm.tsx`, `App.tsx`, `react-router-dom`, `navigation-menu.tsx`, `Index.tsx`, `pagination.tsx`, `useSeo`, `sheet.tsx`, `ChunkErrorBoundary`, `PageViewTracker.tsx`?**
  _High betweenness centrality (0.276) - this node is a cross-community bridge._
- **What connects `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `command.tsx`, `package.json`, `AdminDashboard.tsx`, `PareBrise.tsx`, `utils.ts`, `Mecanique.tsx`, `select.tsx`, `breadcrumb.tsx`, `input-otp.tsx`, `react`, `AdminActualiteForm.tsx`, `VehiclePhotos.tsx`, `AdminApp.tsx`, `AnimatedSection`, `AdminVehiculeForm.tsx`, `react-router-dom`, `navigation-menu.tsx`, `Index.tsx`, `pagination.tsx`, `useSeo`, `aiCopy.ts`, `sheet.tsx`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `lucide-react`, `VehiclePhotos.tsx`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `navigation-menu.tsx`, `command.tsx`, `navigation-menu.tsx`, `form.tsx`, `chart.tsx`, `utils.ts`, `pagination.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `select.tsx`, `sheet.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._