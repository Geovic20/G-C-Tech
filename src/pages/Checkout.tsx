import React, { useState } from 'react';
import { ChevronLeft, CreditCard, CheckCircle2, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import { PRODUCTS } from '@/src/constants';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '@/src/contexts/LanguageContext';

export default function Checkout() {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [showSuccess, setShowSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    email: ''
  });
  const navigate = useNavigate();

  const product = PRODUCTS[0]; // Assume checkout for the first product

  const getWhatsappUrl = () => {
    const defaultPhone = '+22960000000';
    const metaEnv = (import.meta as any).env || {};
    const targetPhone = (metaEnv.VITE_WHATSAPP_NUMBER || defaultPhone).replace(/\s+/g, '').replace('+', '');
    
    const textFr = `Bonjour Shopcart ! Je souhaite acheter cet article :

📝 *PRODUIT*
---------------------------------------
• ${product.name} - ${product.price}.00 USD

📍 *COORDONNÉES DE LIVRAISON*
- *Client* : ${shippingData.firstName} ${shippingData.lastName}
- *Téléphone* : ${shippingData.phone}
- *Adresse* : ${shippingData.address}, ${shippingData.city}
- *Code Postal* : ${shippingData.zip}
- *Email* : ${shippingData.email}

Merci de m'indiquer la procédure pour le règlement !`;

    const textEn = `Hello Shopcart! I would like to purchase this item:

📝 *PRODUCT*
---------------------------------------
• ${product.name} - $${product.price}.00 USD

📍 *SHIPPING DETAILS*
- *Customer* : ${shippingData.firstName} ${shippingData.lastName}
- *Phone* : ${shippingData.phone}
- *Address* : ${shippingData.address}, ${shippingData.city}
- *Zip Code* : ${shippingData.zip}
- *Email* : ${shippingData.email}

Please let know how I can settle the payment!`;

    const selectedMessage = (t('cart.title').toLowerCase().includes('panier')) ? textFr : textEn;
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(selectedMessage)}`;
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'whatsapp') {
      const url = getWhatsappUrl();
      setWhatsappUrl(url);
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (err) {
        console.error('Popup blocked', err);
      }
    }
    
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-4 md:px-12 py-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-gray-900 font-medium">{t('checkout.title')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-8">{t('checkout.review')}</h2>
              <div className="flex gap-6 p-6 rounded-3xl border border-gray-100 items-center">
                <div className="w-24 h-24 bg-[#f5f6f6] rounded-2xl p-4 flex items-center justify-center">
                  <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{product.name.split(',')[0]}</h3>
                  <p className="text-sm text-gray-500">Color: Pink</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">${product.price}.00</p>
                  <p className="text-sm text-gray-500">Quantity: 01</p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{t('checkout.delivery')}</h2>
                <button className="px-6 py-2 bg-gray-100 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">{t('checkout.edit')}</button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">First Name*</label>
                  <input required type="text" placeholder="Type here..." value={shippingData.firstName} onChange={(e) => setShippingData({...shippingData, firstName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Last Name*</label>
                  <input required type="text" placeholder="Type here..." value={shippingData.lastName} onChange={(e) => setShippingData({...shippingData, lastName: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-900">Address*</label>
                  <input required type="text" placeholder="Type here..." value={shippingData.address} onChange={(e) => setShippingData({...shippingData, address: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">City/ Town*</label>
                  <input required type="text" placeholder="Type here..." value={shippingData.city} onChange={(e) => setShippingData({...shippingData, city: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Zip Code*</label>
                  <input required type="text" placeholder="Type here..." value={shippingData.zip} onChange={(e) => setShippingData({...shippingData, zip: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Mobile*</label>
                  <input required type="text" placeholder="Type here..." value={shippingData.phone} onChange={(e) => setShippingData({...shippingData, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">Email*</label>
                  <input required type="email" placeholder="Type here..." value={shippingData.email} onChange={(e) => setShippingData({...shippingData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#244b36] outline-none transition-all" />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 bg-white border border-gray-100 rounded-[40px] p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-8">{t('checkout.summary')}</h2>
              
              <div className="flex gap-4 mb-8">
                <input type="text" placeholder={t('checkout.coupon')} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 outline-none" />
                <button className="px-6 py-3 bg-[#007bff] text-white rounded-xl font-bold text-sm">{t('checkout.apply')}</button>
              </div>

              <div className="space-y-6 mb-8">
                <h3 className="font-bold text-lg">{t('checkout.payment')}</h3>
                <div className="space-y-4">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', icon: null },
                    { id: 'card', label: 'Shopcart Card', icon: null },
                    { id: 'paypal', label: 'Paypal', icon: null },
                    { id: 'whatsapp', label: t('delivery.payment.whatsapp') || 'Order via WhatsApp', icon: <div className="p-1 px-3 bg-green-50 text-green-600 rounded-full font-bold text-xs flex items-center gap-1"><MessageCircle size={12} /> WhatsApp</div> },
                    { id: 'credit', label: 'Credit or Debit Card', icon: <div className="flex gap-2"><img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" /><img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" /></div> }
                  ].map((method) => (
                    <label key={method.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method.id}
                          onChange={() => setPaymentMethod(method.id)}
                          className="w-4 h-4 accent-[#007bff]"
                        />
                        <span className="font-medium text-gray-900">{method.label}</span>
                      </div>
                      {method.icon}
                    </label>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePay} className="space-y-4 mb-8 border-t border-gray-100 pt-8 animate-in fade-in slide-in-from-top-4">
                {paymentMethod === 'credit' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase">Email*</label>
                      <input required type="email" placeholder="Type here..." className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#007bff]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-900 uppercase">Card Holder Name*</label>
                      <input required type="text" placeholder="Type here..." className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#007bff]" />
                    </div>
                    <div className="space-y-2 relative">
                      <label className="text-xs font-bold text-gray-900 uppercase">Card Number*</label>
                      <div className="relative">
                        <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none pr-10 focus:ring-2 focus:ring-[#007bff]" />
                        <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-900 uppercase">Expiry*</label>
                        <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#007bff]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-900 uppercase">CVC*</label>
                        <input required type="text" placeholder="000" className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#007bff]" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'whatsapp' && (
                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-start gap-3 mb-4">
                    <MessageCircle className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                    <div>
                      <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">WhatsApp Redirect</p>
                      <p className="text-xs text-green-700 leading-relaxed">
                        We will formulate a pre-filled transaction message and prompt you to submit this order directly to our sales agent on WhatsApp.
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-8 space-y-4">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Sub Total</span>
                    <span className="font-bold text-gray-900">${product.price}.00</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Tax(10%)</span>
                    <span className="font-bold text-gray-900">${(product.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Coupon Discount</span>
                    <span className="font-bold text-gray-900">-${(product.price * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Shipping Cost</span>
                    <span className="font-bold text-gray-900">-$0.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${product.price}.00</span>
                  </div>

                  {paymentMethod === 'whatsapp' ? (
                    <button type="submit" className="w-full py-5 bg-[#25D366] text-white rounded-full font-bold text-lg hover:bg-green-600 transition-all mt-4 flex items-center justify-center gap-2 shadow-lg shadow-green-500/10 hover:translate-y-[-2px]">
                      <MessageCircle size={20} />
                      Order on WhatsApp (${product.price}.00)
                    </button>
                  ) : (
                    <button type="submit" className="w-full py-5 bg-[#007bff] text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all mt-4">
                      {paymentMethod === 'cod' ? 'Confirm Delivery Order' : `${t('checkout.pay')} $${product.price}.00`}
                    </button>
                  )}

                  <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-4 py-3 rounded-2xl w-full">
                      <CheckCircle2 size={16} />
                      <div>
                        Earn 5% cash back on Shopcart
                        <button type="button" className="underline block mt-1">Learn More</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSuccess(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-12 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('checkout.success')}</h2>
              {paymentMethod === 'whatsapp' ? (
                <div className="space-y-4 mb-8 text-center bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You can finalize your order on WhatsApp. If WhatsApp didn't open automatically, use the button below to start:
                  </p>
                  {whatsappUrl && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-md hover:bg-green-600 transition-all"
                    >
                      <MessageCircle size={14} />
                      Start WhatsApp Chat
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-8">Transaction ID: #8462494820</p>
              )}
              <button
                onClick={() => navigate('/')}
                className="w-full py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all"
              >
                {t('checkout.continue')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
