import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Minus, Plus, Truck, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '@/src/constants';
import Navbar from '@/src/components/Navbar';
import { cn } from '@/src/lib/utils';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { useCart } from '@/src/contexts/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === id) || PRODUCTS[0];
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(product.image);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const images = [
    product.image,
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-4 md:px-12 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-12">
          <Link to="/" className="hover:text-gray-900">{t('breadcrumb.home')}</Link>
          <ChevronRight size={14} />
          <span className="hover:text-gray-900 capitalize">{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 mb-20">
          {/* Gallery */}
          <div className="space-y-4 md:space-y-6">
            <div className="aspect-square bg-[#f5f6f6] rounded-[32px] md:rounded-[40px] overflow-hidden flex items-center justify-center p-6 md:p-12">
              <img src={mainImage} alt={product.name} className="max-w-full max-h-full object-contain" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setMainImage(img)}
                  className={cn(
                    "aspect-square bg-[#f5f6f6] rounded-2xl overflow-hidden p-4 transition-all border-2",
                    mainImage === img ? "border-[#007bff]" : "border-transparent"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">{product.name.split(',')[0]}</h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 max-w-lg">{product.description}</p>
            
            <div className="flex items-center gap-2 mb-8">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>

            <hr className="border-gray-100 mb-8" />

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              </div>

            <hr className="border-gray-100 mb-8" />

            {/* Color Selector */}
            {product.colors && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-4">{t('detail.choose-color')}</h3>
                <div className="flex gap-4">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-4 transition-all",
                        selectedColor === color ? "border-gray-300 ring-2 ring-gray-900" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center bg-[#f5f6f6] rounded-full px-4 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-[#007bff]"><Minus size={18} /></button>
                <span className="w-12 text-center font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-[#007bff]"><Plus size={18} /></button>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-bold text-red-500">{t('detail.left')}</p>
                <p className="text-xs text-gray-500">{t('detail.dont-miss')}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button onClick={handleBuyNow} className="w-full sm:flex-1 px-8 py-4 bg-[#007bff] text-white rounded-full font-bold text-center hover:bg-blue-700 transition-colors">
                {t('detail.buy-now')}
              </button>
              <button onClick={handleAddToCart} className="w-full sm:flex-1 px-8 py-4 border-2 border-[#007bff] text-[#007bff] rounded-full font-bold hover:bg-blue-50 transition-colors">
                {t('products.add')}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-100 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fef2f2] rounded-full flex items-center justify-center text-blue-500">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{t('detail.free-delivery')}</p>
                  <button className="text-xs underline text-gray-500">{t('detail.free-delivery-desc')}</button>
                </div>
              </div>
              <div className="p-4 border border-gray-100 rounded-2xl flex items-start gap-4">
                <div className="w-10 h-10 bg-[#fef2f2] rounded-full flex items-center justify-center text-blue-500">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">{t('detail.return')}</p>
                  <p className="text-xs text-gray-500">{t('detail.return-desc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8">{product.name.split(',')[0]} {t('detail.specs')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            <div className="space-y-6">
              <h3 className="font-bold text-xl pb-4 border-b border-gray-100">General</h3>
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{key}</span>
                  <span className="font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            {product.category === 'Headphones' && (
              <div className="space-y-6">
                <h3 className="font-bold text-xl pb-4 border-b border-gray-100">Product details</h3>
                {[
                  { key: 'Microphone', val: 'Yes' },
                  { key: 'Driver Type', val: 'Dynamic' },
                  { key: 'Driver Size (mm)', val: '40' },
                  { key: 'Number of Drivers', val: '1' },
                  { key: 'Water Resistant', val: 'No' },
                  { key: 'Weight (g)', val: '385.00' },
                  { key: 'Battery Life (hr)', val: '20' }
                ].map((item) => (
                  <div key={item.key} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{item.key}</span>
                    <span className="font-medium text-gray-900">{item.val}</span>
                  </div>
                ))}
              </div>
            )}
            {product.category === 'Phones' && (
              <div className="space-y-6">
                <h3 className="font-bold text-xl pb-4 border-b border-gray-100">Network & Connectivity</h3>
                {[
                  { key: '5G', val: 'Yes' },
                  { key: 'Bluetooth', val: '5.3' },
                  { key: 'Sim Type', val: 'Nano-SIM and eSIM' },
                  { key: 'Charging Port', val: 'USB-C' }
                ].map((item) => (
                  <div key={item.key} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-gray-500">{item.key}</span>
                    <span className="font-medium text-gray-900">{item.val}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
