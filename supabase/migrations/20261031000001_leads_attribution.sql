-- ============================================================================
--  Origine du visiteur enregistrée avec chaque demande (table leads)
--  À exécuter dans Supabase → SQL Editor (ré-exécutable sans risque).
-- ----------------------------------------------------------------------------
--  Colonnes déjà ajoutées en production à la main (octobre 2026) : ce fichier
--  garde l'historique et ajoute ce qui pourrait manquer.
--
--  · utm_* / gclid : paramètres de la publicité ou de la campagne d'arrivée ;
--  · referrer      : site d'où vient le visiteur (sans paramètres) ;
--  · landing_path  : première page vue pendant la visite.
--  Lus par le site dans sessionStorage (src/lib/attribution.ts), sans cookie.
--
--  ⚠️  Le GRANT est indispensable : les visiteurs (anon) ne peuvent insérer
--      que les colonnes listées. Sans lui, Supabase refuse la demande et le
--      site la renvoie sans ces champs (src/lib/leads.ts) : la demande n'est
--      pas perdue, mais son origine l'est.
-- ============================================================================

alter table public.leads
  add column if not exists utm_source   text,
  add column if not exists utm_medium   text,
  add column if not exists utm_campaign text,
  add column if not exists utm_term     text,
  add column if not exists utm_content  text,
  add column if not exists gclid        text,
  add column if not exists referrer     text,
  add column if not exists landing_path text;

-- Longueur bornée (le site tronque déjà à 255) : pas de texte géant envoyé
-- directement à l'API.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'leads_attribution_length') then
    alter table public.leads add constraint leads_attribution_length check (
      coalesce(char_length(utm_source), 0)   <= 255 and
      coalesce(char_length(utm_medium), 0)   <= 255 and
      coalesce(char_length(utm_campaign), 0) <= 255 and
      coalesce(char_length(utm_term), 0)     <= 255 and
      coalesce(char_length(utm_content), 0)  <= 255 and
      coalesce(char_length(gclid), 0)        <= 255 and
      coalesce(char_length(referrer), 0)     <= 255 and
      coalesce(char_length(landing_path), 0) <= 255
    );
  end if;
end $$;

grant insert (utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, referrer, landing_path)
  on public.leads to anon, authenticated;
