import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { CatalogProvider } from './contexts/CatalogContext';
import { WishlistProvider } from './contexts/WishlistContext';

// Pages are code-split: each is loaded on demand to keep the initial bundle small.
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Products = lazy(() => import('./pages/Products'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Tontine = lazy(() => import('./pages/Tontine'));
const EpargneDetail = lazy(() => import('./pages/EpargneDetail'));
const PaiementRetour = lazy(() => import('./pages/PaiementRetour'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSavings = lazy(() => import('./pages/admin/AdminSavings'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const LegalNotice = lazy(() => import('./pages/LegalNotice'));
const CookiesPolicy = lazy(() => import('./pages/CookiesPolicy'));
const Cart = lazy(() => import('./pages/Cart'));
const Smartphones = lazy(() => import('./pages/Smartphones'));
const Computers = lazy(() => import('./pages/Computers'));
const Tablets = lazy(() => import('./pages/Tablets'));
const Headphones = lazy(() => import('./pages/Headphones'));
const Earphones = lazy(() => import('./pages/Earphones'));
const Smartwatches = lazy(() => import('./pages/Smartwatches'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const ShippingInfo = lazy(() => import('./pages/ShippingInfo'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PaymentDetails = lazy(() => import('./pages/PaymentDetails'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      <div
        className="w-10 h-10 rounded-full border-4 border-blue-100 border-t-[#007bff]"
        style={{ animation: 'spin 0.8s linear infinite' }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <AuthProvider>
          <CatalogProvider>
          <WishlistProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/favoris" element={<Favorites />} />
                    <Route path="/epargne" element={<Tontine />} />
                    <Route path="/epargne/:id" element={<EpargneDetail />} />
                    <Route path="/paiement/retour" element={<PaiementRetour />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/refund" element={<RefundPolicy />} />
                    <Route path="/legal-notice" element={<LegalNotice />} />
                    <Route path="/cookies" element={<CookiesPolicy />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/smartphones" element={<Smartphones />} />
                    <Route path="/computers" element={<Computers />} />
                    <Route path="/tablets" element={<Tablets />} />
                    <Route path="/headphones" element={<Headphones />} />
                    <Route path="/earphones" element={<Earphones />} />
                    <Route path="/smartwatches" element={<Smartwatches />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/shipping" element={<ShippingInfo />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/payment-details" element={<PaymentDetails />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/admin" element={<AdminProducts />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                    <Route path="/admin/orders" element={<AdminOrders />} />
                    <Route path="/admin/savings" element={<AdminSavings />} />
                    <Route path="/admin/users" element={<AdminUsers />} />
                    <Route path="/admin/settings" element={<AdminSettings />} />
                    {/* Unknown routes show a proper 404 page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
          </WishlistProvider>
          </CatalogProvider>
          </AuthProvider>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
