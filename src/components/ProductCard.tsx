import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/src/constants';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="relative aspect-square rounded-2xl bg-[#f5f6f6] overflow-hidden mb-4">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <button className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart size={20} />
        </button>
      </div>

      <h3 className="font-bold text-sm md:text-lg text-gray-900 line-clamp-1 mb-1">{product.name}</h3>
      <div className="flex items-center mb-2">
        <span className="text-base md:text-xl font-bold">{formatPrice(product.price)}</span>
      </div>
      
      <p className="text-[10px] md:text-sm text-gray-500 mb-3 line-clamp-2 min-h-[30px] md:min-h-[40px]">{product.description}</p>
      
      <div className="flex items-center gap-1 text-[10px] text-yellow-500 mb-4">
        <span className="flex">{'★'.repeat(Math.floor(product.rating))}</span>
        <span className="text-gray-400 ml-1">({product.reviews})</span>
      </div>

      <button className="w-full px-4 md:px-6 py-2 border-2 border-gray-900 rounded-full font-bold text-[10px] md:text-sm hover:bg-[#007bff] hover:border-[#007bff] hover:text-white transition-all">
        {t('products.add')}
      </button>
    </motion.div>
  );
}
