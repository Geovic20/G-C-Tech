-- =====================================================================
-- G&C Tech — Wishlists (favoris)
-- Run this in Supabase → SQL Editor.
--
-- One row per (user, product). product_id is stored as text (no FK) to match
-- how the cart/savings reference products and to keep favorites even if a
-- product is later removed. RLS: a user only sees/manages their own favorites.
-- =====================================================================

create table if not exists public.wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create index if not exists wishlists_user_id_idx on public.wishlists(user_id);

alter table public.wishlists enable row level security;

create policy "wishlists: select own" on public.wishlists
  for select using (auth.uid() = user_id);
create policy "wishlists: insert own" on public.wishlists
  for insert with check (auth.uid() = user_id);
create policy "wishlists: delete own" on public.wishlists
  for delete using (auth.uid() = user_id);
