import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { insertPublicRow } from "@/lib/publicInsert";

// ============================================================================
//  PageViewTracker — statistiques de visites SANS cookie (RGPD)
// ----------------------------------------------------------------------------
//  À chaque changement de route du site public, enregistre dans page_views :
//    · path     : chemin seul (sans paramètres ni ancre, qui peuvent contenir
//                 des données personnelles) ;
//    · referrer : nom de domaine du site d'origine, seulement à l'arrivée et
//                 seulement s'il est externe (ex. « www.google.com »).
//  Aucune IP, aucun cookie, aucun identifiant de visiteur, aucun stockage local.
//  Seules les routes connues sont comptées (pas les 404). Désactivé en
//  développement et pour les navigateurs automatisés.
// ============================================================================

// Au niveau du module (et non par instance) : document.referrer ne change pas
// pendant la visite, il ne doit être compté qu'une fois même si le composant
// est remonté (aller-retour par /admin, par ex.).
let referrerSent = false;

function externalReferrerHost(): string | null {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).host;
    return host && host !== window.location.host ? host.slice(0, 255) : null;
  } catch {
    return null;
  }
}

const PageViewTracker = ({ trackedPaths }: { trackedPaths: string[] }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV || navigator.webdriver) return;
    if (!trackedPaths.some((pattern) => matchPath(pattern, pathname))) return;

    const referrer = referrerSent ? null : externalReferrerHost();
    referrerSent = true;
    // Envoi immédiat (keepalive) : une petite requête, rien n'est perdu si
    // l'onglet est fermé juste après.
    void insertPublicRow("page_views", { path: pathname.slice(0, 512), referrer });
  }, [pathname, trackedPaths]);

  return null;
};

export default PageViewTracker;
