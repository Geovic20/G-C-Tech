import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/src/contexts/LanguageContext';
import Seo from '@/src/components/Seo';
import { useAuth } from '@/src/contexts/AuthContext';
import { Eye, EyeOff, Layout } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const { t, language } = useLanguage();
  const { signIn } = useAuth();
  const fr = language === 'fr';
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      // Supabase returns a single "invalid credentials" error for both cases,
      // which is also the safer message (doesn't reveal whether the email exists).
      setError(fr ? 'Email ou mot de passe incorrect.' : 'Invalid email or password.');
      return;
    }
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Seo title={t('auth.login.title')} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#007bff] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layout className="text-white" size={24} />
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tight">G&C Tech</span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          {t('auth.login.title')}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          {t('auth.login.subtitle')}
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-blue-900/5 sm:rounded-[32px] sm:px-12 border border-blue-50/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                {t('auth.login.email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                {t('auth.login.password')}
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex items-center justify-end mt-2">
                <div className="text-sm">
                  <Link to="/mot-de-passe-oublie" className="font-bold text-[#007bff] hover:text-blue-700 transition-colors">
                    {t('auth.login.forgot')}
                  </Link>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg shadow-blue-500/25 text-sm font-black text-white bg-[#007bff] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all uppercase tracking-widest disabled:opacity-60"
              >
                {loading ? (fr ? 'Connexion...' : 'Signing in...') : t('auth.login.submit')}
              </button>
            </div>
          </form>


          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500 font-medium">
              {t('auth.login.no-account')}{' '}
              <Link to="/signup" className="font-black text-[#007bff] hover:text-blue-700 transition-colors ml-1">
                {t('auth.login.signup')}
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
