import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, User, Search, Menu, X, ChevronRight, ArrowRight, Verified, CreditCard, Wallet, Thermometer, Droplets, Ruler, Waves, Settings, LayoutGrid, ReceiptText } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ProductsProvider } from './contexts/ProductsContext';
import { signInWithGoogle } from './lib/firebase';
import { cn } from './lib/utils';

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

const Navbar = () => {
  const { user, profile } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const isTransparent = location.pathname === '/';

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out px-6 md:px-10 py-6 flex justify-between items-center",
      isTransparent ? "bg-transparent" : "bg-white/80 backdrop-blur-xl border-b border-neutral-100"
    )}>
      <Link to="/" className="text-2xl font-black tracking-tighter text-black uppercase">
        SMASH PRECISION
      </Link>
      
      <div className="hidden md:flex gap-12 items-center">
        {['Rackets', 'Shoes', 'Shuttles', 'Apparel'].map((cat) => (
          <Link 
            key={cat}
            to={`/collections/${cat.toLowerCase()}`}
            className="font-sans tracking-tight uppercase text-[10px] font-bold text-neutral-500 hover:text-black transition-colors"
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/search')} className="hover:opacity-70 transition-opacity">
          <Search size={20} className="text-black" />
        </button>
        <Link to="/checkout" className="relative hover:opacity-70 transition-opacity">
          <ShoppingBag size={20} className="text-black" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {items.length}
            </span>
          )}
        </Link>
        <Link to={user ? "/dashboard" : "/login"} className="hover:opacity-70 transition-opacity">
          <User size={20} className="text-black" />
        </Link>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="w-full py-20 px-10 border-t border-neutral-200 bg-neutral-50">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start max-w-screen-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-lg font-bold text-black uppercase tracking-tighter">SMASH PRECISION</div>
        <p className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400">
          © 2024 SMASH PRECISION. ENGINEERED SILENCE.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400 mb-2">OPERATIONS</span>
        <Link to="/locker" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Archive</Link>
        <Link to="/guide" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Tech Guide</Link>
        <Link to="/account" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Account</Link>
      </div>
      <div className="flex flex-col gap-4 md:items-end">
        <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400 mb-2">FOLLOW</span>
        <a href="#" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Instagram</a>
        <a href="#" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">X Laboratory</a>
      </div>
    </div>
  </footer>
);

const MobileNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutGrid, label: 'Shop', path: '/' },
    { icon: ReceiptText, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Account', path: '/dashboard' },
    { icon: ShoppingBag, label: 'Cart', path: '/checkout' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 bg-white border-t border-neutral-100 h-20 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center justify-center transition-all",
              isActive ? "text-black scale-110" : "text-neutral-300"
            )}
          >
            <item.icon size={20} />
            <span className="font-sans uppercase text-[10px] tracking-widest font-bold mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

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
