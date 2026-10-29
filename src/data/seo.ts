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
//  (pare-brise, actualités) : ils sont repris ici.
// ============================================================================
import { pareBriseSeo } from "@/data/parebrise";
import { actualitesSeo } from "@/data/actualites";
import { RDV_PATH } from "@/data/rdv";

export interface PageSeo {
  title: string;
  description: string;
}

export const pagesSeo = {
  "/": {
    title: "B MATIC — Pare-brise à Ans (Liège) | Franchise offerte + cadeau",
    description:
      "B MATIC, spécialiste pare-brise à Ans (Liège) : franchise offerte, 0 € à avancer, toutes assurances, jusqu'à 300 € ou un cadeau. Au centre ou à domicile, 7j/7.",
  },
  [RDV_PATH]: {
    title: "Devis et rendez-vous pare-brise en ligne | B MATIC Ans (Liège)",
    description:
      "Demandez votre devis pare-brise et réservez votre créneau en 2 minutes : réparation d'impact, remplacement, vitres. Au centre à Ans ou chez vous, 7j/7.",
  },
  "/conseils": {
    title: "Conseils pare-brise : impact, remplacement, assurance | B MATIC",
    description:
      "Conseils de B MATIC (Ans, Liège) : réparer un impact ou remplacer le pare-brise, recalibrage de caméra, vitres latérales et prise en charge par l'assurance.",
  },
  "/a-propos": {
    title: "À propos de B MATIC, spécialiste pare-brise à Ans (Liège)",
    description:
      "Découvrez B MATIC, centre pare-brise à Ans près de Liège : remplacement et réparation de vitrages, au centre ou à domicile, avec une équipe disponible 7j/7.",
  },
  "/contact": {
    title: "Contact et accès — B MATIC pare-brise à Ans (Liège)",
    description:
      "Contactez B MATIC par téléphone, WhatsApp ou formulaire. Centre pare-brise avenue de l'Énergie à Ans, près de Liège, ouvert 7j/7 de 10h à 19h.",
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
  "/actualites": actualitesSeo,
} satisfies Record<string, PageSeo>;

export type StaticPath = keyof typeof pagesSeo;

/** Page introuvable (non indexée). */
export const notFoundSeo: PageSeo = {
  title: "Page introuvable | B MATIC",
  description: "Cette page n'existe pas ou a été déplacée. Retrouvez l'offre pare-brise depuis l'accueil.",
};
