import React from 'react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';

export default function LegalNotice() {
  const { t, language } = useLanguage();

  const content = {
    en: [
      {
        title: "1. Publisher Information",
        text: "G&C Tech is a limited liability company registered under the laws of [Country]. The company is headquartered at 123 Electronic Street, Tech City, TC 12345."
      },
      {
        title: "2. Contact Information",
        text: "You can contact us by email at contact@gctech.com or by phone at +00 123 456 7890. Our customer service is available Monday to Friday from 9 AM to 6 PM."
      },
      {
        title: "3. Hosting Provider",
        text: "This website is hosted by [Hosting Provider], located at [Hosting Address]. The hosting provider can be contacted at [Hosting Contact]."
      },
      {
        title: "4. Intellectual Property",
        text: "All content on this website (text, images, logos, videos, etc.) is protected by copyright and intellectual property laws. Any reproduction, distribution, or use of this content without prior written authorization is prohibited."
      },
      {
        title: "5. Personal Data Protection",
        text: "In accordance with applicable data protection laws, you have the right to access, rectify, and delete your personal data. To exercise these rights, please contact us at privacy@gctech.com."
      },
      {
        title: "6. Cookies",
        text: "This website uses cookies to improve your browsing experience and analyze site traffic. You can configure your browser to refuse cookies. For more information, please refer to our Cookie Policy."
      }
    ],
    fr: [
      {
        title: "1. Informations sur l'éditeur",
        text: "G&C Tech est une société à responsabilité limitée immatriculée conformément aux lois de [Pays]. Le siège social est situé au 123 Electronic Street, Tech City, TC 12345."
      },
      {
        title: "2. Coordonnées de contact",
        text: "Vous pouvez nous contacter par e-mail à contact@gctech.com ou par téléphone au +00 123 456 7890. Notre service client est disponible du lundi au vendredi de 9h à 18h."
      },
      {
        title: "3. Hébergeur",
        text: "Ce site web est hébergé par [Hébergeur], situé à [Adresse de l'hébergeur]. L'hébergeur peut être contacté à [Contact de l'hébergeur]."
      },
      {
        title: "4. Propriété intellectuelle",
        text: "Tout le contenu de ce site web (textes, images, logos, vidéos, etc.) est protégé par le droit d'auteur et les lois sur la propriété intellectuelle. Toute reproduction, distribution ou utilisation de ce contenu sans autorisation écrite préalable est interdite."
      },
      {
        title: "5. Protection des données personnelles",
        text: "Conformément aux lois sur la protection des données applicables, vous avez le droit d'accéder, de rectifier et de supprimer vos données personnelles. Pour exercer ces droits, veuillez nous contacter à privacy@gctech.com."
      },
      {
        title: "6. Cookies",
        text: "Ce site web utilise des cookies pour améliorer votre expérience de navigation et analyser le trafic du site. Vous pouvez configurer votre navigateur pour refuser les cookies. Pour plus d'informations, veuillez consulter notre Politique de Cookies."
      }
    ]
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('legal.legal-notice.title')} />
      <main className="max-w-4xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-16 shadow-sm"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t('legal.legal-notice.title')}</h1>
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
