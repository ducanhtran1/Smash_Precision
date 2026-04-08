"use client";

import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const logout = () => {
    try {
      localStorage.removeItem("admin_token");
    } finally {
      // router.replace("/login");
      router.push("")
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-white">
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-neutral-100">
        <div className="flex gap-8">
          <span className="text-[11px] font-bold tracking-widest uppercase border-b-2 border-black pb-1">
            Settings
          </span>
        </div>
      </header>

      <div className="p-12 space-y-10 max-w-3xl">
        <div>
          <h1 className="text-6xl font-black tracking-tighter uppercase leading-none mb-3">
            SYSTEM SETTINGS
          </h1>
          <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
            Administrative session and environment controls.
          </p>
        </div>

        <section className="bg-white outline outline-1 outline-neutral-100 p-8">
          <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase border-b-2 border-black pb-3 mb-6 block">
            Session
          </h2>

          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
                Logout
              </p>
              <p className="text-[12px] text-neutral-600">
                End the current admin session on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="bg-black text-white text-[10px] font-bold tracking-[0.2em] uppercase px-8 py-4 hover:bg-neutral-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

