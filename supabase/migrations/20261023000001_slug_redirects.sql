-- ============================================================================
--  Redirections d'adresses (slugs) des fiches publiées
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  L'adresse d'une fiche est figée après sa publication dans l'admin. Si elle
--  est malgré tout changée, l'ancienne adresse est enregistrée ici
--  automatiquement (trigger) : les pages publiques redirigent alors vers la
--  nouvelle, et les liens déjà partagés continuent de fonctionner.
-- ============================================================================

create table if not exists public.slug_redirects (
  kind       text not null check (kind in ('vehicules', 'actualites')),
  old_slug   text not null,
  target_id  uuid not null,
  created_at timestamptz not null default now(),
  primary key (kind, old_slug)
);

alter table public.slug_redirects enable row level security;
revoke all on public.slug_redirects from anon;
grant select, delete on public.slug_redirects to authenticated;

drop policy if exists "slug_redirects_admin_read" on public.slug_redirects;
create policy "slug_redirects_admin_read" on public.slug_redirects
  for select to authenticated using (public.is_admin());
drop policy if exists "slug_redirects_admin_delete" on public.slug_redirects;
create policy "slug_redirects_admin_delete" on public.slug_redirects
  for delete to authenticated using (public.is_admin());

-- Enregistre l'ancienne adresse quand une fiche déjà publiée change de slug.
create or replace function public.record_slug_redirect()
returns trigger
language plpgsql
security definer  -- écrit dans slug_redirects quel que soit l'appelant (l'UPDATE, lui, reste soumis à la RLS)
set search_path = ''
as $$
declare
  v_kind text := case tg_table_name when 'vehicles' then 'vehicules' else 'actualites' end;
begin
  if new.slug is distinct from old.slug and old.published_at is not null then
    insert into public.slug_redirects (kind, old_slug, target_id)
    values (v_kind, old.slug, new.id)
    on conflict (kind, old_slug) do update set target_id = excluded.target_id, created_at = now();
  end if;
  -- La fiche reprend une ancienne adresse à elle : plus besoin de rediriger.
  -- (Les anciennes adresses des AUTRES fiches sont réservées côté admin, jamais supprimées ici.)
  delete from public.slug_redirects where kind = v_kind and old_slug = new.slug and target_id = new.id;
  return new;
end;
$$;

drop trigger if exists vehicles_slug_redirect on public.vehicles;
create trigger vehicles_slug_redirect
  after update of slug on public.vehicles
  for each row execute function public.record_slug_redirect();

drop trigger if exists posts_slug_redirect on public.posts;
create trigger posts_slug_redirect
  after update of slug on public.posts
  for each row execute function public.record_slug_redirect();

-- Pages publiques : ancienne adresse → adresse actuelle (si la fiche est visible), sinon null.
create or replace function public.resolve_slug_redirect(p_kind text, p_slug text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(v.slug, p.slug)
  from public.slug_redirects r
  left join public.vehicles v on p_kind = 'vehicules' and v.id = r.target_id and v.status in ('published', 'sold')
  left join public.posts p on p_kind = 'actualites' and p.id = r.target_id and p.status = 'published'
  where r.kind = p_kind and r.old_slug = p_slug
  limit 1;
$$;

revoke all on function public.resolve_slug_redirect(text, text) from public;
grant execute on function public.resolve_slug_redirect(text, text) to anon, authenticated;
