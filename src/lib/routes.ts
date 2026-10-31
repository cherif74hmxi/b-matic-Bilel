// ============================================================================
//  Pages du site public — source unique pour App.tsx et le serveur du VPS
// ----------------------------------------------------------------------------
//  App.tsx associe une page à chaque chemin (vérifié à la compilation : un
//  chemin sans page, ou l'inverse, ne compile pas). server/index.ts s'en sert
//  pour répondre un VRAI 404 aux adresses inconnues (et non la page
//  d'accueil en 200, un « soft 404 » pénalisé par Google).
// ============================================================================
import { RDV_PATH } from "@/data/rdv";

export const PUBLIC_PATHS = [
  "/",
  "/a-propos",
  "/contact",
  RDV_PATH,
  "/pare-brise",
  "/conseils",
  "/conseils/:slug",
  "/actualites",
  "/actualites/:slug",
  "/politique-de-confidentialite",
  "/mentions-legales",
] as const;

export type PublicPath = (typeof PUBLIC_PATHS)[number];

const FIXED_PATHS: readonly string[] = PUBLIC_PATHS.filter((p) => !p.includes(":"));

/**
 * Adresse servie par l'application en 200 ? Pages fixes et espace admin.
 * Les pages à « :slug » ne sont valables que si le contenu existe : le
 * serveur les sert AVANT ce test (conseils pré-rendus, fonction des
 * actualités), sinon c'est un 404.
 */
export function isAppPath(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/admin" || p.startsWith("/admin/")) return true;
  return FIXED_PATHS.includes(p);
}
