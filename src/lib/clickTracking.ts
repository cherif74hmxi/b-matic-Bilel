// ============================================================================
//  Clics de contact (table public.click_events) — KPI admin
// ----------------------------------------------------------------------------
//  Type de clic déduit de l'adresse du lien : aucun attribut à poser sur les
//  boutons, tout lien WhatsApp / téléphone / e-mail / prise de RDV du site
//  public est compté automatiquement.
// ============================================================================

export type ClickKind = "whatsapp" | "phone" | "email" | "rdv";

export const CLICK_KINDS: ClickKind[] = ["whatsapp", "phone", "rdv", "email"];

export const CLICK_KIND_LABELS: Record<ClickKind, string> = {
  whatsapp: "WhatsApp",
  phone: "Téléphone",
  rdv: "Prise de RDV",
  email: "E-mail",
};

/** Page de réservation : tout lien vers elle compte comme un clic « RDV ». */
const RDV_PATH = "/mecanique";

/** Type de clic d'un lien, ou null si ce n'est pas un lien de contact. */
export function classifyContactLink(href: string, siteOrigin: string): ClickKind | null {
  let url: URL;
  try {
    url = new URL(href, siteOrigin);
  } catch {
    return null;
  }
  if (url.protocol === "tel:") return "phone";
  if (url.protocol === "mailto:") return "email";
  if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) return "whatsapp";
  if (url.origin === siteOrigin && url.pathname.replace(/\/+$/, "") === RDV_PATH) return "rdv";
  return null;
}
