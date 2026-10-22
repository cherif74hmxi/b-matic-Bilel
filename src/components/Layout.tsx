import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import MobileActionBar from "@/components/MobileActionBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col font-body">
      {/* Accessibilité clavier : premier élément focusable, visible seulement au focus */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-3 focus:text-foreground focus:ring-2 focus:ring-primary"
      >
        Aller au contenu
      </a>
      <Header />
      {/* padding-bottom mobile pour laisser la place à la barre d'action fixe */}
      <main id="contenu" tabIndex={-1} className="flex-1 pb-16 md:pb-0 outline-none">{children}</main>
      <Footer />
      <CookieConsent />
      <MobileActionBar />
    </div>
  );
};

export default Layout;
