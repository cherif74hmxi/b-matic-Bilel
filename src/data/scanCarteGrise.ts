// ============================================================================
//  B MATIC — Textes du scan de carte grise (RegistrationScanner)
// ----------------------------------------------------------------------------
//  Le scan est facultatif : il pré-remplit le véhicule dans le formulaire de
//  rendez-vous. Modifier ici les libellés, rien d'autre.
// ============================================================================

export const scanTextes = {
  consigne: "Prenez TOUTE la carte grise en photo, bien à plat et lisible.",
  indice: "Reculez pour cadrer l'intégralité du document",
  boutonPhoto: "Prendre une photo",
  boutonGalerie: "Choisir dans la galerie",
  lecture: "Lecture de la carte grise…",
  confidentialite:
    "Seules les caractéristiques techniques du véhicule sont lues. La photo n'est pas conservée et aucune donnée sur le titulaire n'est enregistrée.",
  succes: (n: number) => `${n} information${n > 1 ? "s" : ""} pré-remplie${n > 1 ? "s" : ""} : vérifiez-les et corrigez si besoin.`,
};
