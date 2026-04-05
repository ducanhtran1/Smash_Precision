import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCart } from '@/src/contexts/CartContext';
import { useProducts } from '@/src/contexts/ProductsContext';
import { CreditCard, Wallet, Verified } from 'lucide-react';

const Checkout = () => {
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();
  const { refreshProducts } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zip: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
      const url = base ? `${base}/api/orders` : '/api/orders';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,
          userId: user.id,
          email: user.email ?? '',
          displayName: user.displayName ?? undefined,
          productIds: items.map((i) => i.productId),
          quantities: items.map((i) => i.quantity),
          firstName: address.firstName,
          lastName: address.lastName,
          street: address.street,
          city: address.city,
          zip: address.zip,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Order failed (${res.status})`);
      }

      const order = (await res.json()) as { id: string };
      clearCart();
      await refreshProducts();
      navigate(`/confirmation/${order.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order failed';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-32 pb-20 px-6 md:px-10 max-w-screen-2xl mx-auto">
      <div className="mb-20">
        <h1 className="text-7xl md:text-9xl font-light tracking-tighter uppercase text-black">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Left Column: Cart & Forms */}
        <div className="lg:col-span-7 space-y-24">
          {/* Section 1: Review Items */}
          <section>
            <div className="flex justify-between items-end mb-10">
              <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold">01. Review Items</h2>
              <span className="text-[11px] text-neutral-400">{items.length} ITEMS</span>
            </div>
            <div className="space-y-8">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-8 group">
                  <div className="w-32 h-40 bg-neutral-50 overflow-hidden">
                    <img className="w-full h-full object-cover grayscale" src={item.imageUrl} alt={item.productName} />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold tracking-tight uppercase">{item.productName}</h3>
                        <span className="text-xl font-medium">${item.priceAtPurchase.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] uppercase tracking-widest text-neutral-400 mt-2">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="py-10 text-center text-neutral-400 uppercase text-[10px] tracking-widest">
                  Your bag is empty.
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Shipping */}
          <section>
            <div className="mb-10">
              <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold">02. Shipping Logistics</h2>
            </div>
            <form id="checkout-form" className="grid grid-cols-2 gap-x-8 gap-y-12" onSubmit={handleSubmit}>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">First Name</label>
                <input
                  className="bg-transparent border-0 border-b border-neutral-200 focus:border-black focus:ring-0 px-0 py-2 text-black placeholder:text-neutral-300"
                  placeholder="JULIAN"
                  type="text"
                  value={address.firstName}
                  onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">Last Name</label>
                <input
                  className="bg-transparent border-0 border-b border-neutral-200 focus:border-black focus:ring-0 px-0 py-2 text-black placeholder:text-neutral-300"
                  placeholder="VANCE"
                  type="text"
                  value={address.lastName}
                  onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">Street Address</label>
                <input
                  className="bg-transparent border-0 border-b border-neutral-200 focus:border-black focus:ring-0 px-0 py-2 text-black placeholder:text-neutral-300"
                  placeholder="1248 PRECISION WAY"
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">City</label>
                <input
                  className="bg-transparent border-0 border-b border-neutral-200 focus:border-black focus:ring-0 px-0 py-2 text-black placeholder:text-neutral-300"
                  placeholder="LOS ANGELES"
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-widest text-neutral-400">Postal Code</label>
                <input
                  className="bg-transparent border-0 border-b border-neutral-200 focus:border-black focus:ring-0 px-0 py-2 text-black placeholder:text-neutral-300"
                  placeholder="90001"
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                />
              </div>
            </form>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-40 bg-white p-12 space-y-10 border border-neutral-100">
            <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold border-b border-neutral-100 pb-6">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-500 uppercase tracking-wider">Subtotal</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-neutral-500 uppercase tracking-wider">Shipping</span>
                <span className="font-medium">FREE</span>
              </div>
            </div>
            <div className="pt-6 border-t border-black flex justify-between items-baseline">
              <span className="text-xl font-bold uppercase tracking-tighter">Total</span>
              <span className="text-4xl font-black tracking-tighter">${total.toFixed(2)}</span>
            </div>
            {submitError && (
              <p className="text-xs text-red-600 leading-relaxed">{submitError}</p>
            )}
            <div className="space-y-4 pt-10">
              <button
                type="submit"
                form="checkout-form"
                disabled={loading || items.length === 0}
                className="w-full bg-black text-white py-6 font-bold uppercase tracking-[0.2em] text-xs hover:bg-neutral-800 transition-all disabled:opacity-50"
              >
                {loading ? 'PROCESSING...' : 'Complete Purchase'}
              </button>
              <p className="text-[9px] text-center text-neutral-400 uppercase tracking-widest leading-relaxed">
                By clicking &quot;Complete Purchase&quot;, you agree to our terms of engineering and shipping protocols.
              </p>
            </div>
            <div className="pt-20">
              <div className="bg-neutral-50 p-6 flex items-start gap-4">
                <Verified size={20} className="text-neutral-400" />
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Authenticity Guaranteed</h4>
                  <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-tight">Every component is engineered and verified at our central lab prior to dispatch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
