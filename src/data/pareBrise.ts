// ============================================================================
//  B MATIC — Offre pare-brise « Votre pare-brise. Votre cadeau. »
// ----------------------------------------------------------------------------
//  Source unique de vérité pour la page /pare-brise-assurances et le bloc de
//  mise en avant sur l'accueil. Tout est éditable ici.
//
//  ⚠️  « À CONFIRMER » = engagement du garage NON tranché : ne rien inventer.
//      Points à confirmer par le propriétaire :
//        - quel cadeau pour quel type de remplacement,
//        - la forme exacte des « 300 € » (bon d'achat, remise, espèces…),
//        - la zone d'intervention sur place,
//        - le bon numéro WhatsApp (voir src/data/legal.ts).
// ============================================================================
import { Gamepad2, Zap, Gift, type LucideIcon } from "lucide-react";
import ps5Img from "@/assets/cadeaux/ps5.png";
import switchImg from "@/assets/cadeaux/nintendo-switch.jpg";
import trottinetteImg from "@/assets/cadeaux/trottinette.png";
import billetsImg from "@/assets/cadeaux/billets-100.webp";

/** Accroche principale de l'offre. */
export const pareBriseAccroche = {
  titre: "Votre pare-brise. Votre cadeau.",
  sousTitre:
    "Remplacement de pare-brise avec prise en charge bris de glace : 0 € à payer avec votre assurance, et un cadeau offert.",
};

/** Numéro de téléphone mis en avant pour l'offre (indiqué par le propriétaire, §5.1). */
export const pareBriseTelephone = {
  affichage: "0470 85 35 51",
  href: "tel:+32470853551",
};

/** Bénéfices clés de l'offre. */
export interface PareBriseAvantage {
  titre: string;
  description: string;
}

export const pareBriseAvantages: PareBriseAvantage[] = [
  {
    titre: "0 € à payer",
    description:
      "Avec la prise en charge bris de glace de votre assurance auto (selon votre contrat, la franchise éventuelle et l'accord de votre assureur).",
  },
  {
    titre: "Intervention sur place",
    description:
      "Nous nous déplaçons pour le remplacement. Zone d'intervention : À CONFIRMER.",
  },
  {
    titre: "Dossier assurance pris en charge",
    description:
      "Nous nous occupons des démarches avec votre assureur, de A à Z.",
  },
  {
    titre: "Lavage offert",
    description: "Votre véhicule vous est rendu propre, lavage offert inclus.",
  },
];

/** Cadeaux possibles selon le remplacement effectué (correspondance À CONFIRMER). */
export interface PareBriseCadeau {
  nom: string;
  /** Visuel du cadeau (image importée depuis src/assets/cadeaux/). */
  image: string;
  /** Icône de repli (conservée au cas où l'image serait retirée). */
  icon?: LucideIcon;
}

export const pareBriseCadeaux: PareBriseCadeau[] = [
  { nom: "PlayStation 5", image: ps5Img, icon: Gamepad2 },
  { nom: "Nintendo Switch", image: switchImg, icon: Gamepad2 },
  { nom: "Trottinette électrique", image: trottinetteImg, icon: Zap },
  { nom: "Jusqu'à 300 € offerts", image: billetsImg, icon: Gift },
];

/**
 * Mentions légales de l'offre (obligatoires, à afficher en petits caractères).
 * Reprises telles quelles du cahier des charges (§5.1).
 */
export const pareBriseMentions: string[] = [
  "Cadeau au montant offert selon le remplacement effectué et la prise en charge bris de glace.",
  "Selon votre contrat, la franchise éventuelle et l'accord de votre assureur.",
  "Nature du cadeau selon le remplacement effectué — à confirmer avec le garage.",
];
