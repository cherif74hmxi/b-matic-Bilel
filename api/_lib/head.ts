// ============================================================================
//  Balises SEO du <head> (titre, description, canonical, Open Graph, JSON-LD)
// ----------------------------------------------------------------------------
//  Utilisé AVANT l'exécution de React, là où les robots de partage (Facebook,
//  WhatsApp, LinkedIn…) lisent la page sans JavaScript :
//    · au build : pré-rendu des pages fixes (vite-plugin-seo.ts) ;
//    · à la demande : fonction Vercel api/share.ts (véhicules, actualités).
//  Une fois la page chargée, src/hooks/useSeo.ts prend le relais.
//
//  index.html délimite le bloc remplacé par <!--seo--> … <!--/seo-->.
//  Aucune dépendance et aucun alias « @/ » : ce fichier tourne aussi sur Vercel.
// ============================================================================

export interface HeadMeta {
  title: string;
  description: string;
  /** URL absolue de la page (canonical + og:url). */
  url?: string;
  /** URL absolue de l'image de partage (1200×630 conseillé). */
  image?: string;
  /** og:type : "website" par défaut, "article" pour un article. */
  type?: string;
  /** Données structurées schema.org (un objet ou un @graph). */
  jsonLd?: unknown;
  /** Page à ne pas indexer (404…). */
  noindex?: boolean;
}

export const SITE_NAME = "B MATIC";

const escapeAttr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** JSON-LD sûr dans un <script> (pas de « </script> » possible). */
export const jsonLdScript = (data: unknown) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;

/** Bloc de balises à placer entre <!--seo--> et <!--/seo-->. */
export function headTags(m: HeadMeta): string {
  const t = escapeAttr(m.title);
  const d = escapeAttr(m.description);
  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    m.noindex ? `<meta name="robots" content="noindex, follow" />` : "",
    m.url ? `<link rel="canonical" href="${escapeAttr(m.url)}" />` : "",
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:locale" content="fr_BE" />`,
    `<meta property="og:type" content="${escapeAttr(m.type ?? "website")}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    m.url ? `<meta property="og:url" content="${escapeAttr(m.url)}" />` : "",
    m.image ? `<meta property="og:image" content="${escapeAttr(m.image)}" />` : "",
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    m.image ? `<meta name="twitter:image" content="${escapeAttr(m.image)}" />` : "",
    m.jsonLd ? jsonLdScript(m.jsonLd) : "",
  ];
  return tags.filter(Boolean).join("\n    ");
}

/** Remplace le bloc <!--seo-->…<!--/seo--> du gabarit HTML. */
export function injectHead(html: string, m: HeadMeta): string {
  const block = `<!--seo-->\n    ${headTags(m)}\n    <!--/seo-->`;
  return /<!--seo-->[\s\S]*?<!--\/seo-->/.test(html)
    ? html.replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, () => block)
    : html.replace("</head>", () => `    ${block}\n  </head>`);
}

/** Texte court pour une meta description (≈ 155 caractères, coupé au mot). */
export function clipDescription(text: string, max = 155): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length)}…`;
}
