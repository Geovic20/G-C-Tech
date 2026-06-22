import React, { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import ProductCard from '@/src/components/ProductCard';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { PRODUCTS, ProductGroup } from '@/src/constants';

const GROUPS: { key: ProductGroup; labelKey: string }[] = [
  { key: 'smartphones', labelKey: 'cat.smartphones' },
  { key: 'computers', labelKey: 'cat.computers' },
  { key: 'tablets', labelKey: 'cat.tablets' },
  { key: 'headphones', labelKey: 'cat.headphones' },
  { key: 'earphones', labelKey: 'cat.earphones' },
  { key: 'smartwatches', labelKey: 'cat.smartwatches' },
];

export default function Products() {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeGroup, setActiveGroup] = useState<ProductGroup | 'all'>('all');

  const products =
    activeGroup === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.group === activeGroup);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Seo title={t('catalog.title')} description={t('catalog.subtitle')} />

      <main className="max-w-7xl mx-auto px-4 pt-2 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8 font-medium">
          <Link to="/" className="hover:text-[#007bff] transition-colors">{t('breadcrumb.home')}</Link>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">{t('catalog.title')}</span>
        </nav>

        {/* Header */}
        <header className="mb-6 md:mb-10">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            {t('catalog.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl text-lg font-medium leading-relaxed"
          >
            {t('catalog.subtitle')}
          </motion.p>
        </header>

        {/* Category filter + view toggle */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-12">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar pb-1">
            <button
              onClick={() => setActiveGroup('all')}
              className={cn(
                'px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all',
                activeGroup === 'all'
                  ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
              )}
            >
              {t('catalog.all')}
            </button>
            {GROUPS.map((g) => (
              <button
                key={g.key}
                onClick={() => setActiveGroup(g.key)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all',
                  activeGroup === g.key
                    ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-white text-gray-600 border border-gray-100 hover:border-gray-200'
                )}
              >
                {t(g.labelKey)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2.5 rounded-xl transition-all',
                viewMode === 'grid' ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              )}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2.5 rounded-xl transition-all',
                viewMode === 'list' ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              )}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div
            className={cn(
              'grid gap-8',
              viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'
            )}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.04, 0.4) }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-20">{t('catalog.empty')}</p>
        )}
      </main>
    </div>
  );
}
