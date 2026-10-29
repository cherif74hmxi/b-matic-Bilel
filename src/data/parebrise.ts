// ============================================================================
//  B MATIC — Offre pare-brise (page /pare-brise + bloc de l'accueil)
// ----------------------------------------------------------------------------
//  Source unique de vérité : la page ne fait qu'afficher ce qui est ici.
//  Modifier un texte, un cadeau, une ville ou une question de la FAQ = modifier
//  ce fichier, rien d'autre. Les données structurées SEO (schema.org Service +
//  FAQPage) sont construites à partir de ces mêmes textes.
//
//  Assureurs partenaires : liste à part dans src/data/assurances.ts.
//  Photos des cadeaux : public/cadeaux/ (fond transparent, voir `image`).
//  Titres de section : les mots entre [crochets] s'affichent en violet B MATIC
//  (un accent par titre au plus).
//
//  ⚠️  FRANCHISE : elle n'est PAS toujours gratuite. Ne jamais écrire
//      « franchise offerte » sans condition : réutiliser `franchiseCondition`
//      (ou « franchise prise en charge* » renvoyant à la mention légale).
// ============================================================================
import { legalInfo } from "@/data/legal";
import { horaires } from "@/data/horaires";
import { RDV_PATH } from "@/data/rdv";

/** Horaires du centre (source : src/data/horaires.ts). */
export const pareBriseHoraires = horaires.centre;

/** Rayon d'intervention autour de Liège (km). */
export const pareBriseRayonKm = 70;
const zone = `Liège et jusqu'à ${pareBriseRayonKm} km autour`;

/**
 * Phrase de référence sur la franchise (FAQ, formulaire, conseils, mention
 * légale). Toute promesse sur la franchise doit rester conforme à celle-ci.
 */
export const franchiseCondition =
  "Si votre contrat prévoit une franchise, nous la prenons en charge dans le cadre de notre offre — selon votre contrat et l'accord de votre assureur.";

// ------------------------------------------------------------------ SEO
export const pareBriseSeo = {
  title: "Remplacement pare-brise Liège — jusqu'à 300 € ou un cadeau | B MATIC",
  description:
    `Pare-brise remplacé à ${zone}. Toutes assurances, franchise prise en charge selon votre contrat, jusqu'à 300 € ou un cadeau. Centre à Ans, 7j/7.`,
  /** Nom du service dans les données structurées. */
  serviceName: "Remplacement de pare-brise à Liège",
};

// ------------------------------------------------------------------ Hero
export const pareBriseHero = {
  surtitre: "Remplacement pare-brise Liège",
  /** Titre en trois morceaux : seul `titreAccent` reçoit le dégradé B MATIC. */
  titre: "Votre pare-brise remplacé,",
  titreAccent: "votre franchise prise en charge*",
  titreSuite: "et jusqu'à 300 € ou un cadeau.",
  sousTitre: `Au centre à Ans ou chez vous, à ${zone}. Toutes assurances, 7j/7.`,
  ctaPrincipal: { label: "Demander un devis / Prendre RDV", to: RDV_PATH },
  badges: [
    "Franchise prise en charge*",
    "Toutes assurances",
    "Démarches faites avec vous",
    "Ouvert 7j/7",
  ],
};

// ------------------------------------------------------------------ Prestations
/**
 * Vitrages traités (données structurées « catalogue de services »). Le
 * formulaire de rendez-vous propose les mêmes choix.
 */
export const pareBrisePrestations = [
  "Réparation d'impact de pare-brise",
  "Remplacement de pare-brise",
  "Remplacement de vitre latérale",
  "Remplacement de lunette arrière",
  "Remplacement de toit ouvrant ou panoramique",
  "Recalibrage de caméra d'aide à la conduite",
];

// ------------------------------------------------------------------ Cadeaux
export interface PareBriseCadeau {
  nom: string;
  /**
   * Photo détourée (fond transparent) dans public/cadeaux/, WebP. `largeur` et
   * `hauteur` = dimensions réelles du fichier (évitent les sauts de mise en page).
   */
  image: { src: string; largeur: number; hauteur: number };
}

export const pareBriseOffre = {
  titre: "Vous choisissez [votre cadeau]",
  texte: "En plus de la prise en charge de votre franchise*, jusqu'à 300 € ou le cadeau de votre choix pour tout pare-brise remplacé.",
  note: "Un cadeau au choix parmi :",
};

/** Cadeaux proposés (le client en choisit UN). Ordre = ordre d'affichage. */
export const pareBriseCadeaux: PareBriseCadeau[] = [
  { nom: "Jusqu'à 300 €", image: { src: "/cadeaux/argent.webp", largeur: 480, hauteur: 335 } },
  { nom: "GTA 6 + FC 27", image: { src: "/cadeaux/gta6-fc27.webp", largeur: 480, hauteur: 366 } },
  { nom: "Nintendo Switch 2", image: { src: "/cadeaux/nintendo-switch.webp", largeur: 480, hauteur: 251 } },
  { nom: "iPad", image: { src: "/cadeaux/ipad.webp", largeur: 323, hauteur: 420 } },
  { nom: "Trottinette électrique", image: { src: "/cadeaux/trottinette.webp", largeur: 357, hauteur: 417 } },
  { nom: "Jusqu'à 4 pneus", image: { src: "/cadeaux/pneus.webp", largeur: 182, hauteur: 298 } },
  { nom: "Air Fryer Ninja", image: { src: "/cadeaux/air-fryer.webp", largeur: 298, hauteur: 278 } },
  { nom: "Aspirateur Tineco", image: { src: "/cadeaux/aspirateur.webp", largeur: 182, hauteur: 420 } },
];

// ------------------------------------------------------------------ Compris
export interface PareBrisePoint {
  titre: string;
  texte: string;
}

export const pareBriseCompris = {
  titre: "Ce qui est compris",
  points: [
    { titre: "Franchise prise en charge*", texte: "Si votre contrat en prévoit une, selon l'accord de votre assureur." },
    { titre: "Paiement direct", texte: "Avec une couverture bris de glace, on règle directement avec votre assureur." },
    { titre: "Toutes assurances", texte: "Démarches faites avec vous." },
    { titre: "Jusqu'à 300 € ou un cadeau", texte: "Pour tout pare-brise remplacé." },
    { titre: "Ouvert 7j/7", texte: `${pareBriseHoraires.detail}.` },
  ] as PareBrisePoint[],
};

// ------------------------------------------------------------------ Étapes
export const pareBriseEtapes = {
  titre: "Comment [ça marche]",
  etapes: [
    { titre: "Vous prenez rendez-vous", texte: "Par le formulaire ou par téléphone. On commande le vitrage." },
    { titre: "On remplace", texte: "Au centre ou chez vous, avec un vitrage homologué." },
    { titre: "Vous recevez votre cadeau", texte: "Jusqu'à 300 € ou le cadeau de votre choix." },
  ] as PareBrisePoint[],
};

// ------------------------------------------------------------------ Lieu
export const pareBriseLieu = {
  titre: "Au centre [ou chez vous]",
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
  titre: "Vous pouvez [choisir votre réparateur].",
  texte: franchiseCondition,
  puces: ["Démarches faites avec vous", "Devis écrit avant intervention", "Cadeau au choix"],
};

// ------------------------------------------------------------------ Qualité
export const pareBriseQualite = {
  titre: "Vitrages homologués, [posés pour durer].",
  paragraphes: [
    "Nos vitrages sont conformes à la norme européenne 43R : vision et sécurité d'origine, capteurs compris.",
    "La pose est garantie (étanchéité et tenue) : en cas d'infiltration ou de bruit de vent, on reprend.",
  ],
  puces: ["Vision et sécurité d'origine", "Conforme norme 43R", "Pose garantie"],
};

// ------------------------------------------------------------------ Assurances
export const pareBriseAssurances = {
  titre: "Votre assureur, [c'est nous qui l'appelons].",
  points: [
    "Déclaration du sinistre faite avec vous au téléphone : aucun document à envoyer.",
    "Pris en charge si votre contrat comprend le bris de vitre ou une omnium.",
    franchiseCondition,
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
    reponse:
      `Si votre contrat couvre le bris de glace (bris de vitre ou omnium) et que votre assureur donne son accord, le remplacement est réglé directement avec lui. ${franchiseCondition} Sans couverture, vous recevez un devis écrit avant toute intervention.`,
  },
  {
    question: "Où est le piège ?",
    reponse:
      "Il n'y en a pas : le cadeau est pris sur notre marge. La facture envoyée à votre assureur correspond au remplacement effectué, sans supplément lié au cadeau.",
  },
  {
    question: "Quels sont les cadeaux ?",
    reponse: `Au choix : ${pareBriseCadeaux.map((c) => c.nom).join(", ")}.`,
  },
  {
    question: "Mon assureur me conseille un réparateur : puis-je quand même choisir B MATIC ?",
    reponse:
      `En règle générale, oui : vous pouvez choisir votre réparateur. Certains contrats prévoient des conditions particulières (réseau agréé, plafond de prise en charge) : nous les vérifions avec vous avant l'intervention. ${franchiseCondition}`,
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
  cta: { label: "Obtenir mon devis et mon cadeau", to: RDV_PATH },
};

/** Mention légale de l'offre (petits caractères, obligatoire), cible des « * ». */
export const pareBriseMention =
  `${franchiseCondition} Devis écrit remis avant toute intervention. Cadeau ou montant selon le remplacement effectué et la prise en charge bris de glace.`;

