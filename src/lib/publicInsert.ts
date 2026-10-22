// ============================================================================
//  publicInsert — insertion « visiteur » dans Supabase, SANS supabase-js
// ----------------------------------------------------------------------------
//  Le site public n'a besoin que d'INSÉRER (vues de page, clics de contact, demandes) : un simple
//  fetch vers l'API REST suffit et évite d'embarquer supabase-js (~50 ko gzip)
//  dans le bundle public. Les droits sont limités par les règles RLS
//  (insertion seule, aucune relecture possible).
//
//  Ne lève jamais d'exception : renvoie false en cas d'échec ou si Supabase
//  n'est pas configuré. Un problème Supabase ne doit jamais casser le site.
// ============================================================================

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function insertPublicRow(
  table: "page_views" | "leads" | "click_events",
  row: Record<string, unknown>,
): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      // keepalive : la requête part même si l'utilisateur quitte la page.
      keepalive: true,
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
    });
    return res.ok;
  } catch {
    return false;
  }
}
