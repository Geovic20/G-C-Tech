import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, PRODUCTS } from '@/src/constants';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import ProductCard from '@/src/components/ProductCard';
import FeatureSection from '@/src/components/FeatureSection';
import { TestimonialStack } from '@/src/components/TestimonialStack';
import Newsletter from '@/src/components/Newsletter';
import { motion } from 'motion/react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { cn } from '@/src/lib/utils';
import { Star, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { t, language } = useLanguage();
  const fr = language === 'fr';

  const TESTIMONIALS = [
    {
      id: 1,
      initials: t('testimonials.1.initials'),
      name: t('testimonials.1.name'),
      role: t('testimonials.1.role'),
      quote: t('testimonials.1.quote'),
      tags: [
        { text: t('testimonials.tag.featured'), type: 'featured' as const },
        { text: t('testimonials.tag.tech'), type: 'default' as const }
      ],
      stats: [
        { icon: ShieldCheck, text: t('testimonials.stat.verified') },
        { icon: Star, text: '5.0' }
      ],
      avatarGradient: 'bg-gradient-to-br from-blue-400 to-indigo-600'
    },
    {
      id: 2,
      initials: t('testimonials.2.initials'),
      name: t('testimonials.2.name'),
      role: t('testimonials.2.role'),
      quote: t('testimonials.2.quote'),
      tags: [
        { text: 'Gaming', type: 'default' as const }
      ],
      stats: [
        { icon: ShieldCheck, text: t('testimonials.stat.verified') },
        { icon: Star, text: '4.9' }
      ],
      avatarGradient: 'bg-gradient-to-br from-purple-400 to-pink-600'
    },
    {
      id: 3,
      initials: t('testimonials.3.initials'),
      name: t('testimonials.3.name'),
      role: t('testimonials.3.role'),
      quote: t('testimonials.3.quote'),
      tags: [
        { text: 'Design', type: 'default' as const }
      ],
      stats: [
        { icon: ShieldCheck, text: t('testimonials.stat.verified') },
        { icon: Star, text: '5.0' }
      ],
      avatarGradient: 'bg-gradient-to-br from-green-400 to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Seo
        title={fr ? 'Boutique High-Tech & Électronique' : 'High-Tech & Electronics Store'}
        description={t('hero.desc')}
      />
      <Navbar />

      <main className="px-4 md:px-12 py-8">
        {/* Hero Section */}
        <div className="relative rounded-[40px] bg-blue-50 overflow-hidden mb-16 flex flex-col md:flex-row items-center justify-between p-12 md:p-20">
          <div className="max-w-md z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg text-gray-600 mb-10"
            >
              {t('hero.desc')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button className="px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
                {t('hero.learn')}
              </button>
            </motion.div>
          </div>
          <div className="relative mt-12 md:mt-0">
             {/* Abstract 3D elements placeholder */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div initial={{ y: 20 }} animate={{ y: 0 }} transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse' }} className="w-32 h-32 bg-yellow-400 rounded-2xl shadow-xl flex items-center justify-center text-4xl">👜</motion.div>
              <motion.div initial={{ y: -20 }} animate={{ y: 0 }} transition={{ repeat: Infinity, duration: 3, repeatType: 'reverse' }} className="w-32 h-32 bg-blue-400 rounded-2xl shadow-xl flex items-center justify-center text-4xl">🎮</motion.div>
              <motion.div initial={{ x: 20 }} animate={{ x: 0 }} transition={{ repeat: Infinity, duration: 5, repeatType: 'reverse' }} className="w-32 h-32 bg-green-400 rounded-2xl shadow-xl flex items-center justify-center text-4xl">💻</motion.div>
              <motion.div initial={{ x: -20 }} animate={{ x: 0 }} transition={{ repeat: Infinity, duration: 4, repeatType: 'reverse' }} className="w-32 h-32 bg-red-400 rounded-2xl shadow-xl flex items-center justify-center text-4xl">👟</motion.div>
            </div>
            <div className="absolute -bottom-10 left-10 w-64 h-16 bg-blue-400 rounded-full blur-3xl opacity-30"></div>
          </div>
        </div>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">{t('cat.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.map((cat) => (
              <Link 
                key={cat.id} 
                to={cat.link}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all block"
              >
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute top-4 left-0 right-0 text-center">
                  <h3 className="text-xl font-bold text-white drop-shadow-md">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Brands Feature Section */}
        <FeatureSection />

        {/* Product Listing */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">{t('products.for-you')}</h2>
            <Link to="/products" className="text-sm font-bold text-[#007bff] hover:text-blue-700 transition-colors">
              {fr ? 'Voir tout →' : 'View all →'}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialStack 
          testimonials={TESTIMONIALS} 
          title={t('testimonials.title')} 
          subtitle={t('testimonials.subtitle')} 
        />

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">{t('services.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: fr ? 'Questions fréquentes' : 'Frequently Asked Questions', desc: fr ? 'Trouvez des réponses aux questions courantes' : 'Find answers to common questions', bg: '#f7edde', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', link: '/faq' },
              { title: fr ? 'Processus de paiement en ligne' : 'Online Payment Process', desc: fr ? 'Découvrez nos moyens de paiement sécurisés' : 'Learn about our secure payment methods', bg: '#e0f0ff', img: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400&h=300&fit=crop', link: '/payment-details' },
              { title: fr ? 'Options de livraison à domicile' : 'Home Delivery Options', desc: fr ? 'Tarifs et délais de livraison' : 'Shipping rates and delivery times', bg: '#f7edde', img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=300&fit=crop', link: '/shipping' }
            ].map((service, i) => (
              <Link key={i} to={service.link} className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all block group" style={{ backgroundColor: service.bg }}>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-[#007bff] transition-colors">{service.title}</h3>
                  <p className="text-sm text-gray-600 mb-6">{service.desc}</p>
                </div>
                <img src={service.img} alt={service.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <Newsletter />
      </main>
    </div>
  );
}
