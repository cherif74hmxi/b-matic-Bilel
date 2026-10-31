alter table public.page_views
  add column if not exists session_id text, add column if not exists utm_source text,
  add column if not exists utm_medium text, add column if not exists utm_campaign text,
  add column if not exists utm_term text, add column if not exists utm_content text,
  add column if not exists gclid text;
grant insert (session_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid)
  on public.page_views to anon, authenticated;
