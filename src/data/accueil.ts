// ============================================================================
//  B MATIC — Textes de la page d'accueil
// ----------------------------------------------------------------------------
//  Modifier ici les textes de l'accueil : la page ne fait que les afficher.
//  · Les PRIX des promotions viennent de src/data/services.ts (catégorie
//    « promotions ») ;
//  · le bloc pare-brise vient de src/data/parebrise.ts (pareBriseAccueil).
//  Les icônes sont des noms d'icônes lucide-react (voir ICONS dans Index.tsx).
// ============================================================================

export const accueilHero = {
  titre: ["Mécanique, pare-brise", "& services", "automobiles"],
  texte:
    "B MATIC, votre garage automobile de confiance. Pare-brise pris en charge par l'assurance, entretien, reprise et dépannage 24h/24.",
  ctaPrincipal: { label: "Prendre rendez-vous", to: "/mecanique" },
  ctaSecondaire: { label: "Offre pare-brise", to: "/pare-brise" },
};

/**
 * Pastilles « offres » sous le titre du hero : visibles dès l'arrivée, même
 * sur téléphone. `prixPromo: true` → le texte est suivi du plus petit prix des
 * promotions (ex. « dès 99 € »).
 */
export const accueilOffresFlash = [
  { label: "Pare-brise : franchise offerte + cadeau", to: "/pare-brise", prixPromo: false },
  { label: "Promos entretien & freins", to: "#promotions", prixPromo: true },
];

export const accueilPromotions = {
  surtitre: "Offres du moment",
  titre: "Nos promotions",
  texte: "Tarifs fermes, pièces et main-d'œuvre comprises. Réservez en ligne en quelques clics.",
  badge: "Prix ferme",
  cta: "Réserver cette offre",
};

export const accueilServices = {
  titre: "Nos services",
  texte: "Un garage complet pour tous vos besoins automobiles.",
  liste: [
    {
      icon: "Car",
      title: "Rachat",
      desc: "Nous reprenons votre véhicule toutes marques à un prix juste et transparent. Estimation rapide et paiement immédiat.",
      btn: "Vendre mon véhicule",
      to: "/reprise",
    },
    {
      icon: "Wrench",
      title: "Mécanique",
      desc: "Entretien complet, réparation et diagnostic de votre véhicule par des professionnels expérimentés. Garage ouvert 24h/24.",
      btn: "Prendre rendez-vous",
      to: "/mecanique",
    },
    {
      icon: "Truck",
      title: "Dépannage",
      desc: "Assistance rapide et remorquage 24h/24, 7j/7. Nous intervenons partout pour vous dépanner dans les plus brefs délais.",
      btn: "Nous contacter",
      to: "/contact",
    },
  ],
} as const;

/** Engagements FACTUELS uniquement (aucun faux témoignage ni note Google). */
export const accueilEngagements = (rayonKm: number) =>
  [
    { icon: "Clock", title: "Ouvert 24h/24", desc: "Un garage disponible à tout moment, dépannage 7j/7." },
    { icon: "ShieldCheck", title: "Dossier assurance pris en charge", desc: "Pour le pare-brise, nous gérons les démarches avec votre assureur." },
    { icon: "Car", title: "Intervention sur place", desc: `Pour le pare-brise, nous venons chez vous ou au travail, à Liège et jusqu'à ${rayonKm} km autour.` },
    { icon: "HandCoins", title: "Reprise toutes marques", desc: "Estimation rapide et paiement sur place, sans mauvaise surprise." },
  ] as const;

export const accueilConseils = {
  titre: "Nos conseils auto",
  texte: "Entretien, pare-brise, hiver, pneus, reprise… nos articles pratiques pour prendre soin de votre véhicule.",
  cta: "Voir nos conseils",
};
