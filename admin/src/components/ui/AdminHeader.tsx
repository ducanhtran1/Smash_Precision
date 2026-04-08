'use client';

import { Bell, UserCircle, Search } from "lucide-react";

interface AdminHeaderProps {
  breadcrumbs: string[];
}

export function AdminHeader({ breadcrumbs }: AdminHeaderProps) {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-neutral-100">
      <div className="flex gap-8 items-center">
        {breadcrumbs.map((crumb, idx) => (
          <div key={idx} className="flex gap-8 items-center">
            <span
              className={`text-[11px] font-bold tracking-widest uppercase ${
                idx === breadcrumbs.length - 1
                  ? "border-b-2 border-black pb-1 text-black"
                  : "text-neutral-400 hover:text-black"
              }`}
            >
              {crumb}
            </span>
            {idx < breadcrumbs.length - 1 && (
              <div className="w-px h-4 bg-neutral-200" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Global Search..."
            className="text-[11px] pl-8 pr-12 py-2 bg-neutral-50 border-0 focus:ring-1 focus:ring-black focus:outline-none w-64 placeholder:text-neutral-400"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-neutral-400 font-bold">
            ⌘K
          </span>
        </div>
        <Bell size={16} className="text-neutral-400 cursor-pointer hover:text-black" />
        <UserCircle size={18} className="text-neutral-400 cursor-pointer hover:text-black" />
      </div>
    </header>
  );
}
