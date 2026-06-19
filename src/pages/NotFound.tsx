import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/contexts/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-[#007bff]">
          <Compass size={44} />
        </div>
        <p className="text-6xl font-black text-[#007bff] mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {language === 'fr' ? 'Page introuvable' : 'Page not found'}
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          {language === 'fr'
            ? "La page que vous recherchez n'existe pas ou a été déplacée."
            : 'The page you are looking for does not exist or has been moved.'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-10 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all"
        >
          {language === 'fr' ? "Retour à l'accueil" : 'Back to home'}
        </Link>
      </main>
    </div>
  );
}
