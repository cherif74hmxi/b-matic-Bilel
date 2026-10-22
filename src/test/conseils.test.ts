import { describe, it, expect } from "vitest";
import { conseils, conseilsLies, findConseil, tempsDeLecture } from "@/data/conseils";

describe("data/conseils", () => {
  it("expose au moins 5 articles", () => {
    expect(conseils.length).toBeGreaterThanOrEqual(5);
  });

  it("a des slugs uniques et non vides", () => {
    const slugs = conseils.map((c) => c.slug);
    expect(slugs.every((s) => s.length > 0)).toBe(true);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("findConseil retrouve un article par son slug", () => {
    const premier = conseils[0];
    expect(findConseil(premier.slug)).toBe(premier);
  });

  it("findConseil renvoie undefined pour un slug inconnu", () => {
    expect(findConseil("slug-inexistant")).toBeUndefined();
  });

  it("chaque article a un titre, un extrait et du contenu", () => {
    for (const c of conseils) {
      expect(c.titre.trim().length).toBeGreaterThan(0);
      expect(c.extrait.trim().length).toBeGreaterThan(0);
      expect(c.contenu.length).toBeGreaterThan(0);
    }
  });

  it("dates au format AAAA-MM-JJ, slugs d'URL valides, pas de mention « À CONFIRMER »", () => {
    for (const c of conseils) {
      expect(c.publie).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(JSON.stringify(c.contenu)).not.toMatch(/À CONFIRMER/);
      expect(tempsDeLecture(c)).toBeGreaterThanOrEqual(1);
    }
  });

  it("conseilsLies exclut l'article courant", () => {
    const lies = conseilsLies(conseils[0].slug);
    expect(lies).toHaveLength(3);
    expect(lies.map((c) => c.slug)).not.toContain(conseils[0].slug);
  });
});
