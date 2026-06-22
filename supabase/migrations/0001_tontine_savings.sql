-- =====================================================================
-- G&C Tech — Tontine "Épargne Produit" (V1)
-- Run this in Supabase → SQL Editor.
--
-- Model: a customer saves toward ONE product until 100% is reached.
-- Funds accumulate via "contributions"; a trigger keeps the plan total
-- in sync so the client can never set the saved amount directly.
-- (In the payment phase, contributions will be inserted by a server-side
--  webhook after the PSP confirms the transfer — never trusted from the client.)
-- =====================================================================

-- ---------- Tables ----------------------------------------------------
create table if not exists public.savings_plans (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  product_id    text not null,
  product_name  text not null,
  product_image text,
  target_amount integer not null check (target_amount > 0),   -- in CFA
  saved_amount  integer not null default 0 check (saved_amount >= 0),
  installment   integer check (installment > 0),              -- suggested amount per contribution (CFA)
  cadence       text not null check (cadence in ('daily','weekly','monthly')),
  status        text not null default 'active' check (status in ('active','completed','cancelled')),
  target_date   date,
  created_at    timestamptz not null default now()
);

create table if not exists public.contributions (
  id         uuid primary key default gen_random_uuid(),
  plan_id    uuid not null references public.savings_plans(id) on delete cascade,
  user_id    uuid not null references auth.users(id) on delete cascade,
  amount     integer not null check (amount > 0),              -- in CFA
  method     text not null default 'simulated',                -- 'simulated' | 'momo' | 'card' ...
  reference  text,                                             -- PSP transaction ref (later)
  created_at timestamptz not null default now()
);

create index if not exists contributions_plan_id_idx on public.contributions(plan_id);

-- ---------- Integrity: recompute plan total on each contribution ------
create or replace function public.recompute_savings_plan()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total  integer;
  v_target integer;
begin
  select coalesce(sum(amount), 0) into v_total
    from public.contributions where plan_id = new.plan_id;
  select target_amount into v_target
    from public.savings_plans where id = new.plan_id;

  update public.savings_plans
     set saved_amount = v_total,
         status = case when v_total >= v_target then 'completed' else status end
   where id = new.plan_id;

  return new;
end;
$$;

drop trigger if exists trg_recompute_plan on public.contributions;
create trigger trg_recompute_plan
  after insert on public.contributions
  for each row execute function public.recompute_savings_plan();

-- ---------- Row Level Security ---------------------------------------
alter table public.savings_plans  enable row level security;
alter table public.contributions  enable row level security;

-- A user only ever sees / creates their own rows.
create policy "plans: select own"        on public.savings_plans
  for select using (auth.uid() = user_id);
create policy "plans: insert own"        on public.savings_plans
  for insert with check (auth.uid() = user_id);

create policy "contributions: select own" on public.contributions
  for select using (auth.uid() = user_id);
create policy "contributions: insert own" on public.contributions
  for insert with check (auth.uid() = user_id);

-- NOTE: there is intentionally NO client UPDATE policy on savings_plans.
-- saved_amount/status are only changed by the trigger above (security definer),
-- so the balance cannot be tampered with from the browser.
