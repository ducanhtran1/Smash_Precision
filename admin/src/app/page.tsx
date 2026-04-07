"use client";

import { useState, useEffect } from "react";
import { Bell, UserCircle } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { API_BASE } from "@/lib/api";

const chartData = [
  { name: "W1, OCT", income: 300, outcome: 180 },
  { name: "W2", income: 450, outcome: 220 },
  { name: "W3", income: 280, outcome: 320 },
  { name: "W4", income: 600, outcome: 140 },
  { name: "NOW", income: 430, outcome: 260 },
];

const RECENT_ACTIVITY = [
  { time: "System", title: "Analytics Engine Online", desc: "Connected to real-time datacore" }
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    activeUsers: 0,
    orderVolume: 0,
    conversionRate: "0%"
  });
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/analytics`)
      .then(res => res.json())
      .then(data => {
        setMetrics(data.metrics);
        setTopProducts(data.topProducts);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-neutral-100">
        <div className="flex gap-8">
          <button className="text-[11px] font-bold tracking-widest uppercase border-b-2 border-black pb-1">Analytics</button>
        </div>
        <div className="flex items-center gap-6">
          <Bell size={16} className="text-black cursor-pointer" />
          <UserCircle size={18} className="text-black cursor-pointer" />
        </div>
      </header>

      <div className="p-8 space-y-12 max-w-7xl">
        {/* KPI Row */}
        <div className="grid grid-cols-4 border-y border-neutral-100 bg-white">
          <div className="p-8 border-r border-neutral-100">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-4">Total Revenue</p>
            <div className="flex items-end gap-3 truncate">
              <h3 className="text-4xl font-black tracking-tighter leading-none">${Number(metrics.totalRevenue).toLocaleString()}</h3>
            </div>
          </div>
          <div className="p-8 border-r border-neutral-100">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-4">Active Users</p>
            <div className="flex items-end gap-3 truncate">
              <h3 className="text-4xl font-black tracking-tighter leading-none">{metrics.activeUsers}</h3>
            </div>
          </div>
          <div className="p-8 border-r border-neutral-100">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-4">Order Volume</p>
            <div className="flex items-end gap-3 truncate">
              <h3 className="text-4xl font-black tracking-tighter leading-none">{metrics.orderVolume}</h3>
            </div>
          </div>
          <div className="p-8">
            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold mb-4">Conversion Rate</p>
            <div className="flex items-end gap-3 truncate">
              <h3 className="text-4xl font-black tracking-tighter leading-none">{metrics.conversionRate}</h3>
            </div>
          </div>
        </div>

        {/* Chart Area */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase mb-1">Income Vs Outcome</h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Precision Monitoring Engine</p>
            </div>
          </div>

          <div className="h-64 w-full bg-white relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={0} barSize={60}>
                <YAxis hide domain={[0, 'dataMax + 100']} />
                <Tooltip cursor={{fill: '#fafafa'}} contentStyle={{ backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: 0, fontSize: '10px', textTransform: 'uppercase' }} />
                <Bar dataKey="outcome" fill="#f5f5f5" />
                <Bar dataKey="income" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Bottom Split */}
        <div className="grid grid-cols-2 gap-16 pt-16">
          <section>
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-black pb-3 mb-6 block">Recent Activity</h2>
            <div className="space-y-6">
              {RECENT_ACTIVITY.map((act, i) => (
                <div key={i} className="flex gap-6 group">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 w-20 pt-1">{act.time}</span>
                  <div>
                    <h4 className="text-[12px] font-bold mb-1">{act.title}</h4>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-neutral-500">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-black pb-3 mb-6 block w-full">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((prod: any, i: number) => (
                <div key={i} className="flex justify-between items-center bg-white p-4 hover:bg-neutral-50 transition-colors border border-transparent outline outline-1 outline-neutral-100">
                  <span className="text-[11px] font-black uppercase">{prod.name}</span>
                  <div className="flex gap-16 text-[11px] font-bold">
                    <span className="w-8 text-right text-neutral-500">{prod.qty} UNI</span>
                    <span className="w-16 text-right whitespace-nowrap">{prod.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
