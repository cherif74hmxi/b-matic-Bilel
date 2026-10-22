// ============================================================================
//  Modèle des contenus (véhicules, actualités) : types, libellés, formats
// ----------------------------------------------------------------------------
//  AUCUNE dépendance à supabase-js : ce module est partagé entre l'admin et
//  le site public, qui n'embarque pas le client Supabase (~50 ko gzip).
//  `vehicles.ts`, `posts.ts`, `slug.ts` et `supabase.ts` le réexportent.
// ============================================================================

// Buckets Storage créés par supabase/schema.sql
export const STORAGE_BUCKETS = {
  vehiclePhotos: "vehicle-photos",
  postImages: "post-images",
} as const;

/** Chemin de la miniature associée à une image (même nom + « _thumb »). */
export const thumbPath = (storagePath: string) => storagePath.replace(/\.webp$/, "_thumb.webp");

// ---------------------------------------------------------------------------
//  Véhicules
// ---------------------------------------------------------------------------

export type VehicleStatus = "draft" | "published" | "sold";
export type Fuel = "essence" | "diesel" | "hybride" | "hybride_rechargeable" | "electrique" | "gpl" | "autre";
export type Gearbox = "manuelle" | "automatique";

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  sold: "Vendu",
};

export const FUEL_LABELS: Record<Fuel, string> = {
  essence: "Essence",
  diesel: "Diesel",
  hybride: "Hybride",
  hybride_rechargeable: "Hybride rechargeable",
  electrique: "Électrique",
  gpl: "GPL",
  autre: "Autre",
};

export const GEARBOX_LABELS: Record<Gearbox, string> = {
  manuelle: "Manuelle",
  automatique: "Automatique",
};

export interface Vehicle {
  id: string;
  slug: string;
  status: VehicleStatus;
  title: string;
  vin: string | null;
  make: string;
  model: string;
  version: string | null;
  year: number | null;
  mileage_km: number | null;
  fuel: Fuel | null;
  gearbox: Gearbox | null;
  power_hp: number | null;
  price_eur: number | null;
  description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const formatPrice = (price: number | null) =>
  price === null ? "Prix à définir" : new Intl.NumberFormat("fr-BE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(price);

export const formatKm = (km: number | null) => (km === null ? null : `${new Intl.NumberFormat("fr-BE").format(km)} km`);

/** Caractéristiques courtes : « 2017 · 98 000 km · Diesel · Manuelle ». */
export const vehicleSpecs = (v: Pick<Vehicle, "year" | "mileage_km" | "fuel" | "gearbox">) =>
  [v.year, formatKm(v.mileage_km), v.fuel && FUEL_LABELS[v.fuel], v.gearbox && GEARBOX_LABELS[v.gearbox]].filter(Boolean).join(" · ");

// ---------------------------------------------------------------------------
//  Actualités
// ---------------------------------------------------------------------------

export type PostStatus = "draft" | "published";

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Brouillon",
  published: "Publiée",
};

export interface Post {
  id: string;
  slug: string;
  status: PostStatus;
  title: string;
  excerpt: string | null;
  content: string;
  cover_path: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Extrait automatique : début du contenu, coupé proprement (~160 caractères). */
export function autoExcerpt(content: string, max = 160): string {
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), max * 0.6)).trimEnd()}…`;
}
