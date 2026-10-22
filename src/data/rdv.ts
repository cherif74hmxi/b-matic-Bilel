// ============================================================================
//  B MATIC — Règles des créneaux de rendez-vous (page /mecanique)
// ----------------------------------------------------------------------------
//  Créneaux d'1 h, un seul véhicule à la fois, 7j/7.
//  ⚠️  Ces valeurs sont AUSSI dans la base (supabase/migrations/
//      20261027000001_rdv_slots.sql, fonction book_rdv) : la base refuse un
//      créneau hors de ces règles. Les modifier aux deux endroits.
// ============================================================================

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

export const rdvTextes = {
  /** Créneau pris pendant que le visiteur remplissait le formulaire. */
  creneauPris: "Ce créneau vient d'être réservé par quelqu'un d'autre. Choisissez-en un autre.",
  creneauInvalide: "Ce créneau n'est plus disponible. Choisissez-en un autre.",
  limite:
    "Vous avez déjà 3 rendez-vous à venir. Pour en ajouter un, appelez-nous ou écrivez-nous sur WhatsApp.",
  /** Agenda injoignable : la demande part quand même, le garage confirme. */
  agendaIndisponible:
    "Les disponibilités en ligne ne sont pas accessibles pour le moment : choisissez un horaire, nous vous confirmerons le créneau.",
  /** Bandeau en haut de la page de réservation. */
  bandeauTitre: "Rendez-vous 7j/7, de 10h à 19h",
  bandeauTexte: "Choisissez votre créneau en ligne. Une panne ? Le dépannage, lui, répond 24h/24.",
};
