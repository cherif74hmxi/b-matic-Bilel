// ============================================================================
//  Véhicules à vendre (tables public.vehicles / public.vehicle_photos)
//  Types, libellés et accès Supabase pour l'espace admin.
// ============================================================================
import { supabase, STORAGE_BUCKETS } from "@/lib/supabase";
import { thumbPath, withFreeSlug } from "@/lib/slug";
import type { Vehicle, VehicleStatus } from "@/lib/contentModel";

export type { VehicleStatus, Fuel, Gearbox, Vehicle } from "@/lib/contentModel";
export { VEHICLE_STATUS_LABELS, FUEL_LABELS, GEARBOX_LABELS, formatPrice, formatKm } from "@/lib/contentModel";

export type VehicleInput = Omit<Vehicle, "id" | "status" | "published_at" | "created_at" | "updated_at">;

/** Photo de couverture renvoyée avec la liste (miniature). */
export interface VehicleListItem extends Vehicle {
  vehicle_photos: { storage_path: string; is_cover: boolean }[];
}

export { slugify, thumbPath } from "@/lib/slug";

// Same URL as the public site (a single implementation, with no supabase-js).
export { photoUrl } from "@/lib/publicContent";

/** Conditions pour publier une annonce. Renvoie un message, ou null si OK. */
export function publishBlocker(vehicle: Pick<Vehicle, "price_eur">, photoCount: number | undefined): string | null {
  if (vehicle.price_eur === null) return "Ajoutez un prix avant de publier.";
  if (photoCount === undefined) return "Photos en cours de chargement, réessayez dans un instant.";
  if (photoCount === 0) return "Ajoutez au moins une photo avant de publier.";
  return null;
}

// ---------------------------------------------------------------------------
//  Accès données
// ---------------------------------------------------------------------------

export async function listVehicles(): Promise<VehicleListItem[]> {
  const { data, error } = await supabase
    .from("vehicles")
    .select("*, vehicle_photos(storage_path, is_cover)")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data as VehicleListItem[];
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const { data, error } = await supabase.from("vehicles").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Vehicle;
}

export async function createVehicle(input: VehicleInput): Promise<Vehicle> {
  return withFreeSlug("vehicles", input.slug || "vehicule", undefined, async (slug) => {
    const { data, error } = await supabase.from("vehicles").insert({ ...input, slug }).select().single();
    if (error) throw error;
    return data as Vehicle;
  });
}

export async function updateVehicle(id: string, input: Partial<VehicleInput> & { status?: VehicleStatus }): Promise<Vehicle> {
  const write = async (patch: typeof input) => {
    const { data, error } = await supabase.from("vehicles").update(patch).eq("id", id).select().single();
    if (error) throw error;
    return data as Vehicle;
  };
  if (input.slug === undefined) return write(input);
  return withFreeSlug("vehicles", input.slug || "vehicule", id, (slug) => write({ ...input, slug }));
}

/**
 * Supprime le véhicule puis ses fichiers photo (la cascade SQL ne touche pas
 * au Storage). La ligne d'abord : si elle échoue, rien n'est perdu ; si c'est
 * le nettoyage des fichiers qui échoue, il ne reste que des fichiers orphelins.
 */
export async function deleteVehicle(id: string): Promise<void> {
  const { data: photos, error: photosError } = await supabase.from("vehicle_photos").select("storage_path").eq("vehicle_id", id);
  if (photosError) throw photosError;
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
  const paths = (photos as { storage_path: string }[]).flatMap((p) => [p.storage_path, thumbPath(p.storage_path)]);
  if (paths.length > 0) await supabase.storage.from(STORAGE_BUCKETS.vehiclePhotos).remove(paths);
}

export interface VehiclePhoto {
  id: string;
  vehicle_id: string;
  storage_path: string;
  slot: string;
  position: number;
  is_cover: boolean;
  alt: string | null;
  created_at: string;
}

export async function listVehiclePhotos(vehicleId: string): Promise<VehiclePhoto[]> {
  const { data, error } = await supabase
    .from("vehicle_photos")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("position")
    .order("created_at");
  if (error) throw error;
  return data as VehiclePhoto[];
}
