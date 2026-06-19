import React from 'react';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { ChevronDown, ShoppingCart, CreditCard, RotateCcw } from 'lucide-react';

const FAQ_CONTENT = {
  en: [
    {
      category: 'Orders',
      icon: ShoppingCart,
      questions: [
        { q: 'How can I track my order?', a: "You can track your order by clicking on the 'Track Order' link in your confirmation email or by visiting the Shipping page." },
        { q: 'Can I change my delivery address?', a: "If your order hasn't been shipped yet, you can contact our support team to update your address." },
        { q: 'What should I do if my order is delayed?', a: 'While we strive for on-time delivery, delays can happen. Please check your tracking link for updates or contact support.' }
      ]
    },
    {
      category: 'Payments',
      icon: CreditCard,
      questions: [
        { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and local mobile money services.' },
        { q: 'Is my payment information secure?', a: 'Yes, we use industry-standard encryption to protect your financial data.' }
      ]
    },
    {
      category: 'Returns & Refunds',
      icon: RotateCcw,
      questions: [
        { q: 'What is your return policy?', a: 'We offer a 30-day return policy for most items in their original condition.' },
        { q: 'How long does a refund take?', a: 'Refunds are typically processed within 5-7 business days after we receive the returned item.' }
      ]
    }
  ],
  fr: [
    {
      category: 'Commandes',
      icon: ShoppingCart,
      questions: [
        { q: 'Comment suivre ma commande ?', a: "Vous pouvez suivre votre commande en cliquant sur le lien « Suivre la commande » dans votre e-mail de confirmation ou en visitant la page Livraison." },
        { q: 'Puis-je modifier mon adresse de livraison ?', a: "Si votre commande n'a pas encore été expédiée, vous pouvez contacter notre support pour mettre à jour votre adresse." },
        { q: 'Que faire si ma commande est en retard ?', a: 'Nous faisons tout pour livrer à temps, mais des retards peuvent survenir. Consultez votre lien de suivi ou contactez le support.' }
      ]
    },
    {
      category: 'Paiements',
      icon: CreditCard,
      questions: [
        { q: 'Quels moyens de paiement acceptez-vous ?', a: 'Nous acceptons les principales cartes bancaires, PayPal et les services de mobile money locaux.' },
        { q: 'Mes informations de paiement sont-elles sécurisées ?', a: 'Oui, nous utilisons un chiffrement aux normes du secteur pour protéger vos données financières.' }
      ]
    },
    {
      category: 'Retours & Remboursements',
      icon: RotateCcw,
      questions: [
        { q: 'Quelle est votre politique de retour ?', a: 'Nous proposons une politique de retour de 30 jours pour la plupart des articles dans leur état d\'origine.' },
        { q: 'Combien de temps prend un remboursement ?', a: 'Les remboursements sont généralement traités sous 5 à 7 jours ouvrés après réception de l\'article retourné.' }
      ]
    }
  ]
};

export default function FAQ() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const items = FAQ_CONTENT[language];
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (q: string) => {
    setOpenItems(prev => prev.includes(q) ? prev.filter(i => i !== q) : [...prev, q]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="py-20">
        <div className="px-4 md:px-12 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
            >
              {fr ? 'Questions fréquentes' : 'Frequently Asked Questions'}
            </motion.h1>
            <p className="text-gray-500 text-lg">
              {fr
                ? 'Trouvez les réponses aux questions les plus courantes sur vos achats chez nous.'
                : 'Find answers to the most common questions about shopping with us.'}
            </p>
          </div>

          <div className="space-y-12">
            {items.map((section, sIdx) => (
              <div key={sIdx}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 text-[#007bff] rounded-lg">
                    <section.icon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.category}</h2>
                </div>

                <div className="space-y-4">
                  {section.questions.map((item, qIdx) => (
                    <div
                      key={qIdx}
                      className="border border-gray-100 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleItem(item.q)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900">{item.q}</span>
                        <ChevronDown className={cn("text-gray-400 transition-transform", openItems.includes(item.q) && "rotate-180")} size={20} />
                      </button>

                      {openItems.includes(item.q) && (
                        <div className="p-6 pt-0 text-gray-500 border-t border-gray-50 animate-in fade-in slide-in-from-top-2">
                          {item.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-gray-900 rounded-[40px] text-center text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
             <h3 className="text-2xl font-bold mb-4">{fr ? 'Encore des questions ?' : 'Still have questions?'}</h3>
             <p className="text-gray-400 mb-8">{fr ? 'Notre équipe support est là pour vous aider 24h/24 et 7j/7.' : 'Our support team is here to help you 24/7.'}</p>
             <button className="px-8 py-4 bg-[#007bff] hover:bg-blue-600 text-white rounded-2xl font-bold transition-all">
                {fr ? 'Contacter le support' : 'Contact Support'}
             </button>
          </div>
        </div>
      </main>

    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
