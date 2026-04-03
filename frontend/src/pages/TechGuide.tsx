import React from 'react';
import { Thermometer, Waves, Ruler, Settings } from 'lucide-react';

const TechGuide = () => {
  return (
    <main className="pt-32 pb-24">
      <header className="px-10 mb-32 max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] mb-6 text-neutral-400">Technical Archive / 001</p>
            <h1 className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tighter uppercase mb-8">
              Racket Care <br/>& Tech Guide
            </h1>
            <p className="text-lg text-neutral-600 max-w-md leading-relaxed opacity-80">
              The preservation of tension, structural integrity, and grip friction is essential for peak performance. This guide outlines the engineering protocols required for equipment longevity.
            </p>
          </div>
          <div className="w-full md:w-1/3 aspect-[4/5] bg-neutral-50 overflow-hidden">
            <img className="w-full h-full object-cover desaturate" src="https://lh3.googleusercontent.com/aida-public/AB6AXuACUIb7iDN4vav89OhVmvfSBqvg5S4KJwHYr68ndtFyjjoboTw4CHPOpZ4jyL2wU-L0aA__BPbxcOXHzf2s1AIA2ELaNaB72xqYpGdjq62rjsyMs5ROsKXquxTStLbcMYMc6fj5Ss6ZcQgpdH9QqY3QjY9rTonTC6ot0DDxAU581pIvaxPCRzLCVCA3CUvcROVGSywtWehoyHFnzruCLifPKK3aEUI0q3uU3RFqHweN_3_bJNuBDEJGKEutCp3r5db3F28aISjUJqQ" alt="Tech Detail" />
          </div>
        </div>
      </header>

      <section className="mb-40 px-10 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-4 sticky top-40">
            <span className="text-xs font-bold tracking-[0.3em] uppercase border-b border-black pb-2">01. Tension Protocols</span>
            <h2 className="text-3xl font-bold mt-10 tracking-tight">The Physics of <br/>Resilience</h2>
          </div>
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-black">
                <Ruler size={20} />
                <span className="text-[10px] font-bold tracking-widest uppercase">High Tension (28-32 lbs)</span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600">Designed for elite precision. Reduced dwell time allows for instant kinetic transfer. Requires advanced technique to prevent arm fatigue and frame fracture.</p>
              <div className="h-px bg-neutral-100 w-full"></div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-black">
                <Waves size={20} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Mid Tension (24-27 lbs)</span>
              </div>
              <p className="text-sm leading-relaxed text-neutral-600">The balance point between power and control. Increased "trampoline effect" assists in deep clears and defensive recovery shots.</p>
              <div className="h-px bg-neutral-100 w-full"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-40 bg-black text-white py-32 px-10">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-12">
            <h3 className="text-5xl font-bold tracking-tighter leading-none">The 10% Decay Rule</h3>
            <p className="opacity-60 text-lg max-w-md">Strings lose 10% of their tension within the first 24 hours of stringing. Professional players restrike every 15-20 hours of play to maintain mathematical consistency.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-square bg-neutral-900 overflow-hidden">
              <img className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdQsCuYqtBsJbDDDGAI1jdrQ_vYnTJs-IZb1rg4QslZvDcltpm9YEvGcAw5dPeAVDMQmFqIKspJxcaRZTxDG2uXi6DW7kURJT5nwVKhLh89sm1v-Qtm4ToMyOkIwIU4gqaNe7E4IYU6SEQluwfFb8af8LtYPqZhs4JYy_FLYN6OBLOrvsrzveUbyc8Ch-vL7WM1wD8I0w73M6mSQbI5oku9wA4bVIccD6iUHNvNGOhYJyZoLgFMb7mXmMEkWSuAn3JnlvLDQLG-yc" alt="Machine" />
            </div>
            <div className="aspect-square bg-neutral-900 flex items-center justify-center p-10 border border-neutral-800">
              <Settings size={64} className="text-white opacity-20" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TechGuide;
