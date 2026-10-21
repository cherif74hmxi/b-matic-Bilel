# Graph Report - b-matic-Bilel  (2026-10-21)

## Corpus Check
- 112 files · ~54,520 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 732 nodes · 1436 edges · 54 communities (44 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3b0901d`
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
- context-menu.tsx
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
- scroll-area.tsx
- dropdown-menu.tsx
- resizable.tsx
- AnimatedSection
- avatar.tsx
- App.tsx
- popover.tsx
- main.tsx
- react-router-dom
- navigation-menu.tsx
- README.md
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- tailwindcss
- @testing-library/jest-dom
- vite-env.d.ts
- react
- Reprise.tsx
- tabs.tsx
- supabase.ts
- progress.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 64 edges
3. `lucide-react` - 34 edges
4. `AnimatedSection()` - 23 edges
5. `compilerOptions` - 19 edges
6. `react-router-dom` - 18 edges
7. `App()` - 17 edges
8. `GlowCard()` - 17 edges
9. `NeonButton()` - 16 edges
10. `compilerOptions` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Architecture` --references--> `AnimatedSection()`  [INFERRED]
  CLAUDE.md → src/components/AnimatedSection.tsx
- `Architecture` --references--> `GlowCard()`  [INFERRED]
  CLAUDE.md → src/components/GlowCard.tsx
- `1. Contexte & état actuel` --references--> `GlowCard()`  [INFERRED]
  docs/PROJET-V2.md → src/components/GlowCard.tsx
- `Architecture` --references--> `NeonButton()`  [INFERRED]
  CLAUDE.md → src/components/NeonButton.tsx
- `1. Contexte & état actuel` --references--> `NeonButton()`  [INFERRED]
  docs/PROJET-V2.md → src/components/NeonButton.tsx

## Import Cycles
- None detected.

## Communities (54 total, 10 thin omitted)

### Community 0 - "lucide-react"
Cohesion: 0.16
Nodes (17): lucide-react, @radix-ui/react-accordion, AccordionContent, AccordionItem, AccordionTrigger, Conseil, conseils, findConseil() (+9 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (53): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @fontsource/inter, @fontsource/orbitron (+45 more)

### Community 2 - "carousel.tsx"
Cohesion: 0.07
Nodes (38): embla-carousel-react, @radix-ui/react-alert-dialog, @radix-ui/react-slot, react-day-picker, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription (+30 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.05
Nodes (41): @radix-ui/react-separator, @radix-ui/react-tooltip, Input, Separator, SheetContent, SheetContentProps, SheetDescription, SheetFooter() (+33 more)

### Community 4 - "hooks/use-toast.ts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 5 - "cn"
Cohesion: 0.13
Nodes (26): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Menubar, MenubarCheckboxItem (+18 more)

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
Cohesion: 0.09
Nodes (21): name, private, type, version, autoprefixer, date-fns, eslint, @hookform/resolvers (+13 more)

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

### Community 15 - "context-menu.tsx"
Cohesion: 0.18
Nodes (10): @radix-ui/react-context-menu, ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem, ContextMenuSeparator, ContextMenuShortcut() (+2 more)

### Community 16 - "PareBrise.tsx"
Cohesion: 0.15
Nodes (14): AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur, assureurs, pareBriseAccroche, PareBriseAvantage (+6 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.08
Nodes (17): clsx, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-radio-group, @radix-ui/react-slider, @radix-ui/react-switch, tailwind-merge, NavLink (+9 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "Mecanique.tsx"
Cohesion: 0.19
Nodes (16): findService(), PriceType, Service, serviceCategories, ServiceCategory, DAYS, durLabel(), HEURES (+8 more)

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
Cohesion: 0.29
Nodes (4): lovable-tagger, vite, @vitejs/plugin-react-swc, vitest

### Community 26 - "B MATIC — Cahier des charges V2 (évolution du site)"
Cohesion: 0.11
Nodes (17): 10. Actions à la charge du propriétaire (hors code), 1. Contexte & état actuel, 2. Objectifs, 3. Décisions techniques (actées), 4. Pages & fonctionnalités à livrer, 5.1 Offre pare-brise (à mettre en avant, page dédiée + accueil), 5.2 Assureurs partenaires (à afficher, logos/noms), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin) (+9 more)

### Community 27 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 28 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 29 - "sonner.tsx"
Cohesion: 0.40
Nodes (4): next-themes, sonner, Toaster(), ToasterProps

### Community 30 - "react"
Cohesion: 0.17
Nodes (12): Architecture, Commands, Graphify, Project, CookieConsent(), Footer(), Header(), navLinksAfter (+4 more)

### Community 31 - "scroll-area.tsx"
Cohesion: 0.67
Nodes (3): @radix-ui/react-scroll-area, ScrollArea, ScrollBar

### Community 32 - "dropdown-menu.tsx"
Cohesion: 0.18
Nodes (10): @radix-ui/react-dropdown-menu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 33 - "resizable.tsx"
Cohesion: 0.50
Nodes (3): react-resizable-panels, ResizableHandle(), ResizablePanelGroup()

### Community 34 - "AnimatedSection"
Cohesion: 0.18
Nodes (15): AnimatedSection(), AuroraBackground(), GlowCard(), GlowCardProps, NeonButton(), NeonButtonProps, advantages, APropos() (+7 more)

### Community 35 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 37 - "App.tsx"
Cohesion: 0.19
Nodes (15): App(), APropos, ConseilDetail, Conseils, Contact, Depannage, Mecanique, MentionsLegales (+7 more)

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

### Community 40 - "react-router-dom"
Cohesion: 0.32
Nodes (7): react-router-dom, LegalPage(), LegalPageProps, legalInfo, supervisoryAuthority, MentionsLegales(), PolitiqueConfidentialite()

### Community 41 - "navigation-menu.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 49 - "react"
Cohesion: 0.36
Nodes (6): react, AnimatedSectionProps, blobs, canRunAmbientMotion(), isLowEndDevice(), prefersReducedMotion()

### Community 50 - "Reprise.tsx"
Cohesion: 0.38
Nodes (5): marques, vehiculesData, carburants, historiqueOptions, mois

### Community 51 - "tabs.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-tabs, TabsContent, TabsList, TabsTrigger

### Community 52 - "supabase.ts"
Cohesion: 0.50
Nodes (3): @supabase/supabase-js, STORAGE_BUCKETS, supabase

## Knowledge Gaps
- **15 isolated node(s):** `@hookform/resolvers`, `date-fns`, `tailwindcss-animate`, `zod`, `@playwright/test` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 270 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `context-menu.tsx`, `utils.ts`, `Mecanique.tsx`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `input-otp.tsx`, `react`, `scroll-area.tsx`, `dropdown-menu.tsx`, `AnimatedSection`, `avatar.tsx`, `App.tsx`, `popover.tsx`, `react-router-dom`, `navigation-menu.tsx`, `Reprise.tsx`, `tabs.tsx`, `progress.tsx`?**
  _High betweenness centrality (0.239) - this node is a cross-community bridge._
- **What connects `@hookform/resolvers`, `date-fns`, `tailwindcss-animate` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.03773584905660377 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `lucide-react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `navigation-menu.tsx`, `command.tsx`, `form.tsx`, `chart.tsx`, `context-menu.tsx`, `utils.ts`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `input-otp.tsx`, `scroll-area.tsx`, `dropdown-menu.tsx`, `resizable.tsx`, `avatar.tsx`, `popover.tsx`, `navigation-menu.tsx`, `tabs.tsx`, `progress.tsx`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Should `carousel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06755260243632337 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `command.tsx`, `package.json`, `context-menu.tsx`, `PareBrise.tsx`, `utils.ts`, `Mecanique.tsx`, `select.tsx`, `breadcrumb.tsx`, `input-otp.tsx`, `react`, `dropdown-menu.tsx`, `resizable.tsx`, `AnimatedSection`, `react-router-dom`, `navigation-menu.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05279034690799397 - nodes in this community are weakly interconnected._