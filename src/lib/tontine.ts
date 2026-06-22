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

export interface Contribution {
  id: string;
  plan_id: string;
  amount: number;
  method: string;
  reference: string | null;
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

/** Fetches a single plan owned by the current user (null if not found). */
export async function getPlan(id: string): Promise<SavingsPlan | null> {
  const { data, error } = await supabase
    .from('savings_plans')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as SavingsPlan) ?? null;
}

/** Lists the contributions of a plan (most recent first). */
export async function listContributions(planId: string): Promise<Contribution[]> {
  const { data, error } = await supabase
    .from('contributions')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Contribution[];
}

/** True if the user already has an active plan (one active plan at a time). */
export async function hasActivePlan(): Promise<boolean> {
  const { count, error } = await supabase
    .from('savings_plans')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'active');
  if (error) throw error;
  return (count ?? 0) > 0;
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
  if (error) {
    // Unique-index violation = the user already has an active plan.
    if (error.code === '23505') return { error: 'ACTIVE_PLAN_EXISTS' };
    return { error: error.message };
  }
  return {};
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
