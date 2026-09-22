-- =====================================================================
-- 2G HUB — Annulation d'une épargne par l'administrateur
-- Run this in Supabase → SQL Editor (after 0015).
--
-- Jusqu'ici, annuler une épargne se faisait en basculant simplement le statut
-- à 'cancelled' depuis un menu déroulant : aucune trace du motif, de la date,
-- ni de l'auteur. Comme le client a de l'argent épargné sur le plan, on veut
-- une action tracée et un motif communiqué au client.
--
-- Cette migration n'ajoute que des colonnes (aucune donnée touchée). Les
-- politiques RLS existantes suffisent :
--   • l'admin peut déjà mettre à jour n'importe quel plan (0012) → il peut donc
--     renseigner ces colonnes ;
--   • le client lit déjà ses propres plans (0001) → il voit donc le motif.
--
-- Idempotent : rejouable sans effet.
-- =====================================================================

alter table public.savings_plans
  add column if not exists cancellation_reason text,
  add column if not exists cancelled_at         timestamptz,
  add column if not exists cancelled_by         uuid references auth.users(id) on delete set null;

comment on column public.savings_plans.cancellation_reason is
  'Motif d''annulation, saisi par l''admin et affiché au client.';
comment on column public.savings_plans.cancelled_at is
  'Horodatage de l''annulation.';
comment on column public.savings_plans.cancelled_by is
  'Administrateur ayant annulé le plan (auth.users.id).';
