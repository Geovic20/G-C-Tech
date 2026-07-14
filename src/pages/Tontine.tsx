import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PiggyBank, Target, Truck, CheckCircle2, Plus, Wallet, X } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCatalog } from '@/src/contexts/CatalogContext';
import { listPlans, createPlan, SavingsPlan, Cadence } from '@/src/lib/tontine';
import { startPayment } from '@/src/lib/payment';
import { getSavingsTerms, DEFAULT_SAVINGS_TERMS, SavingsTerms } from '@/src/lib/settings';

const INSTALLMENT_COUNTS = [3, 6, 9, 12];

const GROUP_ORDER = ['smartphones', 'computers', 'tablets', 'headphones', 'earphones', 'smartwatches'];
const GROUP_LABELS: Record<string, { fr: string; en: string }> = {
  smartphones: { fr: 'Smartphones', en: 'Smartphones' },
  computers: { fr: 'Ordinateurs', en: 'Computers' },
  tablets: { fr: 'Tablettes', en: 'Tablets' },
  headphones: { fr: 'Casques', en: 'Headphones' },
  earphones: { fr: 'Écouteurs', en: 'Earphones' },
  smartwatches: { fr: 'Montres', en: 'Watches' },
};

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
  const { products } = useCatalog();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // New-plan form
  const [groupFilter, setGroupFilter] = useState<string>('');
  const [productId, setProductId] = useState('');
  const [cadence, setCadence] = useState<Cadence>('monthly');
  const [count, setCount] = useState(6);
  const [creating, setCreating] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [termsData, setTermsData] = useState<SavingsTerms>(DEFAULT_SAVINGS_TERMS);

  const activePlan = plans.find((p) => p.status === 'active');
  const groups = GROUP_ORDER.filter((g) => products.some((p) => p.group === g));
  const formProducts = products.filter((p) => p.group === groupFilter);
  const groupLabel = (g: string) => (GROUP_LABELS[g] ? (fr ? GROUP_LABELS[g].fr : GROUP_LABELS[g].en) : g);
  const selectedProduct = useMemo(() => products.find((p) => p.id === productId), [products, productId]);
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

  // Load the (admin-editable) savings terms from the database.
  useEffect(() => {
    getSavingsTerms().then(setTermsData).catch(() => {});
  }, []);

  // Default the category once the catalog has loaded.
  useEffect(() => {
    if (groups.length && !groups.includes(groupFilter)) {
      setGroupFilter(groups[0]);
    }
  }, [groups, groupFilter]);

  // Keep the selected product valid within the chosen category.
  useEffect(() => {
    if (formProducts.length && !formProducts.some((p) => p.id === productId)) {
      setProductId(formProducts[0].id);
    }
  }, [formProducts, productId]);

  // Submitting the form opens the rules dialog (the plan is only created after acceptance).
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setError('');
    setAccepted(false);
    setShowRules(true);
  };

  const confirmCreate = async () => {
    if (!selectedProduct || !accepted) return;
    setCreating(true);
    setError('');
    const result = await createPlan({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      productGroup: selectedProduct.group,
      targetAmount: selectedProduct.price,
      installment,
      cadence,
      targetDate: targetDate.toISOString().slice(0, 10),
    });
    setCreating(false);
    setShowRules(false);
    if (result.error) {
      setError(
        result.error === 'ACTIVE_PLAN_EXISTS'
          ? (fr ? 'Vous avez déjà une épargne en cours.' : 'You already have an active savings plan.')
          : result.error
      );
      await loadPlans();
      return;
    }
    setAccepted(false);
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

  const terms = fr ? termsData.fr : termsData.en;

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
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Category first, then the product list is limited to that category */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{fr ? 'Catégorie' : 'Category'}</label>
                    <div className="flex flex-wrap gap-2">
                      {groups.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGroupFilter(g)}
                          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            groupFilter === g
                              ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/20'
                              : 'bg-gray-50 text-gray-600 border border-gray-100 hover:border-gray-200'
                          }`}
                        >
                          {groupLabel(g)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{fr ? 'Produit' : 'Product'}</label>
                    <select
                      value={productId}
                      onChange={(e) => setProductId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    >
                      {formProducts.map((p) => (
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

      {/* Rules acceptance dialog — must accept before a plan is created */}
      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !creating && setShowRules(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white pb-2">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <PiggyBank size={20} className="text-[#007bff]" />
                {fr ? "Conditions de l'épargne" : 'Savings terms'}
              </h2>
              <button onClick={() => setShowRules(false)} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl">
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 border border-gray-100 rounded-2xl p-4 md:p-5 bg-gray-50/40">
              <Markdown text={terms} />
            </div>

            <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 accent-[#007bff] mt-0.5 flex-shrink-0"
              />
              <span className="text-sm font-bold text-gray-800">
                {fr ? "J'accepte les conditions de l'Épargne Produit." : 'I accept the Product Savings terms.'}
              </span>
            </label>

            <div className="flex gap-3">
              <button
                onClick={confirmCreate}
                disabled={!accepted || creating}
                className="flex-1 py-3.5 bg-[#007bff] text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? '…' : fr ? 'Confirmer et démarrer' : 'Confirm & start'}
              </button>
              <button
                onClick={() => setShowRules(false)}
                className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-50 transition-all"
              >
                {fr ? 'Annuler' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Inline **bold** parser. */
function renderInline(text: string, keyPrefix: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={keyPrefix + i}>{part}</strong> : <React.Fragment key={keyPrefix + i}>{part}</React.Fragment>
  );
}

/** Minimal Markdown renderer: #, ## headings, * bullets, **bold**, paragraphs. */
function Markdown({ text }: { text: string }) {
  const lines = text.split('\n');
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let key = 0;

  const flushList = () => {
    if (list.length) {
      const items = list;
      const k = key++;
      blocks.push(
        <ul key={`ul-${k}`} className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-3">
          {items.map((it, i) => (
            <li key={i}>{renderInline(it, `li-${k}-${i}-`)}</li>
          ))}
        </ul>
      );
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushList();
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      blocks.push(
        <h3 key={key++} className="text-sm font-black text-gray-900 mt-4 mb-1 uppercase tracking-wide">
          {renderInline(line.slice(3), `h3-${key}-`)}
        </h3>
      );
    } else if (line.startsWith('# ')) {
      flushList();
      blocks.push(
        <h2 key={key++} className="text-base font-black text-gray-900 mb-3">
          {renderInline(line.slice(2), `h2-${key}-`)}
        </h2>
      );
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      list.push(line.slice(2));
    } else {
      flushList();
      blocks.push(
        <p key={key++} className="text-sm text-gray-600 leading-relaxed mb-2">
          {renderInline(line, `p-${key}-`)}
        </p>
      );
    }
  }
  flushList();
  return <div>{blocks}</div>;
}
