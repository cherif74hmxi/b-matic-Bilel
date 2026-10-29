// ============================================================================
//  B MATIC — Prestations proposées à la réservation (page /rendez-vous)
// ----------------------------------------------------------------------------
//  Centre pare-brise uniquement. Pris en charge par l'assurance bris de glace :
//  tout est chiffré sur devis (devis écrit remis avant intervention).
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
  {
    id: "pare-brise",
    name: "Pare-brise",
    services: [
      {
        id: "reparation-impact",
        name: "Réparation d'impact",
        description: "Réparation d'un impact sur le pare-brise avant qu'il ne se propage.",
        price: 0,
        duration: 45,
        priceType: "devis",
      },
      {
        id: "remplacement-pare-brise",
        name: "Remplacement de pare-brise",
        description: "Remplacement complet du pare-brise. Franchise offerte + jusqu'à 300 € ou un cadeau.",
        price: 0,
        duration: 0,
        priceType: "devis",
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
