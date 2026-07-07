import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layout, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useAuth } from '@/src/contexts/AuthContext';
import Seo from '@/src/components/Seo';

export default function ResetPassword() {
  const { language } = useLanguage();
  const fr = language === 'fr';
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError(fr ? 'Le mot de passe doit contenir au moins 6 caractères.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError(fr ? 'Les mots de passe ne correspondent pas.' : 'Passwords do not match.');
      return;
    }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) {
      setError(
        fr
          ? 'Le lien est invalide ou expiré. Demandez un nouveau lien.'
          : 'The link is invalid or expired. Please request a new one.'
      );
      return;
    }
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Seo title={fr ? 'Nouveau mot de passe' : 'New password'} />
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
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{fr ? 'Mot de passe mis à jour' : 'Password updated'}</h2>
              <p className="text-sm text-gray-500 mb-8">
                {fr ? 'Vous pouvez désormais utiliser votre nouveau mot de passe.' : 'You can now use your new password.'}
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex px-8 py-3.5 bg-[#007bff] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all"
              >
                {fr ? 'Aller à mon compte' : 'Go to my account'}
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight mb-2">
                {fr ? 'Nouveau mot de passe' : 'New password'}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-8">
                {fr ? 'Choisissez un nouveau mot de passe pour votre compte.' : 'Choose a new password for your account.'}
              </p>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{fr ? 'Nouveau mot de passe' : 'New password'}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{fr ? 'Confirmer le mot de passe' : 'Confirm password'}</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
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
                  {loading ? (fr ? 'Mise à jour…' : 'Updating…') : (fr ? 'Réinitialiser' : 'Reset password')}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
