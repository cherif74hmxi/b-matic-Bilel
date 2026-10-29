// ============================================================================
//  Demandes (table public.leads) — libellés partagés site public / admin
// ============================================================================
import { insertPublicRow } from "@/lib/publicInsert";

// « reprise » : formulaire retiré lors du pivot pare-brise, gardé pour afficher
// les demandes déjà reçues (la contrainte de la table l'accepte toujours).
export type LeadType = "contact" | "rdv" | "reprise";
export type LeadStatus = "new" | "in_progress" | "done" | "archived";

export const LEAD_TYPES: LeadType[] = ["contact", "rdv", "reprise"];
export const LEAD_STATUSES: LeadStatus[] = ["new", "in_progress", "done", "archived"];

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  contact: "Contact",
  rdv: "Rendez-vous",
  reprise: "Reprise",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nouvelle",
  in_progress: "En cours",
  done: "Traitée",
  archived: "Archivée",
};

// ---------------------------------------------------------------------------
//  Enregistrement d'une demande depuis le site public (en plus de Formspree)
// ---------------------------------------------------------------------------

export interface LeadSubmission {
  type: LeadType;
  name: string;
  email?: string;
  phone?: string;
  message?: string;
  /** Champs propres au formulaire (service, véhicule…). Les fichiers n'y vont pas. */
  details?: Record<string, string | number | null | undefined>;
}

const clip = (value: string | undefined, max: number) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

/**
 * Enregistre la demande dans public.leads. À n'appeler qu'après consentement
 * (case RGPD cochée). Ne lève jamais d'exception : renvoie false en cas d'échec.
 * Les limites de taille reprennent les contraintes de la table.
 */
export function submitLead(lead: LeadSubmission): Promise<boolean> {
  const details = Object.fromEntries(
    Object.entries(lead.details ?? {})
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => [k, typeof v === "string" ? v.slice(0, 2000) : v]),
  );
  return insertPublicRow("leads", {
    type: lead.type,
    name: clip(lead.name, 120) ?? "—",
    email: clip(lead.email, 254),
    phone: clip(lead.phone, 40),
    message: clip(lead.message, 5000),
    details,
    consent: true,
  });
}

/**
 * Double envoi d'un formulaire : e-mail (Formspree) + espace admin (leads).
 *  · sans fichier joint : réussi si AU MOINS UN des deux canaux a fonctionné
 *    (une panne de Formspree ne fait pas perdre la demande) ;
 *  · avec fichiers joints : ils ne transitent QUE par l'e-mail, l'envoi
 *    Formspree est donc obligatoire ; la demande n'est enregistrée qu'ensuite
 *    (pas de doublon si le visiteur réessaie après un échec).
 */
export async function sendLead(
  sendMail: () => Promise<Response>,
  lead: LeadSubmission,
  { hasAttachments = false }: { hasAttachments?: boolean } = {},
): Promise<boolean> {
  const mail = () => sendMail().then((r) => r.ok, () => false);
  if (hasAttachments) {
    if (!(await mail())) return false;
    await submitLead(lead);
    return true;
  }
  const [sentByMail, saved] = await Promise.all([mail(), submitLead(lead)]);
  return sentByMail || saved;
}
