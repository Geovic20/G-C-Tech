import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { useCurrency, Currency } from '@/src/contexts/CurrencyContext';
import { useCart } from '@/src/contexts/CartContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { useWishlist } from '@/src/contexts/WishlistContext';
import { CreditCard, Globe, Search, ShoppingCart, User, Phone, ChevronDown, MapPin, Menu, X, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useCatalog } from '@/src/contexts/CatalogContext';

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCategoriesMenu, setShowCategoriesMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const catRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { currency, setCurrency, formatPrice } = useCurrency();
  const { itemCount } = useCart();
  const { currentUser } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { products } = useCatalog();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const categories = [
    { name: t('cat.smartphones'), key: 'cat.smartphones', icon: '📱', to: '/smartphones' },
    { name: t('cat.computers'), key: 'cat.computers', icon: '💻', to: '/computers' },
    { name: t('cat.tablets'), key: 'cat.tablets', icon: '📟', to: '/tablets' },
    { name: t('cat.headphones'), key: 'cat.headphones', icon: '🎧', to: '/headphones' },
    { name: t('cat.earphones'), key: 'cat.earphones', icon: '👂', to: '/earphones' },
    { name: t('cat.smartwatches'), key: 'cat.smartwatches', icon: '⌚', to: '/smartwatches' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (showCurrencyMenu && !(event.target as Element).closest('.currency-menu')) {
        setShowCurrencyMenu(false);
      }
      if (catRef.current && !catRef.current.contains(event.target as Node)) {
        setShowCategoriesMenu(false);
      }
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currencies: { code: Currency; label: string; symbol: string }[] = [
    { code: 'CFA', label: 'CFA Franc', symbol: 'F' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
  ];

  return (
    <>
      <div className="h-[96px] md:h-[120px] lg:h-[132px]"></div>
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-white"
      )}>
        {/* Top Bar - Always fixed */}
        <div className="bg-[#007bff] text-white py-2 px-4 md:px-12 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span className="hidden sm:inline">+2290140543686</span>
            <span className="sm:hidden">{t('nav.call-us')}</span>
          </div>
          
          <div className="hidden xs:flex flex-1 justify-center text-[11px] font-bold uppercase tracking-widest opacity-80">
            {t('nav.free-delivery', { price: formatPrice(100000) })}
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            {/* Currency Selector */}
            <div className="relative currency-menu hidden xs:block">
              <button 
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {currencies.find(c => c.code === currency)?.code} <ChevronDown size={14} />
              </button>
              {showCurrencyMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white text-gray-900 rounded-lg shadow-xl py-2 z-[60] min-w-[140px] border border-gray-100 font-bold tracking-normal normal-case">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        setCurrency(curr.code);
                        setShowCurrencyMenu(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between gap-2",
                        currency === curr.code ? "text-[#007bff] bg-blue-50" : "text-gray-600"
                      )}
                    >
                      {curr.label}
                      <span className="text-xs opacity-50">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={langRef}>
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              >
                {language === 'en' ? 'Eng' : 'Fra'} <ChevronDown size={14} />
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white text-gray-900 rounded-lg shadow-xl py-2 z-[60] min-w-[100px] border border-gray-100 font-bold tracking-normal normal-case">
                  <button 
                    onClick={() => { setLanguage('en'); setShowLangMenu(false); }}
                    className={cn("w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2", language === 'en' && "font-bold text-[#007bff]")}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => { setLanguage('fr'); setShowLangMenu(false); }}
                    className={cn("w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2", language === 'fr' && "font-bold text-[#007bff]")}
                  >
                    Français
                  </button>
                </div>
              )}
            </div>
            <div className="hidden sm:flex items-center gap-1 cursor-pointer">
              <MapPin size={14} />
              <span className="hidden xs:inline">{t('nav.location')}</span> <ChevronDown size={14} />
            </div>
            <Link to="/help" className="hidden sm:flex items-center gap-1 hover:text-blue-100 transition-colors">
              <span className="hidden xs:inline">{t('nav.help')}</span>
            </Link>
          </div>
        </div>

        {/* Main Bar */}
        <div className="px-4 md:px-12 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-8 border-b border-gray-100/50">
          <Link to="/" className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#007bff] rounded-full flex items-center justify-center">
              <ShoppingCart className="text-white w-4 h-4 md:w-5 md:h-5" />
            </div>
            <span className="text-base md:text-2xl font-bold text-[#007bff] tracking-tight">G&C Tech</span>
          </Link>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden lg:flex items-center gap-6 text-gray-700 font-medium whitespace-nowrap">
            <div className="relative" ref={catRef}>
              <button 
                onClick={() => setShowCategoriesMenu(!showCategoriesMenu)}
                className="flex items-center gap-1 cursor-pointer hover:text-[#007bff]"
              >
                {t('nav.categories')} <ChevronDown size={16} />
              </button>
              {showCategoriesMenu && (
                <div className="absolute top-full left-0 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.key}
                        to={cat.to || '/'}
                        onClick={() => {
                          setShowCategoriesMenu(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                      >
                        <span className="text-xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                          <p className="text-xs text-gray-500">{t('nav.shop-now')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/products" className="hover:text-[#007bff]">{t('nav.shop')}</Link>
            <Link to="/epargne" className="hover:text-[#007bff]">{t('nav.tontine')}</Link>
          </div>

          {/* Search Bar - Responsive */}
          <div className="flex-1 max-w-xl relative hidden sm:block" ref={searchRef}>
            <div className={cn(
              "flex items-center bg-[#f5f6f6] rounded-full px-4 py-2 transition-all duration-200 border border-transparent",
              isSearchFocused && "bg-white border-[#007bff] shadow-sm"
            )}>
              <input
                type="text"
                placeholder={t('nav.search')}
                className="bg-transparent border-none outline-none w-full text-sm"
                onFocus={() => setIsSearchFocused(true)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="text-gray-400" size={18} />
            </div>

            {/* Search Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {searchQuery.length === 0 ? (
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">{t('nav.popular')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                    {categories.map((cat) => (
                      <Link
                        key={cat.key}
                        to={cat.to || '/'}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors cursor-pointer group"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{cat.name}</p>
                          <p className="text-xs text-gray-500">{t('nav.items-available')}</p>
                        </div>
                      </Link>
                    ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            navigate(`/product/${p.id}`);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors text-left"
                        >
                          <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-yellow-500">
                              {'★'.repeat(Math.floor(p.rating))}{'☆'.repeat(5 - Math.floor(p.rating))}
                              <span className="text-gray-400 ml-1">({p.reviews})</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-gray-500 text-sm">{t('nav.no-results', { query: searchQuery })}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Actions & Mobile Menu */}
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="sm:hidden text-gray-600 p-1 hover:text-[#007bff]"
            >
              <Search size={22} />
            </button>
            <Link to={currentUser ? "/dashboard" : "/login"} className="flex items-center gap-2 hover:text-[#007bff]">
              <User size={22} />
              <span className="hidden lg:inline text-sm font-medium">
                {currentUser ? currentUser.fullname : t('nav.account')}
              </span>
            </Link>
            <Link to="/favoris" className="flex items-center hover:text-[#007bff] relative" aria-label={t('nav.favorites')}>
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>
            <Link to="/cart" className="flex items-center gap-2 hover:text-[#007bff] relative">
              <ShoppingCart size={22} />
              <span className="hidden lg:inline text-sm font-medium">{t('nav.cart')}</span>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center">{itemCount}</span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1 text-gray-600 hover:text-[#007bff] transition-colors"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className={cn(
            "lg:hidden fixed inset-0 bg-white z-[100] overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-300"
          )}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <Link to="/" className="flex items-center gap-1.5" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 bg-[#007bff] rounded-full flex items-center justify-center">
                  <ShoppingCart className="text-white w-4 h-4" />
                </div>
                <span className="text-base font-bold text-[#007bff]">G&C Tech</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X size={26} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Search in mobile menu for very small screens */}
              <div className="sm:hidden relative">
                <div className="flex items-center bg-[#f5f6f6] rounded-xl px-4 py-3">
                  <input
                    type="text"
                    placeholder={t('nav.search')}
                    className="bg-transparent border-none outline-none w-full"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('nav.categories')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat.key}
                      to={cat.to || '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all"
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="font-bold text-gray-900">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">{t('nav.menu')}</h3>
                <div className="flex flex-col gap-4">
                  <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-900 flex items-center justify-between">
                    {t('nav.shop')} <ChevronDown className="-rotate-90 text-gray-300" size={20} />
                  </Link>
                  <Link to="/epargne" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-900 flex items-center justify-between">
                    {t('nav.tontine')} <ChevronDown className="-rotate-90 text-gray-300" size={20} />
                  </Link>
                  <Link to={currentUser ? "/dashboard" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-gray-900 flex items-center justify-between border-t border-gray-50 pt-3 mt-1">
                    {currentUser ? currentUser.fullname : t('nav.login')} <ChevronDown className="-rotate-90 text-gray-300" size={20} />
                  </Link>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <Phone size={18} className="text-[#007bff]" />
                   <div>
                     <p className="text-xs text-gray-500">{t('nav.contact-support')}</p>
                     <p className="font-bold text-gray-900">+229040543686</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
