// ============================================================================
//  B MATIC — Assureurs partenaires (offre pare-brise / bris de glace)
// ----------------------------------------------------------------------------
//  Liste affichée dans un CARROUSEL défilant (marquee), en BADGES TEXTE pour
//  l'instant (pas de logos tant que le garage n'a pas l'autorisation d'utiliser
//  les marques). Formulation volontairement ouverte :
//  « Nous travaillons avec toutes les assurances, dont… ».
//
//  ➜ Pour ajouter / retirer un assureur : modifier simplement le tableau
//    `assureurs` ci-dessous. Le carrousel ET la liste du formulaire de
//    rendez-vous (étape « Assurance », + « Autre ») se mettent à jour.
//  ➜ Pour afficher un LOGO plus tard : importer l'image en haut du fichier et
//    renseigner le champ `logo` de l'assureur concerné (le carrousel bascule
//    alors automatiquement du badge texte à l'image).
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
  { nom: "P&V" },
  { nom: "Belfius" },
  { nom: "AXA" },
  { nom: "KBC" },
  { nom: "CBC" },
  { nom: "BNP Paribas Fortis" },
  { nom: "Baloise" },
  { nom: "AG" },
];
