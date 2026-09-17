-- =====================================================================
-- 2G HUB — renommage de la boutique (ex « G&C Tech »)
-- Run this in Supabase → SQL Editor (after 0014).
--
-- Les conditions générales de l'Épargne Produit sont stockées en base, dans
-- settings.savings_terms, et éditables depuis /admin/settings. Renommer la
-- boutique dans le code ne les touche donc pas : ce texte est ce que voient
-- réellement les clients avant d'ouvrir un plan d'épargne.
--
-- Idempotent : rejouable sans effet (replace ne trouve plus rien au 2e passage).
-- =====================================================================

update public.settings
set value = jsonb_build_object(
      'fr', replace(value->>'fr', 'G&C Tech', '2G HUB'),
      'en', replace(value->>'en', 'G&C Tech', '2G HUB')
    ),
    updated_at = now()
where key = 'savings_terms'
  and (value->>'fr' like '%G&C Tech%' or value->>'en' like '%G&C Tech%');

-- Contrôle : doit renvoyer 0
--   select count(*) from public.settings
--   where key = 'savings_terms'
--     and (value->>'fr' like '%G&C Tech%' or value->>'en' like '%G&C Tech%');
