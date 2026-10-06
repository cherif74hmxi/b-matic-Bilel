// ============================================================================
//  B MATIC — Catalogue de services pour la page de réservation
//  (structure reprise de la page réservation de sparkauto.be)
// ----------------------------------------------------------------------------
//  ⚠️  PRIX À CONFIRMER
//  Les tarifs de Spark Auto sont chargés dynamiquement depuis leur back-office
//  (Amelia) et ne figurent donc pas dans le code source de la page. Les seuls
//  prix réellement connus sont ceux des PROMOTIONS (149 € / 99 € / 239 €).
//  Tous les autres montants ci-dessous sont des VALEURS DE DÉPART à ajuster :
//  modifie simplement « price » (en euros) et « duration » (en minutes).
//
//  priceType :
//    "fixe"  → prix ferme, affiché tel quel          → « 149,00 € »
//    "from"  → prix variable selon le véhicule        → « à partir de 89,00 € »
//    "devis" → chiffré sur devis (aucun montant)      → « Sur devis »
// ============================================================================

export type PriceType = "fixe" | "from" | "devis";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;       // en euros (ignoré si priceType === "devis")
  duration: number;    // en minutes (0 = masqué)
  priceType: PriceType;
}

export interface ServiceCategory {
  id: string;
  name: string;
  promo?: boolean;     // affiche la catégorie en style « offre »
  services: Service[];
}

export const serviceCategories: ServiceCategory[] = [
  // ----------------------------------------------------------------- Promotions
  {
    id: "promotions",
    name: "Promotions",
    promo: true,
    services: [
      {
        id: "promo-entretien",
        name: "Promo Entretien (vidange + filtres)",
        description: "Vidange huile moteur, filtre à huile et filtre à air — pièces et main-d'œuvre comprises.",
        price: 149,
        duration: 60,
        priceType: "fixe",
      },
      {
        id: "promo-plaquettes",
        name: "Promo Plaquettes de frein (1 essieu)",
        description: "Remplacement des plaquettes de frein d'un essieu — pièces et main-d'œuvre comprises.",
        price: 99,
        duration: 60,
        priceType: "fixe",
      },
      {
        id: "promo-entretien-plaquettes",
        name: "Promo Entretien + Plaquettes de frein",
        description: "Entretien complet et plaquettes de frein d'un essieu, le tout — pièces et main-d'œuvre comprises.",
        price: 239,
        duration: 120,
        priceType: "fixe",
      },
    ],
  },

  // ------------------------------------------------------------------ Entretien
  {
    id: "entretien",
    name: "Entretien",
    services: [
      {
        id: "vidange",
        name: "Vidange",
        description: "Vidange de l'huile moteur et remplacement du filtre à huile.",
        price: 89, // À CONFIRMER
        duration: 45,
        priceType: "from",
      },
      {
        id: "entretien-complet",
        name: "Entretien complet",
        description: "Vidange, filtres (huile, air, habitacle) et contrôle des niveaux et points de sécurité.",
        price: 149, // À CONFIRMER
        duration: 90,
        priceType: "fixe",
      },
      {
        id: "grand-entretien",
        name: "Grand entretien",
        description: "Entretien complet renforcé avec bougies et contrôle approfondi selon le carnet constructeur.",
        price: 249, // À CONFIRMER
        duration: 150,
        priceType: "from",
      },
      {
        id: "renovation-phares",
        name: "Rénovation optique des phares",
        description: "Ponçage et polissage des optiques ternis pour retrouver des phares clairs.",
        price: 69, // À CONFIRMER
        duration: 60,
        priceType: "fixe",
      },
    ],
  },

  // ------------------------------------------------------------ Petite Mécanique
  {
    id: "petite-mecanique",
    name: "Petite Mécanique",
    services: [
      {
        id: "plaquettes",
        name: "Plaquettes de frein",
        description: "Remplacement des plaquettes de frein (par essieu).",
        price: 99, // À CONFIRMER
        duration: 60,
        priceType: "from",
      },
      {
        id: "disques-plaquettes",
        name: "Disques + plaquettes de frein",
        description: "Remplacement des disques et plaquettes de frein (par essieu).",
        price: 199, // À CONFIRMER
        duration: 90,
        priceType: "from",
      },
      {
        id: "diagnostic",
        name: "Diagnostic électronique",
        description: "Lecture des défauts et diagnostic complet à la valise.",
        price: 49, // À CONFIRMER
        duration: 45,
        priceType: "fixe",
      },
      {
        id: "batterie",
        name: "Remplacement batterie",
        description: "Fourniture et remplacement de la batterie, test du circuit de charge.",
        price: 119, // À CONFIRMER
        duration: 45,
        priceType: "from",
      },
    ],
  },

  // ------------------------------------------------------------ Grosse Mécanique
  {
    id: "grosse-mecanique",
    name: "Grosse Mécanique",
    services: [
      {
        id: "embrayage",
        name: "Embrayage",
        description: "Remplacement du kit d'embrayage. Le prix dépend du modèle et des pièces nécessaires.",
        price: 0,
        duration: 0,
        priceType: "devis",
      },
      {
        id: "distribution",
        name: "Kit de distribution",
        description: "Remplacement du kit de distribution (courroie ou chaîne). Chiffré après diagnostic.",
        price: 0,
        duration: 0,
        priceType: "devis",
      },
      {
        id: "amortisseurs",
        name: "Amortisseurs",
        description: "Remplacement des amortisseurs. Le prix dépend du modèle et des pièces.",
        price: 0,
        duration: 0,
        priceType: "devis",
      },
    ],
  },

  // ------------------------------------------------------------------ Pare-brise
  {
    id: "pare-brise",
    name: "Pare-brise",
    services: [
      {
        id: "reparation-impact",
        name: "Réparation d'impact",
        description: "Réparation d'un impact sur le pare-brise avant qu'il ne se propage.",
        price: 79, // À CONFIRMER
        duration: 45,
        priceType: "fixe",
      },
      {
        id: "remplacement-pare-brise",
        name: "Remplacement de pare-brise",
        description: "Remplacement complet du pare-brise. Chiffré selon le modèle et le vitrage.",
        price: 0,
        duration: 0,
        priceType: "devis",
      },
    ],
  },

  // ------------------------------------------------------------------- Detailing
  {
    id: "detailing",
    name: "Detailing",
    services: [
      {
        id: "lavage-complet",
        name: "Lavage complet intérieur & extérieur",
        description: "Nettoyage soigné de la carrosserie et de l'habitacle, aspiration et finitions.",
        price: 89, // À CONFIRMER
        duration: 120,
        priceType: "from",
      },
      {
        id: "polissage-medium",
        name: "Polissage Medium",
        description: "Correction des micro-rayures et polissage pour raviver l'éclat de la peinture.",
        price: 300, // À CONFIRMER
        duration: 300,
        priceType: "from",
      },
      {
        id: "formule-elite",
        name: "Formule Elite",
        description: "Rénovation complète : lavage détaillé, décontamination, polissage et protection.",
        price: 280, // À CONFIRMER
        duration: 270,
        priceType: "from",
      },
      {
        id: "traitement-ceramique",
        name: "Traitement céramique",
        description: "Protection céramique longue durée pour la carrosserie. Chiffré selon le véhicule.",
        price: 0,
        duration: 0,
        priceType: "devis",
      },
      {
        id: "anti-odeur",
        name: "Traitement anti-odeur",
        description: "Élimination des mauvaises odeurs de l'habitacle par traitement à l'ozone.",
        price: 30, // À CONFIRMER
        duration: 30,
        priceType: "fixe",
      },
    ],
  },
];

export function findService(id: string): Service | undefined {
  for (const cat of serviceCategories) {
    const s = cat.services.find((x) => x.id === id);
    if (s) return s;
  }
  return undefined;
}
