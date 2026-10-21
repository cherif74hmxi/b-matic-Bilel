// ============================================================================
//  useSeo — petit hook maison de référencement (SEO)
// ----------------------------------------------------------------------------
//  Met à jour le <title>, la meta description, le lien canonique et, en option,
//  un bloc de données structurées JSON-LD (schema.org) pour la page courante.
//  Volontairement SANS dépendance externe (pas de react-helmet-async).
//
//  Utilisation :
//    useSeo({
//      title: "Pare-brise & Assurances — B MATIC",
//      description: "Remplacement de pare-brise pris en charge par votre assurance…",
//      canonical: "https://www.bmatic.be/pare-brise-assurances", // facultatif
//      jsonLd: { "@context": "https://schema.org", "@type": "FAQPage", … },     // facultatif
//    });
//
//  Au démontage du composant, le hook restaure le titre précédent et retire le
//  bloc JSON-LD qu'il a injecté, afin d'éviter les fuites entre pages.
// ============================================================================
import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  /** URL canonique absolue de la page (facultatif). */
  canonical?: string;
  /** Objet JSON-LD schema.org à injecter (facultatif). */
  jsonLd?: Record<string, unknown>;
}

/** Récupère (ou crée) une balise <meta> par son attribut name. */
function ensureMeta(name: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
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

export function useSeo({ title, description, canonical, jsonLd }: SeoOptions) {
  // On sérialise le JSON-LD : la chaîne sert de dépendance stable au useEffect
  // (un objet passé en ligne change de référence à chaque rendu).
  const jsonLdStr = jsonLd ? JSON.stringify(jsonLd) : undefined;

  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    if (description !== undefined) {
      ensureMeta("description").setAttribute("content", description);
    }

    if (canonical !== undefined) {
      ensureCanonical().setAttribute("href", canonical);
    }

    // Données structurées : on crée notre propre <script> pour pouvoir le retirer proprement.
    let script: HTMLScriptElement | null = null;
    if (jsonLdStr) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = jsonLdStr;
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      if (script) script.remove();
    };
  }, [title, description, canonical, jsonLdStr]);
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
