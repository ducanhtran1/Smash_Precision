"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { name: "DASHBOARD", href: "/", icon: LayoutDashboard },
  { name: "PRODUCTS", href: "/products", icon: Package },
  { name: "ORDERS", href: "/orders", icon: ShoppingCart },
  { name: "USERS", href: "/users", icon: Users },
  { name: "SETTINGS", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-neutral-50 flex flex-col border-r border-neutral-200 z-50">
      {/* Brand */}
      <div className="p-8">
        <h1 className="text-xl font-black tracking-tighter uppercase text-black leading-none mb-1">
          SMASH PRECISION
        </h1>
        <p className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
          Admin Archive
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-4">
        <ul className="flex flex-col gap-1 px-4">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3 text-[11px] font-bold tracking-widest uppercase transition-colors",
                    isActive
                      ? "bg-neutral-100 text-black border-l-4 border-black"
                      : "text-neutral-500 hover:text-black hover:bg-neutral-100 border-l-4 border-transparent"
                  )}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Current User */}
      <div className="p-6 border-t border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-[10px] font-bold">
            OP
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-black">
              SYSTEM OP
            </p>
            <p className="text-[9px] uppercase text-neutral-400 font-medium">
              LEVEL 4 ACCESS
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
