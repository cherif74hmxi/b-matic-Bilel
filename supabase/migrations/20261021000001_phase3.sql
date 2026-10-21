-- ============================================================================
--  B MATIC — Migration Phase 3 (espace admin)
-- ----------------------------------------------------------------------------
--  À exécuter dans Supabase > SQL Editor APRÈS supabase/schema.sql.
--  Ré-exécutable sans risque.
-- ============================================================================

-- ---------------------------------------------------------------------------
--  Tableau de bord : tous les compteurs en une seule requête.
--  SECURITY INVOKER : la RLS s'applique (un non-admin ne voit pas les brouillons,
--  les vues de page ni les demandes).
-- ---------------------------------------------------------------------------
create or replace function public.admin_dashboard_counts()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'visits_total', (select count(*) from public.page_views),
    'visits_30d',   (select count(*) from public.page_views
                     where created_at >= now() - interval '30 days'),
    'vehicles', (select jsonb_build_object(
                   'published', count(*) filter (where status = 'published'),
                   'draft',     count(*) filter (where status = 'draft'),
                   'sold',      count(*) filter (where status = 'sold'))
                 from public.vehicles),
    'posts', (select jsonb_build_object(
                'published', count(*) filter (where status = 'published'),
                'draft',     count(*) filter (where status = 'draft'))
              from public.posts),
    'leads', (select coalesce(jsonb_object_agg(t.type, jsonb_build_object('total', t.total, 'new', t.fresh)), '{}'::jsonb)
              from (select type, count(*) as total, count(*) filter (where status = 'new') as fresh
                    from public.leads group by type) t)
  );
$$;

revoke all on function public.admin_dashboard_counts() from public, anon;
grant execute on function public.admin_dashboard_counts() to authenticated;

-- ---------------------------------------------------------------------------
--  Tableau de bord : pages les plus vues.
-- ---------------------------------------------------------------------------
create or replace function public.admin_top_pages(days integer default 30, max_rows integer default 10)
returns table (path text, views bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select pv.path, count(*) as views
  from public.page_views pv
  where pv.created_at >= now() - make_interval(days => greatest(days, 1))
  group by pv.path
  order by views desc, pv.path
  limit least(greatest(max_rows, 1), 50);
$$;

revoke all on function public.admin_top_pages(integer, integer) from public, anon;
grant execute on function public.admin_top_pages(integer, integer) to authenticated;

-- ---------------------------------------------------------------------------
--  Une annonce visible (publiée ou vendue) doit avoir un prix.
--  (Vérifié aussi dans l'admin, mais la règle vit ici pour tout client.)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'vehicles_price_when_listed') then
    alter table public.vehicles
      add constraint vehicles_price_when_listed check (status = 'draft' or price_eur is not null);
  end if;
end;
$$;
