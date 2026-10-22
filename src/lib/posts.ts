// ============================================================================
//  Actualités (table public.posts) — types et accès Supabase (admin)
//  Image de couverture dans le bucket « post-images » :
//    <post_id>/<uuid>.webp (1920 px max) + <uuid>_thumb.webp (480 px)
// ============================================================================
import { supabase, STORAGE_BUCKETS } from "@/lib/supabase";
import { optimizeImage } from "@/lib/imageOptimize";
import { slugify, thumbPath as thumbOf, withFreeSlug } from "@/lib/slug";
import type { Post, PostStatus } from "@/lib/contentModel";

export type { PostStatus, Post } from "@/lib/contentModel";
export { POST_STATUS_LABELS, autoExcerpt } from "@/lib/contentModel";

export type PostInput = Pick<Post, "slug" | "title" | "excerpt" | "content">;

const bucket = () => supabase.storage.from(STORAGE_BUCKETS.postImages);

// Same URL as the public site (a single implementation, with no supabase-js).
export { postCoverUrl as postImageUrl } from "@/lib/publicContent";

/** Conditions pour publier une actualité. */
export function postPublishBlocker(post: Pick<Post, "content" | "title">): string | null {
  if (!post.title.trim()) return "Ajoutez un titre avant de publier.";
  if (post.content.trim().length < 50) return "Le contenu est trop court pour être publié (50 caractères minimum).";
  return null;
}

// ---------------------------------------------------------------------------

export async function listPosts(): Promise<Post[]> {
  const { data, error } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
  if (error) throw error;
  return data as Post[];
}

export async function getPost(id: string): Promise<Post> {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error) throw error;
  return data as Post;
}

export async function createPost(input: PostInput, status: PostStatus = "draft"): Promise<Post> {
  return withFreeSlug("posts", slugify(input.slug || input.title) || "actualite", undefined, async (slug) => {
    const { data, error } = await supabase.from("posts").insert({ ...input, slug, status }).select().single();
    if (error) throw error;
    return data as Post;
  });
}

export async function updatePost(
  id: string,
  input: Partial<PostInput> & { status?: PostStatus; cover_path?: string | null },
): Promise<Post> {
  const write = async (patch: typeof input) => {
    const { data, error } = await supabase.from("posts").update(patch).eq("id", id).select().single();
    if (error) throw error;
    return data as Post;
  };
  if (input.slug === undefined) return write(input);
  return withFreeSlug("posts", slugify(input.slug || input.title || "") || "actualite", id, (slug) => write({ ...input, slug }));
}

/** Supprime l'actualité puis son image (la ligne d'abord : un fichier orphelin est sans gravité). */
export async function deletePost(post: Post): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", post.id);
  if (error) throw error;
  if (post.cover_path) await bucket().remove([post.cover_path, thumbOf(post.cover_path)]);
}

/** Optimise et envoie une nouvelle image de couverture, remplace l'ancienne. */
export async function replacePostCover(post: Post, file: File): Promise<Post> {
  const { main, thumb } = await optimizeImage(file);
  const path = `${post.id}/${crypto.randomUUID()}.webp`;
  const options = { contentType: "image/webp", cacheControl: "31536000", upsert: false };
  const up = await bucket().upload(path, main, options);
  if (up.error) throw up.error;
  const upThumb = await bucket().upload(thumbOf(path), thumb, options);
  if (upThumb.error) {
    await bucket().remove([path]);
    throw upThumb.error;
  }
  let updated: Post;
  try {
    updated = await updatePost(post.id, { cover_path: path });
  } catch (error) {
    await bucket().remove([path, thumbOf(path)]);
    throw error;
  }
  if (post.cover_path) await bucket().remove([post.cover_path, thumbOf(post.cover_path)]);
  return updated;
}

export async function removePostCover(post: Post): Promise<Post> {
  const updated = await updatePost(post.id, { cover_path: null });
  if (post.cover_path) await bucket().remove([post.cover_path, thumbOf(post.cover_path)]);
  return updated;
}
