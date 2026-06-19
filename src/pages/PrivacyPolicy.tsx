import React from 'react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  const content = {
    en: [
      {
        title: "1. Information We Collect",
        text: "We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This may include your name, email address, shipping address, and payment information."
      },
      {
        title: "2. How We Use Your Information",
        text: "We use the information we collect to process your orders, communicate with you about your account and purchases, and improve our services. We may also use your information for marketing purposes if you have opted in."
      },
      {
        title: "3. Information Sharing",
        text: "We do not sell your personal information to third parties. We may share your information with service providers who help us with our business operations, such as payment processors and shipping companies."
      },
      {
        title: "4. Data Security",
        text: "We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure."
      }
    ],
    fr: [
      {
        title: "1. Informations que nous collectons",
        text: "Nous collectons les informations que vous nous fournissez directement lorsque vous créez un compte, effectuez un achat ou communiquez avec nous. Cela peut inclure votre nom, votre adresse e-mail, votre adresse de livraison et vos informations de paiement."
      },
      {
        title: "2. Comment nous utilisons vos informations",
        text: "Nous utilisons les informations que nous collectons pour traiter vos commandes, communiquer avec vous au sujet de votre compte et de vos achats, et améliorer nos services. Nous pouvons également utiliser vos informations à des fins de marketing si vous avez accepté."
      },
      {
        title: "3. Partage d'informations",
        text: "Nous ne vendons pas vos informations personnelles à des tiers. Nous pouvons partager vos informations avec des prestataires de services qui nous aident dans nos opérations commerciales, tels que les processeurs de paiement et les sociétés de livraison."
      },
      {
        title: "4. Sécurité des données",
        text: "Nous prenons des mesures raisonnables pour protéger vos informations personnelles contre tout accès, utilisation ou divulgation non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est sûre à 100 %."
      }
    ]
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('legal.privacy.title')} />
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-16 shadow-sm"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t('legal.privacy.title')}</h1>
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
