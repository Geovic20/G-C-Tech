-- =====================================================================
-- G&C Tech — Store the product category on each savings plan
-- Run this in Supabase → SQL Editor (after 0001).
--
-- Snapshots the product group (smartphones, computers, …) on the plan so the
-- admin can filter/separate savings by category. Existing plans keep NULL
-- (they will only appear under the "All" filter).
-- =====================================================================

alter table public.savings_plans add column if not exists product_group text;
