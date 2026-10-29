// ============================================================================
//  Modèle des contenus (actualités) : types, libellés, formats
// ----------------------------------------------------------------------------
//  AUCUNE dépendance à supabase-js : ce module est partagé entre l'admin et
//  le site public, qui n'embarque pas le client Supabase (~50 ko gzip).
//  `posts.ts`, `slug.ts` et `supabase.ts` le réexportent.
// ============================================================================

// Buckets Storage créés par supabase/schema.sql. Le bucket « vehicle-photos »
// existe encore en base mais n'est plus utilisé par le site (pivot pare-brise).
export const STORAGE_BUCKETS = {
  postImages: "post-images",
  /** PRIVÉ : carte grise / attestation d'assurance des clients (90 jours). */
  clientDocuments: "client-documents",
} as const;

/** Chemin de la miniature associée à une image (même nom + « _thumb »). */
export const thumbPath = (storagePath: string) => storagePath.replace(/\.webp$/, "_thumb.webp");

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
