import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout, MailCheck } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useAuth } from '@/src/contexts/AuthContext';
import Seo from '@/src/components/Seo';

export default function ForgotPassword() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.error) {
      setError(fr ? 'Une erreur est survenue. Réessayez.' : 'Something went wrong. Please try again.');
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Seo title={fr ? 'Mot de passe oublié' : 'Forgot password'} />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-[#007bff] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Layout className="text-white" size={24} />
          </div>
          <span className="text-3xl font-black text-gray-900 tracking-tight">G&C Tech</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-10 px-6 shadow-2xl shadow-blue-900/5 sm:rounded-[32px] sm:px-12 border border-blue-50/50">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MailCheck size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{fr ? 'Vérifiez votre email' : 'Check your email'}</h2>
              <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                {fr
                  ? "Si un compte est associé à cette adresse, vous recevrez un lien pour réinitialiser votre mot de passe."
                  : 'If an account exists for this address, you will receive a link to reset your password.'}
              </p>
              <Link to="/login" className="inline-flex px-8 py-3.5 bg-[#007bff] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all">
                {fr ? 'Retour à la connexion' : 'Back to sign in'}
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                {fr ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-8">
                {fr
                  ? 'Entrez votre email pour recevoir un lien de réinitialisation.'
                  : 'Enter your email to receive a reset link.'}
              </p>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                    {fr ? 'Adresse e-mail' : 'Email address'}
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 rounded-2xl shadow-lg shadow-blue-500/25 text-sm font-black text-white bg-[#007bff] hover:bg-blue-700 transition-all uppercase tracking-widest disabled:opacity-60"
                >
                  {loading ? (fr ? 'Envoi…' : 'Sending…') : (fr ? 'Envoyer le lien' : 'Send reset link')}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link to="/login" className="text-sm font-bold text-[#007bff] hover:text-blue-700 transition-colors">
                  {fr ? '← Retour à la connexion' : '← Back to sign in'}
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
