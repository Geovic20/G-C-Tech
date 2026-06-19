import React, { useState } from 'react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react';

export default function ContactUs() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="py-12 md:py-20">
        <div className="px-4 md:px-12 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="px-4 py-2 bg-blue-50 text-[#007bff] text-xs font-bold rounded-full uppercase tracking-widest mb-6 inline-block">
                Get in touch
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
                    <h4 className="font-bold text-gray-900 mb-1">Email us</h4>
                    <p className="text-gray-500">support@shopcart.com</p>
                    <p className="text-gray-500">sales@shopcart.com</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#007bff] flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Call us</h4>
                    <p className="text-gray-500">+221 33 000 00 00</p>
                    <p className="text-gray-500">Mon-Fri (8am - 8pm)</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#007bff] flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Visit us</h4>
                    <p className="text-gray-500">Electronic Business Center</p>
                    <p className="text-gray-500">Dakar, Senegal</p>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                  <p className="text-gray-500 mb-8">
                    Thank you for reaching out. We've received your message and will get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-[#007bff] font-bold underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900">Your Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John Doe"
                        className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-900">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="john@example.com"
                        className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Subject</label>
                    <select className="w-full h-14 px-6 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all appearance-none cursor-pointer">
                      <option>General Inquiry</option>
                      <option>Order Support</option>
                      <option>Technical Issue</option>
                      <option>Business Partnership</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-900">Message</label>
                    <textarea 
                      required
                      placeholder="How can we help you?"
                      rows={5}
                      className="w-full p-6 bg-white border border-gray-200 rounded-3xl focus:outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full h-16 bg-[#007bff] hover:bg-blue-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Send size={20} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
