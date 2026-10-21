import { Link } from "react-router-dom";
import { Phone, CalendarDays, MessageCircle } from "lucide-react";
import { legalInfo } from "@/data/legal";

// ============================================================================
//  MobileActionBar — barre d'action fixe en bas d'écran (mobile uniquement)
// ----------------------------------------------------------------------------
//  Actions rapides : Appeler · (WhatsApp) · Prendre RDV.
//  Le bouton WhatsApp n'apparaît que lorsque le numéro est confirmé
//  (legalInfo.whatsappConfirmed === true), afin de ne rien afficher de faux.
//  Cibles tactiles ≥ 44px, prise en compte de la zone sûre iOS (safe-area).
// ============================================================================

const MobileActionBar = () => {
  const showWhatsApp = legalInfo.whatsappConfirmed;
  // Numéro au format wa.me (chiffres uniquement), utilisé seulement si confirmé.
  const waNumber = legalInfo.whatsapp.replace(/[^\d]/g, "");

  const itemClass =
    "flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[56px] text-[11px] font-heading uppercase tracking-wider transition-colors";

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Actions rapides"
    >
      <div className="flex items-stretch">
        <a href={legalInfo.phoneHref} className={`${itemClass} text-foreground`}>
          <Phone className="w-5 h-5 text-neon-cyan" />
          Appeler
        </a>

        {showWhatsApp && (
          <a
            href={`https://wa.me/${waNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${itemClass} text-foreground border-l border-border`}
          >
            <MessageCircle className="w-5 h-5 text-neon-cyan" />
            WhatsApp
          </a>
        )}

        <Link
          to="/mecanique"
          className={`${itemClass} bg-gradient-btn text-primary-foreground`}
        >
          <CalendarDays className="w-5 h-5" />
          Prendre RDV
        </Link>
      </div>
    </nav>
  );
};

export default MobileActionBar;
