// ============================================================================
//  Adresse publique du site (liens absolus : données structurées, partage)
// ----------------------------------------------------------------------------
//  VITE_SITE_URL (ex. « https://www.bmatic.be ») une fois le domaine connu ;
//  à défaut, l'adresse depuis laquelle la page est servie.
// ============================================================================

export const siteUrl = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")
).replace(/\/+$/, "");

/** URL absolue d'un chemin du site (« /conseils » → « https://…/conseils »). */
export const absoluteUrl = (path: string) => `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
