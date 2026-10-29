import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, currentTheme, THEME_COLORS, THEME_STORAGE_KEY } from "@/lib/theme";

describe("thème clair / sombre", () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme;
    localStorage.clear();
  });

  it("clair par défaut", () => {
    expect(currentTheme()).toBe("clair");
  });

  it("applique et mémorise le choix", () => {
    applyTheme("sombre");
    expect(document.documentElement.dataset.theme).toBe("sombre");
    expect(currentTheme()).toBe("sombre");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("sombre");
    applyTheme("clair");
    expect(document.documentElement.dataset.theme).toBeUndefined();
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("clair");
  });

  it("le script anti-flash de index.html utilise la même clé et les mêmes couleurs", () => {
    const html = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
    expect(html).toContain(`localStorage.getItem("${THEME_STORAGE_KEY}") === "sombre"`);
    expect(html).toContain(`"${THEME_COLORS.sombre}"`);
    expect(html).toContain(`<meta name="theme-color" content="${THEME_COLORS.clair}" />`);
  });
});
