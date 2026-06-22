-- =====================================================================
-- G&C Tech — Enforce "one active savings plan per user"
-- Run this in Supabase → SQL Editor (after 0001).
--
-- A partial unique index allows at most ONE row per user with status='active'.
-- Completed/cancelled plans don't count, so a user can start a new plan once
-- the previous one is finished.
--
-- ⚠️ If you already created several active plans while testing, this index
--    will fail to create until you resolve the duplicates, e.g.:
--      update public.savings_plans set status = 'cancelled'
--      where status = 'active' and id <> (
--        select id from public.savings_plans
--        where status = 'active' and user_id = '<your-user-id>'
--        order by created_at desc limit 1
--      );
-- =====================================================================

create unique index if not exists one_active_plan_per_user
  on public.savings_plans (user_id)
  where status = 'active';
