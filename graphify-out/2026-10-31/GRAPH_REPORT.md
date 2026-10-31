# Graph Report - b-matic-Bilel  (2026-10-31)

## Corpus Check
- 202 files · ~167,786 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1298 nodes · 3049 edges · 71 communities (59 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d1cc4b38`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UI Cards & Menus Radix
- Dépendances runtime
- Primitives Radix UI
- Instructions projet & RGPD
- Conseils.tsx
- App.tsx
- RdvSteps.tsx
- SEO & balises head
- Sidebar & Sheet UI
- AdminActualiteForm.tsx
- kpi.ts
- Edge function IA (Gemini)
- react
- toast.tsx
- ActualiteDetail.tsx
- conseils.ts
- AdminApp.tsx
- posts.ts
- package.json
- Carte grise & dialogues
- DevDependencies & lint
- Actions admin véhicules/articles
- select.tsx
- TrafficChart.tsx
- Image Open Graph B MATIC (partage social)
- schema.ts
- tsconfig.app
- AdminDashboard.tsx
- vitest
- imageOptimize.ts
- Alertes & toggles UI
- clickTracking.ts
- components.json shadcn
- Formulaires react-hook-form
- Boutons & calendrier
- PareBrise.tsx
- Carousel
- Mise en ligne de B MATIC sur le VPS
- tsconfig.node
- drawer.tsx
- attribution.ts
- input-otp.tsx
- AdminActualites.tsx
- aiCopy.ts
- Graphiques recharts
- hooks/use-toast.ts
- formTracking.ts
- tsconfig racine
- seo.ts
- Sheet UI
- AnimatedSection.tsx
- Navigation menu UI
- ChunkErrorBoundary
- Scripts npm
- Index.tsx
- routes.ts
- Configuration Vercel
- ESLint
- avatar.tsx
- Polices & point d entrée
- Photo hero garage
- Types Vite
- Aspect ratio UI
- Collapsible UI
- Tailwind
- Setup tests
- Placeholder SVG
- README Lovable

## God Nodes (most connected - your core abstractions)
1. `cn()` - 226 edges
2. `react` - 79 edges
3. `lucide-react` - 50 edges
4. `useSeo()` - 38 edges
5. `react-router-dom` - 31 edges
6. `PostForm()` - 21 edges
7. `AdminDashboard()` - 20 edges
8. `vitest` - 19 edges
9. `AnimatedSection()` - 19 edges
10. `compilerOptions` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Logo B MATIC (PNG, public)` --semantically_similar_to--> `Logo B MATIC (WebP, assets)`  [INFERRED] [semantically similar]
  public/logo.png → src/assets/bmatic-logo.webp
- `Mobile-first global` --semantically_similar_to--> `Regles de travail (mobile-first, RGPD, build avant commit)`  [INFERRED] [semantically similar]
  docs/PROJET-V2.md → CLAUDE.md
- `Logo B MATIC (WebP, assets)` --conceptually_related_to--> `Identité visuelle B MATIC : voiture de sport stylisée, circuits et engrenages, dégradé bleu/violet/rose sur fond blanc`  [INFERRED]
  src/assets/bmatic-logo.webp → public/logo.png
- `PrerenderPage` --references--> `injectHead()`  [EXTRACTED]
  vite-plugin-seo.ts → api/_lib/head.ts
- `Confirmation` --references--> `RdvForm`  [EXTRACTED]
  server/confirmation.ts → src/lib/rendezvous.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Ajout vehicule assiste (VIN, photos guidees, description IA)** — docs_projet_v2_espace_admin, docs_projet_v2_vin_nhtsa, docs_projet_v2_photos_guidees, docs_projet_v2_assistant_ia [EXTRACTED 1.00]
- **Offre pare-brise (page, donnees, cadeaux, assureurs)** — docs_projet_v2_page_pare_brise, src_data_parebrise, docs_projet_v2_data_assurances, docs_projet_v2_gift_illustration [EXTRACTED 1.00]
- **Stack backend Supabase (Auth, schema, RLS, Edge Functions)** — claude_supabase_backend, claude_supabase_schema, claude_rls_policy, docs_projet_v2_edge_functions [INFERRED 0.85]

## Communities (71 total, 12 thin omitted)

### Community 0 - "UI Cards & Menus Radix"
Cohesion: 0.07
Nodes (48): @radix-ui/react-context-menu, @radix-ui/react-dropdown-menu, @radix-ui/react-menubar, @radix-ui/react-tabs, Card, CardContent, CardDescription, CardFooter (+40 more)

### Community 1 - "Dépendances runtime"
Cohesion: 0.03
Nodes (59): dependencies, class-variance-authority, clsx, cmdk, date-fns, @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities (+51 more)

### Community 2 - "Primitives Radix UI"
Cohesion: 0.06
Nodes (23): @radix-ui/react-checkbox, @radix-ui/react-hover-card, @radix-ui/react-popover, @radix-ui/react-progress, @radix-ui/react-radio-group, @radix-ui/react-scroll-area, @radix-ui/react-slider, @radix-ui/react-switch (+15 more)

### Community 3 - "Instructions projet & RGPD"
Cohesion: 0.06
Nodes (43): CLAUDE.md (instructions projet B MATIC), Modules src/data (source unique du contenu editable), Formulaires Formspree (Contact, Reprise, Mecanique), src/data/legal.ts (identite legale et contacts), Routage App.tsx et Layout unique, Backend Supabase (Auth, Postgres, Storage, RLS), Schema Supabase (admins, vehicles, vehicle_photos, posts, page_views, leads), Composants UI maison (GlowCard, NeonButton, AnimatedSection) (+35 more)

### Community 4 - "Conseils.tsx"
Cohesion: 0.15
Nodes (16): APropos, ConseilPhoto(), GlowCard(), GlowCardProps, AccordionContent, AccordionItem, AccordionTrigger, FaqCategorie (+8 more)

### Community 5 - "App.tsx"
Cohesion: 0.10
Nodes (22): next-themes, sonner, ActualiteDetail, Actualites, AdminApp, App(), ConseilDetail, Conseils (+14 more)

### Community 6 - "RdvSteps.tsx"
Cohesion: 0.06
Nodes (89): express, buildConfirmationEmail(), Confirmation, confirmationHandler(), createLimiter(), isIsoDate(), isSameOrigin(), LIMITES (+81 more)

### Community 7 - "SEO & balises head"
Cohesion: 0.07
Nodes (32): clipDescription(), escapeAttr(), headTags(), injectHead(), jsonLdScript(), SITE_NAME, GET(), postMeta() (+24 more)

### Community 8 - "Sidebar & Sheet UI"
Cohesion: 0.07
Nodes (30): Input, Separator, Sidebar, SidebarContent, SidebarContext, SidebarFooter, SidebarGroup, SidebarGroupAction (+22 more)

### Community 9 - "AdminActualiteForm.tsx"
Cohesion: 0.11
Nodes (26): AiAssistButton(), SlugSuggestion(), Field(), FormSection(), adminInputClass, adminSelectClass, adminTextareaClass, SaveBar() (+18 more)

### Community 10 - "kpi.ts"
Cohesion: 0.15
Nodes (19): ClickKind, allowedBuckets(), BUCKET_LABELS, bucketLabel(), day(), defaultBucket(), MAX_HOUR_DAYS, Period (+11 more)

### Community 11 - "Edge function IA (Gemini)"
Cohesion: 0.08
Nodes (27): allowed, BadRequest, callGemini(), callsByUser, cleanRegistration(), cleanSlug(), clientIp(), consumeScanQuota() (+19 more)

### Community 12 - "react"
Cohesion: 0.15
Nodes (22): lucide-react, react, react-router-dom, MentionsLegales, PolitiqueConfidentialite, CookieConsent(), Footer(), Header() (+14 more)

### Community 13 - "toast.tsx"
Cohesion: 0.25
Nodes (12): @radix-ui/react-toast, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps, ToastTitle (+4 more)

### Community 14 - "ActualiteDetail.tsx"
Cohesion: 0.18
Nodes (21): actualitesSeo, actualitesTextes, ensureCanonical(), ensureMeta(), SeoOptions, useNoIndex(), useSeo(), autoExcerpt() (+13 more)

### Community 15 - "conseils.ts"
Cohesion: 0.22
Nodes (15): cadeaux, Conseil, CONSEIL_IMAGE_LARGEURS, CONSEIL_IMAGE_TAILLE, ConseilBloc, ConseilImage, conseils, conseilsLies() (+7 more)

### Community 16 - "AdminApp.tsx"
Cohesion: 0.16
Nodes (24): Identité visuelle B MATIC : voiture de sport stylisée, circuits et engrenages, dégradé bleu/violet/rose sur fond blanc, Logo B MATIC (PNG, public), @supabase/supabase-js, Logo B MATIC (WebP, assets), AdminLayout(), navItems, AccessDenied(), AdminLoading() (+16 more)

### Community 17 - "posts.ts"
Cohesion: 0.20
Nodes (19): Post, POST_STATUS_LABELS, PostStatus, STORAGE_BUCKETS, thumbPath(), optimizeImage(), bucket(), createPost() (+11 more)

### Community 18 - "package.json"
Cohesion: 0.07
Nodes (27): name, private, type, version, autoprefixer, clsx, @dnd-kit/core, @dnd-kit/sortable (+19 more)

### Community 19 - "Carte grise & dialogues"
Cohesion: 0.12
Nodes (18): cmdk, @radix-ui/react-dialog, Command, CommandDialog(), CommandDialogProps, CommandEmpty, CommandGroup, CommandInput (+10 more)

### Community 20 - "DevDependencies & lint"
Cohesion: 0.09
Nodes (23): devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom (+15 more)

### Community 21 - "Actions admin véhicules/articles"
Cohesion: 0.23
Nodes (14): PostActionsMenu(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay (+6 more)

### Community 22 - "select.tsx"
Cohesion: 0.28
Nodes (8): @radix-ui/react-select, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger

### Community 23 - "TrafficChart.tsx"
Cohesion: 0.22
Nodes (11): @testing-library/react, METRIC_LABELS, nf, niceMax(), plural(), TrafficChart(), TrafficChartProps, TrafficMetric (+3 more)

### Community 25 - "schema.ts"
Cohesion: 0.21
Nodes (20): HeadMeta, absoluteUrl(), siteUrl, JSON_LD, notFoundMeta(), pageUrl(), PrerenderPage, prerenderPages() (+12 more)

### Community 26 - "tsconfig.app"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleDetection, moduleResolution (+12 more)

### Community 27 - "AdminDashboard.tsx"
Cohesion: 0.14
Nodes (22): AdminPageHeader(), AdminPageHeaderProps, fetchPeriodStats(), fetchTraffic(), variation(), AdminDashboard(), chipClass(), CLICK_ICONS (+14 more)

### Community 28 - "vitest"
Cohesion: 0.18
Nodes (4): vitest, insertPublicRow, insertPublicRow, lead

### Community 29 - "imageOptimize.ts"
Cohesion: 0.13
Nodes (19): @jsquash/webp, canvasOf(), decode(), Decoded, encodeWebp(), fitWithin(), getWorker(), jobs (+11 more)

### Community 30 - "Alertes & toggles UI"
Cohesion: 0.14
Nodes (15): class-variance-authority, @radix-ui/react-toggle, @radix-ui/react-toggle-group, Alert, AlertDescription, AlertTitle, alertVariants, Badge() (+7 more)

### Community 31 - "clickTracking.ts"
Cohesion: 0.18
Nodes (12): ContactClickTracker(), classifyContactLink(), CLICK_KIND_LABELS, CLICK_KINDS, clip(), LEAD_STATUS_LABELS, LEAD_STATUSES, LEAD_TYPE_LABELS (+4 more)

### Community 32 - "components.json shadcn"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 33 - "Formulaires react-hook-form"
Cohesion: 0.18
Nodes (14): @radix-ui/react-label, react-hook-form, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+6 more)

### Community 34 - "Boutons & calendrier"
Cohesion: 0.09
Nodes (20): @radix-ui/react-slot, react-day-picker, Breadcrumb, BreadcrumbEllipsis(), BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage (+12 more)

### Community 35 - "PareBrise.tsx"
Cohesion: 0.12
Nodes (27): embla-carousel-react, AnimatedSection(), GiftCarousel(), reduitAnimations(), pareBriseAssurances, PareBriseCadeau, pareBriseCadeaux, pareBriseCompris (+19 more)

### Community 36 - "Carousel"
Cohesion: 0.17
Nodes (15): Button, Carousel, CarouselApi, CarouselContent, CarouselContext, CarouselContextProps, CarouselItem, CarouselNext (+7 more)

### Community 37 - "Mise en ligne de B MATIC sur le VPS"
Cohesion: 0.17
Nodes (11): 0. Pré-requis, 1. DNS (déjà fait), 2. Récupérer le code sur le VPS, 3. Le fichier `.env`, 4. Build + démarrage, 5. nginx + HTTPS, 6. Auto-déploiement (GitHub Actions), 7. Tester l'auto-déploiement (+3 more)

### Community 38 - "tsconfig.node"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit (+7 more)

### Community 39 - "drawer.tsx"
Cohesion: 0.25
Nodes (7): vaul, DrawerContent, DrawerDescription, DrawerFooter(), DrawerHeader(), DrawerOverlay, DrawerTitle

### Community 40 - "attribution.ts"
Cohesion: 0.20
Nodes (13): externalReferrerHost(), PageViewTracker(), pickCampaign(), Attribution, ATTRIBUTION_PARAMS, captureAttribution(), clip(), externalReferrer() (+5 more)

### Community 41 - "input-otp.tsx"
Cohesion: 0.33
Nodes (5): input-otp, InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot

### Community 43 - "AdminActualites.tsx"
Cohesion: 0.25
Nodes (12): date-fns, @tanstack/react-query, PostStatusBadge(), fmt, ViewsCount(), ContentKind, ContentViews, fetchContentViews() (+4 more)

### Community 44 - "aiCopy.ts"
Cohesion: 0.24
Nodes (8): AI_LIMITS, compact(), CopyRequest, generateCopy(), GeneratedCopy, Nullable, PostCopyInput, useAiCopy()

### Community 45 - "Graphiques recharts"
Cohesion: 0.24
Nodes (11): recharts, ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent, ChartStyle(), ChartTooltipContent (+3 more)

### Community 46 - "hooks/use-toast.ts"
Cohesion: 0.19
Nodes (13): Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState (+5 more)

### Community 47 - "formTracking.ts"
Cohesion: 0.35
Nodes (11): enabled(), memory, Progress, readProgress(), saveProgress(), send(), TrackedForm, trackFormStart() (+3 more)

### Community 48 - "tsconfig racine"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, noImplicitAny, noUnusedLocals, noUnusedParameters, paths, skipLibCheck, strictNullChecks (+2 more)

### Community 49 - "seo.ts"
Cohesion: 0.27
Nodes (7): NeonButton(), NeonButtonProps, pareBriseSeo, notFoundSeo, PageSeo, StaticPath, NotFound()

### Community 50 - "Sheet UI"
Cohesion: 0.28
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 51 - "AnimatedSection.tsx"
Cohesion: 0.53
Nodes (4): AnimatedSectionProps, canRunAmbientMotion(), isLowEndDevice(), prefersReducedMotion()

### Community 52 - "Navigation menu UI"
Cohesion: 0.28
Nodes (8): @radix-ui/react-navigation-menu, NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle, NavigationMenuViewport

### Community 54 - "Scripts npm"
Cohesion: 0.22
Nodes (9): scripts, build, build:dev, dev, lint, preview, serve, test (+1 more)

### Community 55 - "Index.tsx"
Cohesion: 0.15
Nodes (19): HeroBackground(), InsurerLogos(), largeurOptique(), Tuiles(), accueilArguments, accueilAssureurs, accueilCadeaux, accueilCtaFinal (+11 more)

### Community 56 - "routes.ts"
Cohesion: 0.47
Nodes (4): FIXED_PATHS, isAppPath(), PUBLIC_PATHS, PublicPath

### Community 57 - "Configuration Vercel"
Cohesion: 0.25
Nodes (7): includeFiles, cleanUrls, functions, api/share.ts, headers, redirects, rewrites

### Community 58 - "ESLint"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

### Community 59 - "avatar.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-avatar, Avatar, AvatarFallback, AvatarImage

### Community 60 - "Polices & point d entrée"
Cohesion: 0.40
Nodes (3): @fontsource/inter, @fontsource/poppins, react-dom

### Community 62 - "Photo hero garage"
Cohesion: 0.67
Nodes (4): Hero garage photo (JPG) - modern workshop interior, Homepage hero background: clean, bright modern garage workshop with two vehicles on lifts, mechanic at diagnostic cart, grey/steel palette, polished epoxy floor, skylight, Hero garage photo (WebP mobile), Hero garage photo (WebP desktop)

## Knowledge Gaps
- **33 isolated node(s):** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `tailwindcss-animate`, `tsx` (+28 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 393 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `UI Cards & Menus Radix`, `Primitives Radix UI`, `Conseils.tsx`, `App.tsx`, `RdvSteps.tsx`, `SEO & balises head`, `Sidebar & Sheet UI`, `AdminActualiteForm.tsx`, `toast.tsx`, `ActualiteDetail.tsx`, `AdminApp.tsx`, `package.json`, `Carte grise & dialogues`, `Actions admin véhicules/articles`, `select.tsx`, `TrafficChart.tsx`, `AdminDashboard.tsx`, `Alertes & toggles UI`, `clickTracking.ts`, `Formulaires react-hook-form`, `Boutons & calendrier`, `PareBrise.tsx`, `Carousel`, `drawer.tsx`, `attribution.ts`, `input-otp.tsx`, `Graphiques recharts`, `hooks/use-toast.ts`, `seo.ts`, `Sheet UI`, `AnimatedSection.tsx`, `Navigation menu UI`, `ChunkErrorBoundary`, `avatar.tsx`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **What connects `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` to the rest of the system?**
  _33 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Cards & Menus Radix` be split into smaller, more focused modules?**
  _Cohesion score 0.06708595387840671 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `UI Cards & Menus Radix`, `Primitives Radix UI`, `Conseils.tsx`, `RdvSteps.tsx`, `SEO & balises head`, `Sidebar & Sheet UI`, `AdminActualiteForm.tsx`, `toast.tsx`, `ActualiteDetail.tsx`, `conseils.ts`, `AdminApp.tsx`, `package.json`, `Carte grise & dialogues`, `Actions admin véhicules/articles`, `select.tsx`, `AdminDashboard.tsx`, `Boutons & calendrier`, `PareBrise.tsx`, `Carousel`, `input-otp.tsx`, `AdminActualites.tsx`, `Sheet UI`, `Navigation menu UI`, `Index.tsx`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Should `Dépendances runtime` be split into smaller, more focused modules?**
  _Cohesion score 0.03389830508474576 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `UI Cards & Menus Radix` to `Formulaires react-hook-form`, `Boutons & calendrier`, `Primitives Radix UI`, `Conseils.tsx`, `Carousel`, `drawer.tsx`, `Sidebar & Sheet UI`, `input-otp.tsx`, `Graphiques recharts`, `toast.tsx`, `Sheet UI`, `Carte grise & dialogues`, `Navigation menu UI`, `Actions admin véhicules/articles`, `select.tsx`, `avatar.tsx`, `Alertes & toggles UI`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `Primitives Radix UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._