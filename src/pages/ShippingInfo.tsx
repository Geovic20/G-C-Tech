import React from 'react';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { Truck, Globe, Clock, ShieldCheck, MapPin, Package } from 'lucide-react';

export default function ShippingInfo() {
  const { t, language } = useLanguage();
  const fr = language === 'fr';

  const methods = [
    {
      title: fr ? 'Livraison standard' : 'Standard Delivery',
      time: fr ? '3-5 jours ouvrés' : '3-5 Business Days',
      price: fr ? 'Gratuit' : 'Free',
      description: fr
        ? 'Une livraison fiable et abordable pour les commandes non urgentes.'
        : 'Reliable and affordable shipping for non-urgent orders.',
      icon: Truck
    },
    {
      title: fr ? 'Livraison express' : 'Express Delivery',
      time: fr ? '1-2 jours ouvrés' : '1-2 Business Days',
      price: '5,000 F',
      description: fr
        ? 'Recevez votre matériel plus vite grâce à notre service prioritaire.'
        : 'Get your tech faster with our priority shipping service.',
      icon: Clock
    },
    {
      title: fr ? 'Livraison le jour même' : 'Same Day Delivery',
      time: fr ? 'Sous 24 heures' : 'Within 24 Hours',
      price: '10,000 F',
      description: fr
        ? 'Disponible dans les grandes villes pour les commandes passées avant midi.'
        : 'Available in major cities for orders placed before 12 PM.',
      icon: Package
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-12 md:py-20">
        <div className="px-4 md:px-12 max-w-7xl mx-auto">
          <div className="max-w-3xl mb-12 md:mb-20 text-center mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {methods.map((method, idx) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#007bff] mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <method.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-[#007bff] font-bold mb-6">{method.time} • {method.price}</p>
                <p className="text-gray-500 leading-relaxed text-sm">
                  {method.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-[#007bff] rounded-[32px] md:rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <h2 className="text-3xl font-black mb-8 relative z-10">{fr ? 'Livraison internationale' : 'International Shipping'}</h2>
              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{fr ? 'Portée mondiale' : 'Global Reach'}</h4>
                    <p className="text-blue-100 text-sm">{fr ? 'Nous livrons dans plus de 100 pays grâce à nos partenaires logistiques mondiaux.' : 'We ship to over 100 countries worldwide with our global logistics partners.'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">{fr ? 'Douanes & taxes' : 'Customs & Duties'}</h4>
                    <p className="text-blue-100 text-sm">{fr ? 'Nous gérons toute la documentation douanière pour une livraison sans souci.' : 'We handle all customs documentation to ensure a smooth delivery process.'}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">{fr ? 'Suivez votre colis' : 'Track your package'}</h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                {fr
                  ? "Une fois votre commande expédiée, vous recevrez un numéro de suivi par e-mail. Vous pourrez l'utiliser pour suivre votre colis en temps réel."
                  : "Once your order has been dispatched, you'll receive a tracking number via email. You can use this to monitor your shipment in real-time."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  placeholder={fr ? 'Entrez votre numéro de suivi' : 'Enter your tracking number'}
                  className="flex-1 h-14 px-6 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium"
                />
                <button className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-colors whitespace-nowrap">
                  {fr ? 'Suivre la commande' : 'Track Order'}
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} className="text-[#007bff]" />
                {fr ? 'Le délai de livraison estimé varie selon la localisation.' : 'Estimated delivery time varies by location.'}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
}
