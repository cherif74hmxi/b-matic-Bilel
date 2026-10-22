# Graph Report - b-matic-Bilel  (2026-10-22)

## Corpus Check
- 163 files · ~81,998 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1122 nodes · 2599 edges · 62 communities (54 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `aa89a783`
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
- AdminVehicules.tsx
- table.tsx
- avatar.tsx
- tabs.tsx
- scripts
- vite.config.ts
- B MATIC — Cahier des charges V2 (évolution du site)
- eslint.config.js
- input-otp.tsx
- sonner.tsx
- react
- vehicles.ts
- VehicleActions.tsx
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
- VehiclePhotos.tsx
- vin.ts
- index.ts
- imageOptimize.ts
- scroll-area.tsx
- resizable.tsx
- aiCopy.ts
- B MATIC — Instructions projet (lues automatiquement par Claude Code)
- sheet.tsx
- vitest
- registrationScan.ts
- Reprise
- react

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 82 edges
3. `lucide-react` - 49 edges
4. `react-router-dom` - 31 edges
5. `VehicleForm()` - 27 edges
6. `useSeo()` - 25 edges
7. `AnimatedSection()` - 23 edges
8. `PostForm()` - 21 edges
9. `VehiclePhotos()` - 19 edges
10. `compilerOptions` - 19 edges

## Surprising Connections (you probably didn't know these)
- `6. Améliorations UX` --references--> `RegistrationScanner()`  [INFERRED]
  docs/PROJET-V2.md → src/components/RegistrationScanner.tsx
- `Architecture` --references--> `AnimatedSection()`  [INFERRED]
  CLAUDE.md → src/components/AnimatedSection.tsx
- `Public (visiteurs)` --references--> `GiftIllustration()`  [INFERRED]
  docs/PROJET-V2.md → src/components/GiftIllustration.tsx
- `Architecture` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx
- `Architecture` --references--> `NeonButton()`  [INFERRED]
  CLAUDE.md → src/components/NeonButton.tsx

## Import Cycles
- None detected.

## Communities (62 total, 8 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.20
Nodes (11): Conseils, AccordionContent, AccordionItem, AccordionTrigger, Conseil, conseils, findConseil(), FaqCategorie (+3 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (57): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+49 more)

### Community 2 - "carousel.tsx"
Cohesion: 0.17
Nodes (15): embla-carousel-react, Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem (+7 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.07
Nodes (31): Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction (+23 more)

### Community 4 - "hooks/use-toast.ts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 5 - "cn"
Cohesion: 0.05
Nodes (59): @radix-ui/react-context-menu, @radix-ui/react-dropdown-menu, @radix-ui/react-menubar, @radix-ui/react-select, @radix-ui/react-slot, vaul, Breadcrumb, BreadcrumbEllipsis() (+51 more)

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
Nodes (25): name, private, type, version, autoprefixer, clsx, @dnd-kit/core, @dnd-kit/sortable (+17 more)

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
Cohesion: 0.06
Nodes (47): AdminPageHeader(), AdminPageHeaderProps, externalReferrerHost(), PageViewTracker(), findService(), PriceType, Service, serviceCategories (+39 more)

### Community 16 - "PareBrise.tsx"
Cohesion: 0.09
Nodes (32): shapes, AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur, assureurs, GiftIllustrationKey (+24 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.05
Nodes (31): @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-slider, @radix-ui/react-switch, react-day-picker (+23 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "AdminVehicules.tsx"
Cohesion: 0.15
Nodes (23): date-fns, @tanstack/react-query, PostStatusBadge(), VehicleStatusBadge(), fmt, ViewsCount(), ContentKind, ContentViews (+15 more)

### Community 21 - "table.tsx"
Cohesion: 0.22
Nodes (8): Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow

### Community 22 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 23 - "tabs.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-tabs, TabsContent, TabsList, TabsTrigger

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 25 - "vite.config.ts"
Cohesion: 0.40
Nodes (3): lovable-tagger, vite, @vitejs/plugin-react-swc

### Community 26 - "B MATIC — Cahier des charges V2 (évolution du site)"
Cohesion: 0.12
Nodes (15): 10. Actions à la charge du propriétaire (hors code), 2. Objectifs, 3. Décisions techniques (actées), 4. Pages & fonctionnalités à livrer, 5.1 Offre pare-brise (page `/pare-brise` + bloc sur l'accueil), 5.2 Assureurs partenaires (carrousel, liste dans `src/data/assurances.ts`), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin), 5.4 Promotions (déjà dans `src/data/services.ts`) (+7 more)

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
Cohesion: 0.16
Nodes (18): Architecture, lucide-react, react-router-dom, MentionsLegales, CookieConsent(), Footer(), Header(), navLinksAfter (+10 more)

### Community 31 - "vehicles.ts"
Cohesion: 0.13
Nodes (25): 8. Plan par phases, VehicleActionsMenuProps, bucket(), createPost(), PostInput, removePostCover(), replacePostCover(), updatePost() (+17 more)

### Community 32 - "VehicleActions.tsx"
Cohesion: 0.19
Nodes (23): PostActionsMenu(), badgeStyles, useVehicleStatusMutation(), VehicleActionsMenu(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription (+15 more)

### Community 33 - "AdminApp.tsx"
Cohesion: 0.16
Nodes (24): @supabase/supabase-js, AdminLayout(), navItems, AccessDenied(), AdminLoading(), CheckError(), Panel(), RequireAdmin() (+16 more)

### Community 34 - "AnimatedSection"
Cohesion: 0.13
Nodes (23): Charte graphique (à respecter absolument), 1. Contexte & état actuel, APropos, Depannage, AnimatedSection(), GiftIllustration(), GlowCard(), GlowCardProps (+15 more)

### Community 35 - "AdminVehiculeForm.tsx"
Cohesion: 0.10
Nodes (39): @hookform/resolvers, zod, AiAssistButton(), SlugSuggestion(), Field(), FormSection(), adminInputClass, adminSelectClass (+31 more)

### Community 37 - "App.tsx"
Cohesion: 0.11
Nodes (17): AdminApp, App(), ConseilDetail, Contact, Mecanique, NotFound, PareBrise, PolitiqueConfidentialite (+9 more)

### Community 38 - "@jsquash/webp"
Cohesion: 0.50
Nodes (3): @jsquash/webp, Job, scope

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

### Community 40 - "Reprise.tsx"
Cohesion: 0.13
Nodes (20): Pending, repriseChoix, repriseConsentement, repriseEtapes, repriseEtats, repriseIntro, repriseMessages, reprisePhotos (+12 more)

### Community 41 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 49 - "VehiclePhotos.tsx"
Cohesion: 0.20
Nodes (22): AddTile(), SortablePhoto(), StagedVehiclePhotos(), VehiclePhotos(), thumbPath(), StagedBatch, StagedFile, store (+14 more)

### Community 50 - "vin.ts"
Cohesion: 0.17
Nodes (18): WMI_MAKES, Gearbox, clean(), decodeVin(), knownMakes, makeFromWmi(), mapFuel(), mapGearbox() (+10 more)

### Community 51 - "index.ts"
Cohesion: 0.08
Nodes (27): allowed, BadRequest, callGemini(), callsByUser, cleanRegistration(), cleanSlug(), clientIp(), consumeScanQuota() (+19 more)

### Community 52 - "imageOptimize.ts"
Cohesion: 0.17
Nodes (19): canDecodeImage(), canvasOf(), decode(), Decoded, encodeWebp(), fitWithin(), getWorker(), jobs (+11 more)

### Community 53 - "scroll-area.tsx"
Cohesion: 0.67
Nodes (3): @radix-ui/react-scroll-area, ScrollArea, ScrollBar

### Community 54 - "resizable.tsx"
Cohesion: 0.50
Nodes (3): react-resizable-panels, ResizableHandle(), ResizablePanelGroup()

### Community 55 - "aiCopy.ts"
Cohesion: 0.18
Nodes (11): sonner, AI_ENABLED, AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, invokeAiFunction() (+3 more)

### Community 56 - "B MATIC — Instructions projet (lues automatiquement par Claude Code)"
Cohesion: 0.18
Nodes (10): B MATIC — Instructions projet (lues automatiquement par Claude Code), Commands, Graphify, Infos, Langue, Project, Projet, Règles de travail (+2 more)

### Community 57 - "sheet.tsx"
Cohesion: 0.28
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 58 - "vitest"
Cohesion: 0.17
Nodes (3): vitest, insertPublicRow, lead

### Community 59 - "registrationScan.ts"
Cohesion: 0.20
Nodes (17): Corner(), DocSketch(), RegistrationScanner(), repriseScan, blobToBase64(), fold(), matchIn(), RawScan (+9 more)

### Community 60 - "Reprise"
Cohesion: 0.18
Nodes (14): Camera(), CarTopView(), outlineProps, Point, Shot, SHOTS, SlotIllustration(), zoneProps (+6 more)

### Community 61 - "react"
Cohesion: 0.33
Nodes (7): react, AnimatedSectionProps, AuroraBackground(), blobs, canRunAmbientMotion(), isLowEndDevice(), prefersReducedMotion()

## Knowledge Gaps
- **12 isolated node(s):** `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography`, `@testing-library/react`, `@types/node` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 362 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `AdminDashboard.tsx`, `PareBrise.tsx`, `utils.ts`, `AdminVehicules.tsx`, `table.tsx`, `avatar.tsx`, `tabs.tsx`, `input-otp.tsx`, `react`, `VehicleActions.tsx`, `AdminApp.tsx`, `AnimatedSection`, `AdminVehiculeForm.tsx`, `App.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `VehiclePhotos.tsx`, `scroll-area.tsx`, `sheet.tsx`, `registrationScan.ts`, `Reprise`?**
  _High betweenness centrality (0.236) - this node is a cross-community bridge._
- **What connects `tailwindcss-animate`, `@playwright/test`, `@tailwindcss/typography` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03508771929824561 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `command.tsx`, `package.json`, `AdminDashboard.tsx`, `PareBrise.tsx`, `utils.ts`, `AdminVehicules.tsx`, `input-otp.tsx`, `VehicleActions.tsx`, `AdminApp.tsx`, `AnimatedSection`, `AdminVehiculeForm.tsx`, `Reprise.tsx`, `navigation-menu.tsx`, `VehiclePhotos.tsx`, `resizable.tsx`, `sheet.tsx`, `registrationScan.ts`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06923076923076923 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `lucide-react`, `VehicleActions.tsx`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `navigation-menu.tsx`, `command.tsx`, `navigation-menu.tsx`, `form.tsx`, `chart.tsx`, `utils.ts`, `tabs.tsx`, `scroll-area.tsx`, `avatar.tsx`, `resizable.tsx`, `table.tsx`, `sheet.tsx`, `input-otp.tsx`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `hooks/use-toast.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._