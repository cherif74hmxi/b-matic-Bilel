// ============================================================================
//  Vues par actualité, d'après page_views — admin
//  Fonction SQL admin_content_views (supabase/migrations/20261022000001_content_views.sql)
// ============================================================================
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type ContentKind = "actualites";

export interface ContentViews {
  total: number;
  last30: number;
}

/** Vues par id d'actualité. */
export async function fetchContentViews(kind: ContentKind): Promise<Map<string, ContentViews>> {
  const { data, error } = await supabase.rpc("admin_content_views", { p_kind: kind });
  if (error) throw error;
  const rows = (data ?? []) as { id: string; views_total: number; views_30d: number }[];
  return new Map(rows.map((r) => [r.id, { total: Number(r.views_total), last30: Number(r.views_30d) }]));
}

/**
 * Vues de toutes les fiches d'un type. En cas d'erreur (migration SQL pas encore
 * exécutée, réseau), data reste vide : la liste s'affiche simplement sans compteur.
 */
export const useContentViews = (kind: ContentKind) =>
  useQuery({ queryKey: ["admin", "content-views", kind], queryFn: () => fetchContentViews(kind), retry: false, staleTime: 60_000 });
