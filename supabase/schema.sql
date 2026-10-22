-- ============================================================================
--  B MATIC — Schéma Supabase (Phase 2 : fondations backend)
-- ----------------------------------------------------------------------------
--  À exécuter dans Supabase > SQL Editor (en une fois). Le script est
--  ré-exécutable : tables « if not exists », policies supprimées puis recréées.
--  Ensuite, exécuter les fichiers de supabase/migrations/ dans l'ordre de leur nom.
--
--  Modèle de sécurité (RLS, cf. docs/PROJET-V2.md §7) :
--    • visiteurs (anon)   → lecture des véhicules / actus publiés uniquement,
--                           insertion de vues de page et de demandes (leads) ;
--    • admin (authentifié ET présent dans public.admins) → tout le reste.
--  Un simple compte authentifié qui n'est pas dans public.admins n'a AUCUN
--  droit d'écriture. Désactiver de toute façon les inscriptions publiques
--  (Authentication > Sign In / Providers > « Allow new users to sign up »).
--
--  RGPD : aucune IP, aucun user-agent, aucun cookie dans page_views.
-- ============================================================================


-- ---------------------------------------------------------------------------
--  Administrateurs
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER : lit public.admins sans dépendre des droits de l'appelant.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- ---------------------------------------------------------------------------
--  Trigger commun : updated_at + published_at
-- ---------------------------------------------------------------------------
create or replace function public.set_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;


-- ---------------------------------------------------------------------------
--  Véhicules à vendre
-- ---------------------------------------------------------------------------
create table if not exists public.vehicles (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status       text not null default 'draft'
               check (status in ('draft', 'published', 'sold')),
  title        text not null check (char_length(title) between 1 and 200),
  vin          text check (vin is null or vin ~ '^[A-HJ-NPR-Z0-9]{17}$'),
  make         text not null check (char_length(make) between 1 and 60),
  model        text not null check (char_length(model) between 1 and 80),
  version      text check (char_length(version) <= 120),
  year         smallint check (year between 1950 and 2100),
  mileage_km   integer check (mileage_km >= 0),
  fuel         text check (fuel in ('essence', 'diesel', 'hybride', 'hybride_rechargeable', 'electrique', 'gpl', 'autre')),
  gearbox      text check (gearbox in ('manuelle', 'automatique')),
  power_hp     smallint check (power_hp > 0),
  price_eur    integer check (price_eur >= 0),
  description  text check (char_length(description) <= 10000),
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists vehicles_status_published_idx
  on public.vehicles (status, published_at desc);

drop trigger if exists vehicles_set_timestamps on public.vehicles;
create trigger vehicles_set_timestamps
  before insert or update on public.vehicles
  for each row execute function public.set_timestamps();


-- ---------------------------------------------------------------------------
--  Photos des véhicules (emplacements guidés façon leboncoin, §5.3)
--  Le fichier est dans le bucket « vehicle-photos », storage_path = chemin
--  dans ce bucket (ex. "<vehicle_id>/<uuid>.jpg").
-- ---------------------------------------------------------------------------
create table if not exists public.vehicle_photos (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid not null references public.vehicles (id) on delete cascade,
  storage_path text not null unique,
  slot         text not null default 'autre'
               check (slot in (
                 'couverture', 'avant_gauche_3_4', 'arriere_droit_3_4',
                 'interieur_conducteur', 'interieur_passager', 'profil_gauche',
                 'detail_exterieur', 'equipement_1', 'equipement_2',
                 'roue', 'coffre', 'autre'
               )),
  position     smallint not null default 0,
  is_cover     boolean not null default false,
  alt          text check (char_length(alt) <= 200),
  created_at   timestamptz not null default now()
);

create index if not exists vehicle_photos_vehicle_idx
  on public.vehicle_photos (vehicle_id, position);

-- Une seule photo de couverture par véhicule
create unique index if not exists vehicle_photos_one_cover_idx
  on public.vehicle_photos (vehicle_id) where is_cover;


-- ---------------------------------------------------------------------------
--  Actualités (blog du garage)
-- ---------------------------------------------------------------------------
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  status       text not null default 'draft'
               check (status in ('draft', 'published')),
  title        text not null check (char_length(title) between 1 and 200),
  excerpt      text check (char_length(excerpt) <= 500),
  content      text not null default '' check (char_length(content) <= 50000),
  cover_path   text,  -- chemin dans le bucket « post-images »
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);

drop trigger if exists posts_set_timestamps on public.posts;
create trigger posts_set_timestamps
  before insert or update on public.posts
  for each row execute function public.set_timestamps();


-- ---------------------------------------------------------------------------
--  Vues de page (analytics sans cookie) — KPI admin
-- ---------------------------------------------------------------------------
create table if not exists public.page_views (
  id         bigint generated always as identity primary key,
  path       text not null check (path ~ '^/' and char_length(path) <= 512),
  referrer   text check (char_length(referrer) <= 512),
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_idx
  on public.page_views (created_at desc);


-- ---------------------------------------------------------------------------
--  Demandes reçues (contact / RDV mécanique / reprise)
--  Les champs propres à chaque formulaire vont dans « details » (jsonb).
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id         uuid primary key default gen_random_uuid(),
  type       text not null check (type in ('contact', 'rdv', 'reprise')),
  status     text not null default 'new'
             check (status in ('new', 'in_progress', 'done', 'archived')),
  name       text not null check (char_length(name) between 1 and 120),
  email      text check (email is null or (char_length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  phone      text check (char_length(phone) <= 40),
  message    text check (char_length(message) <= 5000),
  details    jsonb not null default '{}'::jsonb
             check (jsonb_typeof(details) = 'object' and pg_column_size(details) <= 20000),
  consent    boolean not null check (consent),  -- case RGPD obligatoire
  created_at timestamptz not null default now(),
  check (email is not null or phone is not null)
);

create index if not exists leads_created_idx
  on public.leads (created_at desc);
create index if not exists leads_status_idx
  on public.leads (status, created_at desc);


-- ============================================================================
--  Droits (explicites, puis restreints par RLS)
-- ============================================================================
revoke all on public.admins, public.vehicles, public.vehicle_photos,
              public.posts, public.page_views, public.leads
  from anon, authenticated;

-- Visiteurs
grant select on public.vehicle_photos, public.posts to anon;
-- Véhicules : toutes les colonnes SAUF le VIN (jamais exposé aux visiteurs).
grant select (id, slug, status, title, make, model, version, year, mileage_km,
                fuel, gearbox, power_hp, price_eur, description,
                published_at, created_at, updated_at)
  on public.vehicles to anon;
grant insert (path, referrer) on public.page_views to anon;
grant insert (type, name, email, phone, message, details, consent)
  on public.leads to anon;

-- Utilisateurs connectés (l'admin) — RLS limite ensuite à public.admins
grant select on public.admins to authenticated;
grant select, insert, update, delete
  on public.vehicles, public.vehicle_photos, public.posts to authenticated;
grant select, delete on public.page_views to authenticated;
grant insert (path, referrer) on public.page_views to authenticated;
grant select, update, delete on public.leads to authenticated;
grant insert (type, name, email, phone, message, details, consent)
  on public.leads to authenticated;


-- ============================================================================
--  Row Level Security
-- ============================================================================
alter table public.admins         enable row level security;
alter table public.vehicles       enable row level security;
alter table public.vehicle_photos enable row level security;
alter table public.posts          enable row level security;
alter table public.page_views     enable row level security;
alter table public.leads          enable row level security;

-- admins : chacun peut vérifier s'il est admin (aucune écriture via l'API)
drop policy if exists "admins_select_self" on public.admins;
create policy "admins_select_self" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

-- vehicles
drop policy if exists "vehicles_public_read" on public.vehicles;
create policy "vehicles_public_read" on public.vehicles
  for select to anon, authenticated
  using (status in ('published', 'sold'));

drop policy if exists "vehicles_admin_all" on public.vehicles;
create policy "vehicles_admin_all" on public.vehicles
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- vehicle_photos : visibles si le véhicule l'est
drop policy if exists "vehicle_photos_public_read" on public.vehicle_photos;
create policy "vehicle_photos_public_read" on public.vehicle_photos
  for select to anon, authenticated
  using (exists (
    select 1 from public.vehicles v
    where v.id = vehicle_id and v.status in ('published', 'sold')
  ));

drop policy if exists "vehicle_photos_admin_all" on public.vehicle_photos;
create policy "vehicle_photos_admin_all" on public.vehicle_photos
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- posts
drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- page_views : tout le monde insère, seul l'admin lit / purge
drop policy if exists "page_views_insert" on public.page_views;
create policy "page_views_insert" on public.page_views
  for insert to anon, authenticated
  with check (true);

drop policy if exists "page_views_admin_read" on public.page_views;
create policy "page_views_admin_read" on public.page_views
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "page_views_admin_delete" on public.page_views;
create policy "page_views_admin_delete" on public.page_views
  for delete to authenticated
  using ((select public.is_admin()));

-- leads : tout le monde dépose une demande (consentement exigé par la
-- contrainte), seul l'admin lit / traite / supprime.
-- ⚠️  Côté front : insert(...) SANS .select(), le visiteur ne peut pas relire.
drop policy if exists "leads_insert" on public.leads;
create policy "leads_insert" on public.leads
  for insert to anon, authenticated
  with check (consent and status = 'new');

drop policy if exists "leads_admin_read" on public.leads;
create policy "leads_admin_read" on public.leads
  for select to authenticated
  using ((select public.is_admin()));

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "leads_admin_delete" on public.leads;
create policy "leads_admin_delete" on public.leads
  for delete to authenticated
  using ((select public.is_admin()));


-- ============================================================================
--  Storage : photos véhicules + images d'actualités
--  Buckets publics (lecture via URL publique, nécessaire pour l'affichage),
--  écriture réservée à l'admin. Utiliser des noms de fichiers aléatoires
--  (uuid) : l'URL d'une photo de brouillon n'est pas devinable.
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('vehicle-photos', 'vehicle-photos', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('post-images', 'post-images', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "bmatic_storage_admin_select" on storage.objects;
create policy "bmatic_storage_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id in ('vehicle-photos', 'post-images') and (select public.is_admin()));

drop policy if exists "bmatic_storage_admin_insert" on storage.objects;
create policy "bmatic_storage_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('vehicle-photos', 'post-images') and (select public.is_admin()));

drop policy if exists "bmatic_storage_admin_update" on storage.objects;
create policy "bmatic_storage_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id in ('vehicle-photos', 'post-images') and (select public.is_admin()))
  with check (bucket_id in ('vehicle-photos', 'post-images') and (select public.is_admin()));

drop policy if exists "bmatic_storage_admin_delete" on storage.objects;
create policy "bmatic_storage_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id in ('vehicle-photos', 'post-images') and (select public.is_admin()));


-- ============================================================================
--  APRÈS exécution : déclarer le compte admin
--  1) Authentication > Users > « Add user » (e-mail + mot de passe du proprio)
--  2) Exécuter (en remplaçant l'e-mail) :
--
--     insert into public.admins (user_id)
--     select id from auth.users where email = 'proprio@exemple.be'
--     on conflict do nothing;
-- ============================================================================
