-- ============================================================================
--  B MATIC — Tableau de bord KPI (section 6)
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  1. page_views.entry : vrai pour la première page d'une visite (premier
--     affichage du site dans un onglet). Permet de compter des « visites » à
--     côté des « pages vues », toujours SANS cookie ni identifiant : le
--     navigateur ne garde rien (un rechargement compte comme une nouvelle visite).
--  2. click_events : clics sur WhatsApp / téléphone / e-mail / prise de RDV.
--     Seuls le type de clic, la page et la date sont enregistrés.
--  3. Fonctions de statistiques par période (heure / jour / mois), calculées
--     à l'heure de Bruxelles. SECURITY INVOKER : la RLS réserve les lignes à
--     l'admin.
-- ============================================================================

-- ---------------------------------------------------------------------------
--  1. Visites
-- ---------------------------------------------------------------------------
alter table public.page_views add column if not exists entry boolean not null default false;

grant insert (path, referrer, entry) on public.page_views to anon, authenticated;

create index if not exists page_views_entry_created_idx
  on public.page_views (created_at desc) where entry;


-- ---------------------------------------------------------------------------
--  2. Clics de contact
-- ---------------------------------------------------------------------------
create table if not exists public.click_events (
  id         bigint generated always as identity primary key,
  kind       text not null check (kind in ('whatsapp', 'phone', 'email', 'rdv')),
  path       text not null check (path ~ '^/' and char_length(path) <= 512),
  created_at timestamptz not null default now()
);

create index if not exists click_events_created_idx
  on public.click_events (created_at desc);

revoke all on public.click_events from anon, authenticated;
grant insert (kind, path) on public.click_events to anon, authenticated;
grant select, delete on public.click_events to authenticated;

alter table public.click_events enable row level security;

drop policy if exists "click_events_insert" on public.click_events;
create policy "click_events_insert" on public.click_events
  for insert to anon, authenticated
  with check (true);

drop policy if exists "click_events_admin_read" on public.click_events;
create policy "click_events_admin_read" on public.click_events
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "click_events_admin_delete" on public.click_events;
create policy "click_events_admin_delete" on public.click_events
  for delete to authenticated
  using ((select public.is_admin()));


-- ---------------------------------------------------------------------------
--  3a. Courbe de fréquentation : une ligne par heure / jour / mois de la
--      période [p_from, p_to] (dates locales incluses), zéros compris.
--      Le découpage par heure est limité à 31 jours (744 points maximum).
-- ---------------------------------------------------------------------------
create or replace function public.admin_traffic(p_from date, p_to date, p_bucket text)
returns table (bucket timestamp, views bigint, visits bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  with params as (
    select p_bucket as unit,
           p_from::timestamp as t0,
           (least(p_to, p_from + case when p_bucket = 'hour' then 30 else 3660 end) + 1)::timestamp as t1
    where p_bucket in ('hour', 'day', 'month') and p_to >= p_from
  ),
  slots as (
    select gs as bucket
    from params,
         generate_series(date_trunc(unit, t0), t1 - interval '1 microsecond', ('1 ' || unit)::interval) gs
  ),
  hits as (
    select date_trunc(p.unit, pv.created_at at time zone 'Europe/Brussels') as bucket,
           count(*) as views,
           count(*) filter (where pv.entry) as visits
    from params p
    join public.page_views pv
      on pv.created_at >= (p.t0 at time zone 'Europe/Brussels')
     and pv.created_at <  (p.t1 at time zone 'Europe/Brussels')
    group by 1
  )
  select s.bucket, coalesce(h.views, 0), coalesce(h.visits, 0)
  from slots s
  left join hits h using (bucket)
  order by s.bucket;
$$;

revoke all on function public.admin_traffic(date, date, text) from public, anon;
grant execute on function public.admin_traffic(date, date, text) to authenticated;


-- ---------------------------------------------------------------------------
--  3b. Synthèse d'une période [p_from, p_to] (dates locales incluses) :
--      totaux (et période précédente de même durée, pour comparer), clics,
--      demandes par type et statut, pages / véhicules les plus vus, sources.
-- ---------------------------------------------------------------------------
create or replace function public.admin_period_stats(p_from date, p_to date)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with b as (
    select (p_from::timestamp at time zone 'Europe/Brussels') as t0,
           ((p_to + 1)::timestamp at time zone 'Europe/Brussels') as t1,
           ((p_from - (p_to - p_from + 1))::timestamp at time zone 'Europe/Brussels') as prev0
  ),
  pv as (
    select pv.* from public.page_views pv, b
    where pv.created_at >= b.t0 and pv.created_at < b.t1
  )
  select jsonb_build_object(
    'views',  (select count(*) from pv),
    'visits', (select count(*) from pv where entry),
    'prev_views',  (select count(*) from public.page_views x, b
                    where x.created_at >= b.prev0 and x.created_at < b.t0),
    'prev_visits', (select count(*) from public.page_views x, b
                    where x.entry and x.created_at >= b.prev0 and x.created_at < b.t0),
    'clicks', (select coalesce(jsonb_object_agg(kind, n), '{}'::jsonb)
               from (select c.kind, count(*) as n from public.click_events c, b
                     where c.created_at >= b.t0 and c.created_at < b.t1
                     group by c.kind) t),
    'leads', (select coalesce(jsonb_object_agg(type, statuses), '{}'::jsonb)
              from (select type, jsonb_object_agg(status, n) as statuses
                    from (select l.type, l.status, count(*) as n from public.leads l, b
                          where l.created_at >= b.t0 and l.created_at < b.t1
                          group by l.type, l.status) s
                    group by type) t),
    'top_pages', (select coalesce(jsonb_agg(jsonb_build_object('path', path, 'views', n) order by n desc, path), '[]'::jsonb)
                  from (select coalesce(nullif(lower(rtrim(path, '/')), ''), '/') as path, count(*) as n
                        from pv group by 1
                        order by n desc, 1 limit 10) t),
    'top_vehicles', (select coalesce(jsonb_agg(jsonb_build_object(
                                'id', id, 'title', title, 'slug', slug, 'status', status, 'views', n)
                              order by n desc, title), '[]'::jsonb)
                     from (select v.id, v.title, v.slug, v.status, count(*) as n
                           from pv
                           join public.vehicles v
                             on lower(rtrim(pv.path, '/')) = '/vehicules/' || v.slug
                            and pv.created_at >= v.created_at
                           group by v.id
                           order by n desc, v.title limit 10) t),
    'sources', (select coalesce(jsonb_agg(jsonb_build_object('host', host, 'visits', n) order by n desc, host), '[]'::jsonb)
                from (select coalesce(referrer, '') as host, count(*) as n from pv
                      where entry group by 1 order by n desc, 1 limit 8) t)
  );
$$;

revoke all on function public.admin_period_stats(date, date) from public, anon;
grant execute on function public.admin_period_stats(date, date) to authenticated;
