import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useProducts } from '@/src/contexts/ProductsContext';

const ThankYou = () => {
  const [dots, setDots] = useState('');
  const { refreshProducts } = useProducts();

  useEffect(() => {
    // Refresh products once so catalog matches the now-reduced stock
    refreshProducts().catch(() => {});

    // Animated dots for processing illusion
    const interval = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 500);
    return () => clearInterval(interval);
  }, [refreshProducts]);

  return (
    <main className="pt-32 pb-20 px-6 md:px-10 max-w-screen-2xl mx-auto min-h-[70vh] flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8 p-12 bg-white border border-neutral-100 shadow-2xl">
        <div className="flex justify-center mb-8 relative">
           <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-20">
             <CheckCircle2 size={120} className="text-black" />
           </div>
           <CheckCircle2 size={80} className="text-black relative z-10" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase">Thank You</h1>
        
        <div className="space-y-4">
          <p className="text-neutral-500 uppercase tracking-widest text-sm flex items-center justify-center gap-2">
            <Loader2 size={14} className="animate-spin text-black" />
            Your payment was successful and your order is currently being provisioned {dots}
          </p>
          <p className="text-neutral-400 text-xs">
            We are assigning processing resources to your order via our secure queue. You will receive an email confirmation shortly once your items are fully staged.
          </p>
        </div>

        <div className="pt-10">
          <Link 
            to="/orders" 
            className="inline-block bg-black text-white px-8 py-4 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-neutral-800 transition-colors"
          >
            Track My Orders
          </Link>
        </div>
      </div>
    </main>
  );
};

export default ThankYou;
