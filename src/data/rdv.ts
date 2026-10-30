// ============================================================================
//  B MATIC — Règles des créneaux de rendez-vous (agenda admin)
// ----------------------------------------------------------------------------
//  Créneaux d'1 h, un seul véhicule à la fois, 7j/7. Le formulaire public
//  /rendez-vous ne réserve plus d'heure : c'est une demande de rappel
//  (plages de rappel dans src/data/rendezvous.ts).
//  ⚠️  Ces valeurs sont AUSSI dans la base (supabase/migrations/
//      20261027000001_rdv_slots.sql, fonction book_rdv) : la base refuse un
//      créneau hors de ces règles. Les modifier aux deux endroits.
// ============================================================================

/** Adresse de la page de prise de rendez-vous / devis (liens et statistiques). */
export const RDV_PATH = "/rendez-vous";

export const rdvRegles = {
  /** Heure du premier créneau (10 → 10:00–11:00). */
  premiereHeure: 10,
  /** Heure du dernier créneau (18 → 18:00–19:00, fermeture à 19h). */
  derniereHeure: 18,
  /** Délai minimum avant un rendez-vous, en heures. */
  delaiMinimumHeures: 1,
  /** Réservation possible jusqu'à N jours à l'avance. */
  horizonJours: 90,
};

/** Heures de début des créneaux : [10, 11, …, 18]. */
export const rdvHeures = Array.from(
  { length: rdvRegles.derniereHeure - rdvRegles.premiereHeure + 1 },
  (_, i) => rdvRegles.premiereHeure + i,
);
