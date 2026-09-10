import React, { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import Seo from '@/src/components/Seo';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { Mail, Phone, Send, CheckCircle } from 'lucide-react';
import { buildWhatsappUrl } from '@/src/lib/whatsapp';
import { COMPANY } from '@/src/lib/company';

export default function ContactUs() {
  const { t, language } = useLanguage();
  const fr = language === 'fr';
  const [submitted, setSubmitted] = useState(false);
  const [sentUrl, setSentUrl] = useState('');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const set = (k: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const subjects = fr
    ? ['Demande générale', 'Support commande', 'Problème technique', 'Partenariat commercial']
    : ['General Inquiry', 'Order Support', 'Technical Issue', 'Business Partnership'];

  // The message is handed to WhatsApp, the shop's support channel — the same
  // route the cart uses. Nothing is stored: there is no inbox behind this form.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = form.subject || subjects[0];
    const body = fr
      ? `Bonjour G&C Tech,

*${subject}*

${form.message}

—
${form.name}
${form.email}`
      : `Hello G&C Tech,

*${subject}*

${form.message}

—
${form.name}
${form.email}`;
    const url = buildWhatsappUrl(body);
    setSentUrl(url);
    // Synchronous: still inside the submit gesture, so pop-up blockers allow it.
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Seo title={t('support.contact.title')} description={t('support.contact.subtitle')} />

      <main className="py-12 md:py-20">
        <div className="px-4 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="px-4 py-2 bg-blue-50 text-[#007bff] text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block">
                {fr ? 'Contactez-nous' : 'Get in touch'}
              </span>
              <h1 className="text-3xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                {t('support.contact.title')}
              </h1>
              <p className="text-gray-500 text-lg mb-12 leading-relaxed">
                {t('support.contact.subtitle')}
              </p>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#007bff] flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{fr ? 'Écrivez-nous' : 'Email us'}</h4>
                    <a href={`mailto:${COMPANY.email}`} className="text-gray-500 hover:text-[#007bff] break-all">
                      {COMPANY.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#007bff] flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{fr ? 'Appelez-nous' : 'Call us'}</h4>
                    {COMPANY.phones.map((p) => (
                      <a key={p.tel} href={`tel:${p.tel}`} className="block text-gray-500 hover:text-[#007bff]">
                        {p.display}
                      </a>
                    ))}
                    <p className="text-gray-400 text-sm mt-1">{COMPANY.hoursShort[language]}</p>
                  </div>
                </div>

              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 p-6 md:p-12 rounded-[32px] md:rounded-[48px] border border-gray-100 shadow-2xl relative"
            >
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {fr ? 'WhatsApp est ouvert' : 'WhatsApp is open'}
                  </h2>
                  <p className="text-gray-500 mb-6">
                    {fr
                      ? "Votre message vous attend dans WhatsApp, prêt à partir : il ne nous parviendra qu'une fois que vous l'aurez envoyé depuis la conversation."
                      : "Your message is waiting in WhatsApp, ready to go: it only reaches us once you send it from the conversation."}
                  </p>

                  {sentUrl && (
                    <a
                      href={sentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 mb-8 bg-[#25D366] text-white rounded-xl font-bold hover:bg-green-600 transition-all text-sm"
                    >
                      {fr ? "WhatsApp ne s'est pas ouvert ?" : "WhatsApp didn't open?"}
                    </a>
                  )}

                  <div />
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[#007bff] font-bold underline"
                  >
                    {fr ? 'Envoyer un autre message' : 'Send another message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900">{fr ? 'Votre nom' : 'Your Name'}</label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={set('name')}
                        className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900">{fr ? 'Adresse e-mail' : 'Email Address'}</label>
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={set('email')}
                        className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">{fr ? 'Sujet' : 'Subject'}</label>
                    <select
                      value={form.subject}
                      onChange={set('subject')}
                      className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all appearance-none cursor-pointer"
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Message</label>
                    <textarea
                      required
                      placeholder={fr ? 'Comment pouvons-nous vous aider ?' : 'How can we help you?'}
                      rows={5}
                      value={form.message}
                      onChange={set('message')}
                      className="w-full p-6 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-16 bg-[#007bff] hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Send size={20} />
                    {fr ? 'Envoyer via WhatsApp' : 'Send via WhatsApp'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>

    </div>
  );
}
