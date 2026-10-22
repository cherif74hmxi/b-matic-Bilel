// ============================================================================
//  B MATIC — Offre pare-brise (page /pare-brise + bloc de l'accueil)
// ----------------------------------------------------------------------------
//  Source unique de vérité : la page ne fait qu'afficher ce qui est ici.
//  Modifier un texte, un cadeau, une ville ou une question de la FAQ = modifier
//  ce fichier, rien d'autre. Les données structurées SEO (schema.org Service +
//  FAQPage) sont construites à partir de ces mêmes textes.
//
//  Assureurs partenaires : liste à part dans src/data/assurances.ts.
//  Illustrations des cadeaux : dessins maison (src/components/GiftIllustration),
//  choisis par le champ `illustration` — pas de photos produits ni de logos.
// ============================================================================
import { legalInfo } from "@/data/legal";

/** Horaires du centre (repris dans les textes et les données structurées). */
export const pareBriseHoraires = {
  texte: "7j/7, 10h–19h",
  /** Version longue (centre, FAQ). */
  detail: "7j/7, de 10h à 19h, dimanche compris",
};

/** Rayon d'intervention autour de Liège (km). */
export const pareBriseRayonKm = 70;
const zone = `Liège et jusqu'à ${pareBriseRayonKm} km autour`;

// ------------------------------------------------------------------ SEO
export const pareBriseSeo = {
  title: "Remplacement pare-brise Liège — franchise offerte + cadeau | B MATIC",
  description:
    `Remplacement de pare-brise à ${zone} : franchise offerte, 0 € à avancer, toutes assurances, jusqu'à 300 € ou un cadeau. Centre à Ans ouvert ${pareBriseHoraires.texte}.`,
  /** Nom du service dans les données structurées. */
  serviceName: "Remplacement de pare-brise à Liège",
};

// ------------------------------------------------------------------ Hero
export const pareBriseHero = {
  surtitre: "Remplacement pare-brise Liège",
  titre: "Votre pare-brise remplacé.",
  titreAccent: "Franchise offerte + jusqu'à 300 € ou un cadeau.",
  sousTitre: `Remplacement à ${zone} · 0 € à avancer · Toutes assurances · 7j/7`,
  // Ouvre la prise de RDV avec la prestation pare-brise déjà choisie (id dans src/data/services.ts).
  ctaPrincipal: { label: "Réserver mon créneau", to: "/mecanique?service=remplacement-pare-brise" },
  badges: [
    "Franchise offerte + cadeau",
    "0 € à avancer",
    "Toutes assurances",
    "Aucune démarche",
    "Ouvert 7j/7",
  ],
};

// ------------------------------------------------------------------ Cadeaux
/** Dessin utilisé pour chaque cadeau (voir src/components/GiftIllustration.tsx). */
export type GiftIllustrationKey =
  | "argent"
  | "jeux"
  | "console"
  | "tablette"
  | "trottinette"
  | "pneus"
  | "airfryer"
  | "aspirateur";

export interface PareBriseCadeau {
  nom: string;
  illustration: GiftIllustrationKey;
}

export const pareBriseOffre = {
  titre: "Franchise offerte, et vous choisissez votre cadeau",
  texte: "Franchise offerte + jusqu'à 300 € ou le cadeau de votre choix, pour tout pare-brise remplacé.",
  note: "Un cadeau au choix parmi :",
};

/** Cadeaux proposés (le client en choisit UN). Ordre = ordre d'affichage. */
export const pareBriseCadeaux: PareBriseCadeau[] = [
  { nom: "Jusqu'à 300 €", illustration: "argent" },
  { nom: "GTA 6 + FC 27", illustration: "jeux" },
  { nom: "Nintendo Switch 2", illustration: "console" },
  { nom: "iPad", illustration: "tablette" },
  { nom: "Trottinette électrique", illustration: "trottinette" },
  { nom: "Jusqu'à 4 pneus", illustration: "pneus" },
  { nom: "Air Fryer Ninja", illustration: "airfryer" },
  { nom: "Aspirateur Tineco", illustration: "aspirateur" },
];

// ------------------------------------------------------------------ Compris
export interface PareBrisePoint {
  titre: string;
  texte: string;
}

export const pareBriseCompris = {
  titre: "Ce qui est compris",
  points: [
    { titre: "Franchise offerte", texte: "Prise en charge par le centre." },
    { titre: "0 € à avancer", texte: "Réglés directement par l'assurance." },
    { titre: "Toutes assurances", texte: "Démarches faites avec vous." },
    { titre: "Jusqu'à 300 € ou un cadeau", texte: "Pour tout pare-brise remplacé." },
    { titre: "Ouvert 7j/7", texte: `${pareBriseHoraires.detail}.` },
  ] as PareBrisePoint[],
};

// ------------------------------------------------------------------ Étapes
export const pareBriseEtapes = {
  titre: "Comment ça marche",
  etapes: [
    { titre: "Vous prenez rendez-vous", texte: "Par le formulaire ou par téléphone. On commande le vitrage." },
    { titre: "On remplace", texte: "Au centre ou chez vous, avec un vitrage homologué." },
    { titre: "Vous recevez votre cadeau", texte: "Jusqu'à 300 € ou le cadeau de votre choix." },
  ] as PareBrisePoint[],
};

// ------------------------------------------------------------------ Lieu
export const pareBriseLieu = {
  titre: "Au centre ou chez vous",
  centre: {
    titre: "Au centre, à Ans",
    texte: `Ouvert ${pareBriseHoraires.detail}.`,
  },
  domicile: {
    titre: "À domicile ou au travail",
    texte: "Pose sur place. On peut aussi venir chercher votre voiture et vous la ramener.",
  },
  zoneTitre: "Zone d'intervention",
  /** Villes affichées (et déclarées dans les données structurées). */
  villes: [
    "Liège",
    "Ans",
    "Herstal",
    "Seraing",
    "Flémalle",
    "Saint-Nicolas",
    "Grâce-Hollogne",
    "Visé",
    "Verviers",
    "Huy",
    "Waremme",
  ],
  zoneNote: `… et jusqu'à ${pareBriseRayonKm} km autour de Liège.`,
};

// ------------------------------------------------------------------ Liberté de choix
export const pareBriseLiberte = {
  titre: "C'est vous qui choisissez votre réparateur, pas votre assurance.",
  texte: "La franchise, c'est le centre qui la paie.",
  puces: ["Rien à avancer", "Aucune démarche", "Franchise offerte + cadeau"],
};

// ------------------------------------------------------------------ Qualité
export const pareBriseQualite = {
  titre: "Vitrages homologués, posés pour durer.",
  paragraphes: [
    "Nos vitrages sont conformes à la norme européenne 43R : vision et sécurité d'origine, capteurs compris.",
    "La pose est garantie (étanchéité et tenue) : en cas d'infiltration ou de bruit de vent, on reprend.",
  ],
  puces: ["Vision et sécurité d'origine", "Conforme norme 43R", "Pose garantie"],
};

// ------------------------------------------------------------------ Assurances
export const pareBriseAssurances = {
  titre: "Votre assureur, c'est nous qui l'appelons.",
  points: [
    "Déclaration du sinistre faite avec vous au téléphone : aucun document à envoyer.",
    "Pris en charge si votre contrat comprend le bris de vitre ou une omnium.",
    "Franchise offerte.",
  ],
  // Le carrousel affiche la liste de src/data/assurances.ts.
  suite: "… et toutes les autres assurances. Dites-nous la vôtre, on s'occupe du reste.",
};

// ------------------------------------------------------------------ FAQ
export interface PareBriseQuestion {
  question: string;
  reponse: string;
}

export const pareBriseFaq: PareBriseQuestion[] = [
  {
    question: "Combien je vais payer ?",
    reponse: "0 €, et vous repartez avec un cadeau. Un devis écrit vous est remis avant toute intervention.",
  },
  {
    question: "C'est quoi le piège ?",
    reponse:
      "Il n'y en a pas : le cadeau est pris sur notre marge. La facture envoyée à votre assureur est identique à celle d'un autre réparateur.",
  },
  {
    question: "Quels sont les cadeaux ?",
    reponse: `Au choix : ${pareBriseCadeaux.map((c) => c.nom).join(", ")}.`,
  },
  {
    question: "Mon assureur m'a donné un garage, je suis obligé d'y aller ?",
    reponse: "Non, vous êtes libre de choisir votre réparateur. Et la franchise, c'est pour nous.",
  },
  {
    question: "Ça prend combien de temps ?",
    reponse:
      "2 h à 2 h 30 de pose, puis 2 h sans rouler, le temps que la colle sèche. Nous sommes ouverts tous les jours.",
  },
  {
    question: "Où est le centre ?",
    reponse: `${legalInfo.addressParts.street}, à ${legalInfo.addressParts.city}. Ouvert ${pareBriseHoraires.detail}.`,
  },
  {
    question: "Vous venez chez moi ?",
    reponse:
      `Oui, à ${zone}. On peut aussi venir chercher votre voiture et vous la ramener.`,
  },
  {
    question: "Et si le devis ne me va pas ?",
    reponse:
      "Vous ne donnez pas suite, tout simplement. Le devis est gratuit, votre véhicule reste intact et rien ne vous est facturé.",
  },
];

// ------------------------------------------------------------------ CTA final
export const pareBriseCtaFinal = {
  titre: "Un impact ou une fissure ?",
  texte: "Réservez votre créneau : on s'occupe de l'assurance, vous choisissez votre cadeau.",
  cta: { label: "Obtenir mon devis et mon cadeau", to: "/mecanique?service=remplacement-pare-brise" },
};

/** Mention légale de l'offre (petits caractères, obligatoire). */
export const pareBriseMention =
  "Devis écrit remis avant toute intervention. La prise en charge dépend de votre contrat et de l'accord de votre assureur. Cadeau ou montant selon le remplacement effectué et la prise en charge bris de glace.";

// ------------------------------------------------------------------ Accueil
/** Bloc « offre pare-brise » de la page d'accueil. */
export const pareBriseAccueil = {
  surtitre: "Offre pare-brise",
  titre: "Franchise offerte + jusqu'à 300 € ou un cadeau",
  texte: `Remplacement à ${zone} · 0 € à avancer · Toutes assurances · 7j/7`,
  cta: { label: "Découvrir l'offre", to: "/pare-brise" },
};
