"use client";

import { useState, useEffect } from "react";
import { Bell, UserCircle, Search, X } from "lucide-react";
import { API_BASE } from "@/lib/api";

type OrderItem = {
  id: string;
  price: number;
  quantity: number;
  product: { name: string };
};

type Order = {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/orders`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
        // If modal is open for this order, update it
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-black text-white';
      case 'PENDING': return 'bg-red-100 text-red-600';
      case 'PAID': return 'bg-neutral-200 text-black';
      default: return 'bg-neutral-100 text-black';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-neutral-50 relative">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-neutral-100">
        <div className="flex gap-8">
          <button className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 hover:text-black">Logistics / Orders</button>
        </div>
        <div className="flex items-center gap-6">
          <Search size={12} className="text-neutral-400" />
          <Bell size={16} className="text-neutral-400 cursor-pointer hover:text-black" />
          <UserCircle size={18} className="text-neutral-400 cursor-pointer hover:text-black" />
        </div>
      </header>

      <div className="p-12 space-y-12 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-start">
          <div className="max-w-xl">
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-4">ORDER ARCHIVE</h1>
            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">Systematic overview of all engineering-grade fulfillment cycles.</p>
          </div>
          <button className="bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-neutral-800 transition-colors">
            EXPORT CSV
          </button>
        </div>

        <div className="bg-white outline outline-1 outline-neutral-100 mb-8 pb-8">
          <div className="grid grid-cols-[200px_2fr_1fr_1fr_1fr_200px] gap-4 p-6 border-b border-neutral-100 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
            <span>ORDER ID</span>
            <span>CUSTOMER</span>
            <span>DATE</span>
            <span>TOTAL AMOUNT</span>
            <span>STATUS</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {loading ? (
             <div className="p-8 text-center text-xs font-bold text-neutral-400 tracking-widest uppercase">Fetching Orders...</div>
          ) : orders.length === 0 ? (
             <div className="p-8 text-center text-xs font-bold text-neutral-400 tracking-widest uppercase">No Orders Found</div>
          ) : orders.map((item) => (
            <div key={item.id} className="grid grid-cols-[200px_2fr_1fr_1fr_1fr_200px] gap-4 p-6 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors">
              <span className="text-[11px] font-black font-mono break-all pr-4">{item.id}</span>
              <span className="text-[11px] font-medium">{item.user?.name || item.user?.email || "Unknown Entity"}</span>
              <span className="text-[10px] text-neutral-500 font-mono tracking-tighter">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
              <span className="text-[11px] font-black">${Number(item.totalAmount).toLocaleString()}</span>
              <div>
                <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-end gap-4 text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
                <button onClick={() => setSelectedOrder(item)} className="hover:text-black hover:border-b hover:border-black transition-all">VIEW DETAILS</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white outline outline-1 outline-neutral-200 shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-neutral-400 hover:text-black">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-black tracking-tighter uppercase mb-2">ORDER DOSSIER</h2>
            <p className="text-[10px] font-mono text-neutral-400 mb-8">{selectedOrder.id}</p>

            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Customer Entity</h4>
                  <p className="text-sm font-bold">{selectedOrder.user?.name}</p>
                  <p className="text-[11px] text-neutral-500">{selectedOrder.user?.email}</p>
                </div>
                <div>
                  <h4 className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 mb-2">Logistics Stage</h4>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(selectedOrder.id, 'PENDING')} className={`border border-neutral-200 px-3 py-1 text-[9px] font-bold uppercase ${selectedOrder.status === 'PENDING' ? 'bg-black text-white' : 'hover:border-black'}`}>PENDING</button>
                    <button onClick={() => updateStatus(selectedOrder.id, 'PAID')} className={`border border-neutral-200 px-3 py-1 text-[9px] font-bold uppercase ${selectedOrder.status === 'PAID' ? 'bg-black text-white' : 'hover:border-black'}`}>PAID</button>
                    <button onClick={() => updateStatus(selectedOrder.id, 'COMPLETED')} className={`border border-neutral-200 px-3 py-1 text-[9px] font-bold uppercase ${selectedOrder.status === 'COMPLETED' ? 'bg-black text-white' : 'hover:border-black'}`}>COMPLETED</button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2 mb-4">Manifest Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items?.map(it => (
                    <div key={it.id} className="flex justify-between items-center text-[11px]">
                      <span className="font-bold">{it.quantity}x {it.product?.name || "Deleted Product"}</span>
                      <span className="font-mono text-neutral-500">${Number(it.price).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-sm font-black pt-4 border-t border-black mt-4">
                    <span>OVERALL YIELD</span>
                    <span>${Number(selectedOrder.totalAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
