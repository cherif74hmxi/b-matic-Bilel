// ============================================================================
//  B MATIC — Conseils pare-brise (grille d'articles, inspiration sparkauto.be/conseils)
// ----------------------------------------------------------------------------
//  Source unique des articles affichés sur /conseils (grille) et
//  /conseils/:slug (page détail + données structurées schema.org Article).
//  100 % statique et éditable ici.
//
//  Règle de rédaction : aucun engagement du centre qui ne soit déjà affiché
//  ailleurs sur le site (offre pare-brise, horaires, zone…). Ces valeurs sont
//  IMPORTÉES de leur fichier source (parebrise.ts) pour rester à jour
//  automatiquement.
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
import { ShieldCheck, Target, ScanEye, Car, type LucideIcon } from "lucide-react";
import { RDV_PATH } from "@/data/rdv";
import { pareBriseCadeaux, pareBriseHoraires, pareBriseRayonKm } from "@/data/parebrise";

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
    cta: { label: "Demander mon devis", to: RDV_PATH },
    contenu: [
      "Un gravillon sur l'autoroute, un choc thermique un matin de gel, et le petit impact devient une fissure qui traverse le pare-brise. Bonne nouvelle : dans la plupart des cas, le remplacement ne vous coûte rien si votre contrat d'assurance couvre le bris de glace.",
      { titre: "Impact ou fissure : réparer ou remplacer ?" },
      "Un impact plus petit qu'une pièce de 2 €, situé hors du champ de vision du conducteur et loin des bords, peut souvent être réparé. Au-delà, ou dès qu'une fissure apparaît, le remplacement s'impose : un pare-brise fragilisé protège moins bien en cas d'accident et peut vous valoir un refus au contrôle technique.",
      { aSavoir: "N'attendez pas : le froid, le chauffage à fond ou une simple route abîmée suffisent à transformer un impact en fissure." },
      { titre: "Qui paie ? Le rôle de votre assurance" },
      "Le remplacement d'un pare-brise est pris en charge par la garantie « bris de glace » ou « bris de vitrage », incluse dans les formules omnium (partielle ou complète) ou ajoutée en option à une RC auto. Vérifiez votre contrat ou demandez à votre courtier.",
      "Votre contrat peut prévoir une franchise, c'est-à-dire un montant qui reste normalement à votre charge. Chez B MATIC, la franchise est offerte : vous n'avez rien à avancer, nous traitons directement avec votre assureur.",
      { titre: "Vous choisissez librement votre réparateur" },
      "Votre assureur peut vous proposer un réseau de réparateurs agréés, mais vous restez libre de choisir le professionnel qui remplace votre pare-brise. Il suffit de nous communiquer le nom de votre assurance : nous nous occupons des démarches.",
      { titre: "Comment se passe le remplacement chez B MATIC" },
      {
        liste: [
          `Au centre d'Ans (${pareBriseHoraires.texte}) ou à votre domicile, à votre travail, à Liège et jusqu'à ${pareBriseRayonKm} km autour.`,
          "Vitrage homologué selon la norme européenne ECE R43. Votre voiture a une caméra d'aide à la conduite derrière le pare-brise ? Le recalibrage est inclus après le remplacement.",
          "Franchise offerte et 0 € à avancer.",
          `En plus, un cadeau au choix : ${cadeaux}.`,
        ],
      },
      { aSavoir: "Un devis écrit vous est remis avant toute intervention. La prise en charge dépend de votre contrat et de l'accord de votre assureur." },
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "impact-pare-brise-reparer-ou-remplacer",
    titre: "Impact sur le pare-brise : réparer ou remplacer ?",
    extrait:
      "Taille, emplacement, fissure : comment savoir si un impact peut être réparé, et les bons gestes en attendant le rendez-vous.",
    categorie: "Impact",
    publie: "2026-10-29",
    icon: Target,
    cta: { label: "Faire vérifier mon impact", to: RDV_PATH },
    contenu: [
      "Un gravillon projeté par le camion de devant, un petit « clac » et une étoile apparaît sur le pare-brise. Tant qu'elle reste petite, on peut souvent la réparer. Mais un impact ne guérit jamais tout seul : avec les vibrations et les écarts de température, il finit presque toujours par s'étendre.",
      { titre: "Quand un impact peut être réparé" },
      {
        liste: [
          "Il est plus petit qu'une pièce de 2 €.",
          "Il est situé hors du champ de vision direct du conducteur.",
          "Il est éloigné des bords du pare-brise, où le verre travaille davantage.",
          "Il ne s'est pas encore transformé en fissure.",
        ],
      },
      "La réparation consiste à injecter une résine dans l'impact, puis à la durcir : le verre retrouve sa solidité et l'impact devient beaucoup moins visible. L'intervention est rapide et le pare-brise d'origine est conservé.",
      { titre: "Quand il faut remplacer" },
      "Dès qu'une fissure part de l'impact, ou si l'impact est trop grand, trop près du bord ou en plein champ de vision, le remplacement s'impose. Un pare-brise fragilisé protège moins bien en cas d'accident : il participe à la rigidité de l'habitacle et sert d'appui à l'airbag passager.",
      { titre: "Les bons gestes en attendant" },
      {
        liste: [
          "Couvrez l'impact avec un morceau de ruban adhésif transparent pour éviter que la poussière et l'humidité ne s'y logent.",
          "Évitez les chocs thermiques : pas d'air chaud dirigé sur un pare-brise gelé, pas d'eau chaude pour dégivrer.",
          "Fermez les portières sans les claquer et ralentissez sur les routes abîmées.",
        ],
      },
      { aSavoir: "Vous ne savez pas si votre impact est réparable ? Choisissez « Je ne sais pas » en demandant votre devis : nous le vérifions avant toute intervention." },
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "recalibrage-camera-pare-brise",
    titre: "Recalibrer la caméra après un remplacement de pare-brise",
    extrait:
      "Freinage d'urgence, maintien dans la voie, lecture des panneaux : ce que change le remplacement du pare-brise sur une voiture récente.",
    categorie: "Caméra",
    publie: "2026-10-29",
    icon: ScanEye,
    cta: { label: "Demander mon devis", to: RDV_PATH },
    contenu: [
      "Sur beaucoup de voitures récentes, une caméra est fixée derrière le pare-brise, au niveau du rétroviseur intérieur. Elle « regarde » la route pour les aides à la conduite : freinage d'urgence automatique, alerte et maintien dans la voie, lecture des panneaux de vitesse, feux de route automatiques…",
      { titre: "Pourquoi le remplacement change tout" },
      "La caméra est calibrée pour un angle de vue précis à travers le verre. Après un remplacement, sa position par rapport à la route peut varier de quelques fractions de degré, ce qui suffit à fausser l'estimation des distances ou la position des lignes. Il faut donc la recalibrer pour qu'elle voie de nouveau la route exactement comme à la sortie d'usine.",
      { titre: "Comment se passe le recalibrage" },
      {
        liste: [
          "Calibrage statique : la voiture est immobile, face à des cibles placées à des distances précises.",
          "Calibrage dynamique : la caméra se réaligne en roulant, dans des conditions définies par le constructeur.",
          "Certains modèles demandent les deux. La méthode dépend de la marque et du modèle.",
        ],
      },
      { aSavoir: "Depuis juillet 2024, toutes les voitures neuves immatriculées dans l'Union européenne doivent être équipées de plusieurs aides à la conduite. Une caméra derrière le pare-brise devient donc la règle, pas l'exception." },
      { titre: "Chez B MATIC" },
      "Si votre véhicule est équipé d'aides à la conduite, le recalibrage de la caméra est inclus dans le remplacement du pare-brise. Indiquez simplement votre véhicule en demandant votre devis : nous commandons le vitrage compatible avec votre caméra.",
    ],
  },

  // --------------------------------------------------------------------------
  {
    slug: "vitre-laterale-lunette-arriere-cassee",
    titre: "Vitre latérale ou lunette arrière cassée : que faire ?",
    extrait:
      "Vitre brisée par un vol, un choc ou le gel : sécuriser la voiture, prévenir l'assurance et faire remplacer le vitrage sans tarder.",
    categorie: "Vitres",
    publie: "2026-10-29",
    icon: Car,
    cta: { label: "Faire remplacer ma vitre", to: RDV_PATH },
    contenu: [
      "Contrairement au pare-brise, les vitres latérales et la lunette arrière sont le plus souvent en verre trempé : au moindre choc, elles éclatent en milliers de petits morceaux. Elles ne se réparent pas, elles se remplacent.",
      { titre: "Les premiers gestes" },
      {
        liste: [
          "Ramassez les éclats sur les sièges et le tapis avec précaution (gants, aspirateur) : ils se glissent partout.",
          "Protégez l'ouverture avec un film plastique épais et du ruban adhésif pour garder l'habitacle au sec.",
          "Ne laissez rien de visible dans la voiture et garez-la de préférence dans un endroit fermé.",
        ],
      },
      { titre: "Vol ou vandalisme : prévenez la police" },
      "Si la vitre a été brisée lors d'un vol ou d'un acte de vandalisme, faites une déclaration à la police. Votre assureur peut vous demander le numéro du procès-verbal pour traiter le dossier.",
      { titre: "Qui paie ?" },
      "Le remplacement d'une vitre latérale ou de la lunette arrière est en général couvert par la garantie bris de glace ou bris de vitrage (omnium ou option). Pour un toit ouvrant ou panoramique, la couverture varie davantage selon le contrat : vérifiez vos conditions ou demandez-nous, nous vérifions avec votre assureur.",
      { aSavoir: "La lunette arrière intègre souvent le dégivrage et parfois l'antenne radio : le vitrage de remplacement reprend les mêmes fonctions." },
      { titre: "Chez B MATIC" },
      `Nous remplaçons les vitres latérales, la lunette arrière et le toit ouvrant ou panoramique, au centre d'Ans ou chez vous, à Liège et jusqu'à ${pareBriseRayonKm} km autour. Nous nous occupons des démarches avec votre assurance.`,
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
