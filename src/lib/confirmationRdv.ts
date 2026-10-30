// ============================================================================
//  Email de confirmation au client (demande de rappel /rendez-vous)
// ----------------------------------------------------------------------------
//  Demandé au serveur du site (server/confirmation.ts → Brevo) après l'envoi
//  réussi de la demande, seulement si le client a donné son email.
//  Ne lève jamais d'exception : false si l'email n'est pas parti (serveur de
//  développement, clé Brevo absente, limite atteinte…).
// ============================================================================
import type { RdvForm } from "@/lib/rendezvous";

export const CONFIRMATION_PATH = "/api/confirmation-rdv";

export async function sendConfirmation(f: RdvForm): Promise<boolean> {
  // Le strict nécessaire pour rédiger l'email (pas le véhicule).
  const payload = {
    email: f.email.trim(),
    prenom: f.prenom.trim(),
    telephone: f.telephone.trim(),
    rappel: f.rappel,
    rappelDate: f.rappelDate,
    rappelPeriode: f.rappelPeriode,
    vitrages: f.vitrages,
    couverture: f.couverture,
    website: f.website,
  };
  try {
    const res = await fetch(CONFIRMATION_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
