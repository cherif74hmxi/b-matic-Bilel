import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
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
const PolitiqueConfidentialite = lazy(() => import("./pages/PolitiqueConfidentialite"));
const MentionsLegales = lazy(() => import("./pages/MentionsLegales"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Repli discret pendant le chargement d'un chunk de page (hauteur réservée
// pour éviter tout décalage de mise en page / CLS).
const RouteFallback = () => <div className="min-h-screen" aria-hidden="true" />;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/a-propos" element={<APropos />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reprise" element={<Reprise />} />
              <Route path="/mecanique" element={<Mecanique />} />
              <Route path="/depannage" element={<Depannage />} />
              <Route path="/pare-brise-assurances" element={<PareBrise />} />
              <Route path="/conseils" element={<Conseils />} />
              <Route path="/conseils/:slug" element={<ConseilDetail />} />
              <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
