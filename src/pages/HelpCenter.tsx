import React from 'react';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { Search, ChevronRight, MessageCircle, Phone, Mail, FileText, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    category: 'Orders',
    icon: ShoppingBag,
    questions: [
      'How do I track my order?',
      'Can I change my delivery address?',
      'How do I cancel my order?',
    ]
  },
  {
    category: 'Shipping',
    icon: Truck,
    questions: [
      'What are your shipping rates?',
      'Do you offer international shipping?',
      'How long will delivery take?',
    ]
  },
  {
    category: 'Returns',
    icon: RotateCcw,
    questions: [
      'What is your return policy?',
      'How do I start a return?',
      'When will I get my refund?',
    ]
  },
  {
    category: 'Payments',
    icon: ShieldCheck,
    questions: [
      'What payment methods do you accept?',
      'Is my payment information secure?',
      'Do you offer financing options?',
    ]
  }
];

export default function HelpCenter() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
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
                type="text" 
                placeholder="Search for answers..."
                className="w-full h-16 pl-14 pr-6 bg-white rounded-2xl shadow-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <div className="px-4 md:px-12 max-w-7xl mx-auto py-20">
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {FAQS.map((cat, idx) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#007bff] mb-6 shadow-sm group-hover:bg-[#007bff] group-hover:text-white transition-colors">
                  <cat.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{cat.category}</h3>
                <ul className="space-y-3">
                  {cat.questions.map(q => (
                    <li key={q} className="text-gray-500 text-sm hover:text-[#007bff] flex items-center gap-2">
                      <ChevronRight size={12} className="text-blue-300" />
                      {q}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Still need help? */}
          <div className="bg-gray-900 rounded-[32px] md:rounded-[40px] overflow-hidden relative p-8 md:p-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-[120px] opacity-10 -ml-32 -mb-32"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center relative z-10">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-white mb-6">Still need help?</h2>
                <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                  Our customer support team is available 24/7 to assist you with any questions or concerns you might have.
                </p>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-3 bg-[#007bff] hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95"
                >
                  <MessageCircle size={20} />
                  Chat with us
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                    <Phone size={20} />
                  </div>
                  <h4 className="text-white font-bold mb-1">Call us</h4>
                  <p className="text-gray-500 text-sm">+221 33 000 00 00</p>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-4">
                    <Mail size={20} />
                  </div>
                  <h4 className="text-white font-bold mb-1">Email us</h4>
                  <p className="text-gray-500 text-sm">support@gctech.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
