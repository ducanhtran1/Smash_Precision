import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="w-full py-20 px-10 border-t border-neutral-200 bg-neutral-50">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start max-w-screen-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-lg font-bold text-black uppercase tracking-tighter">SMASH PRECISION</div>
        <p className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400">
          © 2024 SMASH PRECISION. ENGINEERED SILENCE.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400 mb-2">OPERATIONS</span>
        <Link to="/locker" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Archive</Link>
        <Link to="/guide" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Tech Guide</Link>
        <Link to="/account" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Account</Link>
      </div>
      <div className="flex flex-col gap-4 md:items-end">
        <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400 mb-2">FOLLOW</span>
        <a href="#" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">Instagram</a>
        <a href="#" className="text-[11px] tracking-[0.1em] uppercase text-neutral-400 hover:text-black transition-opacity">X Laboratory</a>
      </div>
    </div>
  </footer>
);
