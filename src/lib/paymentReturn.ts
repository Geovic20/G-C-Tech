/**
 * Bridges the FedaPay round-trip.
 *
 * FedaPay sends the customer back to `/paiement/retour?plan=<id>` with no status
 * of any kind, so the return page cannot tell a completed payment from an
 * abandoned one. It used to assume success, and showed "Paiement confirmé !"
 * to people who had simply closed the payment page.
 *
 * We therefore record the plan's balance just before redirecting, and treat the
 * payment as confirmed only once the balance actually rises — which happens when
 * the `fedapay-webhook` credits the contribution. Anything else stays "pending
 * verification", never "failed": the webhook is asynchronous and a slow callback
 * is not a refusal.
 */
const KEY = 'gctech:pending-payment';

export interface PendingPayment {
  planId: string;
  /** saved_amount as it stood when the customer left for FedaPay. */
  savedBefore: number;
  startedAt: number;
}

export function rememberPendingPayment(planId: string, savedBefore: number): void {
  try {
    const payload: PendingPayment = { planId, savedBefore, startedAt: Date.now() };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* private mode / storage disabled: the return page falls back to "pending" */
  }
}

export function readPendingPayment(planId: string): PendingPayment | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingPayment;
    if (parsed.planId !== planId) return null;
    // Stale entry from an earlier session tab; treat as absent.
    if (Date.now() - parsed.startedAt > 60 * 60 * 1000) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingPayment(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
