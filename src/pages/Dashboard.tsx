import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import {
  User,
  ShoppingBag,
  MapPin,
  Settings,
  LogOut,
  Calendar,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Package,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'pending' | 'shipped';
  items: OrderItem[];
  trackingNumber: string;
  total: number;
}

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { currency, formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'settings'>('overview');
  const [user, setUser] = useState<{
    fullname: string;
    email: string;
    joinDate: string;
    phone: string;
    address: string;
  } | null>(null);

  // States for Address Editing
  const [shippingAddress, setShippingAddress] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [showAddressSuccess, setShowAddressSuccess] = useState(false);

  // States for Profile updating
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setShippingAddress(parsed.address || '');
        setUserPhone(parsed.phone || '');
        setFullname(parsed.fullname || '');
        setEmail(parsed.email || '');
      } catch (e) {
        console.error('Error parsing user', e);
      }
    } else {
      // Redirect to login if user is not present
      navigate('/login');
    }
  }, [navigate]);

  // Handle address update
  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = { ...user, address: shippingAddress, phone: userPhone };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    window.dispatchEvent(new Event('storage'));
    setShowAddressSuccess(true);
    setTimeout(() => setShowAddressSuccess(false), 3000);
  };

  // Handle profile update
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = { ...user, fullname, email };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    window.dispatchEvent(new Event('storage'));
    setShowProfileSuccess(true);
    setTimeout(() => setShowProfileSuccess(false), 3000);
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Accès restreint</h2>
          <p className="text-gray-500 mb-6">Veuillez vous connecter pour accéder à votre espace personnel.</p>
          <Link to="/login" className="inline-flex items-center justify-center px-6 py-3 bg-[#007bff] text-white rounded-full font-black text-sm uppercase tracking-wide shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
            Se connecter <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // Bilingual dashboard translation dictionary
  const dbTexts = {
    fr: {
      welcome: 'Bonjour,',
      since: 'Membre depuis',
      tabs: {
        overview: 'Aperçu',
        orders: 'Mes Commandes',
        addresses: 'Mes Adresses',
        settings: 'Paramètres'
      },
      stats: {
        totalSpent: 'Total Dépensé',
        totalOrders: 'Commandes Totales',
        cartEstimate: 'Fidélité',
        addressesCount: 'Adresses'
      },
      orders: {
        title: 'Historique des Commandes',
        desc: 'Suivez la livraison de vos articles technologiques.',
        orderNo: 'Commande n°',
        tracking: 'N° de suivi',
        delivered: 'Livré',
        shipped: 'Expédié',
        pending: 'En attente',
        empty: 'Aucune commande pour le moment.',
        seeProduct: 'Voir le produit'
      },
      addresses: {
        title: 'Carnet d\'adresses',
        desc: 'Gérez vos coordonnées de livraison rapide.',
        shipping: 'Adresse principale de livraison',
        phone: 'Numéro de téléphone',
        placeholder: 'Saisissez votre adresse...',
        save: 'Enregistrer l\'adresse',
        success: 'Coordonnées de livraison mises à jour avec succès !'
      },
      settings: {
        title: 'Paramètres du compte',
        desc: 'Gérez les détails de votre identité.',
        fullname: 'Nom complet',
        email: 'Adresse e-mail',
        password: 'Nouveau mot de passe',
        save: 'Enregistrer les modifications',
        success: 'Profil mis à jour !',
        logout: 'Se déconnecter'
      }
    },
    en: {
      welcome: 'Hello,',
      since: 'Member since',
      tabs: {
        overview: 'Overview',
        orders: 'My Orders',
        addresses: 'My Addresses',
        settings: 'Settings'
      },
      stats: {
        totalSpent: 'Total Spent',
        totalOrders: 'Total Orders',
        cartEstimate: 'Loyalty Points',
        addressesCount: 'Addresses'
      },
      orders: {
        title: 'Order History',
        desc: 'Track the delivery of your tech items.',
        orderNo: 'Order No',
        tracking: 'Tracking',
        delivered: 'Delivered',
        shipped: 'Shipped',
        pending: 'Pending',
        empty: 'No orders yet.',
        seeProduct: 'View product'
      },
      addresses: {
        title: 'Address Book',
        desc: 'Manage your quick shipping addresses.',
        shipping: 'Primary Shipping Address',
        phone: 'Phone Number',
        placeholder: 'Enter your address...',
        save: 'Save Address',
        success: 'Shipping details updated successfully!'
      },
      settings: {
        title: 'Account Settings',
        desc: 'Manage your personal details.',
        fullname: 'Full Name',
        email: 'Email address',
        password: 'New password',
        save: 'Save Changes',
        success: 'Profile updated!',
        logout: 'Log Out'
      }
    }
  };

  const texts = language === 'fr' ? dbTexts.fr : dbTexts.en;

  // Mock Orders Data
  const mockOrders: Order[] = [
    {
      id: 'SC-9824',
      date: language === 'fr' ? '12 Mai 2026' : 'May 12, 2026',
      status: 'delivered',
      total: 1290,
      trackingNumber: 'TRK-SHOP4928091',
      items: [
        {
          id: '1',
          name: language === 'fr' ? 'iPhone 15 Pro Max' : 'iPhone 15 Pro Max',
          image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=300&auto=format&fit=crop',
          price: 1290
        }
      ]
    },
    {
      id: 'SC-8561',
      date: language === 'fr' ? '28 Avril 2026' : 'April 28, 2026',
      status: 'shipped',
      total: 249,
      trackingNumber: 'TRK-SHOP3810294',
      items: [
        {
          id: '15',
          name: language === 'fr' ? 'Bose Noise Cancelling 700' : 'Bose Noise Cancelling Headphones 700',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop',
          price: 249
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-4 pb-24">
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#007bff]/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 z-10 text-center sm:text-left">
            <div className="w-20 h-20 bg-gradient-to-tr from-[#007bff] to-blue-400 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/15">
              {user.fullname.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-none">
                  {texts.welcome} {user.fullname}
                </h1>
                <span className="inline-flex self-center px-3 py-1 bg-blue-50 text-[#007bff] font-bold text-xs rounded-full uppercase tracking-wider">
                  Premium
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-500 mt-2">
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Mail size={14} className="text-gray-400" /> {user.email}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Calendar size={14} className="text-gray-400" /> {texts.since} {user.joinDate}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 border border-red-100 bg-red-50/30 text-red-600 hover:bg-red-50 rounded-2xl text-sm font-black transition-all z-10 self-stretch md:self-auto justify-center"
          >
            <LogOut size={16} />
            {texts.settings.logout}
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/10'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
              }`}
            >
              <span className="flex items-center gap-3">
                <User size={18} /> {texts.tabs.overview}
              </span>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/10'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={18} /> {texts.tabs.orders}
              </span>
              <span className="bg-blue-500/20 px-2 py-0.5 rounded-full text-xs font-bold text-white min-w-[20px] text-center">
                {mockOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'addresses'
                  ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/10'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
              }`}
            >
              <span className="flex items-center gap-3">
                <MapPin size={18} /> {texts.tabs.addresses}
              </span>
              <ChevronRight size={16} />
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#007bff] text-white shadow-lg shadow-blue-500/10'
                  : 'bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.98]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Settings size={18} /> {texts.tabs.settings}
              </span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                          {texts.stats.totalSpent}
                        </p>
                        <p className="text-xl font-black text-gray-900 leading-none mt-1">
                          {formatPrice(1539)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                      <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                        <ShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                          {texts.stats.totalOrders}
                        </p>
                        <p className="text-xl font-black text-gray-900 leading-none mt-1">
                          {mockOrders.length}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                      <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                          {texts.stats.cartEstimate}
                        </p>
                        <p className="text-xl font-black text-gray-900 leading-none mt-1">
                          +150 XP
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick summary and latest activity */}
                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight mb-4">
                      {language === 'fr' ? 'Coordonnées par défaut' : 'Default Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{texts.settings.fullname}</p>
                            <p className="text-sm font-bold text-gray-800">{user.fullname}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Mail size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{texts.settings.email}</p>
                            <p className="text-sm font-bold text-gray-800">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Phone size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{texts.addresses.phone}</p>
                            <p className="text-sm font-bold text-gray-800">{user.phone || '—'}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{texts.addresses.shipping}</p>
                            <p className="text-sm font-bold text-gray-800">{user.address || '—'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {texts.orders.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{texts.orders.desc}</p>
                  </div>

                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:border-blue-100 transition-all">
                        {/* Order Header */}
                        <div className="bg-gray-50/70 px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                {texts.orders.orderNo}
                              </p>
                              <p className="text-sm font-black text-gray-900">{order.id}</p>
                            </div>
                            <span className="hidden sm:inline text-gray-200">|</span>
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Date</p>
                              <p className="text-sm font-bold text-gray-700">{order.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-gray-950">{formatPrice(order.total)}</span>
                            {order.status === 'delivered' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                <CheckCircle size={12} /> {texts.orders.delivered}
                              </span>
                            ) : order.status === 'shipped' ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                                <Truck size={12} /> {texts.orders.shipped}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                <Clock size={12} /> {texts.orders.pending}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Order Content */}
                        <div className="p-6">
                          <div className="space-y-4">
                            {order.items.map((item) => (
                              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-2xl border border-gray-100" />
                                  <div>
                                    <p className="font-bold text-gray-900 leading-snug">{item.name}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">{formatPrice(item.price)}</p>
                                  </div>
                                </div>
                                <Link
                                  to={`/product/${item.id}`}
                                  className="text-xs font-bold text-[#007bff] hover:text-blue-700 hover:underline flex items-center gap-1"
                                >
                                  {texts.orders.seeProduct} <ChevronRight size={14} />
                                </Link>
                              </div>
                            ))}
                          </div>

                          {/* Tracking Number */}
                          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs">
                            <span className="text-gray-500">
                              {texts.orders.tracking}: <strong className="text-gray-800 font-bold">{order.trackingNumber}</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {texts.addresses.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{texts.addresses.desc}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    {showAddressSuccess && (
                      <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold flex items-center gap-2">
                        <CheckCircle size={18} /> {texts.addresses.success}
                      </div>
                    )}

                    <form onSubmit={handleAddressUpdate} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {texts.addresses.shipping}
                        </label>
                        <textarea
                          rows={3}
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder={texts.addresses.placeholder}
                          className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {texts.addresses.phone}
                        </label>
                        <input
                          type="tel"
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                          className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-lg shadow-blue-500/15 text-sm font-black text-white bg-[#007bff] hover:bg-blue-700 transition-all uppercase tracking-widest"
                      >
                        {texts.addresses.save}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {texts.settings.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{texts.settings.desc}</p>
                  </div>

                  <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                    {showProfileSuccess && (
                      <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-2xl text-sm font-bold flex items-center gap-2">
                        <CheckCircle size={18} /> {texts.settings.success}
                      </div>
                    )}

                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {texts.settings.fullname}
                        </label>
                        <input
                          type="text"
                          required
                          value={fullname}
                          onChange={(e) => setFullname(e.target.value)}
                          className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {texts.settings.email}
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium animate-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          {texts.settings.password}
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          className="appearance-none block w-full px-5 py-4 border border-gray-200 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#007bff] focus:border-[#007bff] transition-all text-sm font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full sm:w-auto flex justify-center py-4 px-8 border border-transparent rounded-2xl shadow-lg shadow-blue-500/15 text-sm font-black text-white bg-[#007bff] hover:bg-blue-700 transition-all uppercase tracking-widest"
                      >
                        {texts.settings.save}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
