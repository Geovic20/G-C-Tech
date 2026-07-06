import React from 'react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';

export default function CookiesPolicy() {
  const { t, language } = useLanguage();

  const content = {
    en: [
      {
        title: "1. What Are Cookies",
        text: "Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site."
      },
      {
        title: "2. How We Use Cookies",
        text: "We use cookies for various purposes: essential cookies to ensure the website functions properly, analytics cookies to understand user behavior, and marketing cookies to provide personalized content and advertisements."
      },
      {
        title: "3. Types of Cookies We Use",
        text: "Essential cookies are necessary for the website to function. Performance cookies help us analyze site traffic. Functionality cookies remember your preferences. Targeting cookies are used to deliver relevant advertisements."
      },
      {
        title: "4. Managing Cookies",
        text: "You can control and manage cookies through your browser settings. Most browsers allow you to delete cookies, block cookies from third parties, or receive a warning before cookies are stored."
      },
      {
        title: "5. Third-Party Cookies",
        text: "We may use third-party services that set cookies on your device. These include analytics services like Google Analytics, social media platforms, and payment processors. These third parties have their own privacy policies."
      },
      {
        title: "6. Updates to This Policy",
        text: "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We encourage you to review this policy periodically."
      }
    ],
    fr: [
      {
        title: "1. Qu'est-ce que les cookies",
        text: "Les cookies sont de petits fichiers texte qui sont stockés sur votre appareil lorsque vous visitez un site web. Ils nous aident à vous offrir une meilleure expérience en mémorisant vos préférences et en comprenant comment vous utilisez notre site."
      },
      {
        title: "2. Comment nous utilisons les cookies",
        text: "Nous utilisons des cookies à diverses fins : des cookies essentiels pour assurer le bon fonctionnement du site web, des cookies d'analyse pour comprendre le comportement des utilisateurs, et des cookies marketing pour fournir du contenu et des publicités personnalisés."
      },
      {
        title: "3. Types de cookies que nous utilisons",
        text: "Les cookies essentiels sont nécessaires au bon fonctionnement du site web. Les cookies de performance nous aident à analyser le trafic du site. Les cookies de fonctionnalité mémorisent vos préférences. Les cookies de ciblage sont utilisés pour diffuser des publicités pertinentes."
      },
      {
        title: "4. Gestion des cookies",
        text: "Vous pouvez contrôler et gérer les cookies via les paramètres de votre navigateur. La plupart des navigateurs vous permettent de supprimer les cookies, de bloquer les cookies de tiers ou de recevoir un avertissement avant le stockage des cookies."
      },
      {
        title: "5. Cookies tiers",
        text: "Nous pouvons utiliser des services tiers qui placent des cookies sur votre appareil. Cela inclut des services d'analyse comme Google Analytics, des plateformes de médias sociaux et des processeurs de paiement. Ces tiers ont leurs propres politiques de confidentialité."
      },
      {
        title: "6. Mises à jour de cette politique",
        text: "Nous pouvons mettre à jour cette Politique de Cookies de temps à autre pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, juridiques ou réglementaires. Nous vous encourageons à consulter cette politique périodiquement."
      }
    ]
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('legal.cookies.title')} />
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-16 shadow-sm"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t('legal.cookies.title')}</h1>
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
