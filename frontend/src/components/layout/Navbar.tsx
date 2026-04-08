import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCart } from '@/src/contexts/CartContext';
import { cn } from '@/src/lib/utils';

export const Navbar = () => {
  const { user } = useAuth();
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
