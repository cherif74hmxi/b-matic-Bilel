// ============================================================================
//  Slugs (adresses de page) et chemins de miniatures — communs véhicules / actus
// ============================================================================
import { supabase } from "@/lib/supabase";

export const SLUG_MAX = 80;

/** « Golf 7 1.6 TDI Highline » → « golf-7-1-6-tdi-highline » */
export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/g, "");
}

/** `root-n`, en raccourcissant `root` pour rester dans SLUG_MAX caractères. */
export function withSuffix(root: string, n: number): string {
  const suffix = `-${n}`;
  return `${root.slice(0, SLUG_MAX - suffix.length).replace(/-+$/g, "")}${suffix}`;
}

/** Chemin de la miniature associée à une image (même nom + « _thumb »). */
export const thumbPath = (storagePath: string) => storagePath.replace(/\.webp$/, "_thumb.webp");

/**
 * Renvoie `root`, ou `root-2`, `root-3`… si le slug est déjà pris par une autre
 * ligne de `table`, ou réservé comme ancienne adresse (redirection) d'une autre fiche.
 */
async function uniqueSlug(table: "vehicles" | "posts", root: string, excludeId?: string): Promise<string> {
  // Préfixe raccourci : couvre aussi les variantes tronquées par withSuffix.
  const prefix = root.slice(0, SLUG_MAX - 4);
  const kind = table === "vehicles" ? "vehicules" : "actualites";
  const [rows, redirects] = await Promise.all([
    supabase.from(table).select("id, slug").like("slug", `${prefix}%`),
    supabase.from("slug_redirects").select("target_id, old_slug").eq("kind", kind).like("old_slug", `${prefix}%`),
  ]);
  if (rows.error) throw rows.error;
  // Table absente (migration pas encore exécutée) : on ignore les redirections.
  const reserved = redirects.error ? [] : (redirects.data as { target_id: string; old_slug: string }[]);
  const taken = new Set([
    ...(rows.data as { id: string; slug: string }[]).filter((r) => r.id !== excludeId).map((r) => r.slug),
    ...reserved.filter((r) => r.target_id !== excludeId).map((r) => r.old_slug),
  ]);
  if (!taken.has(root)) return root;
  for (let i = 2; ; i++) if (!taken.has(withSuffix(root, i))) return withSuffix(root, i);
}

const isUniqueViolation = (error: unknown) => (error as { code?: string } | null)?.code === "23505";

/**
 * Exécute une écriture avec un slug libre. Si une autre ligne prend le même slug
 * entre la vérification et l'écriture (contrainte UNIQUE), on recalcule et on
 * réessaie une fois.
 */
export async function withFreeSlug<T>(
  table: "vehicles" | "posts",
  root: string,
  excludeId: string | undefined,
  write: (slug: string) => Promise<T>,
): Promise<T> {
  try {
    return await write(await uniqueSlug(table, root, excludeId));
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
    return write(await uniqueSlug(table, root, excludeId));
  }
}
