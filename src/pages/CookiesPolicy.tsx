import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { COMPANY, HOSTING, DATA_RETENTION } from '@/src/lib/company';
import { motion } from 'motion/react';

export default function CookiesPolicy() {
  const { t, language } = useLanguage();

  // Le site n'embarque aucun outil de mesure d'audience ni pixel publicitaire.
  // Ce texte doit être revu si l'un venait à être ajouté : un traceur non
  // nécessaire impose un consentement préalable, donc une bannière.
  const content = {
    en: [
      {
        title: '1. What we store on your device',
        text: `${COMPANY.name} only stores what the site needs to work: the session that keeps you signed in, your shopping cart, and your language and currency preference. Nothing else is written to your device.`,
      },
      {
        title: '2. No tracking, no advertising',
        text: 'We use no audience measurement tool, no advertising pixel and no social network tracker. We do not build a browsing profile, and we share nothing with advertisers. Because these cookies are strictly necessary to provide the service you asked for, no consent banner is required.',
      },
      {
        title: '3. Third parties',
        text: `Two services are involved when you use the site: ${HOSTING.data.name}, which keeps you signed in, and FedaPay, which handles savings payments. Both set only what their own service requires. Their privacy policies apply to what they collect.`,
      },
      {
        title: '4. How long',
        text: `Browser storage is kept for ${DATA_RETENTION.cookies.en}. You can clear it at any time from your browser settings — you will simply be signed out and your cart emptied.`,
      },
      {
        title: '5. Refusing them',
        text: 'Your browser lets you refuse or delete this storage. The site will still display, but signing in, the cart and checkout will no longer work — these functions depend on it.',
      },
    ],
    fr: [
      {
        title: '1. Ce que nous stockons sur votre appareil',
        text: `${COMPANY.name} ne stocke que ce dont le site a besoin pour fonctionner : la session qui vous garde connecté, votre panier, et votre préférence de langue et de devise. Rien d'autre n'est écrit sur votre appareil.`,
      },
      {
        title: '2. Aucun suivi, aucune publicité',
        text: "Nous n'utilisons aucun outil de mesure d'audience, aucun pixel publicitaire et aucun traceur de réseau social. Nous ne construisons pas de profil de navigation et ne transmettons rien à des annonceurs. Ces cookies étant strictement nécessaires au service que vous demandez, aucune bannière de consentement n'est requise.",
      },
      {
        title: '3. Services tiers',
        text: `Deux services interviennent pendant votre navigation : ${HOSTING.data.name}, qui maintient votre session, et FedaPay, qui traite les versements d'épargne. Chacun ne dépose que ce que son propre service exige. Leurs politiques de confidentialité s'appliquent à ce qu'ils collectent.`,
      },
      {
        title: '4. Durée de conservation',
        text: `Le stockage navigateur est conservé ${DATA_RETENTION.cookies.fr}. Vous pouvez l'effacer à tout moment depuis les réglages de votre navigateur : vous serez simplement déconnecté et votre panier vidé.`,
      },
      {
        title: '5. Les refuser',
        text: "Votre navigateur vous permet de refuser ou de supprimer ce stockage. Le site restera consultable, mais la connexion, le panier et la commande cesseront de fonctionner : ces fonctions en dépendent.",
      },
    ],
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
