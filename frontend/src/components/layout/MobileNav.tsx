import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, LayoutGrid, ReceiptText } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const MobileNav = () => {
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
