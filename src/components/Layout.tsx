import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import MobileActionBar from "@/components/MobileActionBar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header />
      {/* padding-bottom mobile pour laisser la place à la barre d'action fixe */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <CookieConsent />
      <MobileActionBar />
    </div>
  );
};

export default Layout;
