import React from 'react';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { ShieldCheck, CreditCard, Smartphone, Banknote, Lock, CheckCircle } from 'lucide-react';

export default function PaymentDetails() {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const methods = [
    {
      title: fr ? 'Cartes de crédit & débit' : 'Credit & Debit Cards',
      desc: fr
        ? 'Nous acceptons Visa, Mastercard et American Express. Paiements sécurisés assurés par les leaders du secteur.'
        : 'We accept Visa, Mastercard, and American Express. Secure payments powered by industry leaders.',
      icon: CreditCard,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Mobile Money',
      desc: fr
        ? 'Payez instantanément avec Orange Money, Free Money ou Wave. Rapide et pratique.'
        : 'Pay instantly using Orange Money, Free Money, or Wave. Fast and convenient.',
      icon: Smartphone,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: fr ? 'Paiement à la livraison' : 'Cash on Delivery',
      desc: fr
        ? 'Disponible dans certaines zones. Payez à la réception de votre colis.'
        : 'Available for selected locations. Pay when your package arrives at your doorstep.',
      icon: Banknote,
      color: 'bg-green-50 text-green-600'
    }
  ];

  const securityPoints = fr
    ? [
        'Transactions conformes PCI-DSS',
        'Chiffrement SSL 256 bits',
        'Aucun frais caché',
        'Confirmation de paiement instantanée'
      ]
    : [
        'PCI-DSS Compliant transactions',
        '256-bit SSL Encryption',
        'No hidden fees or charges',
        'Instant payment confirmation'
      ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-20">
        <div className="px-4 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-2 bg-blue-50 text-[#007bff] text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block"
            >
              {fr ? 'Paiement sécurisé' : 'Secure Checkout'}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
            >
              {fr ? 'Processus de paiement en ligne' : 'Online Payment Process'}
            </motion.h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              {fr
                ? 'Nous proposons plusieurs moyens de paiement sécurisés pour une expérience d\'achat sûre et fluide.'
                : 'We provide a variety of secure payment methods to ensure your shopping experience is safe and smooth.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {methods.map((method, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-10 rounded-[40px] border border-gray-100 hover:border-blue-100 hover:shadow-xl transition-all"
              >
                <div className={`w-16 h-16 ${method.color} rounded-3xl flex items-center justify-center mb-8 shadow-sm`}>
                  <method.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <p className="text-gray-500 leading-relaxed">
                  {method.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#007bff] rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="text-blue-200" />
                  <span className="font-bold tracking-widest uppercase text-sm text-blue-200">{fr ? 'La sécurité avant tout' : 'Security First'}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                  {fr ? 'Vos paiements sont chiffrés et sécurisés.' : 'Your payments are encrypted and secure.'}
                </h2>
                <div className="space-y-6">
                   {securityPoints.map((item, i) => (
                     <div key={i} className="flex items-center gap-4">
                       <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                         <CheckCircle size={14} className="text-white" />
                       </div>
                       <span className="font-medium">{item}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-white/20">
                <ShieldCheck size={48} className="text-white mb-6" />
                <h4 className="text-2xl font-bold mb-4">{fr ? "Protection de l'acheteur" : 'Buyer Protection'}</h4>
                <p className="text-blue-100 leading-relaxed mb-8">
                  {fr
                    ? "Obtenez un remboursement complet si votre article n'arrive pas ou ne correspond pas à la description. Notre équipe dédiée aux litiges vous accompagne à chaque étape."
                    : 'Get a full refund if your item does not arrive or is not as described. Our dedicated dispute team is here to assist you every step of the way.'}
                </p>
                <div className="flex gap-4">
                  <div className="h-12 w-20 bg-white/20 rounded-lg"></div>
                  <div className="h-12 w-20 bg-white/20 rounded-lg"></div>
                  <div className="h-12 w-20 bg-white/20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
