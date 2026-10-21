import { describe, it, expect } from "vitest";
import { conseils, findConseil } from "@/data/conseils";

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
});
