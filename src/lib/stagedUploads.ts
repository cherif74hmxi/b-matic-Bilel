// ============================================================================
//  Photos choisies AVANT le premier enregistrement (nouveau véhicule / actu)
// ----------------------------------------------------------------------------
//  Le formulaire de création garde les fichiers en mémoire (aperçu local).
//  À l'enregistrement, il les dépose ici sous l'id créé, puis ouvre la page
//  d'édition, qui les reprend et les envoie avec le circuit habituel
//  (optimisation, couverture, ordre, « Réessayer » en cas d'échec).
//  Mémoire de l'onglet uniquement : rien n'est stocké sur l'appareil.
// ============================================================================

export interface StagedFile<Slot extends string = string> {
  file: File;
  slot: Slot;
}

const store = new Map<string, StagedFile[]>();

export function stashUploads(id: string, files: StagedFile[]) {
  if (files.length > 0) store.set(id, files);
}

/** Renvoie les fichiers en attente pour `id` et les retire (une seule reprise). */
export function takeUploads<Slot extends string>(id: string): StagedFile<Slot>[] {
  const files = (store.get(id) ?? []) as StagedFile<Slot>[];
  store.delete(id);
  return files;
}
