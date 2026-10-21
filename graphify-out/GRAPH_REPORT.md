# Graph Report - b-matic-Bilel  (2026-10-21)

## Corpus Check
- 110 files · ~266,679 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .lock 1)

## Summary
- 725 nodes · 1429 edges · 49 communities (38 shown, 11 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `326decbe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
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
- InsurerMarquee.tsx
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
- radio-group.tsx
- avatar.tsx
- alert.tsx
- popover.tsx
- main.tsx
- slider.tsx
- switch.tsx
- README.md
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- tailwindcss
- @testing-library/jest-dom

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
- `Architecture` --references--> `NeonButton()`  [INFERRED]
  CLAUDE.md → src/components/NeonButton.tsx
- `Architecture` --references--> `CookieConsent()`  [INFERRED]
  CLAUDE.md → src/components/CookieConsent.tsx
- `Architecture` --references--> `Footer()`  [INFERRED]
  CLAUDE.md → src/components/Footer.tsx

## Import Cycles
- None detected.

## Communities (49 total, 11 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (66): 1. Contexte & état actuel, lucide-react, react-router-dom, App(), APropos, ConseilDetail, Conseils, Contact (+58 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (52): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @fontsource/inter, @fontsource/orbitron (+44 more)

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
Cohesion: 0.11
Nodes (19): class-variance-authority, @radix-ui/react-navigation-menu, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Badge(), BadgeProps, badgeVariants, NavigationMenu (+11 more)

### Community 7 - "command.tsx"
Cohesion: 0.11
Nodes (19): cmdk, @radix-ui/react-dialog, CarteGriseModal(), Command, CommandDialog(), CommandDialogProps, CommandEmpty, CommandGroup (+11 more)

### Community 8 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+15 more)

### Community 9 - "package.json"
Cohesion: 0.09
Nodes (22): name, private, type, version, autoprefixer, date-fns, eslint, @hookform/resolvers (+14 more)

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

### Community 16 - "InsurerMarquee.tsx"
Cohesion: 0.39
Nodes (6): AssureurBadge(), AssureursGroup(), InsurerMarquee(), assurancesIntro, Assureur, assureurs

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "utils.ts"
Cohesion: 0.09
Nodes (16): clsx, @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-progress, @radix-ui/react-tabs, tailwind-merge, NavLink, NavLinkCompatProps (+8 more)

### Community 19 - "Graphify — graphe de connaissances du projet"
Cohesion: 0.33
Nodes (5): Graphify — graphe de connaissances du projet, Installation sur ta machine (une seule fois), Reconstruire le graphe après des changements de code, Utilisation au quotidien, Voir le graphe

### Community 20 - "Mecanique.tsx"
Cohesion: 0.18
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
Cohesion: 0.12
Nodes (16): 10. Actions à la charge du propriétaire (hors code), 2. Objectifs, 3. Décisions techniques (actées), 4. Pages & fonctionnalités à livrer, 5.1 Offre pare-brise (à mettre en avant, page dédiée + accueil), 5.2 Assureurs partenaires (à afficher, logos/noms), 5.3 Emplacements photos guidés (ajout véhicule, façon leboncoin), 5.4 Promotions (déjà dans `src/data/services.ts`) (+8 more)

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
Cohesion: 0.12
Nodes (19): Architecture, Commands, Graphify, Project, react, CookieConsent(), Footer(), Header() (+11 more)

### Community 31 - "scroll-area.tsx"
Cohesion: 0.67
Nodes (3): @radix-ui/react-scroll-area, ScrollArea, ScrollBar

### Community 32 - "dropdown-menu.tsx"
Cohesion: 0.18
Nodes (10): @radix-ui/react-dropdown-menu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 33 - "resizable.tsx"
Cohesion: 0.50
Nodes (3): react-resizable-panels, ResizableHandle(), ResizablePanelGroup()

### Community 34 - "radio-group.tsx"
Cohesion: 0.50
Nodes (3): @radix-ui/react-radio-group, RadioGroup, RadioGroupItem

### Community 35 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 37 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert, AlertDescription, AlertTitle, alertVariants

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/orbitron, react-dom

## Knowledge Gaps
- **15 isolated node(s):** `@hookform/resolvers`, `date-fns`, `tailwindcss-animate`, `zod`, `@playwright/test` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 266 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `context-menu.tsx`, `utils.ts`, `Mecanique.tsx`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `input-otp.tsx`, `scroll-area.tsx`, `dropdown-menu.tsx`, `radio-group.tsx`, `avatar.tsx`, `alert.tsx`, `popover.tsx`, `slider.tsx`, `switch.tsx`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **What connects `@hookform/resolvers`, `date-fns`, `tailwindcss-animate` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `react`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `navigation-menu.tsx`, `command.tsx`, `form.tsx`, `chart.tsx`, `context-menu.tsx`, `utils.ts`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `input-otp.tsx`, `scroll-area.tsx`, `dropdown-menu.tsx`, `resizable.tsx`, `radio-group.tsx`, `avatar.tsx`, `alert.tsx`, `popover.tsx`, `slider.tsx`, `switch.tsx`?**
  _High betweenness centrality (0.200) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `dropdown-menu.tsx`, `resizable.tsx`, `carousel.tsx`, `radio-group.tsx`, `sidebar.tsx`, `cn`, `navigation-menu.tsx`, `command.tsx`, `hooks/use-toast.ts`, `package.json`, `context-menu.tsx`, `utils.ts`, `Mecanique.tsx`, `select.tsx`, `breadcrumb.tsx`, `input-otp.tsx`, `react`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `carousel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06755260243632337 - nodes in this community are weakly interconnected._