# Graph Report - b-matic-Bilel  (2026-10-22)

## Corpus Check
- 178 files · ~89,302 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1208 nodes · 2958 edges · 61 communities (53 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8445a696`
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
- Vehicules.tsx
- useSeo
- pagination.tsx
- tabs.tsx
- scripts
- vite.config.ts
- B MATIC — Cahier des charges V2 (évolution du site)
- eslint.config.js
- input-otp.tsx
- PolitiqueConfidentialite.tsx
- react
- AdminActualiteForm.tsx
- VehiclePhotos.tsx
- AdminApp.tsx
- AnimatedSection
- AdminVehiculeForm.tsx
- App.tsx
- @jsquash/webp
- main.tsx
- Reprise.tsx
- navigation-menu.tsx
- README.md
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- tailwindcss
- @testing-library/jest-dom
- vite-env.d.ts
- select.tsx
- vin.ts
- index.ts
- imageOptimize.ts
- scroll-area.tsx
- drawer.tsx
- aiCopy.ts
- B MATIC — Instructions projet (lues automatiquement par Claude Code)
- sheet.tsx
- AdminLayout.tsx
- registrationScan.ts
- Reprise

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 86 edges
3. `lucide-react` - 56 edges
4. `react-router-dom` - 37 edges
5. `useSeo()` - 33 edges
6. `AnimatedSection()` - 29 edges
7. `VehicleForm()` - 27 edges
8. `thumbPath()` - 22 edges
9. `PostForm()` - 21 edges
10. `VehiclePhotos()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `6. Améliorations UX` --references--> `RegistrationScanner()`  [INFERRED]
  docs/PROJET-V2.md → src/components/RegistrationScanner.tsx
- `8. Plan par phases` --references--> `Vehicle`  [INFERRED]
  docs/PROJET-V2.md → src/lib/contentModel.ts
- `Architecture` --references--> `AnimatedSection()`  [INFERRED]
  CLAUDE.md → src/components/AnimatedSection.tsx
- `Public (visiteurs)` --references--> `GiftIllustration()`  [INFERRED]
  docs/PROJET-V2.md → src/components/GiftIllustration.tsx
- `Architecture` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx

## Import Cycles
- None detected.

## Communities (61 total, 8 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.18
Nodes (12): @radix-ui/react-accordion, Conseils, AccordionContent, AccordionItem, AccordionTrigger, Conseil, conseils, findConseil() (+4 more)

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
Nodes (48): @radix-ui/react-avatar, @radix-ui/react-context-menu, @radix-ui/react-dropdown-menu, @radix-ui/react-menubar, Avatar, AvatarFallback, AvatarImage, Card (+40 more)

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
Cohesion: 0.08
Nodes (24): name, private, type, version, autoprefixer, clsx, @dnd-kit/core, @dnd-kit/sortable (+16 more)

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
Cohesion: 0.06
Nodes (47): Mecanique, AdminPageHeader(), AdminPageHeaderProps, findService(), PriceType, Service, serviceCategories, ServiceCategory (+39 more)

### Community 16 - "PareBrise.tsx"
Cohesion: 0.10
Nodes (31): shapes, AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur, assureurs, GiftIllustrationKey (+23 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.06
Nodes (29): @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-slider, @radix-ui/react-switch, react (+21 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "Vehicules.tsx"
Cohesion: 0.11
Nodes (35): Chip(), FilterOptions, Group(), nf, VehicleFiltersPanel(), filtresKmMax, filtresPrixMax, occasionsIntro (+27 more)

### Community 21 - "useSeo"
Cohesion: 0.15
Nodes (22): ActualiteDetail, Actualites, HomeLatest(), SeeAll(), actualitesSeo, actualitesTextes, accueilDerniers, ensureCanonical() (+14 more)

### Community 22 - "pagination.tsx"
Cohesion: 0.09
Nodes (20): @radix-ui/react-slot, react-day-picker, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage (+12 more)

### Community 23 - "tabs.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-tabs, TabsContent, TabsList, TabsTrigger

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 25 - "vite.config.ts"
Cohesion: 0.25
Nodes (4): lovable-tagger, vite, @vitejs/plugin-react-swc, vitest

### Community 26 - "B MATIC — Cahier des charges V2 (évolution du site)"
Cohesion: 0.11
Nodes (17): 10. Actions à la charge du propriétaire (hors code), 1. Contexte & état actuel, 2. Objectifs, 3. Décisions techniques (actées), 4. Pages & fonctionnalités à livrer, 5.1 Offre pare-brise (page `/pare-brise` + bloc sur l'accueil), 5.2 Assureurs partenaires (carrousel, liste dans `src/data/assurances.ts`), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin) (+9 more)

### Community 27 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 28 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 29 - "PolitiqueConfidentialite.tsx"
Cohesion: 0.29
Nodes (7): MentionsLegales, PolitiqueConfidentialite, LegalPage(), LegalPageProps, supervisoryAuthority, MentionsLegales(), PolitiqueConfidentialite()

### Community 30 - "react"
Cohesion: 0.18
Nodes (12): Architecture, lucide-react, CookieConsent(), Footer(), Header(), navLinksAfter, navLinksBefore, serviceSubLinks (+4 more)

### Community 31 - "AdminActualiteForm.tsx"
Cohesion: 0.11
Nodes (29): @hookform/resolvers, react-hook-form, zod, adminInputClass, adminSelectClass, adminTextareaClass, autoExcerpt(), canDecodeImage() (+21 more)

### Community 32 - "VehiclePhotos.tsx"
Cohesion: 0.05
Nodes (99): date-fns, sonner, @tanstack/react-query, PostActionsMenu(), PostStatusBadge(), badgeStyles, useVehicleStatusMutation(), VehicleActionsMenu() (+91 more)

### Community 33 - "AdminApp.tsx"
Cohesion: 0.23
Nodes (18): AdminLayout(), AccessDenied(), AdminLoading(), CheckError(), Panel(), RequireAdmin(), AdminCheck, AdminSessionContext (+10 more)

### Community 34 - "AnimatedSection"
Cohesion: 0.16
Nodes (17): react-router-dom, APropos, AnimatedSection(), GiftIllustration(), GlowCard(), GlowCardProps, NeonButton(), NeonButtonProps (+9 more)

### Community 35 - "AdminVehiculeForm.tsx"
Cohesion: 0.11
Nodes (27): AiAssistButton(), SlugSuggestion(), Field(), FormSection(), SaveBar(), VehicleStatusBadge(), AI_ENABLED, createVehicle() (+19 more)

### Community 37 - "App.tsx"
Cohesion: 0.08
Nodes (24): next-themes, AdminApp, App(), ConseilDetail, Contact, Depannage, NotFound, PareBrise (+16 more)

### Community 38 - "@jsquash/webp"
Cohesion: 0.50
Nodes (3): @jsquash/webp, Job, scope

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

### Community 40 - "Reprise.tsx"
Cohesion: 0.14
Nodes (19): repriseChoix, repriseConsentement, repriseEtapes, repriseEtats, repriseIntro, repriseMessages, reprisePhotos, ReprisePhotoSlot (+11 more)

### Community 41 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

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
Nodes (16): canvasOf(), decode(), Decoded, encodeWebp(), fitWithin(), getWorker(), jobs, MAX_EDGE (+8 more)

### Community 53 - "scroll-area.tsx"
Cohesion: 0.67
Nodes (3): @radix-ui/react-scroll-area, ScrollArea, ScrollBar

### Community 54 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 55 - "aiCopy.ts"
Cohesion: 0.20
Nodes (11): @supabase/supabase-js, AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, invokeAiFunction(), Nullable (+3 more)

### Community 56 - "B MATIC — Instructions projet (lues automatiquement par Claude Code)"
Cohesion: 0.17
Nodes (11): B MATIC — Instructions projet (lues automatiquement par Claude Code), Charte graphique (à respecter absolument), Commands, Graphify, Infos, Langue, Project, Projet (+3 more)

### Community 57 - "sheet.tsx"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 58 - "AdminLayout.tsx"
Cohesion: 0.39
Nodes (6): navItems, confirmLeave(), guardLinkClick(), setUnsaved(), sources, useLeaveGuard()

### Community 59 - "registrationScan.ts"
Cohesion: 0.23
Nodes (14): Corner(), DocSketch(), RegistrationScanner(), blobToBase64(), fold(), matchIn(), RawScan, RegistrationScan (+6 more)

### Community 60 - "Reprise"
Cohesion: 0.18
Nodes (14): Camera(), CarTopView(), outlineProps, Point, Shot, SHOTS, SlotIllustration(), zoneProps (+6 more)

## Knowledge Gaps
- **12 isolated node(s):** `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography`, `@testing-library/react`, `@types/node` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 370 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `utils.ts` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `AdminDashboard.tsx`, `PareBrise.tsx`, `Vehicules.tsx`, `useSeo`, `pagination.tsx`, `tabs.tsx`, `input-otp.tsx`, `PolitiqueConfidentialite.tsx`, `react`, `AdminActualiteForm.tsx`, `VehiclePhotos.tsx`, `AdminApp.tsx`, `AnimatedSection`, `AdminVehiculeForm.tsx`, `App.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `select.tsx`, `scroll-area.tsx`, `drawer.tsx`, `sheet.tsx`, `AdminLayout.tsx`, `registrationScan.ts`, `Reprise`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **What connects `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `command.tsx`, `package.json`, `AdminDashboard.tsx`, `PareBrise.tsx`, `utils.ts`, `Vehicules.tsx`, `useSeo`, `pagination.tsx`, `input-otp.tsx`, `AdminActualiteForm.tsx`, `VehiclePhotos.tsx`, `AdminApp.tsx`, `AnimatedSection`, `AdminVehiculeForm.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `select.tsx`, `sheet.tsx`, `AdminLayout.tsx`, `registrationScan.ts`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `lucide-react`, `VehiclePhotos.tsx`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `navigation-menu.tsx`, `command.tsx`, `navigation-menu.tsx`, `form.tsx`, `chart.tsx`, `select.tsx`, `utils.ts`, `tabs.tsx`, `scroll-area.tsx`, `pagination.tsx`, `drawer.tsx`, `sheet.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._