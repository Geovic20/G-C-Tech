import React from 'react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';

export default function TermsOfService() {
  const { t, language } = useLanguage();

  const content = {
    en: [
      {
        title: "1. Acceptance of Terms",
        text: "By accessing or using G&C Tech, you agree to be bound by these Terms of Service and all applicable laws and regulations."
      },
      {
        title: "2. Use of the Site",
        text: "You may use our site and services only for lawful purposes. You are prohibited from using the site to engage in any fraudulent activity or to transmit any harmful code."
      },
      {
        title: "3. User Accounts",
        text: "You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account."
      },
      {
        title: "4. Intellectual Property",
        text: "All content on this site, including text, graphics, logos, and images, is the property of G&C Tech and is protected by intellectual property laws."
      },
      {
        title: "5. Limitation of Liability",
        text: "G&C Tech shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services."
      }
    ],
    fr: [
      {
        title: "1. Acceptation des conditions",
        text: "En accédant à G&C Tech ou en l'utilisant, vous acceptez d'être lié par ces conditions d'utilisation et par toutes les lois et réglementations applicables."
      },
      {
        title: "2. Utilisation du site",
        text: "Vous ne pouvez utiliser notre site et nos services qu'à des fins licites. Il vous est interdit d'utiliser le site pour vous livrer à toute activité frauduleuse ou pour transmettre tout code nuisible."
      },
      {
        title: "3. Comptes d'utilisateurs",
        text: "Vous êtes responsable du maintien de la confidentialité des informations de votre compte et de toutes les activités qui se produisent sous votre compte."
      },
      {
        title: "4. Propriété intellectuelle",
        text: "Tout le contenu de ce site, y compris les textes, graphiques, logos et images, est la propriété de G&C Tech et est protégé par les lois sur la propriété intellectuelle."
      },
      {
        title: "5. Limitation de responsabilité",
        text: "G&C Tech ne sera pas responsable des dommages directs, indirects, accessoires ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser nos services."
      }
    ]
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('legal.terms.title')} />
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-16 shadow-sm"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t('legal.terms.title')}</h1>
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
