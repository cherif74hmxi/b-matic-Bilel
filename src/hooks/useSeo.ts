// ============================================================================
//  useSeo — petit hook maison de référencement (SEO)
// ----------------------------------------------------------------------------
//  Met à jour le <title>, la meta description, le lien canonique, les balises
//  de partage (Open Graph / Twitter) et, en option, un bloc de données
//  structurées JSON-LD (schema.org) pour la page courante.
//  Le premier affichage vient déjà du pré-rendu (vite-plugin-seo.ts) : ce hook
//  prend le relais lors de la navigation dans le site.
//  Volontairement SANS dépendance externe (pas de react-helmet-async).
//
//  Utilisation :
//    useSeo({
//      title: "Pare-brise & Assurances — B MATIC",
//      description: "Remplacement de pare-brise pris en charge par votre assurance…",
//      canonical: "https://www.bmatic.be/pare-brise", // facultatif (défaut : page courante)
//      image: "/og-image.jpg",                         // facultatif (aperçu de partage)
//      jsonLd: { "@context": "https://schema.org", "@type": "FAQPage", … },     // facultatif
//    });
//
//  Au démontage du composant, le hook restaure le titre précédent et retire le
//  bloc JSON-LD qu'il a injecté, afin d'éviter les fuites entre pages.
// ============================================================================
import { useEffect } from "react";
import { absoluteUrl } from "@/lib/site";

const DEFAULT_IMAGE = "/og-image.jpg";

interface SeoOptions {
  title: string;
  description?: string;
  /** URL canonique absolue de la page (défaut : adresse courante sans paramètres). */
  canonical?: string;
  /** Image de partage, chemin ou URL absolue (défaut : /og-image.jpg). */
  image?: string;
  /** og:type : "website" (défaut) ou "article". */
  type?: string;
  /** Page à ne pas indexer (404, contenu introuvable). */
  noindex?: boolean;
  /** Objet JSON-LD schema.org à injecter (facultatif). */
  jsonLd?: Record<string, unknown>;
}

/** Récupère (ou crée) une balise <meta> par son attribut name (ou property pour Open Graph). */
function ensureMeta(name: string, attr: "name" | "property" = "name"): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  return el;
}

/** Récupère (ou crée) la balise <link rel="canonical">. */
function ensureCanonical(): HTMLLinkElement {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  return el;
}

export function useSeo({ title, description, canonical, image, type = "website", noindex, jsonLd }: SeoOptions) {
  // On sérialise le JSON-LD : la chaîne sert de dépendance stable au useEffect
  // (un objet passé en ligne change de référence à chaque rendu).
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;
    const url = canonical ?? absoluteUrl(window.location.pathname);
    const imageUrl = /^https?:/.test(image ?? "") ? image! : absoluteUrl(image ?? DEFAULT_IMAGE);

    ensureCanonical().setAttribute("href", url);
    ensureMeta("og:title", "property").setAttribute("content", title);
    ensureMeta("twitter:title").setAttribute("content", title);
    ensureMeta("og:url", "property").setAttribute("content", url);
    ensureMeta("og:type", "property").setAttribute("content", type);
    ensureMeta("og:image", "property").setAttribute("content", imageUrl);
    ensureMeta("twitter:image").setAttribute("content", imageUrl);
    if (description !== undefined) {
      ensureMeta("description").setAttribute("content", description);
      ensureMeta("og:description", "property").setAttribute("content", description);
      ensureMeta("twitter:description").setAttribute("content", description);
    }

    // Une seule balise robots gérée ici (l'admin passe par useNoIndex).
    const robots = noindex ? ensureMeta("robots") : null;
    const previousRobots = robots?.getAttribute("content") ?? null;
    robots?.setAttribute("content", "noindex, follow");

    // Données structurées : on crée notre propre <script> pour pouvoir le retirer proprement.
    // Le JSON-LD du pré-rendu est retiré au premier passage pour éviter les doublons.
    document.head.querySelectorAll('script[type="application/ld+json"]:not([data-seo])').forEach((el) => el.remove());
    let script: HTMLScriptElement | null = null;
    if (jsonLdStr) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seo = "";
      script.textContent = jsonLdStr;
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      if (script) script.remove();
      if (robots) {
        if (previousRobots === null) robots.remove();
        else robots.setAttribute("content", previousRobots);
      }
    };
  }, [title, description, canonical, image, type, noindex, jsonLdStr]);
}

/**
 * Interdit l'indexation de la page courante (<meta name="robots" content="noindex, nofollow">).
 * Utilisé par l'espace admin. Au démontage, la valeur précédente est restaurée.
 * (Ne pas bloquer /admin dans robots.txt : Google ne verrait plus cette balise.)
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = ensureMeta("robots");
    const previous = meta.getAttribute("content");
    meta.setAttribute("content", "noindex, nofollow");
    return () => {
      if (previous === null) meta.remove();
      else meta.setAttribute("content", previous);
    };
  }, []);
}

export default useSeo;
