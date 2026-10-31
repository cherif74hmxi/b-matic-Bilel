// ============================================================================
//  Origine de la visite (publicité, campagne, site référent) — SANS cookie
// ----------------------------------------------------------------------------
//  Au premier chargement de l'onglet, on note les paramètres de campagne de
//  l'URL (utm_*, gclid de Google Ads), le site d'où vient le visiteur et la
//  page d'arrivée, UNE seule fois dans sessionStorage : effacé à la fermeture
//  de l'onglet, jamais partagé entre visites ni avec un tiers.
//  Joint ensuite à chaque demande (src/lib/leads.ts → colonnes de leads),
//  pour savoir quelle publicité ou campagne l'a générée, à la page d'entrée
//  (PageViewTracker) et à la progression dans les formulaires (formTracking).
//
//  Numéro de visite (session_id) : UUID tiré au hasard, une fois par onglet,
//  gardé lui aussi dans sessionStorage. Il relie les pages vues et les étapes
//  de formulaire d'une même visite, rien de plus (pas de suivi d'une visite à
//  l'autre).
// ============================================================================

const STORAGE_KEY = "bmatic-attribution";
const SESSION_KEY = "bmatic-session";
const MAX = 255;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

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

/** Repli si le stockage est indisponible : même numéro pour toute la page. */
let sessionId: string | undefined;

function newUuid(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Anciens navigateurs : UUID v4 à la main.
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** Numéro de visite anonyme de cet onglet (créé au premier appel). */
export function getSessionId(): string {
  try {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && UUID.test(saved)) return (sessionId = saved);
  } catch {
    // Stockage indisponible : numéro gardé en mémoire.
  }
  sessionId ??= newUuid();
  try {
    sessionStorage.setItem(SESSION_KEY, sessionId);
  } catch {
    // idem
  }
  return sessionId;
}
