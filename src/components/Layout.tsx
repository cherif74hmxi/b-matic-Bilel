import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import MobileActionBar from "@/components/MobileActionBar";
import { RDV_PATH } from "@/data/rdv";

const Layout = ({ children }: { children: ReactNode }) => {
  // Le formulaire de rendez-vous a sa propre barre de navigation en bas d'écran.
  const actionBar = useLocation().pathname !== RDV_PATH;
  // padding-bottom mobile (sur tout le site, pied de page compris) : place pour la
  // barre d'action fixe, ou pour la navigation du formulaire de rendez-vous.
  return (
    <div className={`min-h-screen flex flex-col font-body md:pb-0 ${actionBar ? "pb-16" : "pb-[5.5rem]"}`}>
      {/* Accessibilité clavier : premier élément focusable, visible seulement au focus */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:ring-2 focus:ring-primary"
      >
        Aller au contenu
      </a>
      <Header />
      <main id="contenu" tabIndex={-1} className="flex-1 outline-none">{children}</main>
      <Footer />
      <CookieConsent />
      {actionBar && <MobileActionBar />}
    </div>
  );
};

export default Layout;
