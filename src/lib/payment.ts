import { supabase } from './supabase';

/**
 * Starts a FedaPay payment for a savings plan contribution by calling the
 * `create-payment` Edge Function (the user's JWT is attached automatically).
 * Returns the hosted payment URL to redirect the customer to.
 */
export async function startPayment(planId: string): Promise<{ url?: string; error?: string }> {
  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: { planId },
  });
  if (error) return { error: error.message };
  if (data?.url) return { url: data.url as string };
  return { error: data?.error ?? 'Payment could not be started' };
}
