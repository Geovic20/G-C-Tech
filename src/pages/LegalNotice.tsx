import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { COMPANY, HOSTING, DATA_PROTECTION, formattedAddress, phoneList } from '@/src/lib/company';
import { motion } from 'motion/react';

export default function LegalNotice() {
  const { t, language } = useLanguage();

  // Toutes les données d'identité viennent de src/lib/company.ts — ne rien
  // recopier ici, sinon les pages recommenceront à se contredire.
  const content = {
    en: [
      {
        title: '1. Publisher',
        text: `${COMPANY.name} is a ${COMPANY.legalForm.en} registered in ${COMPANY.country.en}, run by ${COMPANY.manager}, who is also responsible for publication. Business address: ${formattedAddress('en')}.`,
      },
      {
        title: '2. Contact',
        text: `You can reach us by email at ${COMPANY.email} or by phone at ${phoneList()}. Customer service is open ${COMPANY.hours.en.toLowerCase()}.`,
      },
      {
        title: '3. Hosting',
        text: `This website is hosted by ${HOSTING.site.name} (${HOSTING.site.country.en}, ${HOSTING.site.url}). Customer accounts and orders are stored by ${HOSTING.data.name} (${HOSTING.data.url}) on servers located in ${HOSTING.data.region.en}.`,
      },
      {
        title: '4. Intellectual property',
        text: 'All content on this website (text, images, logos, videos) is protected by copyright and intellectual property law. Any reproduction, distribution or use without prior written authorisation is prohibited. Product images and brand logos remain the property of their respective owners.',
      },
      {
        title: '5. Personal data',
        text: `The data controller is ${DATA_PROTECTION.controller}. You may request access to, correction of, or deletion of your personal data by writing to ${COMPANY.email}. A declaration to the ${DATA_PROTECTION.authority.fullName.en} (${DATA_PROTECTION.authority.name}) of ${DATA_PROTECTION.authority.country.en} is in progress. See our Privacy Policy for retention periods.`,
      },
      {
        title: '6. Cookies',
        text: `This website uses cookies strictly necessary for it to work — keeping you signed in and remembering your cart. You can configure your browser to refuse them, at the cost of some features. See our Cookie Policy.`,
      },
    ],
    fr: [
      {
        title: "1. Éditeur du site",
        text: `${COMPANY.name} est une ${COMPANY.legalForm.fr} immatriculée au ${COMPANY.country.fr}, exploitée par ${COMPANY.manager}, également directeur de la publication. Adresse : ${formattedAddress('fr')}.`,
      },
      {
        title: '2. Nous contacter',
        text: `Par e-mail à ${COMPANY.email} ou par téléphone au ${phoneList()}. Le service client est joignable ${COMPANY.hours.fr.toLowerCase()}.`,
      },
      {
        title: '3. Hébergement',
        text: `Ce site est hébergé par ${HOSTING.site.name} (${HOSTING.site.country.fr}, ${HOSTING.site.url}). Les comptes clients et les commandes sont stockés par ${HOSTING.data.name} (${HOSTING.data.url}) sur des serveurs situés en ${HOSTING.data.region.fr}.`,
      },
      {
        title: '4. Propriété intellectuelle',
        text: "L'ensemble du contenu de ce site (textes, images, logos, vidéos) est protégé par le droit d'auteur et le droit de la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est interdite. Les visuels produits et les logos de marques restent la propriété de leurs détenteurs respectifs.",
      },
      {
        title: '5. Données personnelles',
        text: `Le responsable de traitement est ${DATA_PROTECTION.controller}. Vous pouvez demander l'accès, la rectification ou la suppression de vos données personnelles en écrivant à ${COMPANY.email}. Une déclaration auprès de l'${DATA_PROTECTION.authority.fullName.fr} (${DATA_PROTECTION.authority.name}) du ${DATA_PROTECTION.authority.country.fr} est en cours. Les durées de conservation figurent dans notre Politique de Confidentialité.`,
      },
      {
        title: '6. Cookies',
        text: "Ce site utilise uniquement des cookies nécessaires à son fonctionnement : maintien de votre session et mémorisation de votre panier. Vous pouvez configurer votre navigateur pour les refuser, au prix de certaines fonctionnalités. Voir notre Politique de Cookies.",
      },
    ],
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
