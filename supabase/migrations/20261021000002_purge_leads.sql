-- ============================================================================
--  B MATIC — Suppression automatique des demandes après 3 ans (RGPD)
-- ----------------------------------------------------------------------------
--  Durée annoncée dans la politique de confidentialité
--  (src/data/legal.ts → leadsRetentionYears). Si elle change, modifier
--  l'intervalle ci-dessous ET legal.ts : le test src/test/retention.test.ts
--  échoue tant que les deux ne concordent pas.
--
--  Prérequis : extension pg_cron. Soit l'activer dans Supabase > Database >
--  Extensions (« pg_cron »), soit laisser la ligne « create extension » le faire.
--  Ré-exécutable : cron.schedule remplace la tâche du même nom.
-- ============================================================================

create extension if not exists pg_cron;

-- Chaque nuit à 3 h (UTC) : suppression des demandes de plus de 3 ans.
select cron.schedule(
  'bmatic-purge-leads',
  '0 3 * * *',
  $$delete from public.leads where created_at < now() - interval '3 years'$$
);
