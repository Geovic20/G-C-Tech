// Supabase Edge Function: create-payment
// Initiates a FedaPay payment for a savings plan contribution.
// The amount is recomputed server-side and the FedaPay secret key never leaves
// the server. The client only receives a payment URL to redirect to.
//
// Deploy:  supabase functions deploy create-payment
// Secrets: FEDAPAY_SECRET_KEY, FEDAPAY_BASE_URL, APP_URL
//          (SUPABASE_URL / SUPABASE_ANON_KEY are provided automatically)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const FEDAPAY_BASE = Deno.env.get('FEDAPAY_BASE_URL') ?? 'https://sandbox-api.fedapay.com';
const FEDAPAY_SECRET = Deno.env.get('FEDAPAY_SECRET_KEY') ?? '';
const APP_URL = Deno.env.get('APP_URL') ?? 'http://localhost:3000';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405);

  try {
    // Identify the caller from their Supabase JWT (queries then run under RLS).
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ error: 'unauthorized' }, 401);

    const { planId } = await req.json().catch(() => ({}));
    if (!planId) return json({ error: 'planId required' }, 400);

    const { data: plan } = await supabase
      .from('savings_plans')
      .select('*')
      .eq('id', planId)
      .maybeSingle();

    if (!plan) return json({ error: 'plan not found' }, 404);
    if (plan.status !== 'active') return json({ error: 'plan not active' }, 400);

    const remaining = plan.target_amount - plan.saved_amount;
    if (remaining <= 0) return json({ error: 'nothing to pay' }, 400);
    const amount = Math.min(plan.installment ?? remaining, remaining); // server-side, never trust client

    const authHeaders = {
      Authorization: `Bearer ${FEDAPAY_SECRET}`,
      'Content-Type': 'application/json',
    };

    // 1) Create the FedaPay transaction (metadata binds it to this plan/user).
    const txRes = await fetch(`${FEDAPAY_BASE}/v1/transactions`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        description: `Epargne — ${plan.product_name}`,
        amount,
        currency: { iso: 'XOF' },
        callback_url: `${APP_URL}/paiement/retour?plan=${plan.id}`,
        customer: {
          email: user.email,
          firstname: (user.user_metadata?.fullname as string) ?? 'Client',
        },
        custom_metadata: { plan_id: plan.id, user_id: user.id },
      }),
    });
    if (!txRes.ok) return json({ error: 'fedapay transaction failed', detail: await txRes.text() }, 502);

    const txBody = await txRes.json();
    const tx = txBody['v1/transaction'] ?? txBody.transaction ?? txBody;
    const txId = tx?.id;
    if (!txId) return json({ error: 'no transaction id', detail: txBody }, 502);

    // 2) Generate the payment token / URL.
    const tokRes = await fetch(`${FEDAPAY_BASE}/v1/transactions/${txId}/token`, {
      method: 'POST',
      headers: authHeaders,
    });
    if (!tokRes.ok) return json({ error: 'fedapay token failed', detail: await tokRes.text() }, 502);

    const tokBody = await tokRes.json();
    const url = tokBody.url ?? tokBody.payment_url ?? tokBody['v1/token']?.url;
    if (!url) return json({ error: 'no payment url', detail: tokBody }, 502);

    return json({ url });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
