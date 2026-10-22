// ============================================================================
//  B MATIC — Conseils auto (grille d'articles, inspiration sparkauto.be/conseils)
// ----------------------------------------------------------------------------
//  Source unique des articles affichés sur /conseils (grille) et
//  /conseils/:slug (page détail + données structurées schema.org Article).
//  100 % statique et éditable ici.
//
//  Règle de rédaction : aucun engagement du garage qui ne soit déjà affiché
//  ailleurs sur le site (prix des promotions, offre pare-brise, horaires…).
//  Ces valeurs sont IMPORTÉES de leur fichier source (services.ts,
//  parebrise.ts, legal.ts) pour rester à jour automatiquement.
//
//  ➜ Pour ajouter un article : ajouter une entrée au tableau `conseils`.
//    - `slug`      : identifiant d'URL (minuscules, tirets, unique, NE PLUS
//                    LE CHANGER une fois publié : les liens partagés casseraient).
//    - `categorie` : libellé court affiché sur la vignette.
//    - `publie` / `misAJour` : dates « AAAA-MM-JJ » (SEO : datePublished /
//                    dateModified). Mettre à jour `misAJour` à chaque retouche.
//    - `icon`      : icône lucide utilisée comme vignette (dégradé néon).
//    - `image`     : (facultatif) vraie photo importée depuis src/assets/ —
//                    si présente, elle remplace la vignette à icône.
//    - `cta`       : bouton d'action en fin d'article (service concerné).
//    - `contenu`   : suite de blocs :
//                      "texte"              → paragraphe
//                      { titre: "…" }       → intertitre
//                      { liste: ["…"] }     → liste à puces
//                      { aSavoir: "…" }     → encadré « Bon à savoir »
// ============================================================================
import {
  Wrench,
  ShieldCheck,
  Snowflake,
  CircleDot,
  HandCoins,
  TriangleAlert,
  Gauge,
  Disc3,
  type LucideIcon,
} from "lucide-react";
import { legalInfo } from "@/data/legal";
import { pareBriseCadeaux, pareBriseHoraires, pareBriseRayonKm } from "@/data/parebrise";
import { serviceCategories } from "@/data/services";

export type ConseilBloc = string | { titre: string } | { liste: string[] } | { aSavoir: string };

export interface Conseil {
  slug: string;
  titre: string;
  extrait: string;
  categorie: string;
  /** Date de publication « AAAA-MM-JJ ». */
  publie: string;
  /** Date de dernière mise à jour « AAAA-MM-JJ » (facultatif). */
  misAJour?: string;
  icon: LucideIcon;
  /** Vraie photo (facultatif) ; si absente, la vignette à icône est utilisée. */
  image?: string;
  cta: { label: string; to: string };
  contenu: ConseilBloc[];
}

// Prix des promotions (source : src/data/services.ts)
const promo = (id: string) =>
  serviceCategories.find((c) => c.id === "promotions")?.services.find((s) => s.id === id)?.price;
const prixEntretien = promo("promo-entretien");
const prixPlaquettes = promo("promo-plaquettes");

const cadeaux = pareBriseCadeaux.map((c) => c.nom).join(", ");

export const conseils: Conseil[] = [
  // --------------------------------------------------------------------------
  {
    slug: "pare-brise-fissure-assurance",
    titre: "Pare-brise fissuré : comment le faire remplacer sans rien payer",
    extrait:
      "Impact, fissure, assurance bris de glace, franchise : ce qu'il faut savoir avant de faire remplacer votre pare-brise à Liège.",
    categorie: "Pare-brise",
    publie: "2026-10-22",
    icon: ShieldCheck,
    cta: { label: "Découvrir l'offre pare-brise", to: "/pare-brise" },
    contenu: [
      "Un gravillon sur l'autoroute, un choc thermique un matin de gel, et le petit impact devient une fissure qui traverse le pare-brise. Bonne nouvelle : dans la plupart des cas, le remplacement ne vous coûte rien si votre contrat d'assurance couvre le bris de glace.",
      { titre: "Impact ou fissure : réparer ou remplacer ?" },
      "Un impact plus petit qu'une pièce de 2 €, situé hors du champ de vision du conducteur et loin des bords, peut souvent être réparé. Au-delà, ou dès qu'une fissure apparaît, le remplacement s'impose : un pare-brise fragilisé protège moins bien en cas d'accident et peut vous valoir un refus au contrôle technique.",
      { aSavoir: "N'attendez pas : le froid, le chauffage à fond ou une simple route abîmée suffisent à transformer un impact en fissure." },
      { titre: "Qui paie ? Le rôle de votre assurance" },
      "Le remplacement d'un pare-brise est pris en charge par la garantie « bris de glace » ou « bris de vitrage », incluse dans les formules omnium (partielle ou complète) ou ajoutée en option à une RC auto. Vérifiez votre contrat ou demandez à votre courtier.",
      "Votre contrat peut prévoir une franchise, c'est-à-dire un montant qui reste normalement à votre charge. Chez B MATIC, la franchise est offerte : vous n'avez rien à avancer, nous traitons directement avec votre assureur.",
      { titre: "Vous choisissez librement votre réparateur" },
      "Votre assureur peut vous proposer un réseau de réparateurs agréés, mais vous restez libre de choisir le professionnel qui remplace votre pare-brise. Il suffit de nous communiquer le nom de votre assurance et votre numéro de contrat : nous nous occupons des démarches.",
      { titre: "Comment se passe le remplacement chez B MATIC" },
      {
        liste: [
          `Au centre d'Ans (${pareBriseHoraires.texte}) ou à votre domicile, à votre travail, à Liège et jusqu'à ${pareBriseRayonKm} km autour.`,
          "Vitrage homologué selon la norme européenne ECE R43. Votre voiture a une caméra d'aide à la conduite derrière le pare-brise ? Signalez-le à la réservation : elle doit être recalibrée après le remplacement.",
          "Franchise offerte et 0 € à avancer.",
          `En plus, un cadeau au choix : ${cadeaux}.`,
        ],
      },
      { aSavoir: "Un devis écrit vous est remis avant toute intervention. La prise en charge dépend de votre contrat et de l'accord de votre assureur." },
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "entretien-regulier-voiture",
    titre: "Entretien de la voiture : quand le faire et que contrôler",
    extrait:
      "Vidange, filtres, freins, pneus : un entretien suivi évite les grosses réparations et garde de la valeur à votre véhicule.",
    categorie: "Entretien",
    publie: "2026-10-22",
    icon: Wrench,
    cta: { label: "Réserver un entretien", to: "/mecanique?service=promo-entretien" },
    contenu: [
      "Une voiture bien entretenue tombe moins en panne, consomme moins et se revend mieux. L'entretien ne se limite pas à la vidange : c'est une série de contrôles qui permettent de repérer une usure avant qu'elle ne coûte cher.",
      { titre: "À quelle fréquence ?" },
      "Le bon rythme est indiqué dans le carnet d'entretien de votre véhicule. En règle générale, comptez une révision par an ou tous les 15 000 à 30 000 km selon le moteur et le type d'huile. Les trajets courts, la conduite en ville et le remorquage usent plus vite : dans ce cas, rapprochez les entretiens.",
      { titre: "Ce que comprend un entretien" },
      {
        liste: [
          "Vidange de l'huile moteur et remplacement du filtre à huile.",
          "Filtre à air (et, selon le kilométrage, filtres d'habitacle et à carburant).",
          "Contrôle des niveaux : liquide de refroidissement, liquide de frein, lave-glace.",
          "Vérification des freins, des pneus, de l'éclairage et de la batterie.",
          "Remise à zéro de l'indicateur d'entretien.",
        ],
      },
      { titre: "Les signes qui ne doivent pas attendre" },
      "Un voyant allumé, un bruit nouveau au freinage, une odeur de brûlé, une fumée inhabituelle à l'échappement ou une flaque sous la voiture : dans tous ces cas, faites contrôler le véhicule sans attendre la prochaine révision.",
      { aSavoir: "Gardez toutes vos factures d'entretien. Un historique complet rassure l'acheteur et fait monter le prix à la revente ou à la reprise." },
      prixEntretien
        ? `Notre promotion entretien (vidange, filtre à huile et filtre à air, pièces et main-d'œuvre comprises) est à ${prixEntretien} €. Réservez en ligne en quelques clics.`
        : "Réservez votre entretien en ligne en quelques clics.",
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "plaquettes-frein-usure",
    titre: "Plaquettes de frein : 5 signes qu'il faut les changer",
    extrait:
      "Grincement, vibration, pédale molle : apprenez à reconnaître des freins usés avant qu'ils ne deviennent dangereux.",
    categorie: "Freinage",
    publie: "2026-10-22",
    icon: Disc3,
    cta: { label: "Réserver le remplacement", to: "/mecanique?service=promo-plaquettes" },
    contenu: [
      "Les plaquettes s'usent à chaque freinage. Leur durée de vie varie énormément (souvent entre 30 000 et 60 000 km) selon votre conduite et vos trajets : en ville, elles s'usent beaucoup plus vite que sur autoroute.",
      { titre: "Les signes à surveiller" },
      {
        liste: [
          "Un grincement aigu au freinage : beaucoup de plaquettes ont un témoin métallique qui siffle quand elles arrivent en fin de vie.",
          "Un bruit de frottement métallique : la plaquette est usée jusqu'au support et abîme le disque.",
          "Le voyant d'usure des freins s'allume au tableau de bord.",
          "Des vibrations dans la pédale ou le volant : souvent des disques voilés ou usés.",
          "La voiture tire d'un côté au freinage, ou la distance de freinage s'allonge.",
        ],
      },
      { titre: "Plaquettes et disques : pourquoi on les change par essieu" },
      "Les plaquettes se remplacent toujours par paire, sur les deux roues d'un même essieu, pour garder un freinage équilibré. Les disques s'usent aussi : en dessous de l'épaisseur minimale gravée par le fabricant, ils doivent être remplacés en même temps.",
      { aSavoir: "Une pédale qui s'enfonce plus que d'habitude n'est pas un problème de plaquettes : elle peut signaler une fuite ou un liquide de frein usé. Ne roulez pas et faites contrôler le circuit." },
      prixPlaquettes
        ? `Notre promotion plaquettes de frein (un essieu, pièces et main-d'œuvre comprises) est à ${prixPlaquettes} €. Si les disques sont à changer, nous vous le disons avant d'intervenir.`
        : "Si les disques sont à changer, nous vous le disons avant d'intervenir.",
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "voyants-tableau-de-bord",
    titre: "Voyants du tableau de bord : lesquels imposent de s'arrêter",
    extrait:
      "Rouge, orange, vert : chaque couleur a un sens. Les voyants à connaître et la bonne réaction pour chacun.",
    categorie: "Diagnostic",
    publie: "2026-10-22",
    icon: Gauge,
    cta: { label: "Prendre rendez-vous pour un diagnostic", to: "/mecanique" },
    contenu: [
      "Les voyants suivent un code couleur simple, proche de celui des feux de circulation. Le connaître évite de s'inquiéter pour rien… ou d'ignorer une alerte sérieuse.",
      { titre: "Rouge : arrêtez-vous dès que possible" },
      {
        liste: [
          "Pression d'huile (burette) : le moteur n'est plus lubrifié. Coupez le moteur rapidement pour éviter une casse.",
          "Température moteur (thermomètre) : risque de surchauffe. Arrêtez-vous et laissez refroidir, sans ouvrir le bouchon du radiateur à chaud.",
          "Freins (point d'exclamation dans un cercle) : si le frein à main est desserré, niveau de liquide trop bas ou défaut du circuit.",
          "Batterie / charge : l'alternateur ne recharge plus, la voiture va s'arrêter quand la batterie sera vide.",
        ],
      },
      { titre: "Orange : faites contrôler rapidement" },
      {
        liste: [
          "Moteur (silhouette de moteur) : un défaut de dépollution ou d'injection a été détecté. S'il clignote, levez le pied et faites contrôler sans attendre.",
          "ABS, ESP : le freinage fonctionne, mais sans assistance.",
          "Pression des pneus : un pneu est sous-gonflé ou crevé.",
          "Préchauffage ou filtre à particules (diesel) : à surveiller s'il reste allumé.",
        ],
      },
      { titre: "Vert ou bleu : simple information" },
      "Feux allumés, régulateur de vitesse actif, feux de route : ces voyants confirment qu'une fonction est en marche.",
      { aSavoir: "Un voyant orange ne veut pas dire que la panne est grave, mais l'ignorer peut l'aggraver. Notez quand il s'est allumé et ce que vous avez ressenti (perte de puissance, bruit, odeur) : cela aide au diagnostic." },
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "preparer-voiture-hiver",
    titre: "Préparer sa voiture pour l'hiver en Belgique",
    extrait:
      "Batterie, pneus, liquides, visibilité : les vérifications à faire avant les premiers froids pour éviter la panne un matin de gel.",
    categorie: "Saison",
    publie: "2026-10-22",
    icon: Snowflake,
    cta: { label: "Prendre rendez-vous", to: "/mecanique" },
    contenu: [
      "Le froid est la première cause de panne en hiver, et la batterie sa première victime. Quelques contrôles en octobre ou en novembre évitent bien des mauvaises surprises.",
      { titre: "La batterie" },
      "Une batterie perd une bonne partie de sa puissance quand il gèle. Si le démarrage est déjà un peu lent en automne, ou si votre batterie a plus de 4 à 5 ans, faites-la tester : le contrôle est rapide et évite d'attendre un dépanneur dans le froid.",
      { titre: "Les pneus" },
      "En Belgique, les pneus hiver ne sont pas obligatoires pour les voitures immatriculées dans le pays. Ils offrent pourtant une adhérence bien meilleure dès que la température passe sous 7 °C, sur route froide, mouillée ou enneigée. Les pneus toutes saisons sont un bon compromis si vous roulez surtout en ville et sur autoroute.",
      { aSavoir: "Vous partez au ski ou traversez l'Allemagne ou le Luxembourg ? Des pneus adaptés y sont exigés par conditions hivernales. Renseignez-vous avant le départ." },
      { titre: "Les liquides et la visibilité" },
      {
        liste: [
          "Liquide de refroidissement : vérifiez le niveau et sa protection contre le gel.",
          "Lave-glace : remplacez-le par un produit hiver qui ne gèle pas.",
          "Essuie-glaces : changez-les s'ils laissent des traces.",
          "Éclairage : contrôlez tous les feux, il fait nuit tôt.",
          "Gardez dans la voiture un grattoir, une raclette et des gants.",
        ],
      },
      "Un passage au garage avant l'hiver permet de faire tous ces contrôles en une seule visite.",
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "pneus-usure-pression-saison",
    titre: "Pneus : usure, pression et choix selon la saison",
    extrait:
      "Vos pneus sont votre seul contact avec la route. Savoir lire leur usure et garder la bonne pression, c'est votre sécurité.",
    categorie: "Pneus",
    publie: "2026-10-22",
    icon: CircleDot,
    cta: { label: "Prendre rendez-vous", to: "/mecanique" },
    contenu: [
      "Des pneus usés ou mal gonflés allongent nettement la distance de freinage, surtout sur route mouillée. Ils augmentent aussi la consommation.",
      { titre: "La profondeur des sculptures" },
      "En Belgique, la profondeur minimale légale est de 1,6 mm sur toute la bande de roulement. Des témoins d'usure (petits bossages au fond des rainures) indiquent ce seuil. Pour votre sécurité, remplacez vos pneus été vers 3 mm et vos pneus hiver vers 4 mm : en dessous, leur efficacité sur sol mouillé ou enneigé chute.",
      { titre: "La pression" },
      "Contrôlez la pression une fois par mois et avant un long trajet, toujours à froid. Les valeurs recommandées figurent sur une étiquette dans l'encadrement de la portière conducteur, dans la trappe à carburant ou dans le manuel. Augmentez-la si la voiture est chargée.",
      { titre: "Une usure irrégulière ?" },
      {
        liste: [
          "Usure au centre : pression trop élevée.",
          "Usure sur les deux bords : pression trop faible.",
          "Usure d'un seul côté : défaut de parallélisme (géométrie) à faire vérifier.",
          "Vibrations dans le volant à vitesse stable : équilibrage à refaire.",
        ],
      },
      { aSavoir: "Une hernie (bosse) sur le flanc d'un pneu signale une structure endommagée, souvent après un choc contre un trottoir. Le pneu doit être remplacé : il peut éclater." },
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "vendre-ou-faire-reprendre-vehicule",
    titre: "Vendre ou faire reprendre sa voiture : documents et étapes",
    extrait:
      "Car-Pass, certificat d'immatriculation, plaque, assurance : la liste des documents et les démarches pour vendre sereinement en Belgique.",
    categorie: "Reprise",
    publie: "2026-10-22",
    icon: HandCoins,
    cta: { label: "Faire estimer mon véhicule", to: "/reprise" },
    contenu: [
      "Vendre à un particulier peut rapporter un peu plus, mais demande du temps : annonces, visites, essais, négociation et formalités. La reprise par un professionnel est plus rapide et vous évite les litiges après la vente.",
      { titre: "Les documents à préparer" },
      {
        liste: [
          "Le certificat d'immatriculation (la « carte grise », ses deux volets).",
          "Le certificat de conformité.",
          "Le Car-Pass, qui retrace l'historique du kilométrage : il est obligatoire en Belgique lors de la vente d'un véhicule d'occasion.",
          "Le dernier certificat de contrôle technique.",
          "Le carnet d'entretien et les factures, ainsi que toutes les clés.",
        ],
      },
      { aSavoir: "Si vous vendez à un particulier, un contrôle technique « vente » est en principe exigé avant l'immatriculation au nom de l'acheteur. Lors d'une reprise par un garage, nous vous indiquons ce qui est nécessaire." },
      { titre: "Pour obtenir le meilleur prix" },
      "Un intérieur propre, des petits défauts réparés et un historique d'entretien complet font une vraie différence. Soyez transparent sur l'état du véhicule : une estimation juste se fait sur des informations exactes.",
      { titre: "Après la vente : plaque et assurance" },
      "En Belgique, la plaque appartient au propriétaire, pas à la voiture : retirez-la et faites-la radier auprès de la DIV (en ligne ou via bpost), ou gardez-la pour votre prochain véhicule. Prévenez ensuite votre assureur pour suspendre ou transférer votre contrat.",
      { titre: "La reprise chez B MATIC" },
      "Nous reprenons les véhicules toutes marques, avec une estimation rapide et un paiement sur place. Sur notre formulaire de reprise, vous pouvez scanner votre carte grise pour remplir les informations techniques en une trentaine de secondes.",
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "que-faire-en-cas-de-panne",
    titre: "Panne sur la route : les bons réflexes",
    extrait:
      "Se mettre en sécurité, signaler la voiture, appeler le dépannage : la marche à suivre pour gérer une panne sans danger.",
    categorie: "Dépannage",
    publie: "2026-10-22",
    icon: TriangleAlert,
    cta: { label: "Appeler le dépannage", to: legalInfo.phoneHref },
    contenu: [
      "Une panne peut arriver à tout le monde. Ce qui compte, c'est de se mettre en sécurité avant toute chose, puis de prévenir les bonnes personnes.",
      { titre: "1. Se mettre en sécurité" },
      {
        liste: [
          "Allumez les feux de détresse et rangez-vous le plus à droite possible, sur la bande d'arrêt d'urgence ou dans un endroit dégagé.",
          "Enfilez le gilet fluorescent avant de sortir (gardez-le dans l'habitacle, pas dans le coffre).",
          "Faites sortir les passagers côté droit, loin de la circulation.",
          "Sur autoroute, mettez-vous à l'abri derrière la glissière de sécurité.",
        ],
      },
      { titre: "2. Signaler le véhicule" },
      "Placez le triangle de danger à au moins 30 m de la voiture sur une route ordinaire, et à au moins 100 m sur autoroute, s'il est possible de le faire sans risque. Sur autoroute, n'essayez jamais de réparer vous-même.",
      { aSavoir: "En Belgique, le gilet fluorescent, le triangle de danger, l'extincteur et la trousse de secours sont obligatoires à bord." },
      { titre: "3. Appeler les secours ou le dépannage" },
      "En cas de danger ou de blessé, appelez le 112. Sinon, contactez votre assistance ou un dépanneur. Indiquez votre position précise (autoroute, sens, borne kilométrique ou sortie la plus proche) et décrivez les symptômes : voyant allumé, bruit, fumée, perte de puissance.",
      `B MATIC assure le dépannage et le remorquage 24h/24, 7j/7. Appelez-nous au ${legalInfo.phone}.`,
    ],
  },
];

/** Retrouve un article par son slug (pour la page détail /conseils/:slug). */
export function findConseil(slug: string): Conseil | undefined {
  return conseils.find((c) => c.slug === slug);
}

/** Texte brut de l'article (temps de lecture, données structurées). */
export function conseilTexte(c: Conseil): string {
  return c.contenu
    .map((b) => (typeof b === "string" ? b : "titre" in b ? b.titre : "liste" in b ? b.liste.join("\n") : b.aSavoir))
    .join("\n\n");
}

/** Temps de lecture estimé en minutes (≈ 200 mots/minute, 1 minute minimum). */
export function tempsDeLecture(c: Conseil): number {
  const mots = conseilTexte(c).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 200));
}

/** Articles à suggérer en fin de lecture (les suivants dans la liste, en boucle). */
export function conseilsLies(slug: string, n = 3): Conseil[] {
  const i = conseils.findIndex((c) => c.slug === slug);
  return Array.from({ length: Math.min(n, conseils.length - 1) }, (_, k) => conseils[(i + 1 + k) % conseils.length]);
}
