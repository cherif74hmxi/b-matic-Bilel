import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import ChunkErrorBoundary from "@/components/ChunkErrorBoundary";
import PageViewTracker from "@/components/PageViewTracker";
import ContactClickTracker from "@/components/ContactClickTracker";
// Accueil chargé immédiatement (page d'atterrissage → LCP rapide).
import Index from "./pages/Index";

// Autres pages découpées en chunks séparés (code-splitting par route) : le JS
// initial reste léger, chaque page ne se télécharge qu'à la navigation.
const APropos = lazy(() => import("./pages/APropos"));
const Contact = lazy(() => import("./pages/Contact"));
const Reprise = lazy(() => import("./pages/Reprise"));
const Mecanique = lazy(() => import("./pages/Mecanique"));
const Depannage = lazy(() => import("./pages/Depannage"));
const PareBrise = lazy(() => import("./pages/PareBrise"));
const Conseils = lazy(() => import("./pages/Conseils"));
const ConseilDetail = lazy(() => import("./pages/ConseilDetail"));
const Vehicules = lazy(() => import("./pages/Vehicules"));
const VehiculeDetail = lazy(() => import("./pages/VehiculeDetail"));
const Actualites = lazy(() => import("./pages/Actualites"));
const ActualiteDetail = lazy(() => import("./pages/ActualiteDetail"));
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Espace admin : chunk séparé (supabase-js inclus), jamais chargé par les visiteurs.
const AdminApp = lazy(() => import("./pages/admin/AdminApp"));

const queryClient = new QueryClient();

// Repli discret pendant le chargement d'un chunk de page (hauteur réservée
// pour éviter tout décalage de mise en page / CLS).
const RouteFallback = () => <div className="min-h-screen" aria-hidden="true" />;

// Site public : Header / Footer / bannière cookies restent affichés pendant
// le chargement du chunk de la page.
// Pages publiques. Seules ces routes sont comptées dans les statistiques :
// les 404 (robots qui testent /wp-login.php, fautes de frappe…) ne le sont pas.
const publicRoutes = [
  { path: "/", element: <Index /> },
  { path: "/a-propos", element: <APropos /> },
  { path: "/contact", element: <Contact /> },
  { path: "/reprise", element: <Reprise /> },
  { path: "/mecanique", element: <Mecanique /> },
  { path: "/depannage", element: <Depannage /> },
  { path: "/pare-brise", element: <PareBrise /> },
  { path: "/conseils", element: <Conseils /> },
  { path: "/conseils/:slug", element: <ConseilDetail /> },
  { path: "/vehicules", element: <Vehicules /> },
  { path: "/vehicules/:slug", element: <VehiculeDetail /> },
  { path: "/actualites", element: <Actualites /> },
  { path: "/actualites/:slug", element: <ActualiteDetail /> },
  { path: "/politique-de-confidentialite", element: <PolitiqueConfidentialite /> },
  { path: "/mentions-legales", element: <MentionsLegales /> },
];
const trackedPaths = publicRoutes.map((r) => r.path);

// PageViewTracker / ContactClickTracker : statistiques sans cookie, site public
// uniquement (pas /admin).
const PublicLayout = () => (
  <Layout>
    <PageViewTracker trackedPaths={trackedPaths} />
    <ContactClickTracker />
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* En haut : en bas, les notifications recouvraient la barre d'onglets mobile de l'admin. */}
      <Sonner position="top-center" />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route
              path="/admin/*"
              element={
                <ChunkErrorBoundary>
                  <AdminApp />
                </ChunkErrorBoundary>
              }
            />
            <Route element={<PublicLayout />}>
              {publicRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              {/* Ancienne adresse de la page pare-brise (liens déjà partagés). */}
              <Route path="/pare-brise-assurances" element={<Navigate to="/pare-brise" replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
