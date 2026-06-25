-- =====================================================================
-- G&C Tech — Profiles & roles
-- Run this in Supabase → SQL Editor (after 0001–0005).
--
-- - One profile row per auth user (id = auth.users.id), with a `role`.
-- - Auto-created on signup via a trigger; existing users are backfilled.
-- - Admins get write access to the catalog and read/manage access to orders.
-- - A client CANNOT promote itself to admin (role is locked in the RLS check);
--   you promote an admin via SQL (see bottom).
-- =====================================================================

-- ---------- Table -----------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  role       text not null default 'customer' check (role in ('customer','admin')),
  fullname   text,
  phone      text,
  created_at timestamptz not null default now()
);

-- ---------- Helper functions (security definer = bypass RLS, no recursion) ----
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.my_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------- Auto-create a profile on signup --------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, fullname)
  values (new.id, new.raw_user_meta_data->>'fullname')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist.
insert into public.profiles (id, fullname)
select id, raw_user_meta_data->>'fullname' from auth.users
on conflict (id) do nothing;

-- ---------- RLS: profiles --------------------------------------------
alter table public.profiles enable row level security;

create policy "profiles: select own"   on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: admin read"   on public.profiles
  for select using (public.is_admin());
-- Update own profile, but the role must stay unchanged (no self-promotion).
create policy "profiles: update own"   on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = public.my_role());

-- ---------- Admin write access on the catalog ------------------------
create policy "products: admin insert"   on public.products   for insert with check (public.is_admin());
create policy "products: admin update"   on public.products   for update using (public.is_admin()) with check (public.is_admin());
create policy "products: admin delete"   on public.products   for delete using (public.is_admin());

create policy "brands: admin insert"     on public.brands     for insert with check (public.is_admin());
create policy "brands: admin update"     on public.brands     for update using (public.is_admin()) with check (public.is_admin());
create policy "brands: admin delete"     on public.brands     for delete using (public.is_admin());

create policy "categories: admin insert" on public.categories for insert with check (public.is_admin());
create policy "categories: admin update" on public.categories for update using (public.is_admin()) with check (public.is_admin());
create policy "categories: admin delete" on public.categories for delete using (public.is_admin());

-- ---------- Admin access on orders -----------------------------------
create policy "orders: admin read"        on public.orders      for select using (public.is_admin());
create policy "orders: admin update"      on public.orders      for update using (public.is_admin()) with check (public.is_admin());
create policy "order_items: admin read"   on public.order_items for select using (public.is_admin());

-- =====================================================================
-- Promote a user to admin (run manually, replace the email):
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'you@example.com');
-- =====================================================================
