// ============================================================================
//  Photos des véhicules — emplacements guidés (façon leboncoin) + Storage
// ----------------------------------------------------------------------------
//  Fichiers dans le bucket « vehicle-photos » :
//    <vehicle_id>/<uuid>.webp        photo (1920 px max)
//    <vehicle_id>/<uuid>_thumb.webp  miniature (480 px)
//  Noms aléatoires : l'URL publique d'une photo de brouillon n'est pas devinable,
//  et le fichier peut être mis en cache un an (il ne change jamais).
// ============================================================================
import { supabase, STORAGE_BUCKETS } from "@/lib/supabase";
import { optimizeImage } from "@/lib/imageOptimize";
import { thumbPath, type VehiclePhoto } from "@/lib/vehicles";

export type PhotoSlot =
  | "couverture"
  | "avant_gauche_3_4"
  | "arriere_droit_3_4"
  | "interieur_conducteur"
  | "interieur_passager"
  | "profil_gauche"
  | "detail_exterieur"
  | "equipement_1"
  | "equipement_2"
  | "roue"
  | "coffre"
  | "autre";

/** Emplacements guidés, dans l'ordre logique d'une annonce (« autre » = photos libres). */
export const GUIDED_SLOTS: { id: Exclude<PhotoSlot, "autre">; label: string }[] = [
  { id: "couverture", label: "Vue principale" },
  { id: "avant_gauche_3_4", label: "3/4 avant gauche" },
  { id: "arriere_droit_3_4", label: "3/4 arrière droit" },
  { id: "interieur_conducteur", label: "Intérieur conducteur" },
  { id: "interieur_passager", label: "Intérieur passager" },
  { id: "profil_gauche", label: "Profil gauche" },
  { id: "detail_exterieur", label: "Détail extérieur" },
  { id: "equipement_1", label: "Détail équipement 1" },
  { id: "equipement_2", label: "Détail équipement 2" },
  { id: "roue", label: "Roue" },
  { id: "coffre", label: "Coffre" },
];

export const MAX_PHOTOS = 30;

export const slotLabel = (slot: string) => GUIDED_SLOTS.find((s) => s.id === slot)?.label ?? "Autre";

const slotRank = (slot: string) => {
  const i = GUIDED_SLOTS.findIndex((s) => s.id === slot);
  return i === -1 ? GUIDED_SLOTS.length : i;
};

/**
 * Où insérer une photo d'emplacement `slot` dans la galerie : après les photos
 * d'emplacements qui la précèdent logiquement (fonction pure, testée).
 */
export function insertionIndex(photos: Pick<VehiclePhoto, "slot">[], slot: string): number {
  if (slot === "autre") return photos.length;
  const rank = slotRank(slot);
  const after = photos.findIndex((p) => slotRank(p.slot) > rank);
  return after === -1 ? photos.length : after;
}

const bucket = () => supabase.storage.from(STORAGE_BUCKETS.vehiclePhotos);

/** Enregistre l'ordre de la galerie en une requête atomique (fonction SQL). */
export async function savePhotoOrder(vehicleId: string, ordered: Pick<VehiclePhoto, "id">[]): Promise<void> {
  const { error } = await supabase.rpc("reorder_vehicle_photos", { p_vehicle_id: vehicleId, p_ids: ordered.map((p) => p.id) });
  if (error) throw error;
}

/** Désigne la photo de couverture (fonction SQL : ancienne retirée + nouvelle posée, en une transaction). */
export async function setCoverPhoto(photoId: string): Promise<void> {
  const { error } = await supabase.rpc("set_vehicle_cover", { p_photo_id: photoId });
  if (error) throw error;
}

/**
 * Optimise, envoie et enregistre une photo, à sa place logique dans la galerie.
 *  · échec AVANT l'insertion en base → les fichiers envoyés sont supprimés, erreur levée ;
 *  · échec APRÈS (couverture / ordre) → la photo est bien enregistrée : on renvoie
 *    null pour que l'appelant recharge la galerie depuis la base.
 * Sinon renvoie la galerie complète à jour, à écrire tout de suite dans le cache.
 */
export async function uploadVehiclePhoto(params: {
  vehicleId: string;
  vehicleTitle: string;
  file: File;
  slot: PhotoSlot;
  current: VehiclePhoto[];
}): Promise<VehiclePhoto[] | null> {
  const { vehicleId, vehicleTitle, file, slot, current } = params;
  const { main, thumb } = await optimizeImage(file);

  const path = `${vehicleId}/${crypto.randomUUID()}.webp`;
  const options = { contentType: "image/webp", cacheControl: "31536000", upsert: false };
  const up = await bucket().upload(path, main, options);
  if (up.error) throw up.error;
  const upThumb = await bucket().upload(thumbPath(path), thumb, options);
  if (upThumb.error) {
    await bucket().remove([path]);
    throw upThumb.error;
  }

  // Insertion SANS couverture : la couverture est posée ensuite de façon atomique.
  const { data, error } = await supabase
    .from("vehicle_photos")
    .insert({
      vehicle_id: vehicleId,
      storage_path: path,
      slot,
      position: current.length,
      is_cover: false,
      alt: `${vehicleTitle} — ${slotLabel(slot)}`.slice(0, 200),
    })
    .select()
    .single();
  if (error) {
    await bucket().remove([path, thumbPath(path)]);
    throw error;
  }
  const photo = data as VehiclePhoto;

  const makeCover = slot === "couverture" || !current.some((p) => p.is_cover);
  // Place logique dans la galerie (ex. « Roue » avant « Coffre »).
  const ordered = current.map((p) => (makeCover ? { ...p, is_cover: false } : p));
  ordered.splice(insertionIndex(current, slot), 0, makeCover ? { ...photo, is_cover: true } : photo);
  try {
    if (makeCover) await setCoverPhoto(photo.id);
    await savePhotoOrder(vehicleId, ordered);
  } catch {
    return null;
  }
  return ordered.map((p, position) => ({ ...p, position }));
}

/**
 * Supprime une photo (ligne puis fichiers). Si c'était la couverture, la
 * première photo restante le devient.
 */
export async function deleteVehiclePhoto(photo: VehiclePhoto, remaining: VehiclePhoto[]): Promise<void> {
  const { error } = await supabase.from("vehicle_photos").delete().eq("id", photo.id);
  if (error) throw error;
  // Échec du nettoyage des fichiers : sans gravité (noms aléatoires, plus référencés).
  await bucket().remove([photo.storage_path, thumbPath(photo.storage_path)]);
  if (photo.is_cover && remaining.length > 0) await setCoverPhoto(remaining[0].id);
  if (remaining.length > 0) await savePhotoOrder(photo.vehicle_id, remaining);
}
