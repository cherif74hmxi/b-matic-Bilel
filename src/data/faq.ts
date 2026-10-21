// ============================================================================
//  B MATIC — FAQ / Conseils
// ----------------------------------------------------------------------------
//  Source unique des questions/réponses de la page /faq. Elles alimentent À LA
//  FOIS l'accordéon affiché ET les données structurées schema.org (FAQPage)
//  injectées pour le SEO — les deux restent donc toujours synchronisées.
//
//  ⚠️  « À CONFIRMER » = tout engagement concret du garage (délais précis, zone
//      géographique, durée de garantie…) n'est PAS inventé. Le propriétaire doit
//      remplacer ces mentions par les valeurs réelles.
//
//  ➜ Pour modifier la FAQ : éditer le tableau ci-dessous. Garder des réponses
//    en texte simple (le rendu et le JSON-LD n'acceptent pas de HTML riche).
// ============================================================================

export type FaqCategorie =
  | "Pare-brise & assurance"
  | "Rendez-vous & délais"
  | "Zone & intervention"
  | "Paiement"
  | "Reprise de véhicule"
  | "Entretien & promotions"
  | "Garanties";

export interface FaqItem {
  question: string;
  reponse: string;
  categorie: FaqCategorie;
}

export const faqItems: FaqItem[] = [
  // --- Pare-brise & assurance ------------------------------------------------
  {
    categorie: "Pare-brise & assurance",
    question: "Le remplacement de mon pare-brise va-t-il vraiment me coûter 0 € ?",
    reponse:
      "Si votre contrat auto inclut la garantie bris de glace, le remplacement peut être pris en charge intégralement, soit 0 € à payer. Le montant restant éventuellement à votre charge dépend de votre contrat, de la franchise prévue et de l'accord de votre assureur.",
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
      "Selon le remplacement effectué, un cadeau vous est offert : PlayStation 5, Nintendo Switch, trottinette électrique ou jusqu'à 300 € offerts. La correspondance exacte entre le cadeau et le type de remplacement est à confirmer avec le garage (À CONFIRMER).",
  },
  {
    categorie: "Pare-brise & assurance",
    question: "Travaillez-vous avec mon assurance ?",
    reponse:
      "Nous travaillons avec toutes les assurances, dont Ethias, P&V, Belfius, BNP Paribas Fortis, CBC et KBC, entre autres. Contactez-nous avec le nom de votre assureur et nous vérifions la prise en charge.",
  },
  {
    categorie: "Pare-brise & assurance",
    question: "Un petit impact peut-il être réparé plutôt que remplacé ?",
    reponse:
      "Souvent oui : un impact de petite taille, hors champ de vision du conducteur et non fissuré, peut être réparé par injection de résine, ce qui évite le remplacement complet. Nous évaluons l'impact avant d'intervenir.",
  },

  // --- Rendez-vous & délais --------------------------------------------------
  {
    categorie: "Rendez-vous & délais",
    question: "Comment prendre rendez-vous ?",
    reponse:
      "Directement en ligne depuis la page « Prendre rendez-vous » : vous choisissez la prestation, la date et l'heure, puis vous renseignez vos coordonnées. Vous pouvez aussi nous appeler.",
  },
  {
    categorie: "Rendez-vous & délais",
    question: "Quels sont vos délais d'intervention ?",
    reponse:
      "Les délais dépendent de la prestation et de la disponibilité des pièces. Les délais précis sont à confirmer avec le garage lors de la prise de rendez-vous (À CONFIRMER).",
  },
  {
    categorie: "Rendez-vous & délais",
    question: "Êtes-vous disponibles en dehors des heures de bureau ?",
    reponse:
      "Notre service de dépannage est joignable 24h/24. Pour les rendez-vous à l'atelier, les créneaux proposés en ligne correspondent à nos horaires d'ouverture.",
  },

  // --- Zone & intervention ---------------------------------------------------
  {
    categorie: "Zone & intervention",
    question: "Intervenez-vous à domicile ou sur mon lieu de travail ?",
    reponse:
      "Pour le remplacement de pare-brise, une intervention sur place est possible. La zone géographique couverte est à confirmer avec le garage (À CONFIRMER).",
  },
  {
    categorie: "Zone & intervention",
    question: "Quelle zone géographique couvrez-vous pour le dépannage ?",
    reponse:
      "Nous assurons dépannage et remorquage. Le périmètre d'intervention est à confirmer avec le garage (À CONFIRMER) — appelez-nous, nous vous indiquons immédiatement si nous pouvons intervenir.",
  },

  // --- Paiement --------------------------------------------------------------
  {
    categorie: "Paiement",
    question: "Comment se passe le paiement ?",
    reponse:
      "Le paiement s'effectue sur place, à l'atelier. Aucun prélèvement n'est réalisé en ligne lors de la prise de rendez-vous. Pour les remplacements pris en charge par l'assurance, le montant couvert est réglé directement avec l'assureur.",
  },
  {
    categorie: "Paiement",
    question: "Les prix affichés sont-ils définitifs ?",
    reponse:
      "Les prix des promotions sont fermes. Les tarifs « à partir de » sont des montants de départ : le prix définitif dépend du modèle et des pièces nécessaires, et vous est confirmé après diagnostic. Les prestations « sur devis » sont chiffrées au cas par cas.",
  },

  // --- Reprise de véhicule ---------------------------------------------------
  {
    categorie: "Reprise de véhicule",
    question: "Rachetez-vous tous les véhicules ?",
    reponse:
      "Nous reprenons les véhicules toutes marques. Vous nous transmettez les caractéristiques et quelques photos via le formulaire de reprise, et nous vous faisons une proposition.",
  },
  {
    categorie: "Reprise de véhicule",
    question: "Comment est estimée la valeur de mon véhicule ?",
    reponse:
      "L'estimation tient compte du modèle, de l'année, du kilométrage, de l'état général et de l'entretien. Plus vous nous donnez d'informations et de photos, plus la proposition est précise.",
  },

  // --- Entretien & promotions ------------------------------------------------
  {
    categorie: "Entretien & promotions",
    question: "Quelles promotions proposez-vous actuellement ?",
    reponse:
      "Promo entretien (vidange + filtres) à 149 €, promo plaquettes de frein (1 essieu) à 99 €, et l'offre combinée entretien + plaquettes à 239 €. Ces tarifs incluent pièces et main-d'œuvre.",
  },
  {
    categorie: "Entretien & promotions",
    question: "À quelle fréquence dois-je faire l'entretien de ma voiture ?",
    reponse:
      "En règle générale, une fois par an ou tous les 15 000 à 30 000 km selon le constructeur et le type de moteur. Reportez-vous au carnet d'entretien de votre véhicule ; en cas de doute, nous vous conseillons.",
  },

  // --- Garanties -------------------------------------------------------------
  {
    categorie: "Garanties",
    question: "Vos interventions sont-elles garanties ?",
    reponse:
      "Nos interventions et les pièces posées bénéficient d'une garantie. La durée et les conditions exactes sont à confirmer avec le garage (À CONFIRMER).",
  },
];
