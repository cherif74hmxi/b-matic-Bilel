// ============================================================================
//  B MATIC — Client Supabase (unique pour toute l'application)
// ----------------------------------------------------------------------------
//  Les valeurs viennent de .env (voir .env.example). La clé utilisée ici est
//  la clé PUBLIQUE (publishable / anon) : elle peut être exposée côté front,
//  la sécurité repose sur les règles RLS de supabase/schema.sql.
//  ⚠️  Ne jamais mettre la clé service_role / secret dans une variable VITE_*.
// ============================================================================

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase non configuré : renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans .env (voir .env.example).",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export { STORAGE_BUCKETS } from "@/lib/contentModel";
