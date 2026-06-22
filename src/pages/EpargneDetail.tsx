import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, Wallet, Calendar, Target, Clock, Repeat } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { getPlan, listContributions, contribute, SavingsPlan, Contribution, Cadence } from '@/src/lib/tontine';

export default function EpargneDetail() {
  const { id } = useParams();
  const { language } = useLanguage();
  const fr = language === 'fr';
  const locale = fr ? 'fr-FR' : 'en-US';
  const { formatPrice } = useCurrency();
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<SavingsPlan | null>(null);
  const [history, setHistory] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const dateLong = (iso: string) =>
    new Date(iso).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const cadenceLabel = (c: Cadence) =>
    fr
      ? { daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel' }[c]
      : { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' }[c];

  const load = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const [p, h] = await Promise.all([getPlan(id), listContributions(id)]);
      setPlan(p);
      setHistory(h);
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, currentUser, id]);

  const handleContribute = async () => {
    if (!plan) return;
    const remaining = plan.target_amount - plan.saved_amount;
    if (remaining <= 0) return;
    const amount = Math.min(plan.installment ?? remaining, remaining);
    setBusy(true);
    const result = await contribute(plan.id, amount);
    setBusy(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    await load();
  };

  const pct = plan ? Math.min(100, Math.round((plan.saved_amount / plan.target_amount) * 100)) : 0;
  const remaining = plan ? Math.max(0, plan.target_amount - plan.saved_amount) : 0;
  const done = plan ? plan.status === 'completed' || remaining === 0 : false;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Seo title={fr ? 'Détail de l’épargne' : 'Savings detail'} />

      <main className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <Link to="/epargne" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
          <ChevronLeft size={16} /> {fr ? 'Retour à mes épargnes' : 'Back to my savings'}
        </Link>

        {loading ? (
          <p className="text-gray-400">{fr ? 'Chargement...' : 'Loading...'}</p>
        ) : !plan ? (
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 text-center">
            <p className="text-gray-500 mb-6">{fr ? 'Épargne introuvable.' : 'Savings plan not found.'}</p>
            <Link to="/epargne" className="px-6 py-3 bg-[#007bff] text-white rounded-full font-bold">
              {fr ? 'Mes épargnes' : 'My savings'}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">{error}</div>
            )}

            {/* Header card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8"
            >
              <div className="flex gap-5 items-center mb-6">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                  {plan.product_image && (
                    <img src={plan.product_image} alt={plan.product_name} className="max-w-full max-h-full object-contain" />
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-black text-gray-900 leading-snug">{plan.product_name}</h1>
                  <p className="text-gray-500">
                    {formatPrice(plan.saved_amount)} / {formatPrice(plan.target_amount)}
                  </p>
                </div>
                {done ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 size={12} /> {fr ? 'Atteint' : 'Reached'}
                  </span>
                ) : (
                  <span className="text-2xl font-black text-[#007bff]">{pct}%</span>
                )}
              </div>

              {/* Progress */}
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-[#007bff]'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mb-6">
                {done
                  ? (fr ? 'Objectif atteint — livraison à venir.' : 'Goal reached — delivery coming.')
                  : (<>{fr ? 'Reste à épargner' : 'Left to save'}: <strong className="text-gray-900">{formatPrice(remaining)}</strong></>)}
              </p>

              {!done && (
                <button
                  onClick={handleContribute}
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all disabled:opacity-60"
                >
                  <Wallet size={18} />
                  {busy ? '...' : `${fr ? 'Verser' : 'Pay in'} ${formatPrice(Math.min(plan.installment ?? remaining, remaining))}`}
                </button>
              )}
            </motion.div>

            {/* Key facts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Calendar, label: fr ? 'Démarré le' : 'Started on', value: dateLong(plan.created_at) },
                { icon: Clock, label: fr ? 'Échéance prévue' : 'Target date', value: plan.target_date ? dateLong(plan.target_date) : '—' },
                { icon: Repeat, label: fr ? 'Rythme' : 'Pace', value: cadenceLabel(plan.cadence) },
                { icon: Target, label: fr ? 'Versement' : 'Installment', value: plan.installment ? formatPrice(plan.installment) : '—' },
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="w-9 h-9 bg-blue-50 text-[#007bff] rounded-xl flex items-center justify-center mb-3">
                    <f.icon size={16} />
                  </div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{f.label}</p>
                  <p className="text-sm font-bold text-gray-900">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Payment history */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                {fr ? 'Historique des versements' : 'Payment history'}
                <span className="text-gray-400 font-medium"> ({history.length})</span>
              </h2>

              {history.length === 0 ? (
                <p className="text-gray-500 text-sm">{fr ? 'Aucun versement pour le moment.' : 'No payment yet.'}</p>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {history.map((c) => (
                    <li key={c.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
                          <Wallet size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{formatPrice(c.amount)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(c.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                            {' · '}
                            {new Date(c.created_at).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                        {c.method === 'simulated' ? (fr ? 'Simulé' : 'Simulated') : c.method}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
