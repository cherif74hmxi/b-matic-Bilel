// ============================================================================
//  B MATIC — FAQ pare-brise (page /conseils)
// ----------------------------------------------------------------------------
//  Source unique des questions/réponses affichées dans le bloc « Questions
//  fréquentes » en bas de la page /conseils. Elles alimentent À LA FOIS
//  l'accordéon affiché ET les données structurées schema.org (FAQPage)
//  injectées pour le SEO — les deux restent donc toujours synchronisées.
//
//  ⚠️  « À CONFIRMER » = tout engagement concret du centre (délais précis,
//      durée de garantie…) n'est PAS inventé. Le propriétaire doit remplacer
//      ces mentions par les valeurs réelles.
//
//  ➜ Pour modifier la FAQ : éditer le tableau ci-dessous. Garder des réponses
//    en texte simple (le rendu et le JSON-LD n'acceptent pas de HTML riche).
// ============================================================================
import { pareBriseCadeaux, pareBriseRayonKm, franchiseCondition } from "@/data/parebrise";

export type FaqCategorie =
  | "Pare-brise & assurance"
  | "Rendez-vous & délais"
  | "Zone & intervention"
  | "Paiement & garanties";

export interface FaqItem {
  question: string;
  reponse: string;
  categorie: FaqCategorie;
}

export const faqItems: FaqItem[] = [
  // --- Pare-brise & assurance ------------------------------------------------
  {
    categorie: "Pare-brise & assurance",
    question: "Le remplacement de mon pare-brise va-t-il me coûter quelque chose ?",
    reponse:
      `Si votre contrat auto inclut la garantie bris de glace et que votre assureur donne son accord, le remplacement est réglé directement avec lui. ${franchiseCondition}`,
  },
  {
    categorie: "Pare-brise & assurance",
    question: "Dois-je avancer les frais auprès de mon assurance ?",
    reponse:
      "Non. Nous nous occupons du dossier directement avec votre assureur lorsque la prise en charge bris de glace s'applique. Vous n'avez pas à faire l'avance du montant couvert.",
  },
  {
    categorie: "Pare-brise & assurance",
    question: "Quel cadeau vais-je recevoir pour le remplacement de mon pare-brise ?",
    reponse:
      `Pour tout pare-brise remplacé, vous choisissez un cadeau : ${pareBriseCadeaux.map((c) => c.nom).join(", ")}. ${franchiseCondition}`,
  },
  {
    categorie: "Pare-brise & assurance",
    question: "Travaillez-vous avec mon assurance ?",
    reponse:
      "Nous travaillons avec toutes les assurances, dont Ethias, P&V, Belfius, AXA, KBC, CBC, BNP Paribas Fortis, Baloise et AG, entre autres. Indiquez-nous le nom de votre assureur et nous vérifions la prise en charge.",
  },
  {
    categorie: "Pare-brise & assurance",
    question: "Un petit impact peut-il être réparé plutôt que remplacé ?",
    reponse:
      "Souvent oui : un impact de petite taille, hors champ de vision du conducteur et non fissuré, peut être réparé par injection de résine, ce qui évite le remplacement complet. Nous évaluons l'impact avant d'intervenir.",
  },

  {
    categorie: "Pare-brise & assurance",
    question: "Mon véhicule a une caméra d'aide à la conduite : est-ce un problème ?",
    reponse:
      "Non. Si votre pare-brise porte une caméra ou des capteurs (freinage d'urgence, maintien dans la voie…), le recalibrage est inclus après le remplacement, pour que ces aides fonctionnent comme à l'origine.",
  },

  // --- Rendez-vous & délais --------------------------------------------------
  {
    categorie: "Rendez-vous & délais",
    question: "Comment prendre rendez-vous ?",
    reponse:
      "En ligne en 2 minutes depuis la page « Demander un devis » : vous indiquez la vitre à traiter, votre véhicule, votre assurance, le lieu et le créneau. Vous pouvez aussi nous appeler ou nous écrire sur WhatsApp.",
  },
  {
    categorie: "Rendez-vous & délais",
    question: "Combien de temps dure un remplacement de pare-brise ?",
    reponse:
      "Comptez 2 h à 2 h 30 de pose, puis 2 h sans rouler, le temps que la colle sèche. La réparation d'un impact est beaucoup plus rapide.",
  },
  {
    categorie: "Rendez-vous & délais",
    question: "Quels jours êtes-vous ouverts ?",
    reponse:
      "Tous les jours, de 10h à 19h, dimanche compris. Les créneaux proposés en ligne correspondent à ces horaires.",
  },

  // --- Zone & intervention ---------------------------------------------------
  {
    categorie: "Zone & intervention",
    question: "Intervenez-vous à domicile ou sur mon lieu de travail ?",
    reponse:
      `Oui : à domicile ou au travail, à Liège et jusqu'à ${pareBriseRayonKm} km autour. Nous pouvons aussi venir chercher votre voiture et vous la ramener.`,
  },

  // --- Paiement & garanties --------------------------------------------------
  {
    categorie: "Paiement & garanties",
    question: "Comment se passe le paiement ?",
    reponse:
      `Lorsque la garantie bris de glace s'applique, le montant couvert est réglé directement avec votre assureur. ${franchiseCondition} Un devis écrit vous est remis avant toute intervention.`,
  },
  {
    categorie: "Paiement & garanties",
    question: "La pose est-elle garantie ?",
    reponse:
      "Oui. Nos vitrages sont conformes à la norme européenne 43R et la pose est garantie (étanchéité et tenue) : en cas d'infiltration ou de bruit de vent, on reprend. La durée exacte de la garantie est à confirmer avec le centre (À CONFIRMER).",
  },
];
