import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PiggyBank, Target, Truck, CheckCircle2, Plus, Wallet } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { PRODUCTS } from '@/src/constants';
import { listPlans, createPlan, SavingsPlan, Cadence } from '@/src/lib/tontine';
import { startPayment } from '@/src/lib/payment';

const INSTALLMENT_COUNTS = [3, 6, 9, 12];

function computeTargetDate(count: number, cadence: Cadence): Date {
  const d = new Date();
  if (cadence === 'daily') d.setDate(d.getDate() + count);
  else if (cadence === 'weekly') d.setDate(d.getDate() + count * 7);
  else d.setMonth(d.getMonth() + count);
  return d;
}

export default function Tontine() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { formatPrice } = useCurrency();
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // New-plan form
  const [productId, setProductId] = useState(PRODUCTS[0]?.id ?? '');
  const [cadence, setCadence] = useState<Cadence>('monthly');
  const [count, setCount] = useState(6);
  const [creating, setCreating] = useState(false);

  const activePlan = plans.find((p) => p.status === 'active');
  const selectedProduct = useMemo(() => PRODUCTS.find((p) => p.id === productId), [productId]);
  const installment = selectedProduct ? Math.ceil(selectedProduct.price / count) : 0;
  const targetDate = computeTargetDate(count, cadence);
  const locale = fr ? 'fr-FR' : 'en-US';

  const cadenceLabel = (c: Cadence) =>
    fr
      ? { daily: 'par jour', weekly: 'par semaine', monthly: 'par mois' }[c]
      : { daily: 'per day', weekly: 'per week', monthly: 'per month' }[c];

  const loadPlans = async () => {
    if (!currentUser) return;
    setPlansLoading(true);
    setError('');
    try {
      setPlans(await listPlans());
    } catch (e: any) {
      setError(e?.message ?? 'Error');
    } finally {
      setPlansLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) loadPlans();
    else setPlans([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setCreating(true);
    setError('');
    const result = await createPlan({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      targetAmount: selectedProduct.price,
      installment,
      cadence,
      targetDate: targetDate.toISOString().slice(0, 10),
    });
    setCreating(false);
    if (result.error) {
      setError(
        result.error === 'ACTIVE_PLAN_EXISTS'
          ? (fr ? 'Vous avez déjà une épargne en cours.' : 'You already have an active savings plan.')
          : result.error
      );
      await loadPlans();
      return;
    }
    await loadPlans();
  };

  const handleContribute = async (plan: SavingsPlan) => {
    const remaining = plan.target_amount - plan.saved_amount;
    if (remaining <= 0) return;
    setBusyId(plan.id);
    const { url, error } = await startPayment(plan.id);
    if (error || !url) {
      setBusyId(null);
      setError(error ?? 'Payment could not be started');
      return;
    }
    // Redirect to FedaPay's secure payment page.
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Seo
        title={fr ? 'Épargne' : 'Savings'}
        description={
          fr
            ? 'Épargnez progressivement pour votre produit tech et soyez livré une fois 100% atteint.'
            : 'Save up gradually for your tech product and get it delivered once you reach 100%.'
        }
      />

      <main className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-[#007bff] text-white p-8 md:p-14 mb-12">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 rounded-full text-xs font-bold uppercase tracking-widest mb-5">
              <PiggyBank size={14} /> {fr ? 'Épargne Produit' : 'Product Savings'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              {fr ? 'Épargnez pour votre tech, payez à votre rythme' : 'Save for your tech, pay at your own pace'}
            </h1>
            <p className="text-blue-100 text-base md:text-lg leading-relaxed">
              {fr
                ? "Choisissez un produit, versez peu à peu (chaque jour, semaine ou mois). Une fois 100% atteint, on vous livre. Pas de crédit, pas d'intérêts."
                : 'Pick a product, contribute little by little (daily, weekly or monthly). Once you reach 100%, we deliver. No credit, no interest.'}
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            { icon: Target, t: fr ? '1. Fixez un objectif' : '1. Set a goal', d: fr ? 'Sélectionnez un produit et un rythme de versement.' : 'Pick a product and a contribution pace.' },
            { icon: PiggyBank, t: fr ? '2. Épargnez' : '2. Save up', d: fr ? 'Versez progressivement jusqu’à atteindre 100%.' : 'Contribute gradually until you reach 100%.' },
            { icon: Truck, t: fr ? '3. Soyez livré' : '3. Get delivered', d: fr ? 'Objectif atteint ? Votre produit vous est livré.' : 'Goal reached? Your product gets delivered.' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center mb-4">
                <s.icon size={24} />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{s.t}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </section>

        {/* Logged-out CTA */}
        {!authLoading && !currentUser && (
          <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {fr ? 'Connectez-vous pour démarrer une épargne' : 'Sign in to start saving'}
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {fr
                ? 'Créez un compte gratuit pour ouvrir votre premier plan d’épargne produit.'
                : 'Create a free account to open your first product savings plan.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/login" className="px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all">
                {fr ? 'Se connecter' : 'Sign in'}
              </Link>
              <Link to="/products" className="px-8 py-4 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all">
                {fr ? 'Parcourir le catalogue' : 'Browse the catalog'}
              </Link>
            </div>
          </section>
        )}

        {/* Logged-in: create + my plans */}
        {currentUser && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* New plan form */}
            <section className="lg:col-span-2">
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8 sticky top-8">
                {activePlan ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-blue-50 text-[#007bff] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <PiggyBank size={22} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{fr ? 'Épargne en cours' : 'Active savings plan'}</h2>
                    <p className="text-sm text-gray-500 mb-6">
                      {fr
                        ? 'Vous ne pouvez avoir qu’une seule épargne à la fois. Terminez celle en cours avant d’en ouvrir une nouvelle.'
                        : 'You can only have one savings plan at a time. Finish the current one before opening a new plan.'}
                    </p>
                    <Link
                      to={`/epargne/${activePlan.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#007bff] text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all"
                    >
                      {fr ? 'Voir mon épargne' : 'View my savings'}
                    </Link>
                  </div>
                ) : (
                <>
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-[#007bff]" />
                  {fr ? 'Démarrer une épargne' : 'Start a savings plan'}
                </h2>
                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{fr ? 'Produit' : 'Product'}</label>
                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {PRODUCTS.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — {formatPrice(p.price)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{fr ? 'Rythme' : 'Pace'}</label>
                      <select
                        value={cadence}
                        onChange={(e) => setCadence(e.target.value as Cadence)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="daily">{fr ? 'Quotidien' : 'Daily'}</option>
                        <option value="weekly">{fr ? 'Hebdomadaire' : 'Weekly'}</option>
                        <option value="monthly">{fr ? 'Mensuel' : 'Monthly'}</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{fr ? 'Versements' : 'Installments'}</label>
                      <select
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        {INSTALLMENT_COUNTS.map((n) => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-blue-50/60 rounded-2xl p-4 text-sm space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{fr ? 'Montant cible' : 'Target amount'}</span>
                      <span className="font-bold text-gray-900">{formatPrice(selectedProduct?.price ?? 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{fr ? 'Versement' : 'Installment'}</span>
                      <span className="font-bold text-[#007bff]">{formatPrice(installment)} {cadenceLabel(cadence)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{fr ? 'Échéance prévue' : 'Target date'}</span>
                      <span className="font-bold text-gray-900">{targetDate.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={creating || !selectedProduct}
                    className="w-full py-4 bg-[#007bff] text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-60"
                  >
                    {creating ? (fr ? 'Création...' : 'Creating...') : (fr ? 'Ouvrir le plan' : 'Open plan')}
                  </button>
                </form>
                </>
                )}
              </div>
            </section>

            {/* My plans */}
            <section className="lg:col-span-3">
              <h2 className="text-xl font-bold text-gray-900 mb-6">{fr ? 'Mes épargnes' : 'My savings'}</h2>

              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {plansLoading ? (
                <p className="text-gray-400">{fr ? 'Chargement...' : 'Loading...'}</p>
              ) : plans.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-10 text-center text-gray-500">
                  {fr ? "Vous n'avez pas encore de plan d'épargne." : 'You have no savings plan yet.'}
                </div>
              ) : (
                <div className="space-y-5">
                  {plans.map((plan) => {
                    const pct = Math.min(100, Math.round((plan.saved_amount / plan.target_amount) * 100));
                    const remaining = Math.max(0, plan.target_amount - plan.saved_amount);
                    const done = plan.status === 'completed' || remaining === 0;
                    return (
                      <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => navigate(`/epargne/${plan.id}`)}
                        className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all"
                      >
                        <div className="flex gap-4 items-center mb-4">
                          <div className="w-16 h-16 bg-gray-50 rounded-2xl p-2 flex-shrink-0 flex items-center justify-center">
                            {plan.product_image && (
                              <img src={plan.product_image} alt={plan.product_name} className="max-w-full max-h-full object-contain" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 leading-snug">{plan.product_name}</h3>
                            <p className="text-sm text-gray-500">
                              {formatPrice(plan.saved_amount)} / {formatPrice(plan.target_amount)}
                            </p>
                          </div>
                          {done ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 size={12} /> {fr ? 'Atteint' : 'Reached'}
                            </span>
                          ) : (
                            <span className="text-lg font-black text-[#007bff]">{pct}%</span>
                          )}
                        </div>

                        {/* Progress bar */}
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${done ? 'bg-emerald-500' : 'bg-[#007bff]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                          <div className="text-gray-500">
                            {done ? (
                              <span className="text-emerald-600 font-bold">
                                {fr ? 'Objectif atteint — livraison à venir' : 'Goal reached — delivery coming'}
                              </span>
                            ) : (
                              <>
                                {fr ? 'Reste' : 'Remaining'}: <strong className="text-gray-900">{formatPrice(remaining)}</strong>
                                {plan.target_date && (
                                  <> · {fr ? 'Échéance' : 'Due'} {new Date(plan.target_date).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}</>
                                )}
                              </>
                            )}
                          </div>
                          {!done && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleContribute(plan); }}
                              disabled={busyId === plan.id}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#007bff] text-white rounded-full font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-60"
                            >
                              <Wallet size={16} />
                              {busyId === plan.id
                                ? (fr ? '...' : '...')
                                : `${fr ? 'Verser' : 'Pay in'} ${formatPrice(Math.min(plan.installment ?? remaining, remaining))}`}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              <p className="mt-6 text-xs text-gray-400">
                {fr
                  ? '💡 Les versements se font par mobile money ou carte via FedaPay (paiement sécurisé).'
                  : '💡 Contributions are made via mobile money or card through FedaPay (secure payment).'}
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
