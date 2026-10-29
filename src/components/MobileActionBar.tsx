import { Link } from "react-router-dom";
import { CalendarDays, MessageCircle } from "lucide-react";
import { legalInfo } from "@/data/legal";
import { RDV_PATH } from "@/data/rdv";

// ============================================================================
//  MobileActionBar — barre d'action fixe en bas d'écran (mobile uniquement)
// ----------------------------------------------------------------------------
//  Actions rapides : Contacter sur WhatsApp · Prendre RDV.
//  Le lien WhatsApp provient de la source unique legalInfo.whatsappHref.
//  Cibles tactiles ≥ 44px, prise en compte de la zone sûre iOS (safe-area).
// ============================================================================

const MobileActionBar = () => {
  const itemClass =
    "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] px-2 text-center leading-tight text-[11px] font-heading uppercase tracking-wider transition-colors";

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Actions rapides"
    >
      <div className="flex items-stretch">
        <a
          href={legalInfo.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${itemClass} text-foreground`}
        >
          <MessageCircle className="w-5 h-5 text-neon-cyan" />
          Contacter sur WhatsApp
        </a>

        <Link
          to={RDV_PATH}
          className={`${itemClass} bg-gradient-btn text-primary-foreground border-l border-border`}
        >
          <CalendarDays className="w-5 h-5" />
          Prendre RDV
        </Link>
      </div>
    </nav>
  );
};

export default MobileActionBar;
