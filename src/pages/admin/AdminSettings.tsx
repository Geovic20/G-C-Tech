import React, { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import AdminLayout from '@/src/components/AdminLayout';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { getSavingsTerms, updateSavingsTerms } from '@/src/lib/settings';

export default function AdminSettings() {
  const { language } = useLanguage();
  const fr = language === 'fr';

  const [frText, setFrText] = useState('');
  const [enText, setEnText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSavingsTerms()
      .then((terms) => {
        setFrText(terms.fr);
        setEnText(terms.en);
      })
      .catch((e) => setError(e?.message ?? 'Error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    const result = await updateSavingsTerms({ fr: frText, en: enText });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout title={fr ? 'Réglages' : 'Settings'}>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 max-w-3xl">
        <h2 className="text-lg font-black text-gray-900 mb-1">{fr ? "Conditions de l'Épargne Produit" : 'Product Savings terms'}</h2>
        <p className="text-sm text-gray-500 mb-6">
          {fr
            ? 'Ces conditions sont affichées et doivent être acceptées avant d’ouvrir une épargne. Format Markdown : # titre, ## section, * puce, **gras**.'
            : 'These terms are shown and must be accepted before opening a savings plan. Markdown: # title, ## section, * bullet, **bold**.'}
        </p>

        {loading ? (
          <p className="text-gray-400">{fr ? 'Chargement…' : 'Loading…'}</p>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {fr ? 'Version française (Markdown)' : 'French version (Markdown)'}
              </label>
              <textarea
                value={frText}
                onChange={(e) => setFrText(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007bff] font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {fr ? 'Version anglaise (Markdown)' : 'English version (Markdown)'}
              </label>
              <textarea
                value={enText}
                onChange={(e) => setEnText(e.target.value)}
                rows={16}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#007bff] font-mono text-xs leading-relaxed resize-y"
              />
            </div>

            {error && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">{error}</div>
            )}
            {saved && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={18} /> {fr ? 'Conditions enregistrées.' : 'Terms saved.'}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="py-3.5 px-8 bg-[#007bff] text-white rounded-full font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-60"
            >
              {saving ? '…' : fr ? 'Enregistrer' : 'Save'}
            </button>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
