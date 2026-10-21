// ============================================================================
//  Helpers de motion — performance & accessibilité
// ----------------------------------------------------------------------------
//  Centralise les décisions « doit-on animer ? » pour respecter
//  prefers-reduced-motion et alléger le rendu sur les appareils bas de gamme.
//  Les animations continues (fond Aurora, parallax) s'appuient dessus pour
//  retomber sur un rendu STATIQUE quand c'est nécessaire.
// ============================================================================

/** L'utilisateur a demandé à réduire les animations (OS / navigateur). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Heuristique « appareil bas de gamme » : peu de mémoire ou peu de cœurs CPU.
 * Sert à désactiver les animations CONTINUES coûteuses (gros flous animés),
 * pas les révélations ponctuelles au scroll (qui restent très légères).
 */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if (typeof mem === "number" && mem > 0 && mem <= 4) return true;
  if (typeof cores === "number" && cores > 0 && cores <= 4) return true;
  return false;
}

/** Peut-on jouer une animation continue (Aurora…) ? */
export function canRunAmbientMotion(): boolean {
  return !prefersReducedMotion() && !isLowEndDevice();
}
