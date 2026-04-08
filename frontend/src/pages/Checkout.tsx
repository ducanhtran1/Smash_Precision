import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { useCart } from '@/src/contexts/CartContext';
import { CreditCard, Wallet, Verified } from 'lucide-react';
import { CheckoutSummary } from '@/src/components/ui/CheckoutSummary';
import { Input } from '@/src/components/ui/Input';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const Checkout = () => {
  const { user } = useAuth();
  const { items, total, clearCart, removeFromCart, updateQuantity } = useCart();
  // const { refreshProducts } = useProducts();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [queued, setQueued] = useState(false);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'vnpay'>('stripe');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
      const url = base ? `${base}/api/payments/create-checkout-session` : '/api/payments/create-checkout-session';
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
          paymentMethod,
        }),
      });

      if (!res.ok) {
        setLoading(false);
        const text = await res.text();
        let errorMsg = `Payment session failed (${res.status})`;
        try {
          const json = JSON.parse(text);
          errorMsg = json.message || errorMsg;
        } catch {
          if (text) errorMsg = text;
        }
        throw new Error(typeof errorMsg === 'string' ? errorMsg : errorMsg[0]);
      }

      const response = await res.json();
      if (response.url) {
        // Clear cart now or wait until webhook completes?
        // Usually, Stripe hosted checkout handles returning.
        // We'll clear the cart right before redirecting so they don't accidentally buy it twice.
        clearCart();
        window.location.href = response.url;
      } else {
        throw new Error('Failed to generate payment link. Please try again.');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order failed';
      toast.error(message);
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
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border border-neutral-200">
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.productId, -1)}
                              className="px-3 py-1 text-neutral-500 hover:bg-neutral-50 transition-colors"
                            >-</button>
                            <span className="text-[11px] w-6 text-center">{item.quantity}</span>
                            <button 
                              type="button"
                              onClick={() => updateQuantity(item.productId, 1)}
                              className="px-3 py-1 text-neutral-500 hover:bg-neutral-50 transition-colors"
                            >+</button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            type="button"
                            className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-black transition-colors underline decoration-neutral-300 underline-offset-4"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
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
              <div className="col-span-2 md:col-span-1">
                <Input
                  variant="underline"
                  label="First Name"
                  placeholder="JULIAN"
                  type="text"
                  value={address.firstName}
                  onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  variant="underline"
                  label="Last Name"
                  placeholder="VANCE"
                  type="text"
                  value={address.lastName}
                  onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <Input
                  variant="underline"
                  label="Street Address"
                  placeholder="1248 PRECISION WAY"
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  variant="underline"
                  label="City"
                  placeholder="LOS ANGELES"
                  type="text"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <Input
                  variant="underline"
                  label="Postal Code"
                  placeholder="90001"
                  type="text"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                />
              </div>
            </form>
          </section>

          {/* Section 3: Payment Method */}
          <section>
            <div className="mb-10">
              <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold">03. Payment Method</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label 
                className={`border p-6 cursor-pointer transition-all flex flex-col gap-2 ${paymentMethod === 'stripe' ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-black'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-black">International Card</span>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="stripe" 
                    checked={paymentMethod === 'stripe'} 
                    onChange={() => setPaymentMethod('stripe')}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Powered by Stripe</span>
              </label>

              <label 
                className={`border p-6 cursor-pointer transition-all flex flex-col gap-2 ${paymentMethod === 'vnpay' ? 'border-black bg-neutral-50' : 'border-neutral-200 hover:border-black'}`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="text-[12px] font-bold uppercase tracking-widest text-black">VNPay</span>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="vnpay" 
                    checked={paymentMethod === 'vnpay'} 
                    onChange={() => setPaymentMethod('vnpay')}
                    className="accent-black w-4 h-4 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">Local VN Gateway</span>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-5">
          <CheckoutSummary 
            total={total} 
            itemsLength={items.length} 
            loading={loading} 
            formId="checkout-form" 
          />
        </div>
      </div>
    </main>
  );
};

export default Checkout;
