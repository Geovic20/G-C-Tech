import { Link } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { motion } from 'motion/react';
import { Truck, Clock, MessageCircle, MapPin } from 'lucide-react';
import { DELIVERY_ZONES, TIME_SLOTS, MIN_DELIVERY_COST } from '@/src/lib/delivery';

/**
 * Everything on this page is derived from `src/lib/delivery.ts`, the same
 * source the cart charges from. Changing a tariff there updates this page —
 * the two can no longer drift apart and contradict each other.
 */
export default function ShippingInfo() {
  const { t, language } = useLanguage();
  const fr = language === 'fr';
  const { formatPrice } = useCurrency();

  // Zones grouped by tariff, cheapest first.
  const tiers = Array.from(new Set(DELIVERY_ZONES.map((z) => z.cost)))
    .sort((a, b) => a - b)
    .map((cost) => ({ cost, zones: DELIVERY_ZONES.filter((z) => z.cost === cost) }));

  const facts = [
    {
      icon: Truck,
      title: fr ? 'Un tarif par quartier' : 'One tariff per neighbourhood',
      value: `${fr ? 'À partir de' : 'From'} ${formatPrice(MIN_DELIVERY_COST)}`,
      desc: fr
        ? 'Les frais dépendent uniquement de votre zone, jamais du montant de la commande. Le tarif exact s’affiche dès que vous choisissez votre quartier dans le panier.'
        : 'The fee depends only on your zone, never on the order amount. The exact tariff appears as soon as you pick your neighbourhood in the cart.',
    },
    {
      icon: Clock,
      title: fr ? 'Vous choisissez le créneau' : 'You pick the time slot',
      value: `${TIME_SLOTS.length} ${fr ? 'créneaux' : 'slots'} · 08h–20h`,
      desc: fr
        ? 'Au moment de la commande, vous indiquez la date qui vous arrange et l’un des créneaux de deux heures. Nous nous y tenons.'
        : 'When ordering, you choose the date that suits you and one of the two-hour slots. We stick to it.',
    },
    {
      icon: MessageCircle,
      title: fr ? 'Le suivi se fait sur WhatsApp' : 'Follow-up happens on WhatsApp',
      value: fr ? 'Contact direct' : 'Direct contact',
      desc: fr
        ? 'Votre commande est finalisée par WhatsApp : c’est là que nous confirmons le paiement, la disponibilité et l’heure de passage du livreur.'
        : 'Your order is completed on WhatsApp: that is where we confirm payment, availability and the courier’s time.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('support.shipping.title')} description={t('support.shipping.subtitle')} />

      <main className="py-12 md:py-20">
        <div className="px-4 md:px-12 max-w-7xl mx-auto">
          {/* Hero */}
          <div className="max-w-3xl mb-12 md:mb-16 text-center mx-auto">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-4 py-2 bg-blue-50 text-[#007bff] text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block"
            >
              {fr ? 'Livraison & Logistique' : 'Delivery & Logistics'}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black text-gray-900 mb-6"
            >
              {t('support.shipping.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-500 text-lg leading-relaxed"
            >
              {t('support.shipping.subtitle')}
            </motion.p>
          </div>

          {/* Three facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20">
            {facts.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.08 }}
                className="bg-gray-50 p-8 rounded-[32px] border border-gray-100"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#007bff] mb-6 shadow-sm">
                  <f.icon size={26} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{f.title}</h2>
                <p className="text-[#007bff] font-bold mb-4">{f.value}</p>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Tariffs — the real reason people open this page */}
          <section>
            <div className="flex items-baseline gap-3 flex-wrap mb-2">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                {fr ? 'Zones et tarifs' : 'Zones and tariffs'}
              </h2>
              <span className="text-sm text-gray-400 font-medium">
                {DELIVERY_ZONES.length} {fr ? 'zones' : 'zones'}
              </span>
            </div>
            <p className="text-gray-500 text-sm mb-8 max-w-2xl leading-relaxed">
              {fr
                ? 'Trouvez votre quartier ci-dessous : le montant indiqué est celui qui sera ajouté à votre commande. Aucun autre frais ne s’applique.'
                : 'Find your neighbourhood below: the amount shown is what gets added to your order. No other fee applies.'}
            </p>

            <div className="space-y-4">
              {tiers.map((tier) => (
                <div
                  key={tier.cost}
                  className="border border-gray-100 rounded-[28px] overflow-hidden bg-white"
                >
                  <div className="flex items-baseline gap-3 px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <span className="text-xl font-black text-[#007bff] tabular-nums">
                      {formatPrice(tier.cost)}
                    </span>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {tier.zones.length} {fr ? (tier.zones.length > 1 ? 'zones' : 'zone') : (tier.zones.length > 1 ? 'zones' : 'zone')}
                    </span>
                  </div>
                  <ul className="divide-y divide-gray-50">
                    {tier.zones.map((zone) => (
                      <li key={zone.id} className="px-6 py-4 flex gap-3">
                        <MapPin size={16} className="text-gray-300 flex-shrink-0 mt-1" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {zone.areas.join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 md:p-8 bg-blue-50/60 border border-blue-100 rounded-[28px] flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">
                  {fr ? 'Votre quartier n’est pas dans la liste ?' : 'Your neighbourhood is not listed?'}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {fr
                    ? 'Écrivez-nous : nous livrons au-delà de ces zones au cas par cas, et nous vous donnons le tarif avant que vous ne commandiez.'
                    : 'Get in touch: we deliver beyond these zones case by case, and we quote the fee before you order.'}
                </p>
              </div>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all whitespace-nowrap flex-shrink-0"
              >
                <MessageCircle size={18} />
                {fr ? 'Nous contacter' : 'Contact us'}
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
