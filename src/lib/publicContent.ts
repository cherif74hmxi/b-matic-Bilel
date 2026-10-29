// ============================================================================
//  Lecture des contenus PUBLICS : actualités publiées
// ----------------------------------------------------------------------------
//  La RLS limite déjà les visiteurs au contenu en ligne ; le filtre de statut
//  est répété ici pour qu'un admin connecté ne voie pas ses brouillons sur le
//  site. Pas de supabase-js ici : voir `rest()` plus bas.
// ============================================================================
import { STORAGE_BUCKETS, thumbPath, type Post } from "@/lib/contentModel";

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

export const postCoverUrl = (path: string, thumb = false) => publicFileUrl(STORAGE_BUCKETS.postImages, thumb ? thumbPath(path) : path);
export { thumbPath };

export type PublicKind = "actualites";

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
