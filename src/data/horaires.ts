// ============================================================================
//  B MATIC — Horaires (source unique)
// ----------------------------------------------------------------------------
//  · Le CENTRE (mécanique, pare-brise, reprise, rendez-vous) : 7j/7, 10h–19h.
//  · Seul le DÉPANNAGE est disponible 24h/24.
//  Repris par l'accueil, À propos, le pied de page, la page pare-brise et les
//  données structurées (schema.org AutoRepair). Les créneaux de RDV ont leurs
//  propres règles dans src/data/rdv.ts (à garder cohérentes avec ces heures).
// ============================================================================

export const horaires = {
  centre: {
    /** Version courte : « 7j/7, 10h–19h ». */
    texte: "7j/7, 10h–19h",
    /** Version longue : « 7j/7, de 10h à 19h, dimanche compris ». */
    detail: "7j/7, de 10h à 19h, dimanche compris",
    /** Pour les données structurées (format HH:MM). */
    ouverture: "10:00",
    fermeture: "19:00",
  },
  depannage: {
    texte: "24h/24, 7j/7",
  },
};

/** Phrase type, à réutiliser telle quelle : « Centre ouvert 7j/7, 10h–19h · Dépannage 24h/24 ». */
export const horairesResume = `Centre ouvert ${horaires.centre.texte} · Dépannage 24h/24`;
