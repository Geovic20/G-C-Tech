import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useState } from 'react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { Search, ChevronRight, MessageCircle, Phone, Mail, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY } from '@/src/lib/company';

/**
 * Questions du centre d'aide, avec leurs reponses.
 *
 * Chaque reponse decrit ce que le site fait REELLEMENT : pas de suivi de colis,
 * pas de livraison mondiale, pas de paiement par carte sur les commandes. Une
 * question sans reponse honnete vaut mieux supprimee qu'inventee.
 */
const HELP_CATEGORIES = {
  en: [
    {
      category: 'Orders',
      icon: ShoppingBag,
      items: [
        {
          q: 'How do I follow my order?',
          a: 'There is no parcel tracking number. Your order is finalised on WhatsApp, and that conversation is where we confirm payment, availability and the courier’s time. If you ordered while signed in, the status also appears under My Orders in your account: pending, confirmed, shipped, delivered.',
        },
        {
          q: 'Can I change my delivery address?',
          a: 'Yes, as long as the order has not shipped — write to us on WhatsApp. The address is recorded with the order at checkout, so it is not editable from your account: we update it on our side.',
        },
        {
          q: 'How do I cancel my order?',
          a: 'Write to us on WhatsApp before the order ships. Since payment is arranged in that conversation, an order that has not been paid for is simply not processed.',
        },
      ],
    },
    {
      category: 'Delivery',
      icon: Truck,
      items: [
        {
          q: 'What are your delivery fees?',
          a: 'Within Benin, the fee depends only on your neighbourhood — never on the order amount. Every zone and its price is listed on the Delivery page. Outside Benin, the fee is quoted case by case.',
        },
        {
          q: 'Do you ship outside Benin?',
          a: 'Yes, to Togo, Niger, Nigeria, Côte d’Ivoire and Senegal. The fee depends on the carrier and the period, so we quote it individually: pick "On request" as your zone at checkout, and we send you the amount on WhatsApp before anything ships.',
        },
        {
          q: 'How long does delivery take?',
          a: 'Within Benin you choose the date and one of the two-hour slots between 8am and 8pm when ordering, and we keep to it. For shipments abroad the date is agreed on WhatsApp, since it depends on the carrier.',
        },
      ],
    },
    {
      category: 'Returns',
      icon: RotateCcw,
      items: [
        {
          q: 'What is your return policy?',
          a: 'You have 30 calendar days from the day you receive an item to return it. It must be unused and in the condition you received it. Return shipping is at your expense and is not refunded.',
        },
        {
          q: 'How do I start a return?',
          a: 'Write to us on WhatsApp or by email within the 30 days, telling us which item and why. We confirm the return address before you ship anything back.',
        },
        {
          q: 'When do I get my refund?',
          a: 'Once we receive the item we inspect it and let you know. If the return is approved, the refund goes back through the payment method you originally used.',
        },
      ],
    },
    {
      category: 'Payments',
      icon: ShieldCheck,
      items: [
        {
          q: 'How do I pay for an order?',
          a: 'Orders are settled in the WhatsApp conversation: you send your basket from the site, and we agree there on how you pay. The site itself never asks for card or mobile money details.',
        },
        {
          q: 'Are my payment details safe?',
          a: 'The site collects no banking data at all. Savings contributions go through FedaPay’s own secure page — we never see your card or mobile money details, and our payment key never leaves our server.',
        },
        {
          q: 'Can I pay in instalments?',
          a: 'Yes, through Product Savings: you pick a product, contribute at your own pace (daily, weekly or monthly), and we deliver once you reach 100%. No credit, no interest, and the price is locked at the catalog price when you open the plan.',
        },
      ],
    },
  ],
  fr: [
    {
      category: 'Commandes',
      icon: ShoppingBag,
      items: [
        {
          q: 'Comment suivre ma commande ?',
          a: "Il n'y a pas de numéro de suivi de colis. Votre commande se finalise sur WhatsApp, et c'est dans cette conversation que nous confirmons le paiement, la disponibilité et l'heure de passage du livreur. Si vous étiez connecté, le statut apparaît aussi dans « Mes commandes » : en attente, confirmée, expédiée, livrée.",
        },
        {
          q: 'Puis-je modifier mon adresse de livraison ?',
          a: "Oui, tant que la commande n'est pas expédiée — écrivez-nous sur WhatsApp. L'adresse est enregistrée avec la commande au moment de l'achat, elle n'est donc pas modifiable depuis votre compte : nous la corrigeons de notre côté.",
        },
        {
          q: 'Comment annuler ma commande ?',
          a: "Écrivez-nous sur WhatsApp avant l'expédition. Le règlement se convenant dans cette conversation, une commande non payée n'est tout simplement pas traitée.",
        },
      ],
    },
    {
      category: 'Livraison',
      icon: Truck,
      items: [
        {
          q: 'Quels sont vos tarifs de livraison ?',
          a: "Au Bénin, les frais dépendent uniquement de votre quartier, jamais du montant de la commande. Chaque zone et son tarif sont listés sur la page Livraison. Hors du Bénin, le tarif est établi au cas par cas.",
        },
        {
          q: 'Livrez-vous hors du Bénin ?',
          a: "Oui, au Togo, au Niger, au Nigeria, en Côte d'Ivoire et au Sénégal. Le tarif dépend de la compagnie et de la période, nous l'établissons donc individuellement : choisissez « Sur devis » comme zone au moment de la commande, et nous vous communiquons le montant sur WhatsApp avant toute expédition.",
        },
        {
          q: 'Combien de temps prend la livraison ?',
          a: "Au Bénin, vous choisissez la date et l'un des créneaux de deux heures entre 8h et 20h au moment de la commande, et nous nous y tenons. Pour les envois à l'étranger, la date se convient sur WhatsApp, car elle dépend du transporteur.",
        },
      ],
    },
    {
      category: 'Retours',
      icon: RotateCcw,
      items: [
        {
          q: 'Quelle est votre politique de retour ?',
          a: "Vous disposez de 30 jours calendaires à compter de la réception pour retourner un article. Il doit être inutilisé et dans l'état où vous l'avez reçu. Les frais de retour sont à votre charge et ne sont pas remboursés.",
        },
        {
          q: 'Comment initier un retour ?',
          a: "Écrivez-nous sur WhatsApp ou par e-mail dans les 30 jours, en précisant l'article et le motif. Nous vous confirmons l'adresse de retour avant que vous n'expédiiez quoi que ce soit.",
        },
        {
          q: 'Quand serai-je remboursé ?',
          a: "Dès réception de l'article, nous l'inspectons et vous tenons informé. Si le retour est accepté, le remboursement repart par le moyen de paiement que vous aviez utilisé.",
        },
      ],
    },
    {
      category: 'Paiements',
      icon: ShieldCheck,
      items: [
        {
          q: 'Comment régler une commande ?',
          a: "Les commandes se règlent dans la conversation WhatsApp : vous nous envoyez votre panier depuis le site, et nous convenons là du mode de règlement. Le site ne vous demande jamais de coordonnées bancaires ni mobile money.",
        },
        {
          q: 'Mes informations de paiement sont-elles en sécurité ?',
          a: "Le site ne collecte aucune donnée bancaire. Les versements d'épargne passent par la page sécurisée de FedaPay : nous ne voyons jamais vos coordonnées de carte ou de mobile money, et notre clé de paiement ne quitte jamais notre serveur.",
        },
        {
          q: 'Proposez-vous des facilités de paiement ?',
          a: "Oui, avec l'Épargne Produit : vous choisissez un produit, vous versez à votre rythme (chaque jour, semaine ou mois), et nous livrons une fois 100% atteint. Pas de crédit, pas d'intérêts, et le prix est figé au tarif catalogue le jour où vous ouvrez le plan.",
        },
      ],
    },
  ],
};

/** Insensible a la casse et aux accents : « livraison » trouve « Livraison ». */
function normalize(v: string): string {
  return v.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function HelpCenter() {
  const { t, language } = useLanguage();
  const fr = language === 'fr';
  const [query, setQuery] = useState('');

  // Le champ de recherche filtre sur le nom de categorie ET sur les questions ;
  // une categorie ne garde que les questions qui correspondent.
  const q = normalize(query.trim());
  const categories = q
    ? HELP_CATEGORIES[language]
        .map((cat) => ({
          ...cat,
          items: normalize(cat.category).includes(q)
            ? cat.items
            : cat.items.filter(
                (item) => normalize(item.q).includes(q) || normalize(item.a).includes(q)
              ),
        }))
        .filter((cat) => cat.items.length > 0)
    : HELP_CATEGORIES[language];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('support.help.title')} description={t('support.help.subtitle')} />

      <main>
        {/* Hero Section */}
        <div className="bg-[#007bff] py-12 md:py-20">
          <div className="px-4 md:px-12 max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-black text-white mb-6"
            >
              {t('support.help.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-lg mb-10"
            >
              {t('support.help.subtitle')}
            </motion.p>

            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={fr ? 'Rechercher des réponses...' : 'Search for answers...'}
                aria-label={fr ? 'Rechercher dans le centre d’aide' : 'Search the help center'}
                className="w-full h-16 pl-14 pr-6 bg-white rounded-2xl shadow-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-12 max-w-7xl mx-auto py-20">
          {/* Quick Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#007bff] mb-6 shadow-sm group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                  <cat.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{cat.category}</h3>
                <ul className="space-y-4">
                  {cat.items.map((item) => (
                    <li key={item.q}>
                      <p className="text-gray-900 text-sm font-bold flex items-start gap-2 mb-1">
                        <ChevronRight size={14} className="text-blue-300 flex-shrink-0 mt-0.5" />
                        {item.q}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed pl-[22px]">{item.a}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {categories.length === 0 && (
            <p className="text-center text-gray-500 -mt-12 mb-20">
              {fr
                ? 'Aucune réponse ne correspond à votre recherche. Écrivez-nous, nous répondons directement.'
                : 'No answer matches your search. Write to us, we reply directly.'}
            </p>
          )}

          {/* Still need help? */}
          <div className="bg-gray-900 rounded-[32px] md:rounded-[40px] overflow-hidden relative p-8 md:p-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-10 -ml-32 -mb-32"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-6">{fr ? "Besoin d'aide supplémentaire ?" : 'Still need help?'}</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  {fr
                    ? `Notre équipe vous répond ${COMPANY.hours.fr.toLowerCase()}, par WhatsApp, par téléphone ou par e-mail.`
                    : `Our team replies ${COMPANY.hours.en.toLowerCase()}, on WhatsApp, by phone or by email.`}
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 bg-[#007bff] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  <MessageCircle size={20} />
                  {fr ? 'Discuter avec nous' : 'Chat with us'}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                    <Phone size={20} />
                  </div>
                  <h4 className="text-white font-bold mb-1">{fr ? 'Appelez-nous' : 'Call us'}</h4>
                  {COMPANY.phones.map((p) => (
                    <a key={p.tel} href={`tel:${p.tel}`} className="block text-gray-400 text-sm hover:text-white">
                      {p.display}
                    </a>
                  ))}
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                    <Mail size={20} />
                  </div>
                  <h4 className="text-white font-bold mb-1">{fr ? 'Écrivez-nous' : 'Email us'}</h4>
                  <a href={`mailto:${COMPANY.email}`} className="text-gray-400 text-sm hover:text-white break-all">
                    {COMPANY.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
