-- ============================================================================
--  Pages publiques : compteur de vues + VIN masqué aux visiteurs
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  page_views n'est lisible que par l'admin. Cette fonction renvoie seulement
--  un TOTAL pour une fiche en ligne (véhicule publié ou vendu, actualité
--  publiée), avec la même règle que admin_content_views : vues de l'adresse
--  /vehicules/<slug> ou /actualites/<slug> depuis la création de la fiche.
--  Aucune autre donnée de page_views n'est exposée.
-- ============================================================================

create or replace function public.public_view_count(p_kind text, p_slug text)
returns bigint
language sql
stable
security definer
set search_path = ''
as $$
  with item as (
    select '/vehicules/' || v.slug as path, v.created_at
    from public.vehicles v
    where p_kind = 'vehicules' and v.slug = p_slug and v.status in ('published', 'sold')
    union all
    select '/actualites/' || p.slug, p.created_at
    from public.posts p
    where p_kind = 'actualites' and p.slug = p_slug and p.status = 'published'
  )
  select count(pv.id)
  from item i
  join public.page_views pv
    on lower(rtrim(pv.path, '/')) = i.path
   and pv.created_at >= i.created_at;
$$;

revoke all on function public.public_view_count(text, text) from public;
grant execute on function public.public_view_count(text, text) to anon, authenticated;

-- ----------------------------------------------------------------------------
--  VIN : le site public ne l'affiche pas, et l'API ne doit pas le livrer non
--  plus (la clé « anon » est publique). Droit de lecture colonne par colonne,
--  VIN exclu. Toute colonne AJOUTÉE plus tard à vehicles devra être ajoutée ici
--  si elle doit être lisible par les visiteurs.
-- ----------------------------------------------------------------------------
revoke select on public.vehicles from anon;
grant select (id, slug, status, title, make, model, version, year, mileage_km,
                fuel, gearbox, power_hp, price_eur, description,
                published_at, created_at, updated_at)
  on public.vehicles to anon;
