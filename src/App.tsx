import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import RefundPolicy from './pages/RefundPolicy';
import Cart from './pages/Cart';
import Smartphones from './pages/Smartphones';
import Computers from './pages/Computers';
import Tablets from './pages/Tablets';
import Headphones from './pages/Headphones';
import Earphones from './pages/Earphones';
import Smartwatches from './pages/Smartwatches';
import HelpCenter from './pages/HelpCenter';
import ShippingInfo from './pages/ShippingInfo';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import PaymentDetails from './pages/PaymentDetails';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { LanguageProvider } from './contexts/LanguageContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { CartProvider } from './contexts/CartContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
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
          </div>
          <Footer />
        </div>
      </BrowserRouter>
      </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
