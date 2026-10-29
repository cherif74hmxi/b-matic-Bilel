-- ============================================================================
--  Documents du client APRÈS la réservation (carte grise, attestation
--  d'assurance) — formulaire /rendez-vous, écran de confirmation.
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  · Bucket PRIVÉ « client-documents » : aucune URL publique. Seul l'admin lit
--    les fichiers (liens signés de courte durée dans le tableau de bord).
--  · Le visiteur ne peut que DÉPOSER, et seulement dans le dossier de SA
--    demande : le premier segment du chemin est la « Référence dossier »
--    (UUID aléatoire tiré dans le navigateur, enregistré dans leads.details).
--    Dépôt accepté 7 jours après la demande, 4 fichiers au plus par dossier.
--  · Conservation : 90 jours (src/data/legal.ts → documentsRetentionDays).
--    La suppression passe par l'Edge Function « purge-documents » (API Storage :
--    supprimer une ligne de storage.objects en SQL laisserait le fichier en
--    place). Elle est appelée chaque nuit par pg_cron + pg_net.
--
--  Après exécution : déployer la fonction (supabase/functions/purge-documents)
--  puis remplacer <PROJECT_REF> et <ANON_KEY> dans le bloc pg_cron en bas.
-- ============================================================================

-- ---------------------------------------------------------------------------
--  Bucket privé (10 Mo par fichier, images et PDF uniquement)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('client-documents', 'client-documents', false, 10485760,
        array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
--  Le dépôt est-il autorisé pour ce chemin ?
--  « <uuid>/<carte-grise|assurance>-<horodatage>.<jpg|png|webp|pdf> »
--  security definer : le visiteur ne peut pas lire leads, la fonction si.
-- ---------------------------------------------------------------------------
create or replace function public.client_document_upload_allowed(p_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/(carte-grise|assurance)-[0-9]{10,16}\.(jpg|png|webp|pdf)$'
    and exists (
      select 1
      from public.leads l
      where l.details ->> 'Référence dossier' = split_part(p_name, '/', 1)
        and l.created_at > now() - interval '7 days'
        and l.status <> 'archived'
    )
    and (
      select count(*)
      from storage.objects o
      where o.bucket_id = 'client-documents'
        and split_part(o.name, '/', 1) = split_part(p_name, '/', 1)
    ) < 4;
$$;

revoke all on function public.client_document_upload_allowed(text) from public;
grant execute on function public.client_document_upload_allowed(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
--  Règles d'accès (storage.objects)
-- ---------------------------------------------------------------------------
drop policy if exists "client_documents_public_insert" on storage.objects;
create policy "client_documents_public_insert" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'client-documents'
    and public.client_document_upload_allowed(name)
  );

drop policy if exists "client_documents_admin_select" on storage.objects;
create policy "client_documents_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'client-documents' and public.is_admin());

drop policy if exists "client_documents_admin_delete" on storage.objects;
create policy "client_documents_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'client-documents' and public.is_admin());

-- Recherche de la demande par référence (dépôt + affichage admin).
create index if not exists leads_reference_dossier_idx
  on public.leads ((details ->> 'Référence dossier'));

-- ---------------------------------------------------------------------------
--  Purge nocturne (90 jours) : appel de l'Edge Function « purge-documents ».
--  La fonction ne supprime QUE les fichiers de plus de 90 jours : l'appeler
--  avec la clé publique ne permet rien d'autre (pas de secret à stocker ici).
--  ⚠️  Remplacer <PROJECT_REF> et <ANON_KEY> AVANT d'exécuter ce bloc
--      (Project Settings → API). Ré-exécutable : remplace la tâche du même nom.
-- ---------------------------------------------------------------------------
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'bmatic-purge-client-documents',
  '30 3 * * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/purge-documents',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <ANON_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
