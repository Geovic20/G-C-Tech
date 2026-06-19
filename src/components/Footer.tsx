import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, ShoppingCart } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-20 pb-10">
      <div className="px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#007bff] rounded-full flex items-center justify-center">
                <ShoppingCart className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-[#007bff]">G&C Tech</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              We offer the best electronics at the most competitive prices. Quality and customer satisfaction guaranteed.
            </p>
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#007bff] transition-colors"><Facebook size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#007bff] transition-colors"><Twitter size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#007bff] transition-colors"><Instagram size={18} /></button>
              <button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-[#007bff] transition-colors"><Youtube size={18} /></button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">{t('footer.about')}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-[#007bff]">Our Story</Link></li>
              <li><Link to="/" className="hover:text-[#007bff]">Careers</Link></li>
              <li><Link to="/" className="hover:text-[#007bff]">Press</Link></li>
              <li><Link to="/" className="hover:text-[#007bff]">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">{t('footer.support')}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/help" className="hover:text-[#007bff]">Help Center</Link></li>
              <li><Link to="/refund" className="hover:text-[#007bff]">Returns</Link></li>
              <li><Link to="/shipping" className="hover:text-[#007bff]">Shipping Info</Link></li>
              <li><Link to="/refund" className="hover:text-[#007bff]">{t('footer.refund')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><Link to="/contact" className="hover:text-[#007bff] font-bold">Contact Us</Link></li>
              <li>123 Electronic Street</li>
              <li>Tech City, TC 12345</li>
              <li>+00 123 456 7890</li>
              <li>contact@gctech.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} G&C Tech. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-[#007bff]">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-[#007bff]">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
