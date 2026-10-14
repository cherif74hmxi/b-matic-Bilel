# Graph Report - b-matic-Bilel  (2026-10-14)

## Corpus Check
- 93 files · ~183,628 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 6 file(s) not represented in the graph (top: .css 2, (none) 1, .lock 1)

## Summary
- 626 nodes · 1219 edges · 49 communities (36 shown, 13 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c42da78a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
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
- dropdown-menu.tsx
- compilerOptions
- Layout.tsx
- sheet.tsx
- utils.ts
- select.tsx
- breadcrumb.tsx
- drawer.tsx
- scripts
- vite.config.ts
- react
- eslint.config.js
- input-otp.tsx
- sonner.tsx
- accordion.tsx
- avatar.tsx
- tabs.tsx
- radio-group.tsx
- scroll-area.tsx
- resizable.tsx
- checkbox.tsx
- popover.tsx
- slider.tsx
- NavLink.tsx
- textarea.tsx
- README.md
- @radix-ui/react-aspect-ratio
- @radix-ui/react-collapsible
- tailwindcss
- @testing-library/jest-dom

## God Nodes (most connected - your core abstractions)
1. `cn()` - 228 edges
2. `react` - 59 edges
3. `lucide-react` - 28 edges
4. `compilerOptions` - 19 edges
5. `react-router-dom` - 15 edges
6. `AnimatedSection()` - 15 edges
7. `compilerOptions` - 14 edges
8. `App()` - 13 edges
9. `class-variance-authority` - 11 edges
10. `GlowCard()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `NavLink` --calls--> `cn()`  [EXTRACTED]
  src/components/NavLink.tsx → src/lib/utils.ts
- `AccordionItem` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `AccordionTrigger` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `AccordionContent` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/accordion.tsx → src/lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  src/components/ui/alert-dialog.tsx → src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (49 total, 13 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.07
Nodes (47): lucide-react, react-dom, react-router-dom, App(), queryClient, AnimatedSection(), AnimatedSectionProps, GlowCard() (+39 more)

### Community 1 - "dependencies"
Cohesion: 0.04
Nodes (50): dependencies, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, @hookform/resolvers, input-otp (+42 more)

### Community 2 - "carousel.tsx"
Cohesion: 0.07
Nodes (37): embla-carousel-react, @radix-ui/react-alert-dialog, react-day-picker, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter() (+29 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.07
Nodes (30): Input, Separator, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent (+22 more)

### Community 4 - "hooks/use-toast.ts"
Cohesion: 0.12
Nodes (25): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+17 more)

### Community 5 - "cn"
Cohesion: 0.13
Nodes (26): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Menubar, MenubarCheckboxItem (+18 more)

### Community 6 - "navigation-menu.tsx"
Cohesion: 0.09
Nodes (23): class-variance-authority, @radix-ui/react-navigation-menu, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert, AlertDescription, AlertTitle, alertVariants (+15 more)

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

### Community 16 - "dropdown-menu.tsx"
Cohesion: 0.18
Nodes (10): @radix-ui/react-dropdown-menu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuShortcut() (+2 more)

### Community 17 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 18 - "Layout.tsx"
Cohesion: 0.31
Nodes (6): CookieConsent(), Footer(), Header(), navLinks, serviceSubLinks, Layout()

### Community 19 - "sheet.tsx"
Cohesion: 0.24
Nodes (9): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants (+1 more)

### Community 20 - "utils.ts"
Cohesion: 0.22
Nodes (6): clsx, @radix-ui/react-hover-card, @radix-ui/react-switch, tailwind-merge, HoverCardContent, Switch

### Community 21 - "select.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-select, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 22 - "breadcrumb.tsx"
Cohesion: 0.22
Nodes (8): @radix-ui/react-slot, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator()

### Community 23 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 24 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:dev, dev, lint, preview, test, test:watch

### Community 25 - "vite.config.ts"
Cohesion: 0.29
Nodes (4): lovable-tagger, vite, @vitejs/plugin-react-swc, vitest

### Community 26 - "react"
Cohesion: 0.25
Nodes (5): @radix-ui/react-progress, @radix-ui/react-separator, @radix-ui/react-tooltip, react, Progress

### Community 27 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 28 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 29 - "sonner.tsx"
Cohesion: 0.40
Nodes (4): next-themes, sonner, Toaster(), ToasterProps

### Community 30 - "accordion.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-accordion, AccordionContent, AccordionItem, AccordionTrigger

### Community 31 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 32 - "tabs.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-tabs, TabsContent, TabsList, TabsTrigger

### Community 33 - "radio-group.tsx"
Cohesion: 0.50
Nodes (3): @radix-ui/react-radio-group, RadioGroup, RadioGroupItem

### Community 34 - "scroll-area.tsx"
Cohesion: 0.67
Nodes (3): @radix-ui/react-scroll-area, ScrollArea, ScrollBar

### Community 35 - "resizable.tsx"
Cohesion: 0.50
Nodes (3): react-resizable-panels, ResizableHandle(), ResizablePanelGroup()

## Knowledge Gaps
- **15 isolated node(s):** `@hookform/resolvers`, `date-fns`, `tailwindcss-animate`, `zod`, `@playwright/test` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 227 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `navigation-menu.tsx`, `command.tsx`, `form.tsx`, `chart.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `sheet.tsx`, `utils.ts`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `react`, `input-otp.tsx`, `accordion.tsx`, `avatar.tsx`, `tabs.tsx`, `radio-group.tsx`, `scroll-area.tsx`, `resizable.tsx`, `checkbox.tsx`, `popover.tsx`, `slider.tsx`, `NavLink.tsx`, `textarea.tsx`?**
  _High betweenness centrality (0.248) - this node is a cross-community bridge._
- **What connects `@hookform/resolvers`, `date-fns`, `tailwindcss-animate` to the rest of the system?**
  _15 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07287784679089027 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `App.tsx`, `carousel.tsx`, `sidebar.tsx`, `hooks/use-toast.ts`, `cn`, `navigation-menu.tsx`, `command.tsx`, `package.json`, `form.tsx`, `chart.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `Layout.tsx`, `sheet.tsx`, `utils.ts`, `select.tsx`, `breadcrumb.tsx`, `drawer.tsx`, `input-otp.tsx`, `accordion.tsx`, `avatar.tsx`, `tabs.tsx`, `radio-group.tsx`, `scroll-area.tsx`, `checkbox.tsx`, `popover.tsx`, `slider.tsx`, `NavLink.tsx`, `textarea.tsx`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Should `carousel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06968641114982578 - nodes in this community are weakly interconnected._