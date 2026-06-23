import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, Loader2, ArrowRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { getPlan, SavingsPlan } from '@/src/lib/tontine';

export default function PaiementRetour() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { formatPrice } = useCurrency();
  const [params] = useSearchParams();

  const planId = params.get('plan');
  const status = (params.get('status') || '').toLowerCase();
  const failed = status === 'declined' || status === 'canceled' || status === 'cancelled';

  const [plan, setPlan] = useState<SavingsPlan | null>(null);
  const [polling, setPolling] = useState(!failed && !!planId);

  // The webhook credits the contribution asynchronously, so poll the plan a few
  // times to reflect the new balance once FedaPay confirms.
  useEffect(() => {
    if (!planId || failed) return;
    let active = true;
    let tries = 0;
    const poll = async () => {
      try {
        const p = await getPlan(planId);
        if (active && p) setPlan(p);
      } catch {
        /* ignore transient errors */
      }
      tries += 1;
      if (active && tries < 5) {
        setTimeout(poll, 2500);
      } else if (active) {
        setPolling(false);
      }
    };
    poll();
    return () => {
      active = false;
    };
  }, [planId, failed]);

  const pct = plan ? Math.min(100, Math.round((plan.saved_amount / plan.target_amount) * 100)) : null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Seo title={fr ? 'Retour de paiement' : 'Payment result'} />

      <main className="max-w-xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-10 md:p-12 shadow-xl shadow-blue-500/5 border border-blue-50 text-center"
        >
          {failed ? (
            <>
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <XCircle size={40} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                {fr ? 'Paiement non abouti' : 'Payment not completed'}
              </h1>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                {fr
                  ? "Votre paiement a été annulé ou refusé. Aucun montant n'a été débité. Vous pouvez réessayer."
                  : 'Your payment was cancelled or declined. No amount was charged. You can try again.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={planId ? `/epargne/${planId}` : '/epargne'}
                  className="px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all"
                >
                  {fr ? 'Réessayer' : 'Try again'}
                </Link>
                <Link
                  to="/epargne"
                  className="px-8 py-4 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all"
                >
                  {fr ? 'Mes épargnes' : 'My savings'}
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 mb-3">
                {fr ? 'Paiement confirmé !' : 'Payment confirmed!'}
              </h1>
              <p className="text-gray-500 mb-8 leading-relaxed text-sm">
                {fr
                  ? 'Merci ! Votre versement est en cours d’enregistrement sur votre épargne.'
                  : 'Thank you! Your contribution is being recorded on your savings plan.'}
              </p>

              {/* Live plan progress (updates as the webhook credits the payment) */}
              {plan && (
                <div className="bg-blue-50/60 rounded-3xl p-6 mb-8 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{plan.product_name}</span>
                    <span className="font-black text-[#007bff]">{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-white rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#007bff] rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatPrice(plan.saved_amount)} / {formatPrice(plan.target_amount)}
                  </p>
                </div>
              )}

              {polling && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-8">
                  <Loader2 size={16} className="animate-spin" />
                  {fr ? 'Mise à jour de votre solde…' : 'Updating your balance…'}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={planId ? `/epargne/${planId}` : '/epargne'}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all"
                >
                  {fr ? 'Voir mon épargne' : 'View my savings'} <ArrowRight size={18} />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all"
                >
                  <ShoppingBag size={18} />
                  {fr ? 'Continuer mes achats' : 'Continue shopping'}
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
