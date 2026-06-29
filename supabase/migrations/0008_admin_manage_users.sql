-- =====================================================================
-- G&C Tech — Admin user management
-- Run this in Supabase → SQL Editor (after 0006).
--
-- - Store the email on the profile (denormalized from auth.users) so admins
--   can list users without touching the auth schema from the client.
-- - Let admins update any profile (e.g. change a user's role).
-- =====================================================================

-- ---------- Email on profiles ----------------------------------------
alter table public.profiles add column if not exists email text;

-- Recreate the signup trigger function to also store the email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, fullname)
  values (new.id, new.email, new.raw_user_meta_data->>'fullname')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Backfill emails for existing profiles.
update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is null;

-- ---------- Admins can update any profile (incl. role) ---------------
-- Combined with the existing "update own" policy (which locks the role for a
-- normal user), this lets an admin promote/demote others. Permissive policies
-- are OR'd, so an admin passes via is_admin() regardless of the role lock.
create policy "profiles: admin update" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
