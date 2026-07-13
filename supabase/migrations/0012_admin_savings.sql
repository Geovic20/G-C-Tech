-- =====================================================================
-- G&C Tech — Admin oversight of savings plans
-- Run this in Supabase → SQL Editor (after 0001 & 0006).
--
-- - Adds a 'suspended' status.
-- - Lets admins read ALL plans/contributions and change a plan's status.
--   (Regular users keep seeing only their own, via the 0001 policies.)
-- =====================================================================

-- Allow the 'suspended' status.
alter table public.savings_plans drop constraint if exists savings_plans_status_check;
alter table public.savings_plans add constraint savings_plans_status_check
  check (status in ('active', 'completed', 'cancelled', 'suspended'));

-- Admin can read every plan and every contribution.
create policy "plans: admin read" on public.savings_plans
  for select using (public.is_admin());
create policy "plans: admin update" on public.savings_plans
  for update using (public.is_admin()) with check (public.is_admin());
create policy "contributions: admin read" on public.contributions
  for select using (public.is_admin());

-- NOTE: the "one active plan per user" unique index (0002) only applies to
-- status = 'active', so suspended/completed/cancelled plans never conflict.
-- Reactivating a suspended plan while the user already has another active one
-- will be rejected by that index (handled gracefully in the UI).
