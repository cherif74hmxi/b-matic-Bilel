// ============================================================================
//  B MATIC — Assureurs partenaires (offre pare-brise / bris de glace)
// ----------------------------------------------------------------------------
//  Liste affichée dans un CARROUSEL défilant (marquee), en BADGES TEXTE pour
//  l'instant (pas de logos tant que le garage n'a pas l'autorisation d'utiliser
//  les marques). Formulation volontairement ouverte :
//  « Nous travaillons avec toutes les assurances, dont… ».
//
//  ➜ Pour ajouter / retirer un assureur : modifier simplement le tableau
//    `assureurs` ci-dessous. L'affichage se met à jour automatiquement.
//  ➜ Pour afficher un LOGO plus tard : importer l'image en haut du fichier et
//    renseigner le champ `logo` de l'assureur concerné (le carrousel bascule
//    alors automatiquement du badge texte à l'image).
//  ➜ À COMPLÉTER / CONFIRMER par le propriétaire (ex. AXA, Baloise, AG…).
// ============================================================================

/** Phrase d'introduction affichée au-dessus du carrousel. */
export const assurancesIntro =
  "Nous travaillons avec toutes les assurances, dont :";

/** Un assureur partenaire : nom obligatoire, logo optionnel (ajout ultérieur). */
export interface Assureur {
  nom: string;
  /** Image de logo importée (facultatif). Si absent → badge texte. */
  logo?: string;
}

/** Assureurs partenaires. Ordre = ordre d'affichage dans le carrousel. */
export const assureurs: Assureur[] = [
  { nom: "Ethias" },
  { nom: "P&V Assurances" },
  { nom: "Belfius Assurance" },
  { nom: "BNP Paribas Fortis Assurance" },
  { nom: "CBC Assurance" },
  { nom: "KBC Assurance" },
  // À CONFIRMER / COMPLÉTER : AXA, Baloise, AG, …
];
