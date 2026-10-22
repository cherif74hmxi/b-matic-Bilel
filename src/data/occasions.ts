// ============================================================================
//  B MATIC — Pages publiques des véhicules (/vehicules, /vehicules/:slug)
// ----------------------------------------------------------------------------
//  Textes et paliers des filtres, modifiables ici. Les véhicules eux-mêmes se
//  gèrent dans l'admin (Véhicules) : seuls les publiés et les vendus s'affichent.
// ============================================================================

export const occasionsSeo = {
  title: "Véhicules d'occasion à Liège (Ans) | B MATIC",
  description:
    "Voitures d'occasion contrôlées par B MATIC à Ans, près de Liège : photos, caractéristiques, prix. Contactez-nous sur WhatsApp pour un essai.",
};

export const occasionsIntro = {
  titre: "Nos véhicules d'occasion",
  texte: "Des véhicules contrôlés par notre atelier, à Ans. Une question, un essai ? Écrivez-nous sur WhatsApp.",
};

/** Paliers proposés dans les filtres (« jusqu'à … »). */
export const filtresPrixMax = [5_000, 7_500, 10_000, 15_000, 20_000, 25_000, 30_000, 40_000, 50_000];
export const filtresKmMax = [25_000, 50_000, 75_000, 100_000, 150_000, 200_000];

export const occasionsTextes = {
  recherche: "Marque, modèle…",
  filtres: "Filtres",
  reinitialiser: "Réinitialiser",
  afficherVendus: "Afficher les véhicules vendus",
  resultats: (n: number) => (n === 0 ? "Aucun véhicule" : `${n} véhicule${n > 1 ? "s" : ""}`),
  aucunResultat: "Aucun véhicule ne correspond à ces critères.",
  stockVide: "Aucun véhicule en vente pour le moment. Revenez bientôt, ou dites-nous ce que vous cherchez !",
  erreur: "Impossible de charger les véhicules pour le moment. Réessayez dans un instant.",
  vendu: "Vendu",
  retour: "Tous les véhicules",
  introuvable: "Ce véhicule n'est plus en ligne.",
  vues: (n: number) => `Vu ${new Intl.NumberFormat("fr-BE").format(n)} fois`,
  caracteristiques: "Caractéristiques",
  description: "Description",
  ctaWhatsapp: "Écrire sur WhatsApp",
  ctaAppeler: "Appeler",
  ctaVendu: "Ce véhicule est vendu. Découvrez nos autres véhicules ou dites-nous ce que vous cherchez.",
  reessayer: "Réessayer",
  /** Title and description of a listing page (search engines, shares). */
  seoTitre: (titre: string, prix: string, vendu: boolean) => `${titre}${vendu ? " (vendu)" : ` — ${prix}`} | B MATIC`,
  seoDescription: (titre: string, caracteristiques: string) => `${titre} : ${caracteristiques}. Véhicule d'occasion chez B MATIC à Ans (Liège).`,
  /** Pre-filled message in WhatsApp. */
  messageWhatsapp: (titre: string, url: string) => `Bonjour, je suis intéressé(e) par le véhicule « ${titre} » : ${url}`,
};

/** Bloc « derniers arrivages » de la page d'accueil (caché s'il n'y a rien). */
export const accueilDerniers = {
  vehiculesTitre: "Derniers véhicules",
  vehiculesLien: "Tous nos véhicules",
  actusTitre: "Actualités du garage",
  actusLien: "Toutes les actualités",
};
