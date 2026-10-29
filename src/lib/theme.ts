// ============================================================================
//  Thème d'affichage clair / sombre
// ----------------------------------------------------------------------------
//  Préférence d'affichage (pas du suivi) : mémorisée dans localStorage, sans
//  consentement. Clair par défaut. Le script en tête de index.html applique le
//  thème mémorisé AVANT le premier affichage (pas de flash) : il utilise la
//  même clé et les mêmes couleurs que ce fichier (vérifié par src/test/theme.test.ts).
// ============================================================================

export type Theme = "clair" | "sombre";

export const THEME_STORAGE_KEY = "bmatic-theme";

/** Couleur de la barre du navigateur mobile (<meta name="theme-color">). */
export const THEME_COLORS: Record<Theme, string> = { clair: "#ffffff", sombre: "#0f0d17" };

export const currentTheme = (): Theme =>
  document.documentElement.dataset.theme === "sombre" ? "sombre" : "clair";

/** Applique le thème à la page et le mémorise. */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "sombre") root.dataset.theme = "sombre";
  else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* Navigation privée / stockage bloqué : le choix vaut pour cette visite. */
  }
}
