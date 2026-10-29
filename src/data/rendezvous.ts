// ============================================================================
//  B MATIC — Formulaire de devis / rendez-vous pare-brise (page /rendez-vous)
// ----------------------------------------------------------------------------
//  Source unique des textes et des choix du formulaire multi-étapes :
//  la page ne fait que les afficher. Les créneaux (heures, délais) sont dans
//  src/data/rdv.ts, la liste des assureurs dans src/data/assurances.ts.
//
//  ⚠️  Les `id` sont enregistrés avec la demande : ne pas les changer, seuls
//      les libellés peuvent l'être.
// ============================================================================
import { legalInfo } from "@/data/legal";
import { pareBriseRayonKm } from "@/data/parebrise";

export const rdvEtapes = ["Besoin", "Véhicule", "Assurance", "Lieu", "Créneau", "Coordonnées"] as const;

export const rdvIntro = {
  titre: "Devis et rendez-vous pare-brise",
  texte: "6 petites étapes, 2 minutes. Aucun document à envoyer maintenant.",
};

// ------------------------------------------------------------------ Étape 1
export type BesoinId = "pare-brise" | "vitre-laterale" | "lunette-arriere" | "toit" | "inconnu";

export interface Besoin {
  id: BesoinId;
  label: string;
  texte: string;
  /** Sous-choix obligatoire (ex. réparer / remplacer). */
  sousChoix?: { id: string; label: string; texte?: string }[];
  /** Ligne d'information sous le choix. */
  note?: string;
}

export const rdvBesoins: Besoin[] = [
  {
    id: "pare-brise",
    label: "Pare-brise",
    texte: "Impact, fissure ou pare-brise cassé",
    sousChoix: [
      { id: "impact", label: "Réparer un impact", texte: "Petit impact, sans fissure" },
      { id: "remplacement", label: "Remplacer", texte: "Fissure ou impact trop grand" },
    ],
    note: "Recalibrage caméra inclus si votre véhicule est équipé d'aides à la conduite.",
  },
  {
    id: "vitre-laterale",
    label: "Vitre latérale",
    texte: "Vitre de portière cassée",
    sousChoix: [
      { id: "avant", label: "Avant" },
      { id: "arriere", label: "Arrière" },
    ],
  },
  { id: "lunette-arriere", label: "Lunette arrière", texte: "Vitre du hayon ou du coffre" },
  { id: "toit", label: "Toit ouvrant / panoramique", texte: "Toit vitré fêlé ou cassé" },
  { id: "inconnu", label: "Je ne sais pas", texte: "On regarde ensemble, sans engagement" },
];

// ------------------------------------------------------------------ Étape 2
export const rdvVehicule = {
  titre: "Votre véhicule",
  texte: "Pour commander le bon vitrage. Aucun document lourd à envoyer ici.",
  modes: {
    plaque: "Plaque",
    scan: "Scanner ma carte grise",
    manuel: "Saisie manuelle",
  },
  plaqueLabel: "Numéro de plaque",
  plaquePlaceholder: "1-ABC-123",
  plaqueAide: "Le plus rapide : on retrouve votre modèle exact.",
  plaqueInvalide: "Vérifiez la plaque (lettres et chiffres).",
  scanFacultatif: "Facultatif : la photo n'est pas conservée.",
  marque: "Marque",
  modele: "Modèle",
  annee: "Année",
  manuelAide: "Marque et modèle suffisent. L'année nous aide à choisir le bon vitrage.",
};

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
  assureurQuestion: "Votre assureur",
  assureurAutre: "Autre",
  assureurAutrePlaceholder: "Nom de votre assureur (facultatif)",
  rassurance: "On s'occupe des démarches, vous n'avancez rien, franchise offerte.",
  sansCouverture: "Pas de couverture bris de glace ? Pas de souci : on vous fait un devis, sans engagement.",
  /** Juste le nom de l'assureur : jamais de numéro de contrat ici. */
  aide: "Juste le nom : pas besoin de numéro de contrat.",
};

// ------------------------------------------------------------------ Étape 4
export type LieuId = "centre" | "domicile";

export const rdvLieu = {
  titre: "Où intervenir ?",
  centre: {
    label: "Au centre",
    texte: legalInfo.address.replace(/, Belgique$/, ""),
  },
  domicile: {
    label: "À domicile ou au travail",
    texte: `Liège et jusqu'à ${pareBriseRayonKm} km autour`,
  },
  codePostal: "Code postal du lieu d'intervention",
  codePostalInvalide: "Un code postal belge compte 4 chiffres.",
  horsZone: `Ce code postal est peut-être au-delà de ${pareBriseRayonKm} km de Liège. Continuez : nous vous confirmons rapidement si nous pouvons venir.`,
  /**
   * Codes postaux sûrs d'être dans la zone (province de Liège). Les autres
   * sont acceptés avec un message « on vous confirme ». Modifiable.
   */
  zoneSure: [[4000, 4999]] as [number, number][],
};

// ------------------------------------------------------------------ Étape 5
export const rdvCreneau = {
  titre: "Choisissez votre créneau",
  texte: "7j/7, de 10h à 19h. Les créneaux déjà pris sont masqués.",
  domicileNote: "À domicile : l'heure choisie est l'heure d'arrivée de notre technicien.",
  choisirDate: "Choisissez d'abord une date.",
  aucunCreneau: "Plus de créneau libre ce jour-là : choisissez une autre date.",
};

// ------------------------------------------------------------------ Étape 6
export const rdvCoordonnees = {
  titre: "Vos coordonnées",
  texte: "Pour vous confirmer le rendez-vous.",
  recapTitre: "Votre demande",
  consentement: "J'accepte que B MATIC traite mes données pour gérer cette demande de devis et ce rendez-vous, conformément à la",
  consentementLien: "politique de confidentialité",
  envoyer: "Confirmer mon rendez-vous",
  envoi: "Envoi en cours…",
  erreur: "Une erreur est survenue. Réessayez ou appelez-nous directement.",
};

// ------------------------------------------------------------------ Confirmation
export const rdvConfirmation = {
  titreReserve: "Rendez-vous confirmé",
  titreDemande: "Demande bien reçue",
  texteReserve: (prenom: string, quand: string) =>
    `Merci ${prenom}. Votre créneau du ${quand} est réservé. Nous vous appelons si un détail doit être précisé.`,
  texteDemande: (prenom: string) =>
    `Merci ${prenom}. Votre demande est enregistrée : nous vous rappelons rapidement pour confirmer le créneau.`,
};

// ------------------------------------------------------------------ Documents (après réservation)
export const rdvDocuments = {
  titre: "Gagnez du temps : ajoutez vos documents",
  texte: "Facultatif. Avec ces deux documents, nous préparons votre dossier d'assurance avant le rendez-vous.",
  pieces: [
    { id: "carte-grise", label: "Carte grise", aide: "Certificat d'immatriculation, recto" },
    { id: "assurance", label: "Attestation d'assurance", aide: "Carte verte ou attestation de votre assureur" },
  ] as const,
  formats: "Photo ou PDF, 10 Mo maximum.",
  consentement: (jours: number) =>
    `J'accepte que B MATIC conserve ces documents pour traiter mon dossier avec mon assureur, ${jours} jours au maximum.`,
  rassurance: (jours: number) =>
    `Stockage sécurisé, accessible uniquement à notre équipe et supprimé automatiquement après ${jours} jours. Vous pouvez aussi simplement les apporter le jour du rendez-vous.`,
  bouton: "Ajouter",
  remplacer: "Remplacer",
  envoi: "Envoi…",
  ok: "Bien reçu",
  formatRefuse: "Format non accepté : photo (JPG, PNG) ou PDF.",
  tropLourd: "Fichier trop lourd : 10 Mo maximum.",
  echec: "Envoi impossible pour le moment. Apportez simplement ce document le jour du rendez-vous.",
};
