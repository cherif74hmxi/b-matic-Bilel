// ============================================================================
//  Garde « modifications non enregistrées » pour la navigation interne admin
// ----------------------------------------------------------------------------
//  BrowserRouter ne permet pas de bloquer une navigation (useBlocker exige un
//  data router). Les liens de l'admin appellent donc confirmLeave() avant de
//  changer de page ; le formulaire en cours déclare son état via setUnsaved().
//  (Fermeture d'onglet / rechargement : géré par « beforeunload » dans le formulaire.)
// ============================================================================

let unsaved = false;

export function setUnsaved(value: boolean) {
  unsaved = value;
}

/** true si on peut quitter la page (rien à perdre, ou l'utilisateur confirme). */
export function confirmLeave(): boolean {
  if (!unsaved) return true;
  const ok = window.confirm("Des modifications ne sont pas enregistrées. Quitter quand même ?");
  if (ok) unsaved = false;
  return ok;
}

/** onClick pour un <Link> : annule la navigation si l'utilisateur refuse. */
export function guardLinkClick(e: { preventDefault: () => void }) {
  if (!confirmLeave()) e.preventDefault();
}
