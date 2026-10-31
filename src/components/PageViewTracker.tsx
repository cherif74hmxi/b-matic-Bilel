import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { ATTRIBUTION_PARAMS, getAttribution, getSessionId } from "@/lib/attribution";
import { insertPublicRow } from "@/lib/publicInsert";

// ============================================================================
//  PageViewTracker — statistiques de visites SANS cookie (RGPD)
// ----------------------------------------------------------------------------
//  À chaque changement de route du site public, enregistre dans page_views :
//    · path     : chemin seul (sans paramètres ni ancre, qui peuvent contenir
//                 des données personnelles) ;
//    · entry    : vrai pour la première page comptée de la visite (premier
//                 affichage du site dans cet onglet) → nombre de visites ;
//    · referrer : nom de domaine du site d'origine, seulement à l'arrivée et
//                 seulement s'il est externe (ex. « www.google.com ») ;
//    · session_id : numéro de visite anonyme, tiré au hasard pour cet onglet
//                 (sessionStorage, src/lib/attribution.ts) ;
//    · utm_*, gclid : campagne d'où vient la visite, sur la page d'entrée seulement.
//  Aucune IP, aucun cookie, aucun suivi d'une visite à l'autre.
//  Seules les routes connues sont comptées (pas les 404). Désactivé en
//  développement et pour les navigateurs automatisés.
// ============================================================================

// Au niveau du module (et non par instance) : document.referrer ne change pas
// pendant la visite, il ne doit être compté qu'une fois même si le composant
// est remonté (aller-retour par /admin, par ex.).
// Le même drapeau marque la page d'entrée de la visite (entry).
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

/** Paramètres de campagne (utm_*, gclid) notés à l'arrivée dans cet onglet. */
function pickCampaign(): Record<string, string> {
  const a = getAttribution();
  return Object.fromEntries(ATTRIBUTION_PARAMS.flatMap((k) => (a[k] ? [[k, a[k]]] : [])));
}

const PageViewTracker = ({ trackedPaths }: { trackedPaths: string[] }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV || navigator.webdriver) return;
    if (!trackedPaths.some((pattern) => matchPath(pattern, pathname))) return;

    const entry = !referrerSent;
    const referrer = entry ? externalReferrerHost() : null;
    referrerSent = true;
    const row = { path: pathname.slice(0, 512), referrer, entry };
    const campaign = entry ? pickCampaign() : {};
    // Envoi immédiat (keepalive) : une petite requête, rien n'est perdu si
    // l'onglet est fermé juste après. Si la base refuse les nouvelles colonnes,
    // la vue est renvoyée sans elles : jamais perdue.
    void insertPublicRow("page_views", { ...row, session_id: getSessionId(), ...campaign }).then(
      (ok) => ok || insertPublicRow("page_views", row),
    );
  }, [pathname, trackedPaths]);

  return null;
};

export default PageViewTracker;
