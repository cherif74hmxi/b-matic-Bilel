// ============================================================================
//  Consentement Google (GTM, GA4, Google Ads) — Consent Mode v2
// ----------------------------------------------------------------------------
//  Seuls les outils Google dépendent du bandeau. La mesure interne sans cookie
//  (page_views, form_events) n'en dépend PAS.
//
//  Le script en tête de index.html (même clé, testé) :
//    · pose le consentement par défaut à « denied » AVANT tout chargement de GTM ;
//    · applique le choix déjà mémorisé et ne charge GTM qu'en cas d'accord
//      (window.bmaticLoadGtm, une seule fois).
//  Ce module enregistre un nouveau choix (bandeau CookieConsent) et l'applique
//  tout de suite : GA4 démarre donc dès l'acceptation, même après le chargement.
//
//  Conversions : événements dataLayer pour GTM, envoyés seulement avec un
//  accord, sans aucune donnée personnelle (ni nom, ni téléphone, ni e-mail…).
// ============================================================================

export const CONSENT_STORAGE_KEY = "bmatic-cookie-consent";

/** Version du format mémorisé : un ancien choix (bandeau d'information) est redemandé. */
const VERSION = 2;

export type Consent = { analytics: boolean; marketing: boolean };

/** Noms des événements dataLayer, à reprendre dans les déclencheurs GTM. */
export const CONVERSIONS = {
  rdv: "form_rdv_success",
  contact: "form_contact_success",
  phone: "click_phone",
  whatsapp: "click_whatsapp",
} as const;

export type Conversion = keyof typeof CONVERSIONS;

declare global {
  interface Window {
    dataLayer?: unknown[];
    bmaticLoadGtm?: () => void;
  }
}

/** Commande gtag : GTM attend l'objet `arguments` tel quel (pas un tableau). */
function gtag(..._args: unknown[]): void {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

const state = (granted: boolean) => (granted ? "granted" : "denied");

/** Choix mémorisé, ou null si le visiteur n'a pas encore choisi. */
export function readConsent(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) || "null");
    if (!c || c.v !== VERSION) return null;
    return { analytics: c.analytics === true, marketing: c.marketing === true };
  } catch {
    return null;
  }
}

/** Efface les cookies Google déjà déposés quand l'accord est retiré. */
function clearCookies(prefixes: string[]): void {
  const host = window.location.hostname;
  const domains = ["", host, `.${host.replace(/^www\./, "")}`];
  for (const part of document.cookie.split(";")) {
    const name = part.split("=")[0].trim();
    if (!name || !prefixes.some((p) => name.startsWith(p))) continue;
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

/** Mémorise le choix et l'applique tout de suite (Consent Mode + chargement de GTM). */
export function saveConsent(consent: Consent): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ v: VERSION, ...consent, date: new Date().toISOString() }));
  } catch {
    // Stockage indisponible : le choix vaut pour cette page seulement.
  }
  gtag("consent", "update", {
    analytics_storage: state(consent.analytics),
    ad_storage: state(consent.marketing),
    ad_user_data: state(consent.marketing),
    ad_personalization: state(consent.marketing),
  });
  if (!consent.analytics) clearCookies(["_ga", "_gid"]);
  if (!consent.marketing) clearCookies(["_gcl"]);
  if (consent.analytics || consent.marketing) window.bmaticLoadGtm?.();
}

/** Conversion pour GTM : seulement avec un accord, sans donnée personnelle. */
export function pushConversion(conversion: Conversion): void {
  const consent = readConsent();
  if (!consent || (!consent.analytics && !consent.marketing)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: CONVERSIONS[conversion], page_path: window.location.pathname });
}
