import { supabase } from './supabase';

export type Cadence = 'daily' | 'weekly' | 'monthly';
export type PlanStatus = 'active' | 'completed' | 'cancelled';

export interface SavingsPlan {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  target_amount: number;
  saved_amount: number;
  installment: number | null;
  cadence: Cadence;
  status: PlanStatus;
  target_date: string | null;
  created_at: string;
}

export interface NewPlanInput {
  productId: string;
  productName: string;
  productImage?: string;
  targetAmount: number;
  installment: number;
  cadence: Cadence;
  targetDate?: string; // ISO date (yyyy-mm-dd)
}

/** Lists the current user's savings plans (most recent first). */
export async function listPlans(): Promise<SavingsPlan[]> {
  const { data, error } = await supabase
    .from('savings_plans')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as SavingsPlan[];
}

/** Creates a new savings plan for the logged-in user. */
export async function createPlan(input: NewPlanInput): Promise<{ error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return { error: 'NOT_AUTHENTICATED' };

  const { error } = await supabase.from('savings_plans').insert({
    user_id: user.id,
    product_id: input.productId,
    product_name: input.productName,
    product_image: input.productImage ?? null,
    target_amount: input.targetAmount,
    installment: input.installment,
    cadence: input.cadence,
    target_date: input.targetDate ?? null,
  });
  return error ? { error: error.message } : {};
}

/**
 * Records a contribution toward a plan. For V1 this is "simulated" — in the
 * payment phase, contributions will instead be inserted server-side by the
 * PSP webhook after a real transfer is confirmed.
 */
export async function contribute(planId: string, amount: number): Promise<{ error?: string }> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return { error: 'NOT_AUTHENTICATED' };
  if (amount <= 0) return { error: 'INVALID_AMOUNT' };

  const { error } = await supabase.from('contributions').insert({
    plan_id: planId,
    user_id: user.id,
    amount,
    method: 'simulated',
  });
  return error ? { error: error.message } : {};
}
