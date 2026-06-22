import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';

// Pages are code-split: each is loaded on demand to keep the initial bundle small.
const Home = lazy(() => import('./pages/Home'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Products = lazy(() => import('./pages/Products'));
const Tontine = lazy(() => import('./pages/Tontine'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
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
          <BrowserRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/epargne" element={<Tontine />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/refund" element={<RefundPolicy />} />
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
                    {/* Unknown routes show a proper 404 page */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
          </AuthProvider>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
