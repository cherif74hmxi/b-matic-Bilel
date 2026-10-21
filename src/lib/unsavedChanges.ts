// ============================================================================
//  Garde « modifications non enregistrées » pour la navigation interne admin
// ----------------------------------------------------------------------------
//  BrowserRouter ne permet pas de bloquer une navigation (useBlocker exige un
//  data router). Les liens de l'admin appellent donc confirmLeave() avant de
//  changer de page ; le formulaire en cours déclare son état via setUnsaved().
//  (Fermeture d'onglet / rechargement : géré par « beforeunload » dans le formulaire.)
// ============================================================================

import { useEffect } from "react";

/** Sources en cours (« form », « photos », « cover »…) : on avertit tant qu'il en reste une. */
const sources = new Set<string>();

export function setUnsaved(value: boolean, source = "form") {
  if (value) sources.add(source);
  else sources.delete(source);
}

/** true si on peut quitter la page (rien à perdre, ou l'utilisateur confirme). */
export function confirmLeave(): boolean {
  if (sources.size === 0) return true;
  const ok = window.confirm(
    sources.has("form")
      ? "Des modifications ne sont pas enregistrées. Quitter quand même ?"
      : "Un envoi de photo est en cours et sera interrompu. Quitter quand même ?",
  );
  if (ok) sources.clear();
  return ok;
}

/** onClick pour un <Link> : annule la navigation si l'utilisateur refuse. */
export function guardLinkClick(e: { preventDefault: () => void }) {
  if (!confirmLeave()) e.preventDefault();
}

/** Déclare `source` comme « à ne pas perdre » tant que `active` : liens admin + fermeture d'onglet. */
export function useLeaveGuard(active: boolean, source = "form") {
  useEffect(() => {
    setUnsaved(active, source);
    return () => setUnsaved(false, source);
  }, [active, source]);
  useEffect(() => {
    if (!active) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [active]);
}
