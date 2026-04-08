// Force Vercel build for Stripe UI
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import Home from './pages/Home';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import { Toaster } from 'react-hot-toast';
import SearchResults from './pages/SearchResults';
import Account from './pages/Account';
import Dashboard from './pages/Dashboard';
import OrderHistory from './pages/OrderHistory';
import GearLocker from './pages/GearLocker';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import ThankYou from './pages/ThankYou';
import TechGuide from './pages/TechGuide';
import Login from './pages/Login';
import Register from './pages/Register';



const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
        <Router>
          <Toaster 
            position="bottom-center"
            toastOptions={{
              style: {
                borderRadius: '8px',
                background: '#fff',
                color: '#171717',
                fontSize: '13px',
                fontWeight: '500',
                padding: '12px 20px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f5f5f5',
              },
              error: {
                style: {
                  background: '#fff',
                  border: '1px solid #fee2e2',
                  color: '#b91c1c',
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
            <Navbar />
            <main className="min-h-screen">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                  <Route path="/collections/:category" element={<PageTransition><Collection /></PageTransition>} />
                  <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
                  <Route path="/search" element={<PageTransition><SearchResults /></PageTransition>} />
                  <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
                  <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
                  <Route path="/orders" element={<PageTransition><OrderHistory /></PageTransition>} />
                  <Route path="/locker" element={<PageTransition><GearLocker /></PageTransition>} />
                  <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
                  <Route path="/thank-you" element={<PageTransition><ThankYou /></PageTransition>} />
                  <Route path="/confirmation/:orderId" element={<PageTransition><Confirmation /></PageTransition>} />
                  <Route path="/guide" element={<PageTransition><TechGuide /></PageTransition>} />
                  <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                  <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
            <MobileNav />
          </div>
        </Router>
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
