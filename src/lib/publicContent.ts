// ============================================================================
//  Lecture des contenus PUBLICS : véhicules (publiés + vendus) et actualités
// ----------------------------------------------------------------------------
//  La RLS limite déjà les visiteurs au contenu en ligne ; le filtre de statut
//  est répété ici pour qu'un admin connecté ne voie pas ses brouillons sur le
//  site. Colonnes choisies une à une (le VIN n'est pas affiché publiquement).
//  Pas de supabase-js ici : voir `rest()` plus bas.
// ============================================================================
import { STORAGE_BUCKETS, thumbPath, type Post, type Vehicle } from "@/lib/contentModel";

// Lecture par l'API REST (PostgREST) avec un simple fetch : le site public
// n'embarque pas supabase-js (même principe que publicInsert.ts).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function rest<T>(path: string, body?: unknown): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("Supabase non configuré");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return (await res.json()) as T;
}

/** URL publique d'un fichier Storage (buckets publics). */
const publicFileUrl = (bucket: string, path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;

export const photoUrl = (storagePath: string) => publicFileUrl(STORAGE_BUCKETS.vehiclePhotos, storagePath);
/** Image responsive : miniature (480 px) sur mobile, image complète au-delà. */
export const photoSrcSet = (storagePath: string) => `${photoUrl(thumbPath(storagePath))} 480w, ${photoUrl(storagePath)} 1920w`;
export const postCoverUrl = (path: string, thumb = false) => publicFileUrl(STORAGE_BUCKETS.postImages, thumb ? thumbPath(path) : path);
export { thumbPath };

export type PublicKind = "vehicules" | "actualites";

const LIST_COLUMNS = "id,slug,status,title,make,model,version,year,mileage_km,fuel,gearbox,power_hp,price_eur,published_at,created_at,updated_at";
const PHOTO_COLUMNS = "vehicle_photos(storage_path,is_cover,position,alt)";
const ONLINE = "status=in.(published,sold)";

export type PublicVehicle = Omit<Vehicle, "vin">;

export interface PublicPhoto {
  storage_path: string;
  is_cover: boolean;
  position: number;
  alt: string | null;
}

export interface PublicVehicleWithPhotos extends PublicVehicle {
  vehicle_photos: PublicPhoto[];
}

/** Vehicle in a list: no description, and only the cover photo. */
export type PublicVehicleSummary = Omit<PublicVehicleWithPhotos, "description">;

/** Photos dans l'ordre d'affichage : couverture d'abord, puis l'ordre choisi dans l'admin. */
export const orderedPhotos = (photos: PublicPhoto[]) =>
  [...photos].sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.position - b.position);

/**
 * Vehicle list (most recent first), lightened: cover photo only, no description.
 * `availableOnly` + `limit`: the "latest vehicles" block on the home page.
 */
export const listPublicVehicles = ({ availableOnly = false, limit }: { availableOnly?: boolean; limit?: number } = {}) =>
  rest<PublicVehicleSummary[]>(
    `vehicles?select=${LIST_COLUMNS},${PHOTO_COLUMNS}&${availableOnly ? "status=eq.published" : ONLINE}` +
      `&vehicle_photos.order=is_cover.desc,position.asc&vehicle_photos.limit=1&order=published_at.desc.nullslast${limit ? `&limit=${limit}` : ""}`,
  );

export async function getPublicVehicle(slug: string): Promise<PublicVehicleWithPhotos | null> {
  const rows = await rest<PublicVehicleWithPhotos[]>(`vehicles?select=${LIST_COLUMNS},description,${PHOTO_COLUMNS}&${ONLINE}&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ?? null;
}

const POST_SELECT = "select=id,slug,status,title,excerpt,content,cover_path,published_at,created_at,updated_at&status=eq.published";

export const listPublicPosts = (limit?: number) =>
  rest<Post[]>(`posts?${POST_SELECT}&order=published_at.desc.nullslast${limit ? `&limit=${limit}` : ""}`);

export async function getPublicPost(slug: string): Promise<Post | null> {
  const rows = await rest<Post[]>(`posts?${POST_SELECT}&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rows[0] ?? null;
}

/** Nouvelle adresse d'une fiche dont l'adresse a changé après publication (sinon null). */
export async function resolveSlugRedirect(kind: PublicKind, slug: string): Promise<string | null> {
  try {
    const data = await rest<unknown>("rpc/resolve_slug_redirect", { p_kind: kind, p_slug: slug });
    return typeof data === "string" && data ? data : null;
  } catch {
    return null; // migration absente : simple page introuvable
  }
}

/** Nombre de vues d'une fiche en ligne (null si indisponible). */
export async function publicViewCount(kind: PublicKind, slug: string): Promise<number | null> {
  try {
    const data = await rest<unknown>("rpc/public_view_count", { p_kind: kind, p_slug: slug });
    return data === null ? null : Number(data);
  } catch {
    return null;
  }
}

const dateFr = new Intl.DateTimeFormat("fr-BE", { day: "numeric", month: "long", year: "numeric" });

/** Date de publication lisible : « 22 octobre 2026 ». */
export const formatPostDate = (post: Pick<Post, "published_at" | "created_at">) => dateFr.format(new Date(post.published_at ?? post.created_at));

/** Contenu d'un article découpé en paragraphes (ligne vide = nouveau paragraphe). */
export const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
