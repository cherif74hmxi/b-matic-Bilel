import { useEffect, useId, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, Camera, ChevronLeft, ChevronRight, GripVertical, ImagePlus, Loader2, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SlotIllustration from "@/components/admin/SlotIllustration";
import { photoUrl, thumbPath, type VehiclePhoto } from "@/lib/vehicles";
import {
  deleteVehiclePhoto,
  GUIDED_SLOTS,
  insertionIndex,
  MAX_PHOTOS,
  savePhotoOrder,
  setCoverPhoto,
  slotLabel,
  uploadVehiclePhoto,
  type PhotoSlot,
} from "@/lib/vehiclePhotos";
import { canDecodeImage, UnsupportedImageError } from "@/lib/imageOptimize";
import { useLeaveGuard } from "@/lib/unsavedChanges";
import { takeUploads } from "@/lib/stagedUploads";

// ============================================================================
//  Photos guidées d'un véhicule (façon leboncoin), mobile-first
//  · emplacements vides = tuiles « + » (appareil photo ou galerie)
//  · glisser-déposer via la poignée (souris, doigt, clavier) + boutons ← →
//  · étoile = photo de couverture (une seule)
// ============================================================================

interface Pending {
  key: string;
  slot: PhotoSlot;
  name: string;
  error?: string;
  file: File;
}

const tileClass = "relative aspect-[4/3] rounded-xl overflow-hidden";
const iconButton =
  "flex items-center justify-center w-10 h-10 rounded-full bg-background/80 backdrop-blur text-foreground hover:bg-background disabled:opacity-40";

// ---------------------------------------------------------------------------

const SortablePhoto = ({
  photo,
  index,
  count,
  busy,
  onMove,
  onCover,
  onDelete,
}: {
  photo: VehiclePhoto;
  index: number;
  count: number;
  busy: boolean;
  onMove: (from: number, to: number) => void;
  onCover: () => void;
  onDelete: () => void;
}) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.id,
    disabled: busy,
  });
  const label = slotLabel(photo.slot);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`min-w-0 ${isDragging ? "z-20 opacity-80" : ""}`}
    >
      <div className={`${tileClass} bg-muted ${photo.is_cover ? "ring-2 ring-neon-cyan" : "border border-border"}`}>
        <img src={photoUrl(thumbPath(photo.storage_path))} alt={photo.alt ?? label} loading="lazy" className="w-full h-full object-cover" />

        <div className="absolute inset-x-0 top-0 flex justify-between p-1.5">
          <button
            type="button"
            onClick={onCover}
            disabled={busy || photo.is_cover}
            aria-pressed={photo.is_cover}
            aria-label={photo.is_cover ? "Photo de couverture" : `Choisir « ${label} » comme couverture`}
            className={`${iconButton} ${photo.is_cover ? "!opacity-100 text-neon-cyan" : ""}`}
          >
            <Star className="w-5 h-5" fill={photo.is_cover ? "currentColor" : "none"} aria-hidden="true" />
          </button>
          <button type="button" onClick={onDelete} disabled={busy} aria-label={`Supprimer la photo « ${label} »`} className={`${iconButton} hover:text-neon-pink`}>
            <Trash2 className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {photo.is_cover && (
          <span className="absolute left-2 bottom-12 rounded-full bg-neon-cyan text-background text-[10px] font-heading uppercase tracking-wider px-2 py-0.5">
            Couverture
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-1.5 bg-gradient-to-t from-background/90 to-transparent">
          <button type="button" onClick={() => onMove(index, index - 1)} disabled={busy || index === 0} aria-label={`Déplacer « ${label} » avant`} className={iconButton}>
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label={`Réorganiser « ${label} » (glisser, ou Espace puis flèches)`}
            className={`${iconButton} cursor-grab active:cursor-grabbing touch-none`}
          >
            <GripVertical className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, index + 1)}
            disabled={busy || index === count - 1}
            aria-label={`Déplacer « ${label} » après`}
            className={iconButton}
          >
            <ChevronRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-1 truncate">
        {index + 1}. {label}
      </p>
    </li>
  );
};

/** Tuile « + » : <label> autour d'un <input type=file> (appareil photo ou galerie). */
const AddTile = ({
  label,
  slot,
  multiple,
  disabled,
  onFiles,
  dashed = true,
}: {
  label: string;
  /** Emplacement guidé : affiche l'illustration de l'angle à photographier. */
  slot?: Exclude<PhotoSlot, "autre">;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
  dashed?: boolean;
}) => {
  const id = useId();
  return (
    <li className="min-w-0">
      <label
        htmlFor={id}
        className={`${tileClass} flex flex-col items-center justify-center gap-1.5 text-center px-2 py-2 cursor-pointer border-2 ${
          dashed ? "border-dashed" : ""
        } border-border hover:border-neon-purple/60 text-muted-foreground hover:text-foreground transition-colors ${
          disabled ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        {slot ? (
          <SlotIllustration slot={slot} className="w-full max-w-[120px] min-h-0 flex-1" />
        ) : multiple ? (
          <ImagePlus className="w-7 h-7" aria-hidden="true" />
        ) : (
          <Camera className="w-7 h-7" aria-hidden="true" />
        )}
        <span className="text-xs leading-tight">{label}</span>
        <input
          id={id}
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = ""; // permet de reprendre le même fichier
            if (files.length) onFiles(files);
          }}
        />
      </label>
    </li>
  );
};

// ---------------------------------------------------------------------------

const VehiclePhotos = ({
  vehicleId,
  vehicleTitle,
  photos,
  onBatchPublish,
}: {
  vehicleId: string;
  vehicleTitle: string;
  photos: VehiclePhoto[];
  /** « Publier » demandé à la création : appelé quand toutes les photos du lot sont envoyées. */
  onBatchPublish?: () => void;
}) => {
  const queryClient = useQueryClient();
  const queryKey = ["admin", "vehicle-photos", vehicleId];
  const [pending, setPending] = useState<Pending[]>([]);
  const [working, setWorking] = useState(false);
  const [toDelete, setToDelete] = useState<VehiclePhoto | null>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());

  const setPhotos = (next: VehiclePhoto[]) => queryClient.setQueryData(queryKey, next);
  const refreshList = () => void queryClient.invalidateQueries({ queryKey: ["admin", "vehicles"] });
  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey });
    refreshList();
  };
  const current = () => queryClient.getQueryData<VehiclePhoto[]>(queryKey) ?? photos;

  // ----- Envoi : une photo à la fois (mémoire limitée sur téléphone)
  // Renvoie une promesse : true si la photo est enregistrée, false en cas d'échec.
  const upload = (file: File, slot: PhotoSlot, key: string) => {
    const done = queue.current.then(async () => {
      setPending((p) => p.map((x) => (x.key === key ? { ...x, error: undefined } : x)));
      try {
        // Le cache est la référence pendant la file d'envoi (pas de rechargement
        // qui pourrait l'écraser avec une version plus ancienne).
        const next = await uploadVehiclePhoto({ vehicleId, vehicleTitle, file, slot, current: current() });
        setPending((p) => p.filter((x) => x.key !== key));
        // null : photo enregistrée mais couverture/ordre non confirmés → relire la base.
        if (next) {
          setPhotos(next);
          refreshList();
        } else {
          refresh();
        }
        return true;
      } catch (error) {
        const message =
          error instanceof UnsupportedImageError
            ? "Format non pris en charge (HEIC ?). Utilisez une photo JPEG ou PNG."
            : "Envoi impossible. Vérifiez la connexion et réessayez.";
        setPending((p) => p.map((x) => (x.key === key ? { ...x, error: message } : x)));
        return false;
      }
    });
    queue.current = done.then(() => undefined);
    return done;
  };

  // L'erreur est effacée tout de suite : un second clic ne relance pas un doublon.
  const retry = (p: Pending) => {
    setPending((list) => list.map((x) => (x.key === p.key ? { ...x, error: undefined } : x)));
    upload(p.file, p.slot, p.key);
  };

  const addFiles = (files: File[], slot: PhotoSlot) => {
    const room = MAX_PHOTOS - current().length - pending.length;
    if (room <= 0) {
      toast.error(`${MAX_PHOTOS} photos maximum.`);
      return;
    }
    if (files.length > room) toast.error(`${MAX_PHOTOS} photos maximum : seules les ${room} premières seront ajoutées.`);
    for (const file of files.slice(0, room)) {
      const key = crypto.randomUUID();
      setPending((p) => [...p, { key, slot, name: file.name, file }]);
      upload(file, slot, key);
    }
  };

  // Photos choisies avant le premier enregistrement : envoyées dès l'ouverture.
  // Si « Publier » a été demandé, l'annonce passe en ligne une fois TOUT le lot envoyé.
  const onBatchPublishRef = useRef(onBatchPublish);
  onBatchPublishRef.current = onBatchPublish;
  useEffect(() => {
    const { files, publish } = takeUploads<PhotoSlot>(vehicleId);
    const results = files.map(({ file, slot }) => {
      const key = crypto.randomUUID();
      setPending((p) => [...p, { key, slot, name: file.name, file }]);
      return upload(file, slot, key);
    });
    if (!publish || results.length === 0) return;
    void Promise.all(results).then((ok) => {
      if (ok.every(Boolean)) onBatchPublishRef.current?.();
      else toast.error("Des photos n'ont pas pu être envoyées : l'annonce reste en brouillon. Réessayez l'envoi, puis publiez.");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- une seule reprise, au montage
  }, [vehicleId]);

  // ----- Réorganisation (optimiste)
  const persistOrder = async (ordered: VehiclePhoto[]) => {
    const previous = current();
    setPhotos(ordered.map((p, position) => ({ ...p, position })));
    try {
      await savePhotoOrder(vehicleId, ordered);
    } catch {
      setPhotos(previous);
      toast.error("Impossible d'enregistrer le nouvel ordre.");
    } finally {
      refresh();
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= photos.length) return;
    void persistOrder(arrayMove(photos, from, to));
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const from = photos.findIndex((p) => p.id === active.id);
    const to = photos.findIndex((p) => p.id === over.id);
    if (from !== -1 && to !== -1) move(from, to);
  };

  const run = async (action: () => Promise<void>, errorMessage: string) => {
    setWorking(true);
    try {
      await action();
    } catch {
      toast.error(errorMessage);
    } finally {
      setWorking(false);
      refresh();
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Pendant un envoi, la galerie est figée (suppression, ordre, couverture) :
  // chaque envoi s'appuie sur la liste en cache, qu'une autre action rendrait périmée.
  const uploading = pending.some((p) => !p.error);
  const busy = working || uploading;
  // Quitter la page interromprait la file d'envoi (et masquerait ses erreurs).
  useLeaveGuard(uploading, "photos");

  const usedSlots = new Set([...photos.map((p) => p.slot), ...pending.map((p) => p.slot)]);
  const emptySlots = GUIDED_SLOTS.filter((s) => !usedSlots.has(s.id));
  const full = photos.length + pending.length >= MAX_PHOTOS;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Touchez un emplacement pour prendre ou choisir la photo. Les photos sont optimisées automatiquement (WebP, 1920 px).
        L'étoile désigne la photo de couverture.
      </p>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" aria-label="Photos du véhicule">
            {photos.map((photo, index) => (
              <SortablePhoto
                key={photo.id}
                photo={photo}
                index={index}
                count={photos.length}
                busy={busy}
                onMove={move}
                onCover={() => void run(() => setCoverPhoto(photo.id), "Impossible de changer la couverture.")}
                onDelete={() => setToDelete(photo)}
              />
            ))}

            {pending.map((p) => (
              <li key={p.key} className="min-w-0">
                <div
                  className={`${tileClass} flex flex-col items-center justify-center gap-2 text-center px-3 border ${
                    p.error ? "border-neon-pink/60 bg-neon-pink/5" : "border-border bg-muted/40"
                  }`}
                  role="status"
                >
                  {p.error ? (
                    <>
                      <AlertTriangle className="w-6 h-6 text-neon-pink" aria-hidden="true" />
                      <span className="text-xs">{p.error}</span>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => retry(p)} className="text-xs underline min-h-[32px]">
                          Réessayer
                        </button>
                        <button
                          type="button"
                          onClick={() => setPending((list) => list.filter((x) => x.key !== p.key))}
                          aria-label="Abandonner cette photo"
                          className="min-h-[32px] min-w-[32px] flex items-center justify-center"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Loader2 className="w-6 h-6 text-neon-purple animate-spin" aria-hidden="true" />
                      <span className="text-xs text-muted-foreground">Optimisation et envoi…</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{slotLabel(p.slot)}</p>
              </li>
            ))}

            {emptySlots.map((slot) => (
              <AddTile key={slot.id} label={slot.label} slot={slot.id} disabled={full} onFiles={(files) => addFiles(files.slice(0, 1), slot.id)} />
            ))}
            <AddTile label="Ajouter d'autres photos" multiple dashed disabled={full} onFiles={(files) => addFiles(files, "autre")} />
          </ul>
        </SortableContext>
      </DndContext>

      <p className="text-xs text-muted-foreground mt-3">
        {photos.length} / {MAX_PHOTOS} photos. Pour réorganiser : maintenez la poignée{" "}
        <GripVertical className="inline w-3.5 h-3.5 align-text-bottom" aria-label="poignée" /> et faites glisser, ou utilisez les flèches.
      </p>

      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette photo ?</AlertDialogTitle>
            <AlertDialogDescription>
              La photo « {toDelete ? slotLabel(toDelete.slot) : ""} » sera supprimée définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="min-h-[44px]">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="min-h-[44px] bg-neon-pink text-white hover:bg-neon-pink/90"
              onClick={() => {
                const photo = toDelete;
                if (!photo) return;
                const remaining = photos.filter((p) => p.id !== photo.id);
                setPhotos(remaining);
                void run(() => deleteVehiclePhoto(photo, remaining), "Suppression impossible.");
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// ---------------------------------------------------------------------------
//  Nouveau véhicule (pas encore enregistré) : photos gardées en aperçu local,
//  envoyées automatiquement après le premier enregistrement.
// ---------------------------------------------------------------------------

export interface StagedPhoto {
  key: string;
  slot: PhotoSlot;
  file: File;
  /** URL locale (blob:) de l'aperçu. */
  preview: string;
}

export const StagedVehiclePhotos = ({
  items,
  onChange,
  disabled = false,
}: {
  items: StagedPhoto[];
  onChange: Dispatch<SetStateAction<StagedPhoto[]>>;
  /** Pendant l'enregistrement : la liste est figée (elle part avec le véhicule). */
  disabled?: boolean;
}) => {
  // Libère les aperçus restants en quittant la page (les fichiers, eux, sont transmis).
  const latest = useRef(items);
  latest.current = items;
  useEffect(() => () => latest.current.forEach((p) => URL.revokeObjectURL(p.preview)), []);

  const add = async (files: File[], slot: PhotoSlot) => {
    // Vérifié dès maintenant : un HEIC illisible échouerait sinon après la création du véhicule.
    const readable: File[] = [];
    for (const file of files) if (await canDecodeImage(file)) readable.push(file);
    if (readable.length < files.length) toast.error("Format non pris en charge (HEIC ?). Utilisez une photo JPEG ou PNG.");
    const room = MAX_PHOTOS - latest.current.length;
    if (readable.length > room) toast.error(`${MAX_PHOTOS} photos maximum.`);
    const added = readable.slice(0, Math.max(room, 0)).map((file) => ({ key: crypto.randomUUID(), slot, file, preview: URL.createObjectURL(file) }));
    if (added.length === 0) return;
    onChange((list) => {
      const next = [...list];
      for (const item of added) next.splice(insertionIndex(next, slot), 0, item);
      return next.slice(0, MAX_PHOTOS);
    });
  };

  const remove = (item: StagedPhoto) => {
    URL.revokeObjectURL(item.preview);
    onChange((list) => list.filter((p) => p.key !== item.key));
  };

  const used = new Set(items.map((p) => p.slot));
  const full = items.length >= MAX_PHOTOS || disabled;

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        Touchez un emplacement pour prendre ou choisir la photo. Elles seront envoyées automatiquement à l'enregistrement du
        véhicule.
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3" aria-label="Photos du véhicule (en attente)">
        {items.map((item, index) => (
          <li key={item.key} className="min-w-0">
            <div className={`${tileClass} bg-muted border border-border`}>
              <img src={item.preview} alt={slotLabel(item.slot)} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 top-0 flex justify-end p-1.5">
                <button
                  type="button"
                  onClick={() => remove(item)}
                  disabled={disabled}
                  aria-label={`Retirer la photo « ${slotLabel(item.slot)} »`}
                  className={`${iconButton} hover:text-neon-pink`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <span className="absolute left-2 bottom-2 rounded-full bg-background/85 text-[10px] font-heading uppercase tracking-wider px-2 py-0.5">
                En attente
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {index + 1}. {slotLabel(item.slot)}
            </p>
          </li>
        ))}
        {GUIDED_SLOTS.filter((s) => !used.has(s.id)).map((slot) => (
          <AddTile key={slot.id} label={slot.label} slot={slot.id} disabled={full} onFiles={(files) => void add(files.slice(0, 1), slot.id)} />
        ))}
        <AddTile label="Ajouter d'autres photos" multiple dashed disabled={full} onFiles={(files) => void add(files, "autre")} />
      </ul>
    </div>
  );
};

export default VehiclePhotos;
