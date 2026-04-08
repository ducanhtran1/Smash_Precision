"use client";

import { useState, useEffect } from "react";
import { API_BASE, getAuthHeaders } from "@/lib/api";
import { AdminHeader } from "@/components/ui/AdminHeader";

import { UserRow, User } from "@/components/ui/UserRow";

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
      <AdminHeader breadcrumbs={["Directory"]} />

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
          ) : users.map((item) => (
            <UserRow key={item.id} item={item} onToggleStatus={toggleStatus} />
          ))}
        </div>
      </div>
    </div>
  );
}
