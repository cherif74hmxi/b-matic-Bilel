// ============================================================================
//  B MATIC — Formulaire de reprise (/reprise) : textes et listes modifiables
// ----------------------------------------------------------------------------
//  Le formulaire (src/pages/Reprise.tsx) ne fait qu'afficher ce qui est ici.
//  Le scan de carte grise n'apparaît que si l'assistant IA est activé
//  (VITE_AI_ENABLED=true) ; sinon le formulaire démarre en saisie manuelle.
// ============================================================================
import type { PhotoSlot } from "@/lib/vehiclePhotos";

export const repriseSeo = {
  title: "Reprise de véhicule à Liège — offre rapide | B MATIC",
  description:
    "Faites reprendre votre voiture par B MATIC (Ans, Liège) : scannez votre carte grise ou décrivez votre véhicule en 2 minutes, nous vous rappelons avec une offre.",
};

export const repriseIntro = {
  titre: "Reprise de véhicule",
  texte: "Toutes marques, au juste prix. Décrivez votre véhicule en quelques minutes : nous vous rappelons avec une offre.",
};

/** Écran de départ : le client choisit sa méthode (temps estimés affichés). */
export const repriseChoix = {
  titre: "Comment voulez-vous décrire votre véhicule ?",
  scan: {
    label: "Scanner ma carte grise",
    duree: "environ 30 secondes",
    badge: "Recommandé",
    texte: "Une photo suffit : on remplit les informations pour vous, vous vérifiez.",
  },
  manuel: {
    label: "Remplir à la main",
    duree: "environ 2 à 3 minutes",
    texte: "Marque, modèle, année, kilométrage… à saisir vous-même.",
  },
};

/** Consignes de la zone de dépôt de la carte grise. */
export const repriseScan = {
  titre: "Photo de la carte grise",
  consigne: "Prenez TOUTE la carte grise en photo, bien à plat et lisible.",
  indice: "Reculez pour cadrer l'intégralité du document",
  boutonPhoto: "Prendre une photo",
  boutonGalerie: "Choisir dans la galerie",
  lecture: "Lecture de la carte grise…",
  confidentialite:
    "Seules les caractéristiques techniques du véhicule sont lues. La photo n'est pas conservée et aucune donnée sur le titulaire n'est enregistrée.",
  succes: (n: number) => `${n} information${n > 1 ? "s" : ""} pré-remplie${n > 1 ? "s" : ""} : vérifiez-les et corrigez si besoin.`,
};

/** État général proposé au client (valeur = texte envoyé au garage). */
export const repriseEtats = ["Très bon état", "Bon état", "État moyen", "À réparer / non roulant"];

/** Photos du véhicule, façon leboncoin (toutes facultatives). */
export interface ReprisePhotoSlot {
  id: string;
  label: string;
  /** Dessin de l'angle (repris de l'admin) ; sinon une icône simple. */
  illustration?: Exclude<PhotoSlot, "autre">;
  icone?: "compteur" | "defaut" | "plus";
}

export const reprisePhotos = {
  titre: "Photos du véhicule",
  texte: "Facultatif, mais une offre est bien plus précise avec 4 ou 5 photos.",
  max: 8,
  slots: [
    { id: "avant", label: "3/4 avant", illustration: "avant_gauche_3_4" },
    { id: "arriere", label: "3/4 arrière", illustration: "arriere_droit_3_4" },
    { id: "profil", label: "Profil", illustration: "profil_gauche" },
    { id: "interieur", label: "Intérieur", illustration: "interieur_conducteur" },
    { id: "compteur", label: "Compteur (km)", icone: "compteur" },
    { id: "defaut", label: "Défauts éventuels", icone: "defaut" },
  ] as ReprisePhotoSlot[],
  autre: "Autre photo",
  /** Photo illisible par le navigateur (souvent HEIC sur ordinateur). */
  formatRefuse: "Certaines photos n'ont pas pu être lues (format HEIC ?) : choisissez des photos JPEG ou PNG.",
};

export const repriseEtapes = ["Véhicule", "Photos", "Coordonnées"];

export const repriseConsentement =
  "J'accepte que mes données soient traitées pour étudier ma demande de reprise, conformément à la";

export const repriseMessages = {
  succes: "Merci ! Votre demande de reprise est bien envoyée. Nous vous rappelons rapidement avec une offre.",
  erreur: "L'envoi a échoué. Réessayez, ou appelez-nous directement.",
};
