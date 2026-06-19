import React from 'react';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';

export default function RefundPolicy() {
  const { t, language } = useLanguage();

  const content = {
    en: [
      {
        title: "1. Returns",
        text: "You have 30 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it."
      },
      {
        title: "2. Refunds",
        text: "Once we receive your item, we will inspect it and notify you that we have received your returned item. If your return is approved, we will initiate a refund to your original method of payment."
      },
      {
        title: "3. Shipping",
        text: "You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable."
      }
    ],
    fr: [
      {
        title: "1. Retours",
        text: "Vous avez 30 jours calendaires pour retourner un article à compter de la date à laquelle vous l'avez reçu. Pour être éligible à un retour, votre article doit être inutilisé et dans le même état que vous l'avez reçu."
      },
      {
        title: "2. Remboursements",
        text: "Une fois que nous aurons reçu votre article, nous l'inspecterons et vous informerons que nous avons reçu votre article retourné. Si votre retour est approuvé, nous initierons un remboursement selon votre mode de paiement original."
      },
      {
        title: "3. Expédition",
        text: "Vous serez responsable de payer vos propres frais d'expédition pour le retour de votre article. Les frais d'expédition ne sont pas remboursables."
      }
    ]
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-16 shadow-sm"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t('legal.refund.title')}</h1>
          <p className="text-gray-400 font-medium mb-12">
            {t('legal.last-updated')} {new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
          </p>

          <div className="space-y-12">
            {currentContent.map((section, index) => (
              <div key={index}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-500 leading-relaxed text-lg">{section.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
