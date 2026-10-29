// ============================================================================
//  Photos choisies AVANT le premier enregistrement (nouvelle actualité)
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

export interface StagedBatch<Slot extends string = string> {
  files: StagedFile<Slot>[];
  /** « Publier » demandé à la création : mettre en ligne une fois les envois réussis. */
  publish: boolean;
}

const store = new Map<string, StagedBatch>();

export function stashUploads(id: string, files: StagedFile[], publish = false) {
  if (files.length > 0) store.set(id, { files, publish });
}

/** Renvoie le lot en attente pour `id` et le retire (une seule reprise). */
export function takeUploads<Slot extends string>(id: string): StagedBatch<Slot> {
  const batch = (store.get(id) ?? { files: [], publish: false }) as StagedBatch<Slot>;
  store.delete(id);
  return batch;
}
