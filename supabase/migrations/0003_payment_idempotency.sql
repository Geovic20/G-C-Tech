-- =====================================================================
-- G&C Tech — Payment idempotency (FedaPay)
-- Run this in Supabase → SQL Editor (after 0001 & 0002).
--
-- Each confirmed FedaPay transaction is recorded once: the transaction id is
-- stored in contributions.reference, and this unique index guarantees the same
-- transaction can never credit a plan twice (webhook retries / double events).
-- =====================================================================

create unique index if not exists contributions_reference_unique
  on public.contributions (reference)
  where reference is not null;
