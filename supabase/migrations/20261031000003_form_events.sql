create table if not exists public.form_events (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  form text not null check (form in ('rdv','contact')),
  event text not null check (event in ('start','step','submit')),
  step int, step_label text,
  utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
  gclid text, referrer text, landing_path text,
  created_at timestamptz not null default now()
);
alter table public.form_events enable row level security;
grant insert (session_id, form, event, step, step_label, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, referrer, landing_path)
  on public.form_events to anon, authenticated;
grant select on public.form_events to authenticated;
drop policy if exists form_events_insert on public.form_events;
create policy form_events_insert on public.form_events for insert to anon, authenticated with check (true);
drop policy if exists form_events_admin_read on public.form_events;
create policy form_events_admin_read on public.form_events for select using ((select public.is_admin()));
create index if not exists form_events_session_idx on public.form_events (session_id);
create index if not exists form_events_created_idx on public.form_events (created_at);
