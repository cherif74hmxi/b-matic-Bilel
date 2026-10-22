// ============================================================================
//  Pages pré-rendues au build (vite-plugin-seo.ts) et sitemap des pages fixes
// ----------------------------------------------------------------------------
//  Chaque entrée devient un fichier HTML dont le <head> contient déjà le bon
//  titre, la description, l'aperçu de partage et les données structurées.
//  Véhicules et actualités (contenu en base) : voir api/share.ts et
//  api/sitemap-annonces.ts.
// ============================================================================
import type { HeadMeta } from "../../api/_lib/head";
import { pagesSeo, type StaticPath } from "@/data/seo";
import { conseils } from "@/data/conseils";
import { absoluteUrl, siteUrl } from "@/lib/site";
import {
  OG_IMAGE,
  accueilJsonLd,
  conseilJsonLd,
  conseilsJsonLd,
  contactJsonLd,
  depannageJsonLd,
  pareBriseJsonLd,
} from "@/seo/schema";

export interface PrerenderPage {
  path: string;
  meta: HeadMeta;
  /** Date de dernière modification connue (sitemap), « AAAA-MM-JJ ». */
  lastmod?: string;
}

const JSON_LD: Partial<Record<StaticPath, () => unknown>> = {
  "/": accueilJsonLd,
  "/contact": contactJsonLd,
  "/depannage": depannageJsonLd,
  "/pare-brise": pareBriseJsonLd,
  "/conseils": conseilsJsonLd,
};

/** URL absolue, ou rien si l'adresse du site est inconnue (build local) : pas de canonical relatif. */
const pageUrl = (path: string) => (siteUrl ? absoluteUrl(path) : undefined);

export function prerenderPages(): PrerenderPage[] {
  const fixes = (Object.keys(pagesSeo) as StaticPath[]).map((path) => ({
    path,
    meta: {
      ...pagesSeo[path],
      url: pageUrl(path),
      image: absoluteUrl(OG_IMAGE),
      jsonLd: JSON_LD[path]?.(),
    },
  }));
  const articles = conseils.map((c) => ({
    path: `/conseils/${c.slug}`,
    lastmod: c.misAJour ?? c.publie,
    meta: {
      title: `${c.titre} | B MATIC`,
      description: c.extrait,
      url: pageUrl(`/conseils/${c.slug}`),
      image: absoluteUrl(c.image ?? OG_IMAGE),
      type: "article",
      jsonLd: conseilJsonLd(c),
    },
  }));
  return [...fixes, ...articles];
}
