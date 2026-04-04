import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Order } from '@/src/types';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';

/** Map Nest order (with nested product) to the flat item shape the UI expects */
function orderFromApiPayload(data: {
  id: string;
  status?: string;
  items?: Array<{
    quantity: number;
    priceAtPurchase: number;
    product?: { id: string; name: string; imageUrl: string };
  }>;
}): Order {
  const items =
    data.items?.map((it) => ({
      productId: it.product?.id ?? '',
      productName: it.product?.name ?? 'Product',
      quantity: it.quantity,
      priceAtPurchase: it.priceAtPurchase,
      imageUrl: it.product?.imageUrl ?? '',
    })) ?? [];

  return {
    id: data.id,
    userId: '',
    items,
    total: 0,
    status: 'Order Received',
    createdAt: new Date().toISOString(),
    shippingAddress: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      zip: '',
    },
  };
}

const Confirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? '';
      const primary = base ? `${base}/api/orders/${orderId}` : `/api/orders/${orderId}`;

      let loaded = false;
      try {
        const res = await fetch(primary, { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as Parameters<typeof orderFromApiPayload>[0];
          setOrder(orderFromApiPayload(data));
          loaded = true;
        }
      } catch {
        /* try Firestore */
      }

      if (!loaded) {
        try {
          const docSnap = await getDoc(doc(db, 'orders', orderId));
          if (docSnap.exists()) {
            setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `orders/${orderId}`);
        }
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="pt-40 px-10 text-center uppercase text-[10px] tracking-widest">Verifying Transaction...</div>;
  if (!order) return <div className="pt-40 px-10 text-center uppercase text-[10px] tracking-widest">Order not found.</div>;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 md:px-10">
      <div className="max-w-screen-2xl mx-auto">
        {/* Hero Statement */}
        <section className="mb-32 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-[clamp(4rem,12vw,10rem)] font-black text-black uppercase select-none leading-[0.9] tracking-tighter">
              THANK<br/>YOU
            </h1>
            <div className="max-w-xs mb-4">
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">Order Confirmed</p>
              <p className="text-neutral-600 leading-relaxed">
                Your equipment has been registered in our system. Engineering and logistics have been initiated for precision delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Order Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 border-t border-neutral-100 pt-12">
            <div className="flex flex-col md:flex-row justify-between mb-20 gap-8">
              <div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 block mb-2">Reference ID</span>
                <span className="text-xl font-medium tracking-tight">#{order.id.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 block mb-2">Estimated Arrival</span>
                <span className="text-xl font-medium tracking-tight">OCT 24, 2024</span>
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 block mb-2">Carrier</span>
                <span className="text-xl font-medium tracking-tight">LOGIC EXPEDITE</span>
              </div>
            </div>

            <div className="space-y-12">
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.productName}`} className="flex gap-8 items-start">
                  <div className="w-32 h-40 bg-neutral-50 flex-shrink-0 overflow-hidden group">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale" src={item.imageUrl} alt={item.productName} />
                  </div>
                  <div className="flex-grow py-2">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-bold tracking-tight uppercase">{item.productName}</h3>
                      <span className="text-body-md font-medium">
                        ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-4">ENGINEERED COMPONENT</p>
                    <div className="flex gap-4">
                      <span className="text-[10px] border border-neutral-100 px-2 py-1 uppercase tracking-tighter">QTY: {item.quantity.toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-white p-10 flex flex-col justify-between h-full border border-neutral-100">
              <div>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-black mb-8 block">Shipment Status</span>
                <div className="space-y-8 relative">
                  <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-neutral-100"></div>
                  <div className="flex gap-6 items-start relative">
                    <div className="w-4 h-4 rounded-full bg-black mt-1 shrink-0 z-10"></div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">Order Received</p>
                      <p className="text-[11px] text-neutral-400 uppercase tracking-tighter">Today, 10:42 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-6 items-start relative opacity-40">
                    <div className="w-4 h-4 rounded-full bg-neutral-200 mt-1 shrink-0 z-10"></div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-tight">Processing Engineering</p>
                      <p className="text-[11px] text-neutral-400 uppercase tracking-tighter">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-20 space-y-4">
                <Link to="/dashboard" className="w-full bg-black text-white py-5 px-10 font-bold uppercase tracking-[0.15em] text-[12px] hover:bg-neutral-800 transition-all text-center block">
                  TRACK ORDER
                </Link>
                <Link to="/locker" className="w-full border border-neutral-200 text-black py-5 px-10 font-bold uppercase tracking-[0.15em] text-[12px] hover:bg-neutral-50 transition-all text-center block">
                  VIEW ARCHIVE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Confirmation;
