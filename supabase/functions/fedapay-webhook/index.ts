// Supabase Edge Function: fedapay-webhook
// Receives FedaPay webhook events and credits a contribution once a payment is
// confirmed. Security model:
//   1. We DO NOT trust the incoming payload's amounts/status.
//   2. We re-fetch the transaction from FedaPay's API (authoritative — an
//      attacker cannot make FedaPay report a transaction as 'approved').
//   3. plan_id / user_id are read from the transaction's custom_metadata, which
//      we set ourselves at creation — so they can't be forged.
//   4. Idempotent on the transaction id (unique reference) → no double credit.
//
// Deploy WITHOUT JWT (FedaPay has no Supabase token):
//   supabase functions deploy fedapay-webhook --no-verify-jwt
// Secrets: FEDAPAY_SECRET_KEY, FEDAPAY_BASE_URL
//          (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are provided automatically)
// Then register the function URL in FedaPay dashboard → Webhooks
//   https://<project-ref>.supabase.co/functions/v1/fedapay-webhook

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FEDAPAY_BASE = Deno.env.get('FEDAPAY_BASE_URL') ?? 'https://sandbox-api.fedapay.com';
const FEDAPAY_SECRET = Deno.env.get('FEDAPAY_SECRET_KEY') ?? '';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });

  const raw = await req.text();
  // NOTE: FedaPay also signs the request via the `X-FEDAPAY-SIGNATURE` header.
  // The re-fetch below is the authoritative check, so a forged payload cannot
  // credit anything. Once you confirm FedaPay's exact signature format you can
  // additionally reject requests whose signature doesn't match here.

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response('bad json', { status: 400 });
  }

  // Extract the transaction id (FedaPay wraps the entity under `entity`).
  const entity = payload.entity ?? payload.data?.object ?? payload.data ?? {};
  const txId = entity.id ?? payload.transaction?.id;
  if (!txId) return new Response('no transaction id', { status: 200 });

  // --- Authoritative verification: ask FedaPay directly ---
  const txRes = await fetch(`${FEDAPAY_BASE}/v1/transactions/${txId}`, {
    headers: { Authorization: `Bearer ${FEDAPAY_SECRET}` },
  });
  if (!txRes.ok) return new Response('fedapay fetch failed', { status: 502 }); // 5xx → FedaPay retries

  const txBody = await txRes.json();
  const tx = txBody['v1/transaction'] ?? txBody.transaction ?? txBody;

  if (tx?.status !== 'approved') return new Response('not approved', { status: 200 });

  let meta = tx.custom_metadata ?? {};
  if (typeof meta === 'string') {
    try { meta = JSON.parse(meta); } catch { meta = {}; }
  }
  const planId = meta.plan_id;
  const userId = meta.user_id;
  const amount = Number(tx.amount);
  if (!planId || !userId || !amount) return new Response('missing metadata', { status: 200 });

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const reference = String(txId);

  // Idempotency: if this transaction was already recorded, ack and stop.
  const { data: existing } = await admin
    .from('contributions')
    .select('id')
    .eq('reference', reference)
    .maybeSingle();
  if (existing) return new Response('already processed', { status: 200 });

  const { error } = await admin.from('contributions').insert({
    plan_id: planId,
    user_id: userId,
    amount,
    method: 'fedapay',
    reference,
  });

  // Unique-violation (race with a duplicate event) is fine — already credited.
  if (error && (error as any).code !== '23505') {
    return new Response(`insert error: ${error.message}`, { status: 500 }); // retry
  }

  return new Response('ok', { status: 200 });
});
