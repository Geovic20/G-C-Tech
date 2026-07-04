-- =====================================================================
-- G&C Tech — Remove product colors (feature dropped)
-- Run this in Supabase → SQL Editor.
--
-- Optional cleanup: the app no longer reads or writes `colors`, so this just
-- removes the now-unused column. Safe to run; irreversible (drops the column).
-- =====================================================================

alter table public.products drop column if exists colors;
