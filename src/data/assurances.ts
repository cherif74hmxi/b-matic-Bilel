// ============================================================================
//  B MATIC — Assureurs partenaires (offre pare-brise / bris de glace)
// ----------------------------------------------------------------------------
//  Liste affichée en GRILLE DE LOGOS (tuiles identiques) sur l'accueil et
//  /pare-brise. Formulation volontairement ouverte :
//  « Nous travaillons avec toutes les assurances, dont… ».
//
//  ➜ Pour ajouter / retirer un assureur : modifier simplement le tableau
//    `assureurs` ci-dessous. La grille ET la liste du formulaire de
//    rendez-vous (étape « Assurance », + « Autre ») se mettent à jour.
//  ➜ Logos : un fichier par assureur dans public/assureurs/ (WebP recadré sur
//    le logo, ou SVG). `largeur` / `hauteur` = dimensions réelles du fichier :
//    elles servent à équilibrer visuellement les logos larges et carrés dans
//    des tuiles identiques (voir src/components/InsurerLogos.tsx).
// ============================================================================

/** Phrase d'introduction affichée au-dessus des logos. */
export const assurancesIntro =
  "Nous travaillons avec toutes les assurances, dont :";

/** Un assureur partenaire : nom obligatoire, logo facultatif (sinon badge texte). */
export interface Assureur {
  nom: string;
  logo?: { src: string; largeur: number; hauteur: number };
}

/** Assureurs partenaires. Ordre = ordre d'affichage. */
export const assureurs: Assureur[] = [
  { nom: "Ethias", logo: { src: "/assureurs/ethias.webp", largeur: 480, hauteur: 125 } },
  { nom: "P&V", logo: { src: "/assureurs/pv.svg", largeur: 564, hauteur: 390 } },
  { nom: "Belfius", logo: { src: "/assureurs/belfius.webp", largeur: 480, hauteur: 104 } },
  { nom: "AXA", logo: { src: "/assureurs/axa.webp", largeur: 240, hauteur: 240 } },
  { nom: "KBC", logo: { src: "/assureurs/kbc.webp", largeur: 307, hauteur: 240 } },
  { nom: "CBC", logo: { src: "/assureurs/cbc.webp", largeur: 285, hauteur: 222 } },
  { nom: "BNP Paribas Fortis", logo: { src: "/assureurs/bnp-paribas-fortis.webp", largeur: 323, hauteur: 70 } },
  { nom: "Baloise", logo: { src: "/assureurs/baloise.webp", largeur: 480, hauteur: 98 } },
  { nom: "AG", logo: { src: "/assureurs/ag.webp", largeur: 424, hauteur: 240 } },
];
