-- ============================================================================
--  Vues par fiche véhicule / actualité (admin)
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  Une vue = une ligne de page_views sur l'adresse publique de la fiche :
--    /vehicules/<slug>  ou  /actualites/<slug>  (majuscules et barre finale tolérées).
--  On ne compte que les vues postérieures à la création de la fiche : une
--  nouvelle fiche qui reprend l'adresse d'une fiche supprimée n'hérite pas de
--  ses vues. Si l'adresse d'une fiche change, le compteur repart de zéro.
-- ============================================================================

-- Chemin normalisé (minuscules, sans « / » final) : sert la jointure ci-dessous.
create index if not exists page_views_norm_path_idx
  on public.page_views ((lower(rtrim(path, '/'))));

drop function if exists public.admin_content_views();

create or replace function public.admin_content_views(p_kind text)
returns table (id uuid, views_total bigint, views_30d bigint)
language sql
stable
security invoker  -- RLS de page_views : seul un admin lit des lignes
set search_path = ''
as $$
  with items as (
    select v.id, '/vehicules/' || v.slug as path, v.created_at from public.vehicles v where p_kind = 'vehicules'
    union all
    select p.id, '/actualites/' || p.slug, p.created_at from public.posts p where p_kind = 'actualites'
  )
  select i.id,
         count(pv.id) as views_total,
         count(pv.id) filter (where pv.created_at >= now() - interval '30 days') as views_30d
  from items i
  left join public.page_views pv
    on lower(rtrim(pv.path, '/')) = i.path
   and pv.created_at >= i.created_at
  group by i.id;
$$;

revoke all on function public.admin_content_views(text) from public, anon;
grant execute on function public.admin_content_views(text) to authenticated;
