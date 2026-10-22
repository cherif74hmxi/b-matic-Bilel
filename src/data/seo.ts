// ============================================================================
//  B MATIC — Titres et descriptions des pages (référencement)
// ----------------------------------------------------------------------------
//  Un titre et une description UNIQUES par page. Ils servent :
//    · dans l'onglet du navigateur et sur Google ;
//    · dans l'aperçu quand on partage le lien (WhatsApp, Facebook…), grâce au
//      pré-rendu du build (vite-plugin-seo.ts).
//  Titre : ~60 caractères max. Description : ~155 caractères max.
//
//  Certaines pages ont leurs textes dans leur propre fichier de données
//  (pare-brise, reprise, véhicules, actualités) : ils sont repris ici.
// ============================================================================
import { pareBriseSeo } from "@/data/parebrise";
import { repriseSeo } from "@/data/reprise";
import { occasionsSeo } from "@/data/occasions";
import { actualitesSeo } from "@/data/actualites";

export interface PageSeo {
  title: string;
  description: string;
}

export const pagesSeo = {
  "/": {
    title: "B MATIC — Garage automobile à Ans (Liège) | Pare-brise, mécanique",
    description:
      "Garage B MATIC à Ans (Liège) : pare-brise pris en charge par l'assurance, franchise offerte, entretien à prix ferme, reprise de véhicules, dépannage 24h/24.",
  },
  "/mecanique": {
    title: "Prendre rendez-vous au garage — entretien, freins | B MATIC Ans",
    description:
      "Réservez en ligne votre créneau chez B MATIC à Ans : entretien, vidange, freins, diagnostic, pare-brise, detailing. 7j/7 de 10h à 19h, paiement sur place.",
  },
  "/depannage": {
    title: "Dépannage et remorquage 24h/24 à Liège | B MATIC",
    description:
      "Panne ou accident ? B MATIC assure le dépannage et le remorquage 24h/24 et 7j/7 depuis Ans, dans la région de Liège. Un appel suffit.",
  },
  "/conseils": {
    title: "Conseils auto : entretien, pare-brise, pneus, panne | B MATIC",
    description:
      "Conseils pratiques de B MATIC (Ans, Liège) : pare-brise et assurance, entretien, freins, voyants, hiver, pneus, panne et vente de voiture en Belgique.",
  },
  "/a-propos": {
    title: "À propos du garage B MATIC à Ans (Liège)",
    description:
      "Découvrez B MATIC, garage automobile à Ans près de Liège : mécanique, pare-brise, reprise de véhicules et dépannage, avec une équipe disponible 7j/7.",
  },
  "/contact": {
    title: "Contact et accès — garage B MATIC à Ans (Liège)",
    description:
      "Contactez B MATIC par téléphone, WhatsApp ou formulaire. Garage situé avenue de l'Énergie à Ans, près de Liège, ouvert 7j/7 de 10h à 19h.",
  },
  "/mentions-legales": {
    title: "Mentions légales | B MATIC",
    description: "Mentions légales du site B MATIC : éditeur, numéro d'entreprise, hébergeur et conditions d'utilisation.",
  },
  "/politique-de-confidentialite": {
    title: "Politique de confidentialité | B MATIC",
    description:
      "Comment B MATIC traite vos données personnelles : finalités, durées de conservation, sous-traitants et vos droits (RGPD).",
  },
  "/pare-brise": { title: pareBriseSeo.title, description: pareBriseSeo.description },
  "/reprise": repriseSeo,
  "/vehicules": occasionsSeo,
  "/actualites": actualitesSeo,
} satisfies Record<string, PageSeo>;

export type StaticPath = keyof typeof pagesSeo;

/** Page introuvable (non indexée). */
export const notFoundSeo: PageSeo = {
  title: "Page introuvable | B MATIC",
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos services depuis l'accueil.",
};
