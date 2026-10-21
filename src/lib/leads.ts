// ============================================================================
//  Demandes (table public.leads) — libellés partagés site public / admin
// ============================================================================

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
