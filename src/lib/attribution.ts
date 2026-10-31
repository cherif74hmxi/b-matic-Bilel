// ============================================================================
//  Origine de la visite (publicité, campagne, site référent) — SANS cookie
// ----------------------------------------------------------------------------
//  Au premier chargement de l'onglet, on note les paramètres de campagne de
//  l'URL (utm_*, gclid de Google Ads), le site d'où vient le visiteur et la
//  page d'arrivée, UNE seule fois dans sessionStorage : effacé à la fermeture
//  de l'onglet, jamais partagé entre visites ni avec un tiers.
//  Joint ensuite à chaque demande (src/lib/leads.ts → colonnes de leads),
//  pour savoir quelle publicité ou campagne l'a générée.
// ============================================================================

const STORAGE_KEY = "bmatic-attribution";
const MAX = 255;

/** Noms identiques aux colonnes de la table leads. */
export const ATTRIBUTION_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number] | "referrer" | "landing_path", string>>;

const clip = (v: string | null | undefined) => {
  const t = v?.trim();
  return t ? t.slice(0, MAX) : undefined;
};

/** Site d'origine sans paramètres ni ancre (minimisation) ; rien s'il s'agit du site lui-même. */
function externalReferrer(referrer: string, origin: string): string | undefined {
  try {
    const u = new URL(referrer);
    if (u.origin === origin || !/^https?:$/.test(u.protocol)) return undefined;
    return clip(u.origin + u.pathname);
  } catch {
    return undefined;
  }
}

/** Lit l'origine de la visite dans l'adresse et le référent (fonction pure, testée). */
export function readAttribution(href: string, referrer: string): Attribution {
  const url = new URL(href);
  const a: Attribution = {};
  for (const key of ATTRIBUTION_PARAMS) {
    const v = clip(url.searchParams.get(key));
    if (v) a[key] = v;
  }
  const ref = externalReferrer(referrer, url.origin);
  if (ref) a.referrer = ref;
  a.landing_path = clip(url.pathname) ?? "/";
  return a;
}

/**
 * À appeler une fois au démarrage du site (src/main.tsx). Ne remplace jamais
 * une origine déjà notée dans cet onglet (navigations et rechargements suivants).
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(readAttribution(window.location.href, document.referrer)));
  } catch {
    // Stockage indisponible (navigation privée stricte…) : pas d'origine, rien de grave.
  }
}

/** Origine notée pour cet onglet ({} si inconnue). */
export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const a: Attribution = {};
    for (const key of [...ATTRIBUTION_PARAMS, "referrer", "landing_path"] as const) {
      const v = typeof data[key] === "string" ? clip(data[key] as string) : undefined;
      if (v) a[key] = v;
    }
    return a;
  } catch {
    return {};
  }
}
