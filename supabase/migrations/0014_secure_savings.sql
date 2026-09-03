-- =====================================================================
-- G&C Tech — Verrouillage de l'Épargne Produit (correctifs C-1 et C-2)
-- Run this in Supabase → SQL Editor (after 0001–0013).
--
-- Deux chemins permettaient d'obtenir un produit sans le payer :
--
--   C-1  La politique RLS "contributions: insert own" (0001) laissait tout
--        compte authentifié insérer une contribution du montant de son choix,
--        directement via l'API REST avec la clé anon (publique). Le trigger
--        trg_recompute_plan passait ensuite le plan à 'completed'.
--        → La politique est retirée. Seul le webhook FedaPay crédite désormais,
--          et il utilise la clé service_role, qui contourne la RLS.
--
--   C-2  target_amount / product_name / installment étaient envoyés par le
--        client et jamais confrontés au catalogue : un plan pour un produit à
--        999 000 F pouvait viser 1 000 F et se terminer légitimement après un
--        vrai paiement FedaPay de 1 000 F.
--        → Un trigger before insert résout le produit en base et réécrit les
--          montants. Le prix catalogue fait foi.
--
-- Idempotent : rejouable sans effet de bord.
-- =====================================================================


-- ---------------------------------------------------------------------
-- C-1 — Les contributions ne peuvent plus venir du navigateur
-- ---------------------------------------------------------------------
-- Après ce drop, plus aucune politique INSERT n'existe sur la table et la RLS
-- est active : les rôles anon et authenticated ne peuvent plus rien y écrire.
-- Le webhook (service_role) et les corrections manuelles en SQL Editor ne sont
-- pas concernés. Les politiques de lecture (propriétaire + admin) sont intactes.
DROP POLICY IF EXISTS "contributions: insert own" ON public.contributions;


-- ---------------------------------------------------------------------
-- C-2 — Le catalogue fait foi sur le prix et l'identité du produit
-- ---------------------------------------------------------------------
-- Les refus utilisent `raise exception` sans errcode explicite, donc le SQLSTATE
-- par défaut P0001 (raise_exception), que PostgREST traduit en HTTP 400. Un code
-- personnalisé (GC001…) serait passé en 500 côté API : fonctionnel, mais chaque
-- refus de validation apparaîtrait comme une erreur serveur dans les logs.
-- Le message porte un préfixe stable que le client reconnaît.
create or replace function public.validate_savings_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_product_id uuid;
  v_prod       record;
begin
  -- savings_plans.product_id est un text (choix de 0001, conservé pour ne pas
  -- casser l'historique). On refuse proprement tout ce qui n'est pas un uuid :
  -- le catalogue statique de secours de l'app utilise des ids '1', '2', … et
  -- une conversion nue produirait une erreur Postgres illisible.
  begin
    v_product_id := new.product_id::uuid;
  exception when invalid_text_representation then
    raise exception 'PRODUCT_UNAVAILABLE: identifiant produit invalide (%)',
      new.product_id;
  end;

  select pr.name, pr.image, pr.price, ct.slug as group_slug
    into v_prod
    from public.products pr
    left join public.categories ct on ct.id = pr.category_id
   where pr.id = v_product_id;

  if not found then
    raise exception 'PRODUCT_UNAVAILABLE: produit absent du catalogue (%)',
      new.product_id;
  end if;

  if v_prod.price is null or v_prod.price <= 0 then
    raise exception 'PRODUCT_UNAVAILABLE: produit sans prix exploitable (%)',
      v_prod.name;
  end if;

  -- Le prix catalogue écrase ce qu'a envoyé le client.
  new.target_amount := v_prod.price;
  new.product_name  := v_prod.name;
  new.product_image := v_prod.image;
  new.product_group := v_prod.group_slug;

  -- Le versement suggéré reste borné à 1..prix (il sert de montant par défaut
  -- à create-payment, qui applique de son côté min(installment, restant)).
  new.installment := greatest(
    1,
    least(coalesce(new.installment, v_prod.price), v_prod.price)
  );

  -- Un plan démarre toujours vide et actif : le client ne peut ni se
  -- pré-créditer, ni ouvrir un plan déjà 'completed'.
  new.saved_amount := 0;
  new.status       := 'active';

  return new;
end;
$$;

drop trigger if exists trg_validate_plan on public.savings_plans;
create trigger trg_validate_plan
  before insert on public.savings_plans
  for each row execute function public.validate_savings_plan();


-- =====================================================================
-- Audit des données existantes (à lancer une fois, à la main)
--
-- 1. Contributions qui n'ont pas pu venir du webhook FedaPay : celui-ci
--    renseigne toujours method='fedapay' et reference=<id de transaction>.
--    Tout le reste est soit un test de la V1 simulée, soit une exploitation
--    de C-1.
--
--      select p.user_id, pr.email, p.product_name, p.target_amount,
--             c.amount, c.method, c.reference, c.created_at
--        from public.contributions c
--        join public.savings_plans p on p.id = c.plan_id
--        left join public.profiles pr on pr.id = p.user_id
--       where c.reference is null or c.method <> 'fedapay'
--       order by c.created_at desc;
--
-- 2. Plans dont l'objectif ne correspond pas au prix du catalogue — la trace
--    de C-2, qui ne laisse par ailleurs aucun indice dans les contributions.
--
--      select p.id, pr.email, p.product_name, p.target_amount,
--             c.price as prix_catalogue, p.saved_amount, p.status
--        from public.savings_plans p
--        left join public.products c
--               on c.id::text = p.product_id
--        left join public.profiles pr on pr.id = p.user_id
--       where c.id is null or c.price <> p.target_amount
--       order by p.created_at desc;
--
--    Pour un plan touché : le suspendre le temps de le régulariser
--      update public.savings_plans set status = 'suspended' where id = '<id>';
-- =====================================================================
