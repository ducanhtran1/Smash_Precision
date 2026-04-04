import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { Order } from '@/src/types';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <main className="pt-32 pb-40 px-6 max-w-screen-xl mx-auto min-h-screen">
      <header className="mb-20">
        <div className="flex items-center space-x-2 mb-4">
          <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-neutral-400">Account</span>
          <span className="text-neutral-400 text-[10px]">/</span>
          <span className="font-sans text-[10px] tracking-[0.1em] uppercase text-black font-bold">Orders</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-2">Order History</h1>
        <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-neutral-400">Viewing all transactions for user ID: {user?.uid.slice(0, 8)}</p>
      </header>

      <div className="space-y-12">
        {orders.map((order) => (
          <section key={order.id} className="group">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-100 pb-4 mb-8">
              <div className="flex items-baseline space-x-4">
                <span className="font-sans text-2xl font-bold tracking-tighter">#ORD-{order.id.slice(0, 6).toUpperCase()}</span>
                <span className="font-sans text-[10px] tracking-[0.1em] uppercase bg-black text-white px-3 py-1">{order.status}</span>
              </div>
              <div className="mt-4 md:mt-0 font-sans text-[10px] tracking-[0.1em] uppercase text-neutral-400">
                Placed {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
              <div className="md:col-span-4 aspect-square bg-neutral-50 overflow-hidden">
                <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src={order.items[0].imageUrl} alt={order.items[0].productName} />
              </div>
              <div className="md:col-span-5 space-y-4">
                <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-neutral-400">Contents ({order.items.length})</div>
                <h3 className="text-2xl font-bold tracking-tighter uppercase">{order.items[0].productName} {order.items.length > 1 && `+ ${order.items.length - 1} more`}</h3>
                <p className="text-neutral-600 max-w-sm leading-relaxed">Precision engineered components for high-performance athletic pursuit.</p>
                <div className="pt-4 flex items-center space-x-6">
                  <Link to={`/confirmation/${order.id}`} className="bg-black text-white px-8 py-3 font-sans text-[10px] tracking-[0.1em] uppercase hover:bg-neutral-800 transition-colors">Order Details</Link>
                </div>
              </div>
              <div className="md:col-span-3 text-right">
                <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-neutral-400 mb-2">Order Total</div>
                <div className="text-4xl font-black tracking-tighter">${order.total.toFixed(2)}</div>
              </div>
            </div>
          </section>
        ))}
        {orders.length === 0 && !loading && (
          <div className="py-40 text-center text-neutral-400 uppercase text-[10px] tracking-widest">
            No transaction records found.
          </div>
        )}
      </div>
    </main>
  );
};

export default OrderHistory;
