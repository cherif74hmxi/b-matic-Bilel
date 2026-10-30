// ============================================================================
//  B MATIC — Formulaire de demande de rappel pare-brise (page /rendez-vous)
// ----------------------------------------------------------------------------
//  Source unique des textes et des choix du formulaire en 4 étapes :
//  la page ne fait que les afficher. Le visiteur laisse son numéro, le
//  garage le rappelle pour fixer le rendez-vous (aucune heure précise n'est
//  réservée en ligne).
//
//  ⚠️  Les `id` sont utilisés par le code : ne pas les changer, seuls les
//      libellés peuvent l'être.
// ============================================================================
import { horaires } from "@/data/horaires";
import { franchiseCondition } from "@/data/parebrise";

export const rdvEtapes = ["Coordonnées", "Vitrage", "Assurance", "Véhicule"] as const;

export const rdvIntro = {
  titre: "Devis et rendez-vous pare-brise",
  texte: "4 petites étapes, 1 minute. On vous rappelle pour fixer le rendez-vous.",
};

// ------------------------------------------------------------------ Étape 1
export type RappelId = "asap" | "date";
export type PeriodeId = "matin" | "apres-midi";

export const rdvCoordonnees = {
  titre: "Vos coordonnées",
  prenom: "Prénom",
  nom: "Nom",
  telephone: "Numéro de téléphone",
  telephonePlaceholder: "04xx xx xx xx",
  telephoneInvalide: "Numéro incomplet.",
  /** Affiché en gras, puis `emailAide` en gris sur la même ligne. */
  email: "Email (facultatif)",
  emailAide: "— pour recevoir votre confirmation",
  emailInvalide: "Adresse e-mail invalide.",
};

export const rdvRappel = {
  question: "Quand souhaitez-vous être rappelé ?",
  asap: {
    label: "Rappelez-moi dès que possible",
    texte: `Aux heures d'ouverture : ${horaires.centre.texte}`,
  },
  date: {
    label: "Choisir une date",
    texte: "Un jour, le matin ou l'après-midi",
  },
  jourQuestion: "Quel jour ?",
  periodeQuestion: "À quel moment ?",
  /**
   * Plages de rappel (heures de Bruxelles). `moment` sert dans les phrases :
   * « le vendredi 31 octobre, le matin ».
   */
  periodes: [
    { id: "matin", label: "Matin", moment: "le matin", debut: 10, fin: 12 },
    { id: "apres-midi", label: "Après-midi", moment: "l'après-midi", debut: 12, fin: 19 },
  ] as { id: PeriodeId; label: string; moment: string; debut: number; fin: number }[],
  /** Nombre de jours proposés. */
  jours: 14,
  /** Le jour même, une plage disparaît quand il reste moins de N minutes avant sa fin. */
  delaiMinutes: 60,
  /** Fin de phrase de la confirmation pour « dès que possible ». */
  asapPhrase: `dès que possible (${horaires.centre.texte})`,
};

// ------------------------------------------------------------------ Étape 2
export type VitrageId = "pare-brise" | "vitre-laterale" | "lunette-arriere" | "toit" | "inconnu";

/** Vitrages dessinés sur le schéma de voiture (src/components/rdv/GlassDiagram). */
export type ZoneVitrage =
  | "pare-brise"
  | "toit"
  | "lunette"
  | "avant-gauche"
  | "avant-droite"
  | "arriere-gauche"
  | "arriere-droite";

export interface Vitrage {
  id: VitrageId;
  label: string;
  texte: string;
  /** Vitre(s) surlignée(s) sur le schéma ; absent = pas de schéma (« Je ne sais pas »). */
  zones?: ZoneVitrage[];
  /** Ligne d'information affichée quand ce vitrage est coché. */
  note?: string;
  /** Choix exclusif : le cocher décoche les autres (et inversement). */
  exclusif?: boolean;
}

export const rdvVitrage = {
  titre: "Quel vitrage est abîmé ?",
  texte: "Plusieurs choix possibles.",
};

export const rdvVitrages: Vitrage[] = [
  {
    id: "pare-brise",
    label: "Pare-brise",
    texte: "Impact, fissure ou pare-brise cassé",
    zones: ["pare-brise"],
    note: "Recalibrage caméra inclus si votre véhicule est équipé d'aides à la conduite.",
  },
  {
    id: "vitre-laterale",
    label: "Vitre latérale",
    texte: "Vitre de portière cassée",
    zones: ["avant-gauche", "arriere-gauche", "avant-droite", "arriere-droite"],
  },
  { id: "lunette-arriere", label: "Lunette arrière", texte: "Vitre du hayon ou du coffre", zones: ["lunette"] },
  { id: "toit", label: "Toit ouvrant / panoramique", texte: "Toit vitré fêlé ou cassé", zones: ["toit"] },
  { id: "inconnu", label: "Je ne sais pas", texte: "On regarde ensemble, sans engagement", exclusif: true },
];

// ------------------------------------------------------------------ Étape 3
export type CouvertureId = "oui" | "non" | "inconnu";

export const rdvAssurance = {
  titre: "Votre assurance",
  question: "Avez-vous une couverture bris de glace (bris de vitre ou omnium) ?",
  couvertures: [
    { id: "oui", label: "Oui" },
    { id: "non", label: "Non" },
    { id: "inconnu", label: "Je ne sais pas" },
  ] as { id: CouvertureId; label: string }[],
  rassurance: `On s'occupe des démarches avec votre assureur. ${franchiseCondition}`,
  sansCouverture: "Pas de couverture bris de glace ? Pas de souci : on vous fait un devis, sans engagement.",
};

// ------------------------------------------------------------------ Étape 4
export const rdvVehicule = {
  titre: "Votre véhicule",
  texte: "Pour commander le bon vitrage. Aucun document à envoyer.",
  modes: {
    plaque: "Plaque",
    manuel: "Marque et modèle",
  },
  plaqueLabel: "Numéro de plaque",
  plaquePlaceholder: "1-ABC-123",
  plaqueAide: "Le plus rapide : on retrouve votre modèle exact.",
  plaqueInvalide: "Vérifiez la plaque (lettres et chiffres).",
  marque: "Marque",
  modele: "Modèle",
  annee: "Année (facultatif)",
  anneeInvalide: "Année invalide.",
};

// ------------------------------------------------------------------ Envoi
export const rdvEnvoi = {
  consentement: "J'accepte que B MATIC traite mes données pour me rappeler au sujet de cette demande de devis et de rendez-vous, conformément à la",
  consentementLien: "politique de confidentialité",
  envoyer: "Envoyer ma demande",
  envoi: "Envoi en cours…",
  erreur: "Une erreur est survenue. Réessayez ou appelez-nous directement.",
};

// ------------------------------------------------------------------ Confirmation
export const rdvConfirmation = {
  titre: "Merci, on vous rappelle pour convenir du rendez-vous.",
  /** `quand` : « dès que possible (…) » ou « le vendredi 31 octobre 2026, le matin (10h–12h) ». */
  texte: (telephone: string, quand: string) => `Nous vous appelons au ${telephone} ${quand}.`,
};
