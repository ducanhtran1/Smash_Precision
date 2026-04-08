import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { useAuth } from '@/src/contexts/AuthContext';
import { Order } from '@/src/types';
import { handleFirestoreError, OperationType } from '@/src/lib/error-handler';
import { ArrowRight, Package } from 'lucide-react';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        // Either use the token or Firebase ID token depending on which auth they chose
        const response = await fetch(`${API_URL}/api/orders/user/${user.uid || user.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });

        if (response.ok) {
          const orders = await response.json();
          setRecentOrders(orders);
        }
      } catch (error) {
        console.error("Failed to load orders");
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 md:px-12 lg:px-20 flex items-center">
        <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-bold">
          Loading account...
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen pt-24">
      {/* Sidebar Navigation */}
      <aside className="w-64 fixed left-0 top-24 bottom-0 border-r border-neutral-100 px-10 py-12 hidden lg:block bg-white">
        <nav className="space-y-8">
          <div>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400 mb-6 block">Account</span>
            <ul className="space-y-4">
              <li><Link to="/dashboard" className="text-[11px] tracking-widest uppercase font-bold text-black border-b border-black pb-1 block w-fit">Dashboard</Link></li>
              <li><Link to="/orders" className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors block">Order History</Link></li>
              <li><Link to="/locker" className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors block">Gear Locker</Link></li>
              <li><Link to="/account" className="text-[11px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors block">Settings</Link></li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 px-6 md:px-12 lg:px-20 py-12">
        <section className="mb-20">
          <span className="text-[11px] tracking-[0.3em] uppercase text-neutral-400 font-medium mb-2 block">System Status: Active</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black leading-none mb-8 uppercase">
            WELCOME, <br />{profile?.displayName?.split(' ')[0] || 'ATHLETE'}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-100 border border-neutral-100">
            <div className="bg-white p-10 flex flex-col justify-between aspect-video md:aspect-auto">
              <span className="text-[10px] tracking-widest uppercase text-neutral-400">Total Orders</span>
              <span className="text-4xl font-light tracking-tighter">{recentOrders.length} <span className="text-sm font-bold uppercase tracking-widest text-neutral-400 ml-2">Orders</span></span>
            </div>
            <div className="bg-white p-10 flex flex-col justify-between aspect-video md:aspect-auto">
              <span className="text-[10px] tracking-widest uppercase text-neutral-400">Member Tier</span>
              <span className="text-4xl font-light tracking-tighter uppercase">Elite <span className="text-sm font-bold uppercase tracking-widest text-neutral-400 ml-2">Precision</span></span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="flex justify-between items-end mb-12 border-b border-neutral-100 pb-4">
              <h2 className="text-[11px] tracking-[0.2em] uppercase font-bold">Recent Logistics</h2>
              <Link to="/orders" className="text-[10px] tracking-widest uppercase text-neutral-400 hover:text-black transition-colors">View Archive</Link>
            </div>

            <div className="space-y-px bg-neutral-100">
              {recentOrders.length > 0 ? recentOrders.map(order => {
                const firstItem = order.items?.[0];
                const previewImage = firstItem?.product?.imageUrl || firstItem?.imageUrl || '';
                const previewName = firstItem?.product?.name || firstItem?.productName || 'Unknown item';

                return (
                <div key={order.id} className="bg-white py-8 flex flex-col md:flex-row md:items-center justify-between group transition-colors hover:bg-neutral-50 px-4">
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-16 h-16 bg-neutral-50 overflow-hidden">
                      {previewImage ? (
                        <img className="w-full h-full object-cover grayscale" src={previewImage} alt={previewName} />
                      ) : (
                        <div className="w-full h-full bg-neutral-100" />
                      )}
                    </div>
                    <div className="md:col-span-2 flex flex-col justify-center">
                      <div className="font-sans text-[10px] tracking-[0.1em] uppercase text-neutral-400 mb-2">Order items ({order.items?.length ?? 0})</div>
                      <h4 className="text-xl font-bold tracking-tight uppercase line-clamp-1">
                        {previewName} {(order.items?.length ?? 0) > 1 && `+ ${(order.items?.length ?? 0) - 1} more`}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-12">
                    <div className="text-right">
                      <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1">Status</p>
                      <p className="text-[11px] font-black tracking-[0.15em] uppercase text-black">{order.status.toUpperCase()}</p>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
                );
              }) : (
                <div className="bg-white py-20 text-center text-neutral-400 uppercase text-[10px] tracking-widest">
                  No recent logistics found.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-20">
            <div>
              <h2 className="text-[11px] tracking-[0.2em] uppercase font-bold mb-8 border-b border-neutral-100 pb-4">Gear Locker</h2>
              <Link to="/locker" className="relative group cursor-pointer overflow-hidden bg-black aspect-square block">
                <img
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 grayscale"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAafRvnKEIcAq5KAgfdIXQRqekjXN4iRel1d_d31SNhnh8l4ldeWbnar0BFJhHw__wHpGTmIuUAwNY__ZVSbofcbvkOqRA123vpxm1gG-1D837-__ySnemVHAr8044Q7HrrulmVt1JtG9A0m9BK2N3_mYLfZXNnVvlpyvQf4dXIf-2vzoLwLURVHEmNf5M9xIP9ME6u7dSduXQXKTElSv8KI2bo1nHKU3_0zMt5SHpZev-9Szsa65EZnCrPHzxKNs4YI_DLBWLA6q8"
                  alt="Gear Locker"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-white text-[10px] tracking-widest uppercase font-bold mb-2">Technical Archive</span>
                  <h4 className="text-white text-2xl font-black tracking-tight leading-tight uppercase">Manage your hardware specifications</h4>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
