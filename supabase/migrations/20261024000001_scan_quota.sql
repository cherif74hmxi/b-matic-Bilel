-- ============================================================================
--  Quotas du scan de carte grise (formulaire de reprise, ouvert au public)
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  Le scan appelle Gemini (payant) sans compte : l'Edge Function generate-copy
--  consomme ici un « jeton » avant chaque lecture.
--    · plafond global sur 24 h glissantes (protège la facture) ;
--    · plafond par appareil sur 1 h, compté sur un HACHAGE de l'adresse IP
--      (sel secret qui change chaque jour : l'IP n'est jamais stockée en clair
--      et le hachage ne permet pas de suivre quelqu'un d'un jour à l'autre).
--  Les lignes ont plus de 24 h sont effacées à chaque appel.
--  Ni les visiteurs ni l'admin n'y ont accès : seule la fonction (service_role).
-- ============================================================================

create table if not exists public.scan_quota (
  id         bigint generated always as identity primary key,
  ip_hash    text not null check (char_length(ip_hash) = 64),
  created_at timestamptz not null default now()
);
create index if not exists scan_quota_created_idx on public.scan_quota (created_at);
create index if not exists scan_quota_ip_idx on public.scan_quota (ip_hash, created_at);

alter table public.scan_quota enable row level security;
revoke all on public.scan_quota from anon, authenticated;

-- Renvoie 'ok' (jeton consommé), 'ip' (limite de l'appareil) ou 'global' (plafond du jour).
create or replace function public.consume_scan_quota(p_ip_hash text, p_per_hour int, p_per_day int)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_total int;
  v_ip    int;
begin
  -- Un appel à la fois : les compteurs restent exacts même avec des requêtes simultanées.
  perform pg_advisory_xact_lock(hashtext('public.scan_quota'));
  delete from public.scan_quota where created_at < now() - interval '24 hours';

  select count(*) into v_total from public.scan_quota;
  if v_total >= p_per_day then
    return 'global';
  end if;

  select count(*) into v_ip from public.scan_quota
  where ip_hash = p_ip_hash and created_at > now() - interval '1 hour';
  if v_ip >= p_per_hour then
    return 'ip';
  end if;

  insert into public.scan_quota (ip_hash) values (p_ip_hash);
  return 'ok';
end;
$$;

revoke all on function public.consume_scan_quota(text, int, int) from public, anon, authenticated;
grant execute on function public.consume_scan_quota(text, int, int) to service_role;
