// ============================================================================
//  Données structurées schema.org (JSON-LD), construites depuis src/data/*
// ----------------------------------------------------------------------------
//  Utilisées par les pages (via useSeo) ET par le pré-rendu du build : une
//  seule source, aucun texte en double.
//  Le garage (AutoRepair) a un @id stable : les autres blocs (services,
//  articles) y font référence au lieu de le répéter.
// ============================================================================
import { legalInfo } from "@/data/legal";
import { horaires } from "@/data/horaires";
import { pareBriseFaq, pareBriseLieu, pareBriseRayonKm, pareBriseSeo } from "@/data/parebrise";
import { faqItems } from "@/data/faq";
import { conseils, conseilTexte, type Conseil } from "@/data/conseils";
import { pagesSeo } from "@/data/seo";
import { absoluteUrl } from "@/lib/site";

const CONTEXT = "https://schema.org";
const TOUS_LES_JOURS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const garageId = () => absoluteUrl("/#garage");
export const OG_IMAGE = "/og-image.jpg";
export const LOGO = "/logo.png";

const adresse = () => ({
  "@type": "PostalAddress",
  streetAddress: legalInfo.addressParts.street,
  postalCode: legalInfo.addressParts.postalCode,
  addressLocality: legalInfo.addressParts.city,
  addressRegion: legalInfo.addressParts.region,
  addressCountry: legalInfo.addressParts.country,
});

/**
 * Le garage : centre ouvert 7j/7 de 10h à 19h (src/data/horaires.ts).
 * Le dépannage 24h/24 est un service distinct (depannageJsonLd), jamais
 * mélangé aux horaires d'ouverture du centre.
 */
export const garageJsonLd = () => ({
  "@type": "AutoRepair",
  "@id": garageId(),
  name: legalInfo.siteName,
  legalName: legalInfo.companyName,
  vatID: legalInfo.vat,
  url: absoluteUrl("/"),
  logo: absoluteUrl(LOGO),
  image: absoluteUrl(OG_IMAGE),
  telephone: legalInfo.phone,
  email: legalInfo.email,
  address: adresse(),
  areaServed: { "@type": "City", name: "Liège" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: TOUS_LES_JOURS,
      opens: horaires.centre.ouverture,
      closes: horaires.centre.fermeture,
    },
  ],
});

const garageRef = () => ({ "@id": garageId() });

/** Accueil : le site + le garage. */
export const accueilJsonLd = () => ({
  "@context": CONTEXT,
  "@graph": [
    {
      "@type": "WebSite",
      name: legalInfo.siteName,
      url: absoluteUrl("/"),
      inLanguage: "fr-BE",
      publisher: garageRef(),
    },
    garageJsonLd(),
  ],
});

/** Contact : page de contact + le garage. */
export const contactJsonLd = () => ({
  "@context": CONTEXT,
  "@graph": [
    { "@type": "ContactPage", url: absoluteUrl("/contact"), name: pagesSeo["/contact"].title, about: garageRef() },
    garageJsonLd(),
  ],
});

/** Dépannage : service disponible 24h/24, 7j/7. */
export const depannageJsonLd = () => ({
  "@context": CONTEXT,
  "@graph": [
    {
      "@type": "Service",
      name: "Dépannage et remorquage 24h/24",
      serviceType: "Dépannage automobile",
      description: pagesSeo["/depannage"].description,
      provider: garageRef(),
      areaServed: { "@type": "City", name: "Liège" },
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: TOUS_LES_JOURS,
        opens: "00:00",
        closes: "23:59",
      },
    },
    garageJsonLd(),
  ],
});

/** Pare-brise : le service (avec sa zone d'intervention) + la FAQ. */
export const pareBriseJsonLd = () => ({
  "@context": CONTEXT,
  "@graph": [
    {
      "@type": "Service",
      name: pareBriseSeo.serviceName,
      serviceType: "Remplacement de pare-brise",
      description: pareBriseSeo.description,
      provider: garageRef(),
      areaServed: [
        ...pareBriseLieu.villes.map((name) => ({ "@type": "City", name })),
        {
          "@type": "GeoCircle",
          geoMidpoint: { "@type": "GeoCoordinates", latitude: 50.6326, longitude: 5.5797 }, // Liège
          geoRadius: pareBriseRayonKm * 1000,
        },
      ],
    },
    garageJsonLd(),
    {
      "@type": "FAQPage",
      mainEntity: pareBriseFaq.map((q) => ({
        "@type": "Question",
        name: q.question,
        acceptedAnswer: { "@type": "Answer", text: q.reponse },
      })),
    },
  ],
});

/** Conseils : liste des articles + FAQ (balisage FAQPage conservé). */
export const conseilsJsonLd = () => ({
  "@context": CONTEXT,
  "@graph": [
    {
      "@type": "ItemList",
      name: "Conseils auto B MATIC",
      itemListElement: conseils.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.titre,
        url: absoluteUrl(`/conseils/${c.slug}`),
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.reponse },
      })),
    },
  ],
});

/** Article de conseil + fil d'Ariane. */
export const conseilJsonLd = (c: Conseil) => {
  const url = absoluteUrl(`/conseils/${c.slug}`);
  const texte = conseilTexte(c);
  const editeur = {
    "@type": "Organization",
    "@id": garageId(),
    name: legalInfo.siteName,
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl(LOGO) },
  };
  return {
    "@context": CONTEXT,
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: c.titre,
        description: c.extrait,
        articleSection: c.categorie,
        articleBody: texte,
        wordCount: texte.split(/\s+/).filter(Boolean).length,
        inLanguage: "fr-BE",
        datePublished: c.publie,
        dateModified: c.misAJour ?? c.publie,
        image: absoluteUrl(c.image ?? OG_IMAGE),
        mainEntityOfPage: url,
        url,
        author: editeur,
        publisher: editeur,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Conseils", item: absoluteUrl("/conseils") },
          { "@type": "ListItem", position: 3, name: c.titre, item: url },
        ],
      },
    ],
  };
};
