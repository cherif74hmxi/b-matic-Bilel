import { describe, expect, it } from "vitest";
import { PUBLIC_PATHS, isAppPath } from "@/lib/routes";
import { pagesSeo } from "@/data/seo";
import { notFoundMeta } from "@/seo/pages";

describe("routes — vrai 404 côté serveur", () => {
  it("pages fixes et espace admin : servies en 200", () => {
    for (const p of ["/", "/pare-brise", "/rendez-vous", "/contact", "/contact/", "/conseils", "/actualites",
      "/mentions-legales", "/politique-de-confidentialite", "/a-propos", "/admin", "/admin/agenda"]) {
      expect(isAppPath(p), p).toBe(true);
    }
  });

  it("adresses inconnues : 404 (les pages à slug passent par le pré-rendu ou la fonction avant)", () => {
    for (const p of ["/wp-login.php", "/pare-brise/xyz", "/conseils/article-inexistant", "/administration", "/conseils/:slug"]) {
      expect(isAppPath(p), p).toBe(false);
    }
  });

  it("chaque page référencée (SEO) est une route de l'application", () => {
    for (const path of Object.keys(pagesSeo)) expect(PUBLIC_PATHS as readonly string[]).toContain(path);
  });

  it("page 404 pré-rendue : noindex et sans URL canonique", () => {
    const meta = notFoundMeta();
    expect(meta.noindex).toBe(true);
    expect(meta.url).toBeUndefined();
    expect(meta.title).toMatch(/introuvable/i);
  });
});
