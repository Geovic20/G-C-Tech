import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency } from '@/src/contexts/CurrencyContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, MapPin, Phone, Calendar, Clock, CreditCard, Wallet, CheckCircle2, ChevronLeft, MessageCircle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

const MOCK_CART: CartItem[] = [
  {
    id: 1,
    name: 'MacBook Pro M3 Pro',
    price: 1999000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1517336712468-077648f3efbc?w=200&h=200&fit=crop',
    category: 'Laptops'
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    price: 999000,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200&h=200&fit=crop',
    category: 'Phones'
  }
];

const DELIVERY_ZONES = [
  { id: 'cotonou', name: 'Cotonou', cost: 1000 },
  { id: 'porto-novo', name: 'Porto-Novo', cost: 1500 },
  { id: 'calavi', name: 'Abomey-Calavi', cost: 1200 },
  { id: 'ouidah', name: 'Ouidah', cost: 2500 },
  { id: 'parakou', name: 'Parakou', cost: 5000 },
];

const TIME_SLOTS = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '12:00 - 14:00',
  '14:00 - 16:00',
  '16:00 - 18:00',
  '18:00 - 20:00',
];

export default function Cart() {
  const { t, language } = useLanguage();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [items, setItems] = useState<CartItem[]>(MOCK_CART);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  
  // Delivery form state
  const [deliveryData, setDeliveryData] = useState({
    zoneId: '',
    details: '',
    phone: '',
    date: '',
    timeSlot: '',
    paymentMethod: 'momo' as 'momo' | 'cash' | 'whatsapp'
  });

  const updateQuantity = (id: number, delta: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const selectedZone = DELIVERY_ZONES.find(z => z.id === deliveryData.zoneId);
  const shipping = selectedZone ? selectedZone.cost : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const getWhatsappUrl = () => {
    const defaultPhone = '+22960000000';
    const metaEnv = (import.meta as any).env || {};
    const targetPhone = (metaEnv.VITE_WHATSAPP_NUMBER || defaultPhone).replace(/\s+/g, '').replace('+', '');
    const zoneName = selectedZone ? selectedZone.name : 'Non spécifiée';
    
    const productsText = items.map(p => `• ${p.name} (x${p.quantity}) - ${formatPrice(p.price * p.quantity)}`).join('\n');
    
    const textFr = `Bonjour G&C Tech ! Je souhaite commander et finaliser mon paiement :

📝 *RÉCAPITULATIF DE LA COMMANDE*
---------------------------------------
${productsText}

💵 *Détails Financiers* :
- Sous-total : ${formatPrice(subtotal)}
- Livraison (${zoneName}) : +${formatPrice(shipping)}
- Taxes (10%) : ${formatPrice(tax)}
*TOTAL : ${formatPrice(total)}*
---------------------------------------

📍 *COORDONNÉES DE LIVRAISON*
- *Téléphone* : ${deliveryData.phone}
- *Quartier/Adresse* : ${deliveryData.details || 'Non spécifié'}
- *Date* : ${deliveryData.date ? new Date(deliveryData.date).toLocaleDateString('fr-FR') : 'Non spécifiée'}
- *Plage horaire* : ${deliveryData.timeSlot}

Merci de m'indiquer la procédure pour le règlement !`;

    const textEn = `Hello G&C Tech! I would like to place an order and pay on WhatsApp:

📝 *ORDER SUMMARY*
---------------------------------------
${productsText}

💵 *Financial Summary* :
- Subtotal : ${formatPrice(subtotal)}
- Shipping (${zoneName}) : +${formatPrice(shipping)}
- Taxes (10%) : ${formatPrice(tax)}
*TOTAL : ${formatPrice(total)}*
---------------------------------------

📍 *SHIPPING DETAILS*
- *Phone* : ${deliveryData.phone}
- *Address details* : ${deliveryData.details || 'Not specified'}
- *Delivery date* : ${deliveryData.date ? new Date(deliveryData.date).toLocaleDateString('en-US') : 'Not specified'}
- *Time slot* : ${deliveryData.timeSlot}

Please let me know how I can settle the payment!`;

    const selectedMessage = language === 'fr' ? textFr : textEn;
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(selectedMessage)}`;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      // Final confirmation logic here
      console.log('Order Placed:', { items, deliveryData, total });
      
      if (deliveryData.paymentMethod === 'whatsapp') {
        const url = getWhatsappUrl();
        setWhatsappUrl(url);
        try {
          window.open(url, '_blank', 'noopener,noreferrer');
        } catch (e) {
          console.error('Popup blocked', e);
        }
      }
      
      // Redirect to some success page or show success message
      setStep(4); // Bonus success step
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStep2Valid = deliveryData.zoneId && deliveryData.phone && deliveryData.date && deliveryData.timeSlot;

  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] p-12 shadow-xl shadow-blue-500/5 border border-blue-50"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="text-green-500" size={48} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">{t('checkout.success')}</h1>
            {deliveryData.paymentMethod === 'whatsapp' ? (
              <div className="space-y-6 mb-10">
                <p className="text-gray-600 leading-relaxed text-sm">
                  {language === 'fr' 
                    ? 'Votre commande a été préparée avec succès ! Vous allez être redirigé vers WhatsApp pour finaliser le paiement.'
                    : 'Your order has been prepared successfully! You are being redirected to WhatsApp to complete your payment.'}
                </p>
                
                {whatsappUrl && (
                  <div className="bg-green-50 rounded-[24px] p-6 border border-green-100 flex flex-col items-center gap-4 my-6">
                    <span className="text-xs font-bold text-green-700 uppercase tracking-widest leading-none">
                      {language === 'fr' ? 'Lancer WhatsApp manuellement' : 'Open WhatsApp manually'}
                    </span>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] text-white rounded-xl font-bold hover:bg-green-600 shadow-lg shadow-green-500/10 transition-all text-xs"
                    >
                      <MessageCircle size={16} />
                      {t('delivery.whatsapp.not-opened')}
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 mb-10 leading-relaxed text-sm">
                Your order has been placed successfully. We'll contact you at <strong>{deliveryData.phone}</strong> for delivery in <strong>{selectedZone?.name}</strong>.
              </p>
            )}
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-10 py-5 bg-[#007bff] text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              <ArrowRight size={20} className="order-last" />
              {t('checkout.continue')}
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 py-16">
        {/* Steps Progress */}
        <div className="flex items-center justify-center gap-4 mb-16">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={cn(
                "flex items-center gap-3 transition-all duration-300",
                step >= s ? "scale-105" : "opacity-40"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm",
                  step >= s ? "bg-[#007bff] text-white shadow-lg shadow-blue-500/20" : "bg-gray-200 text-gray-500"
                )}>
                  {s}
                </div>
                <span className={cn(
                  "font-bold hidden sm:inline",
                  step >= s ? "text-gray-900" : "text-gray-400"
                )}>
                  {s === 1 ? t('cart.step1') : s === 2 ? t('cart.step2') : t('cart.step3')}
                </span>
              </div>
              {s < 3 && <div className={cn("w-12 h-0.5 rounded-full transition-all duration-500", step > s ? "bg-[#007bff]" : "bg-gray-200")} />}
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {items.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-16 text-center shadow-sm border border-gray-100">
                      <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag className="text-gray-300" size={40} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cart.empty')}</h2>
                      <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 bg-[#007bff] text-white rounded-full font-bold hover:bg-blue-700 transition-all">{t('cart.continue')}</Link>
                    </div>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="bg-white rounded-[32px] p-6 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-gray-100 group">
                        <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 p-4">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <span className="text-xs font-bold text-[#007bff] uppercase tracking-widest mb-1 block">{item.category}</span>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-lg font-black text-gray-900">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center bg-gray-50 rounded-2xl p-1 border border-gray-100">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-gray-500"><Minus size={18} /></button>
                            <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-xl transition-colors text-gray-500"><Plus size={18} /></button>
                          </div>
                          <button onClick={() => removeItem(item.id)} className="w-12 h-12 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={22} /></button>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                    <MapPin className="text-[#007bff]" />
                    {t('delivery.zone')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Zone Select */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('delivery.zone')}</label>
                      <select 
                        value={deliveryData.zoneId}
                        onChange={(e) => setDeliveryData({...deliveryData, zoneId: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      >
                        <option value="">{t('delivery.zone.placeholder')}</option>
                        {DELIVERY_ZONES.map(zone => (
                          <option key={zone.id} value={zone.id}>{zone.name} (+{formatPrice(zone.cost)})</option>
                        ))}
                      </select>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('delivery.phone')}</label>
                      <div className="relative">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="tel"
                          placeholder="+229 ..."
                          value={deliveryData.phone}
                          onChange={(e) => setDeliveryData({...deliveryData, phone: e.target.value})}
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('delivery.details')}</label>
                      <textarea 
                        rows={3}
                        placeholder={t('delivery.details.placeholder')}
                        value={deliveryData.details}
                        onChange={(e) => setDeliveryData({...deliveryData, details: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('delivery.date')}</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          type="date"
                          value={deliveryData.date}
                          onChange={(e) => setDeliveryData({...deliveryData, date: e.target.value})}
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('delivery.time')}</label>
                      <div className="relative">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select 
                          value={deliveryData.timeSlot}
                          onChange={(e) => setDeliveryData({...deliveryData, timeSlot: e.target.value})}
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        >
                          <option value="">{t('delivery.time')}</option>
                          {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="md:col-span-2 space-y-4 pt-4">
                      <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('delivery.payment')}</label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                          onClick={() => setDeliveryData({...deliveryData, paymentMethod: 'momo'})}
                          className={cn(
                            "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left",
                            deliveryData.paymentMethod === 'momo' ? "border-[#007bff] bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", deliveryData.paymentMethod === 'momo' ? "bg-[#007bff] text-white" : "bg-gray-100 text-gray-400")}>
                            <CreditCard size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-snug">{t('delivery.payment.momo')}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Pay via Mobile Money</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => setDeliveryData({...deliveryData, paymentMethod: 'cash'})}
                          className={cn(
                            "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left",
                            deliveryData.paymentMethod === 'cash' ? "border-[#007bff] bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", deliveryData.paymentMethod === 'cash' ? "bg-[#007bff] text-white" : "bg-gray-100 text-gray-400")}>
                            <Wallet size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 leading-snug">{t('delivery.payment.cash')}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Pay when receiving items</p>
                          </div>
                        </button>
                        <button 
                          onClick={() => setDeliveryData({...deliveryData, paymentMethod: 'whatsapp'})}
                          className={cn(
                            "flex items-center gap-4 p-6 rounded-3xl border-2 transition-all text-left",
                            deliveryData.paymentMethod === 'whatsapp' ? "border-[#25D366] bg-green-50/50 animate-pulse" : "border-gray-100 hover:border-gray-200"
                          )}
                        >
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", deliveryData.paymentMethod === 'whatsapp' ? "bg-[#25D366] text-white" : "bg-gray-100 text-gray-400")}>
                            <MessageCircle size={24} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-950 leading-snug">{t('delivery.payment.whatsapp')}</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Agree & pay on WhatsApp</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('checkout.review')}</h2>
                    
                    <div className="space-y-8">
                       <div className="flex gap-6 pb-6 border-b border-gray-100">
                         <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[#007bff] flex-shrink-0">
                           <MapPin size={24} />
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900">{selectedZone?.name}</h4>
                           <p className="text-gray-500 text-sm">{deliveryData.details || 'No extra details'}</p>
                         </div>
                       </div>
                       
                       <div className="flex gap-6 pb-6 border-b border-gray-100">
                         <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 flex-shrink-0">
                           <Phone size={24} />
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900">{deliveryData.phone}</h4>
                           <p className="text-gray-500 text-sm">Contact Number</p>
                         </div>
                       </div>

                       <div className="flex gap-6 pb-6 border-b border-gray-100">
                         <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                           <Calendar size={24} />
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900">{new Date(deliveryData.date).toLocaleDateString()}</h4>
                           <p className="text-gray-500 text-sm">{deliveryData.timeSlot}</p>
                         </div>
                       </div>

                       <div className="flex gap-6">
                         <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-white",
                            deliveryData.paymentMethod === 'whatsapp' ? "bg-[#25D366]" :
                            deliveryData.paymentMethod === 'momo' ? "bg-[#007bff]" : "bg-purple-600"
                          )}>
                           {deliveryData.paymentMethod === 'whatsapp' ? <MessageCircle size={24} /> :
                             deliveryData.paymentMethod === 'momo' ? <CreditCard size={24} /> : <Wallet size={24} />}
                         </div>
                         <div>
                           <h4 className="font-bold text-gray-900">{deliveryData.paymentMethod === 'whatsapp' ? t('delivery.payment.whatsapp') :
                               deliveryData.paymentMethod === 'momo' ? t('delivery.payment.momo') : t('delivery.payment.cash')}</h4>
                           <p className="text-gray-500 text-sm">
                              {deliveryData.paymentMethod === 'whatsapp' ? t('delivery.payment.whatsapp.desc') : 'Payment Method'}
                            </p>
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar: Totals & Button */}
          {items.length > 0 && (
            <div className="w-full lg:w-[400px]">
              <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-blue-900/5 border border-blue-50 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('cart.summary')}</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>{t('cart.subtotal')}</span>
                    <span className="text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>{t('cart.shipping')}</span>
                    <span className={cn("font-bold", shipping > 0 ? "text-green-500" : "text-gray-400")}>
                      {shipping > 0 ? `+${formatPrice(shipping)}` : '---'}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-medium">
                    <span>{t('cart.tax')}</span>
                    <span className="text-gray-900">{formatPrice(tax)}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gray-900">{t('cart.total')}</span>
                    <span className="text-3xl font-black text-[#007bff]">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleNext}
                    disabled={step === 2 && !isStep2Valid}
                    className="w-full flex items-center justify-center gap-3 py-5 bg-[#007bff] text-white rounded-full font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:translate-y-[-2px] transition-all disabled:opacity-50 disabled:translate-y-0"
                  >
                    {step === 1 ? t('cart.validate') : step === 3 ? t('delivery.confirm') : t('cart.next')}
                    <ArrowRight size={20} />
                  </button>
                  
                  {step > 1 && (
                    <button 
                      onClick={handlePrev}
                      className="w-full flex items-center justify-center gap-2 py-4 text-gray-400 font-bold hover:text-gray-600 transition-all"
                    >
                      <ChevronLeft size={20} />
                      {t('cart.prev')}
                    </button>
                  )}
                </div>

                <p className="text-center text-[10px] text-gray-400 mt-6 font-medium uppercase tracking-widest">
                  Secure transaction protected
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
