-- ============================================================================
--  Créneaux de rendez-vous (page /mecanique) — section 7
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  Règle : créneaux d'1 h, un seul véhicule à la fois, 10h → 19h 7j/7
--  (créneaux de 10:00 à 18:00, heure de Bruxelles). Ces valeurs sont aussi
--  dans src/data/rdv.ts : les changer AUX DEUX ENDROITS.
--
--  · rdv_slots : une ligne par créneau occupé. La clé primaire (date, heure)
--    rend la double réservation impossible, même avec deux clics simultanés.
--    lead_id renseigné = rendez-vous d'un client ; vide = créneau bloqué par
--    l'admin (congé, atelier plein…).
--  · rdv_taken_slots() : créneaux occupés, SANS aucune donnée personnelle.
--  · book_rdv() : enregistre la demande (leads) ET le créneau en une seule
--    transaction. Les visiteurs ne peuvent pas écrire dans rdv_slots autrement.
--  · Archiver ou supprimer la demande libère le créneau.
-- ============================================================================

create table if not exists public.rdv_slots (
  slot_date  date not null,
  slot_hour  smallint not null check (slot_hour between 10 and 18),
  lead_id    uuid unique references public.leads (id) on delete cascade,
  note       text check (char_length(note) <= 200),
  created_at timestamptz not null default now(),
  primary key (slot_date, slot_hour)
);

alter table public.rdv_slots enable row level security;
revoke all on public.rdv_slots from anon, authenticated;
grant select, insert, delete on public.rdv_slots to authenticated;

drop policy if exists "rdv_slots_admin_all" on public.rdv_slots;
create policy "rdv_slots_admin_all" on public.rdv_slots
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
--  Créneaux occupés entre deux dates (62 jours maximum par appel)
-- ---------------------------------------------------------------------------
create or replace function public.rdv_taken_slots(p_from date, p_to date)
returns table (slot_date date, slot_hour smallint)
language sql
stable
security definer
set search_path = ''
as $$
  select s.slot_date, s.slot_hour
  from public.rdv_slots s
  where s.slot_date between p_from and least(p_to, p_from + 62)
  order by 1, 2;
$$;

revoke all on function public.rdv_taken_slots(date, date) from public;
grant execute on function public.rdv_taken_slots(date, date) to anon, authenticated;

-- ---------------------------------------------------------------------------
--  Réservation : 'ok' | 'taken' (déjà pris) | 'limit' (trop de RDV à venir
--  pour ce contact) | 'invalid' (créneau hors horaires, passé ou trop loin,
--  données refusées par les contraintes de leads)
-- ---------------------------------------------------------------------------
create or replace function public.book_rdv(
  p_date    date,
  p_hour    int,
  p_name    text,
  p_email   text,
  p_phone   text,
  p_details jsonb,
  p_consent boolean
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_start timestamptz;
  v_today date := (now() at time zone 'Europe/Brussels')::date;
  v_email text := nullif(lower(trim(p_email)), '');
  v_phone text := nullif(regexp_replace(coalesce(p_phone, ''), '\D', '', 'g'), '');
  v_count int;
  v_lead  uuid;
begin
  if not coalesce(p_consent, false) or p_date is null or p_hour is null
     or p_hour < 10 or p_hour > 18 then
    return 'invalid';
  end if;

  -- Au moins 1 h à l'avance, au plus 90 jours.
  v_start := (p_date + make_time(p_hour, 0, 0)) at time zone 'Europe/Brussels';
  if v_start < now() + interval '1 hour' or p_date > v_today + 90 then
    return 'invalid';
  end if;

  -- Anti-abus : 3 rendez-vous à venir au plus par e-mail ou téléphone.
  select count(*) into v_count
  from public.rdv_slots s
  join public.leads l on l.id = s.lead_id
  where s.slot_date >= v_today
    and (lower(l.email) = v_email
         or regexp_replace(coalesce(l.phone, ''), '\D', '', 'g') = v_phone);
  if v_count >= 3 then
    return 'limit';
  end if;

  insert into public.leads (type, name, email, phone, details, consent)
  values ('rdv', trim(p_name), nullif(trim(p_email), ''), nullif(trim(p_phone), ''),
          coalesce(p_details, '{}'::jsonb), true)
  returning id into v_lead;

  insert into public.rdv_slots (slot_date, slot_hour, lead_id)
  values (p_date, p_hour, v_lead);

  return 'ok';
exception
  -- Créneau pris entre-temps : la demande insérée ci-dessus est annulée aussi.
  when unique_violation then return 'taken';
  when check_violation or not_null_violation then return 'invalid';
end;
$$;

revoke all on function public.book_rdv(date, int, text, text, text, jsonb, boolean) from public;
grant execute on function public.book_rdv(date, int, text, text, text, jsonb, boolean)
  to anon, authenticated;

-- ---------------------------------------------------------------------------
--  Demande archivée → créneau libéré (la suppression, elle, passe par la
--  clé étrangère « on delete cascade »).
-- ---------------------------------------------------------------------------
create or replace function public.free_rdv_slot_on_archive()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'archived' and old.status is distinct from 'archived' then
    delete from public.rdv_slots where lead_id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists leads_free_rdv_slot on public.leads;
create trigger leads_free_rdv_slot
  after update of status on public.leads
  for each row execute function public.free_rdv_slot_on_archive();
