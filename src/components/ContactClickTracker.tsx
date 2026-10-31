import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { classifyContactLink } from "@/lib/clickTracking";
import { pushConversion } from "@/lib/consent";
import { insertPublicRow } from "@/lib/publicInsert";

// ============================================================================
//  ContactClickTracker — clics WhatsApp / téléphone / e-mail / RDV, SANS cookie
// ----------------------------------------------------------------------------
//  Un seul écouteur sur le document (phase de capture) : il voit tous les
//  liens du site public, y compris ceux ajoutés plus tard. N'enregistre que le
//  type de clic et la page (sans paramètres). Aucun identifiant de visiteur.
//  Comptage interne désactivé en développement et pour les navigateurs
//  automatisés, comme PageViewTracker. Le clic sur le lien de RDV de la page
//  /rendez-vous elle-même n'est pas compté (on y est déjà).
//  Téléphone et WhatsApp sont aussi des conversions pour GTM (pushConversion :
//  seulement avec l'accord du bandeau, sans donnée personnelle).
// ============================================================================

const ContactClickTracker = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const interne = !import.meta.env.DEV && !navigator.webdriver;

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const kind = classifyContactLink(link.href, window.location.origin);
      if (!kind) return;
      if (kind === "phone" || kind === "whatsapp") pushConversion(kind);
      if (!interne) return;
      if (kind === "rdv" && link.pathname === pathname) return;
      void insertPublicRow("click_events", { kind, path: pathname.slice(0, 512) });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
};

export default ContactClickTracker;
