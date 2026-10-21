import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import Reprise from "./pages/Reprise";
import Mecanique from "./pages/Mecanique";
import Depannage from "./pages/Depannage";
import PareBrise from "./pages/PareBrise";
import Faq from "./pages/Faq";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import MentionsLegales from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/reprise" element={<Reprise />} />
            <Route path="/mecanique" element={<Mecanique />} />
            <Route path="/depannage" element={<Depannage />} />
            <Route path="/pare-brise-assurances" element={<PareBrise />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/politique-de-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
