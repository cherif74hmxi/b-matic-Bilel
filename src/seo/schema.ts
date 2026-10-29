// ============================================================================
//  Données structurées schema.org (JSON-LD), construites depuis src/data/*
// ----------------------------------------------------------------------------
//  Utilisées par les pages (via useSeo) ET par le pré-rendu du build : une
//  seule source, aucun texte en double.
//  Le centre a un @id stable : les autres blocs (services, articles) y font
//  référence au lieu de le répéter. schema.org n'a pas de type « AutoGlass » :
//  on garde AutoRepair (sous-type d'AutomotiveBusiness) avec le catalogue des
//  vitrages traités. La catégorie Google « Vitrier auto » se règle dans la
//  fiche Google Business Profile.
// ============================================================================
import { legalInfo } from "@/data/legal";
import { horaires } from "@/data/horaires";
import { pareBriseFaq, pareBriseLieu, pareBrisePrestations, pareBriseRayonKm, pareBriseSeo } from "@/data/parebrise";
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

/** Zone d'intervention : les villes citées + un cercle de 70 km autour de Liège. */
const zoneServie = () => [
  ...pareBriseLieu.villes.map((name) => ({ "@type": "City", name })),
  {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 50.6326, longitude: 5.5797 }, // Liège
    geoRadius: pareBriseRayonKm * 1000,
  },
];

/** Le centre pare-brise : ouvert 7j/7 de 10h à 19h (src/data/horaires.ts). */
export const garageJsonLd = () => ({
  "@type": "AutoRepair",
  "@id": garageId(),
  name: legalInfo.siteName,
  description: pagesSeo["/"].description,
  legalName: legalInfo.companyName,
  vatID: legalInfo.vat,
  url: absoluteUrl("/"),
  logo: absoluteUrl(LOGO),
  image: absoluteUrl(OG_IMAGE),
  telephone: legalInfo.phone,
  email: legalInfo.email,
  address: adresse(),
  areaServed: zoneServie(),
  knowsAbout: ["Pare-brise", "Vitrage automobile", "Bris de glace"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Vitrage automobile",
    itemListElement: pareBrisePrestations.map((name) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name, serviceType: "Vitrage automobile" },
    })),
  },
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

/** Le service pare-brise (offre phare), repris par l'accueil et la page pare-brise. */
const pareBriseService = () => ({
  "@type": "Service",
  name: pareBriseSeo.serviceName,
  serviceType: "Remplacement de pare-brise",
  description: pareBriseSeo.description,
  provider: garageRef(),
  areaServed: zoneServie(),
});

/** Accueil : le site + le centre + le service pare-brise. */
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
    pareBriseService(),
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

/** Pare-brise : le service (avec sa zone d'intervention) + la FAQ. */
export const pareBriseJsonLd = () => ({
  "@context": CONTEXT,
  "@graph": [
    pareBriseService(),
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
      name: "Conseils pare-brise B MATIC",
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
        image: absoluteUrl(c.image ? `${c.image.src}.jpg` : OG_IMAGE),
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
