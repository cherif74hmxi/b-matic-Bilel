// ============================================================================
//  Edge Function « purge-documents » — suppression des documents clients
//  (carte grise, attestation d'assurance) de plus de 90 jours (RGPD).
// ----------------------------------------------------------------------------
//  Appelée chaque nuit par pg_cron (migration 20261029000001_client_documents).
//  Passe par l'API Storage : une suppression en SQL ne retirerait que la ligne
//  de storage.objects, pas le fichier lui-même.
//
//  Sécurité : la fonction ne fait QU'UNE chose, supprimer les fichiers plus
//  vieux que la durée de conservation. Un appel avec la clé publique ne permet
//  donc rien d'autre que d'avancer la purge prévue : aucun secret à protéger.
//  La clé de service (SUPABASE_SERVICE_ROLE_KEY) est fournie par Supabase et
//  ne quitte jamais le serveur.
//
//  ⚠️ Déploiement : `supabase functions deploy purge-documents`
//  Durée : RETENTION_DAYS ci-dessous = src/data/legal.ts → documentsRetentionDays
//  (le test src/test/retention.test.ts vérifie qu'elles concordent).
// ============================================================================
import { createClient } from "jsr:@supabase/supabase-js@2";

const BUCKET = "client-documents";
const RETENTION_DAYS = 90;
const PAGE = 100;

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

/** Liste complète d'un niveau du bucket (l'API pagine par 100). */
async function listAll(prefix: string) {
  const out: { name: string; id: string | null; created_at: string | null }[] = [];
  for (let offset = 0; ; offset += PAGE) {
    const { data, error } = await admin.storage.from(BUCKET).list(prefix, { limit: PAGE, offset });
    if (error) throw error;
    out.push(...data);
    if (data.length < PAGE) return out;
  }
}

Deno.serve(async () => {
  try {
    const limit = Date.now() - RETENTION_DAYS * 24 * 3600 * 1000;
    const expired: string[] = [];
    // Racine : un dossier par demande (« Référence dossier »).
    for (const folder of await listAll("")) {
      if (folder.id !== null) continue; // fichier égaré à la racine : ignoré
      for (const file of await listAll(folder.name)) {
        if (file.created_at && Date.parse(file.created_at) < limit) expired.push(`${folder.name}/${file.name}`);
      }
    }
    for (let i = 0; i < expired.length; i += PAGE) {
      const { error } = await admin.storage.from(BUCKET).remove(expired.slice(i, i + PAGE));
      if (error) throw error;
    }
    return Response.json({ removed: expired.length });
  } catch (error) {
    console.error("purge-documents", error);
    return Response.json({ error: "purge impossible" }, { status: 500 });
  }
});
