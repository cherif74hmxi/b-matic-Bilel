// ============================================================================
//  B MATIC — Conseils auto (grille d'articles, inspiration sparkauto.be/conseils)
// ----------------------------------------------------------------------------
//  Source unique des articles de conseils affichés sur /conseils (grille) et
//  /conseils/:slug (page détail). 100 % statique et éditable ici.
//
//  ⚠️  « À CONFIRMER » = tout engagement concret du garage (délais, prix, zone
//      d'intervention, durée de garantie, nature exacte des cadeaux…) n'est PAS
//      inventé. Le propriétaire doit remplacer ces mentions par les valeurs
//      réelles avant publication.
//
//  ➜ Pour ajouter un article : ajouter une entrée au tableau `conseils`.
//    - `slug`    : identifiant d'URL (minuscules, tirets, unique).
//    - `icon`    : icône lucide utilisée comme vignette (dégradé néon).
//    - `image`   : (facultatif) vraie photo importée depuis src/assets/ —
//                  si présente, elle remplace la vignette à icône.
//    - `contenu` : tableau de paragraphes (texte simple, pas de HTML riche).
// ============================================================================
import {
  Wrench,
  ShieldCheck,
  Snowflake,
  CircleDot,
  HandCoins,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

export interface Conseil {
  slug: string;
  titre: string;
  extrait: string;
  icon: LucideIcon;
  /** Vraie photo (facultatif) ; si absente, la vignette à icône est utilisée. */
  image?: string;
  contenu: string[];
}

export const conseils: Conseil[] = [
  {
    slug: "entretien-regulier-voiture",
    titre: "Entretien régulier : pourquoi ne pas le repousser",
    extrait:
      "Vidange, filtres, freins, pneus : un entretien suivi évite les grosses réparations et préserve la valeur de votre véhicule.",
    icon: Wrench,
    contenu: [
      "Un entretien régulier est le meilleur moyen d'éviter les pannes coûteuses. La plupart des constructeurs recommandent une révision selon le kilométrage ou une fois par an (intervalle exact à vérifier dans le carnet d'entretien de votre véhicule).",
      "Les points à surveiller en priorité : le niveau et la qualité de l'huile moteur, l'état des plaquettes et disques de frein, l'usure et la pression des pneus, les filtres (air, habitacle, carburant) et l'état de la batterie.",
      "Chez B MATIC, nous réalisons l'entretien complet et le diagnostic de votre véhicule. Nos tarifs d'entretien figurent dans nos promotions du moment — les prix et prestations exacts sont à confirmer avec le garage (À CONFIRMER).",
      "Un conseil simple : conservez les factures d'entretien. Un historique suivi rassure un futur acheteur et valorise votre voiture au moment de la revente ou de la reprise.",
    ],
  },
  {
    slug: "pare-brise-fissure-assurance",
    titre: "Pare-brise fissuré : 0 € avec votre assurance",
    extrait:
      "Un impact ou une fissure ? Avec la garantie bris de glace, le remplacement peut être pris en charge intégralement — et un cadeau vous est offert.",
    icon: ShieldCheck,
    contenu: [
      "Un petit impact peut vite se transformer en fissure qui traverse tout le pare-brise, notamment avec les écarts de température. Il est donc préférable d'agir rapidement.",
      "Si votre contrat auto inclut la garantie bris de glace, le remplacement du pare-brise peut être pris en charge par votre assurance, soit 0 € à payer. Le montant éventuellement restant à votre charge dépend de votre contrat, de la franchise prévue et de l'accord de votre assureur.",
      "B MATIC s'occupe du dossier avec votre assureur de A à Z, intervient sur place (zone d'intervention À CONFIRMER) et vous rend le véhicule lavé. Un cadeau est également offert selon le remplacement effectué (nature du cadeau et conditions À CONFIRMER).",
      "Indiquez-nous simplement le nom de votre assurance : nous vérifions la prise en charge avec vous avant toute intervention.",
    ],
  },
  {
    slug: "preparer-voiture-hiver",
    titre: "Préparer sa voiture pour l'hiver",
    extrait:
      "Pneus, batterie, liquides, visibilité : quelques vérifications avant les premiers froids pour rouler l'esprit tranquille.",
    icon: Snowflake,
    contenu: [
      "Le froid met les voitures à rude épreuve. Avant l'hiver, quelques vérifications simples réduisent fortement le risque de panne.",
      "La batterie est la première victime du froid : une batterie faible peut lâcher au premier matin glacial. Faites contrôler son état. Vérifiez aussi le liquide de refroidissement (antigel) et le lave-glace adapté aux basses températures.",
      "Côté visibilité et adhérence : contrôlez les essuie-glaces, l'état et la pression des pneus. En conditions hivernales, les pneus hiver offrent une bien meilleure sécurité sur route froide, mouillée ou enneigée. La réglementation sur les pneus hiver varie selon les régions et les pays (règles exactes À CONFIRMER selon votre situation).",
      "Un passage au garage avant l'hiver permet de faire le point sur l'ensemble de ces éléments en une seule visite.",
    ],
  },
  {
    slug: "pneus-usure-pression-saison",
    titre: "Pneus : usure, pression et choix selon la saison",
    extrait:
      "Les pneus sont votre seul contact avec la route. Savoir lire leur usure et maintenir la bonne pression, c'est votre sécurité.",
    icon: CircleDot,
    contenu: [
      "Les pneus assurent l'adhérence, le freinage et la tenue de route. Les négliger, c'est allonger les distances de freinage et augmenter le risque d'accident.",
      "Surveillez la profondeur des sculptures : la limite légale est généralement de 1,6 mm, mais il est prudent de remplacer les pneus bien avant (seuil précis à vérifier selon la réglementation applicable). Repérez aussi une usure irrégulière, qui peut révéler un défaut de parallélisme ou de pression.",
      "La pression se contrôle à froid, environ une fois par mois, selon les valeurs indiquées par le constructeur (souvent sur une étiquette dans l'ouverture de portière conducteur). Une pression mal réglée use prématurément les pneus et augmente la consommation.",
      "Selon la saison et votre usage, pneus été, hiver ou toutes saisons n'offrent pas les mêmes performances. Nous pouvons vous conseiller le montage adapté et vérifier l'équilibrage (prestations et tarifs À CONFIRMER).",
    ],
  },
  {
    slug: "vendre-ou-faire-reprendre-vehicule",
    titre: "Vendre ou faire reprendre son véhicule",
    extrait:
      "Préparer sa voiture, réunir les bons documents et obtenir une estimation juste : nos conseils pour une reprise sans mauvaise surprise.",
    icon: HandCoins,
    contenu: [
      "Que vous vendiez à un particulier ou que vous optiez pour une reprise, une bonne préparation fait la différence sur le prix final.",
      "Avant l'estimation, rassemblez les documents : carte grise, carnet d'entretien, factures de réparation et le double des clés. Un historique d'entretien complet rassure et valorise le véhicule.",
      "Un nettoyage intérieur et extérieur soigné, ainsi que la réparation des petits défauts évidents, donnent une bien meilleure impression. Soyez transparent sur l'état réel : cela accélère la transaction et évite les litiges.",
      "B MATIC reprend les véhicules toutes marques avec une estimation rapide et un paiement sur place (modalités et délais À CONFIRMER). Décrivez-nous votre véhicule via notre formulaire de reprise pour obtenir une première estimation.",
    ],
  },
  {
    slug: "que-faire-en-cas-de-panne",
    titre: "Que faire en cas de panne sur la route",
    extrait:
      "Se mettre en sécurité, signaler, puis appeler le dépannage : les bons réflexes pour gérer une panne sans stress.",
    icon: TriangleAlert,
    contenu: [
      "Face à une panne, la priorité absolue est la sécurité. Si possible, rejoignez la bande d'arrêt d'urgence ou un endroit dégagé, allumez les feux de détresse et quittez le véhicule par le côté opposé à la circulation.",
      "Enfilez le gilet de sécurité (à garder dans l'habitacle, pas dans le coffre) et placez le triangle de présignalisation à bonne distance, puis mettez-vous à l'abri derrière la glissière de sécurité en attendant les secours.",
      "Notez les symptômes (voyant allumé, bruit, fumée, perte de puissance) : ces informations aident le dépanneur à intervenir plus efficacement.",
      "B MATIC assure un service de dépannage et de remorquage 24h/24, 7j/7 (zone d'intervention et délais À CONFIRMER). En cas de panne, contactez-nous : nous intervenons dans les plus brefs délais.",
    ],
  },
];

/** Retrouve un article par son slug (pour la page détail /conseils/:slug). */
export function findConseil(slug: string): Conseil | undefined {
  return conseils.find((c) => c.slug === slug);
}
