"use client";

import { useState, useEffect } from "react";
import { Bell, UserCircle, Search } from "lucide-react";
import { API_BASE, getAuthHeaders } from "@/lib/api";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string | null;
  isActive: boolean | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`, {
        cache: "no-store",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean | null) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ isActive: currentStatus === false ? true : false }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-neutral-50 relative">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-neutral-100">
        <div className="flex gap-8">
          <button className="text-[11px] font-bold tracking-widest uppercase border-b-2 border-black pb-1">Directory</button>
        </div>
        <div className="flex items-center gap-6">
          <Search size={12} className="text-neutral-400" />
          <Bell size={16} className="text-neutral-400 hover:text-black" />
          <UserCircle size={18} className="text-neutral-400 hover:text-black" />
        </div>
      </header>

      <div className="p-12 space-y-12 max-w-6xl w-full">
        <div className="flex justify-between items-start">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold mb-2">PERSONNEL MANAGEMENT</p>
            <h1 className="text-6xl font-black tracking-tighter uppercase leading-none">USER DIRECTORY</h1>
          </div>
        </div>

        <div className="bg-white outline outline-1 outline-neutral-100 border-t-8 border-t-neutral-100">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr_150px] gap-6 p-8 border-b border-neutral-100 text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">
            <span>ENTITY</span>
            <span>CONTACT INTERFACE</span>
            <span>REGISTRY DATE</span>
            <span>CLASSIFICATION</span>
            <span>STATUS</span>
            <span className="text-right">OPERATIONS</span>
          </div>

          {loading ? (
             <div className="p-8 text-center text-xs font-bold text-neutral-400 tracking-widest uppercase">Fetching Entities...</div>
          ) : users.length === 0 ? (
             <div className="p-8 text-center text-xs font-bold text-neutral-400 tracking-widest uppercase">No Users Found</div>
          ) : users.map((item) => {
             const isActive = item.isActive !== false; // Default to active if null
             const userClass = item.role || "STANDARD";
             return (
              <div key={item.id} className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_150px] gap-6 p-8 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors ${!isActive ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 flex items-center justify-center text-white text-[10px]">
                    {item.name ? item.name.substring(0, 2).toUpperCase() : "?"}
                  </div>
                  <span className="text-[12px] font-black leading-tight w-24 truncate">{item.name || "UNNAMED"}</span>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium truncate">{item.email}</span>
                <span className="text-[10px] text-neutral-400 font-mono tracking-tighter">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <div>
                  <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 border ${userClass === 'admin' ? 'border-black text-black' : 'border-neutral-300 text-neutral-400'}`}>
                    {userClass}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-1 h-1 ${isActive ? 'bg-black' : 'bg-red-500'}`} />
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-black' : 'text-red-500'}`}>
                    {isActive ? 'ACTIVE' : 'SUSPENDED'}
                  </span>
                </div>
                <div className="flex justify-end gap-6 text-[9px] font-bold uppercase tracking-widest">
                  <button onClick={() => toggleStatus(item.id, item.isActive)} className="text-red-700 hover:text-red-500 transition-colors">
                    {isActive ? "SUSPEND" : "REACTIVATE"}
                  </button>
                </div>
              </div>
             )
          })}
        </div>
      </div>
    </div>
  );
}
