import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col md:flex-row items-center px-10 gap-20 overflow-hidden">
        <div className="z-10 w-full md:w-1/2 flex flex-col justify-center">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-8 block"
          >
            EST. 2024 / PRECISION SERIES
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.9] tracking-tighter text-black mb-8"
          >
            PERFORMANCE<br/>IN MONOCHROME.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-neutral-600 max-w-md mb-12 leading-relaxed"
          >
            The purest equipment for the competitive court. Engineered with mathematical silence to eliminate distraction and amplify every smash.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6"
          >
            <Link 
              to="/collections/all"
              className="bg-black text-white px-11 py-4 text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-neutral-800 text-center"
            >
              SHOP COLLECTION
            </Link>
            <Link 
              to="/guide"
              className="bg-transparent border border-neutral-200 text-black px-11 py-4 text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-neutral-50 text-center"
            >
              OUR PHILOSOPHY
            </Link>
          </motion.div>
        </div>
        
        <div className="relative w-full md:w-1/2 h-[600px] md:h-screen flex items-center justify-center">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] font-black text-[153px] opacity-[0.03] select-none pointer-events-none">
            PRECISION
          </div>
          <motion.img 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            alt="Minimalist Carbon Fiber Racket" 
            className="w-full h-full object-contain grayscale mix-blend-multiply" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkX8MKWpeYuwKkL1eQ-53Cdm8PJyNbJYeAV-cMLhrRFJOqMX99-8Qcl9_3_y-ocDWCAyj228GGj3t0qxaXrp1ZqRzdFhBa8NnEeNmGgvfbawjDw7JGctO02oyOT-uOvB8ZCNN0-sHPVbjKn87e3LNsHWotRU0FgMvdSGXG6_s8JDKYl9GF9DjrBXT_bjHRo_CkWaG_nQb7Bye4k1yrCdz7z0Dp6yo4_W_lqZk3WuHXz7mWnv5fH86HCUQabJSqJU7Pd6fb_odPG0E"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-neutral-50 py-40 px-10">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-4xl font-black tracking-tighter uppercase">Categories</h2>
            <div className="h-[1px] bg-neutral-200 flex-grow mx-10 hidden md:block"></div>
            <span className="font-sans text-[11px] tracking-[0.1em] uppercase text-neutral-400">01 / 03 SERIES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[
              { title: 'Rackets', tag: 'Technical Core', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxgqfGbnOw9O0yN9Sy_ni_5pFQHCen2jSM1Fhc1SLUkrxtC3O0xgrMuAAmJjUo_Cz2zRJ3ql531lIU09rXYzYlaO5HEM4oAXO-12Zj16r1pWtVmUd_xrywN4Fm7PzQbX2TcXzY47muieGHuPvOZV7kM7q-4P_lVA5o-4SBUHwBETIl724sXK_UYuo-7MTIpmw0SFR6fR6q_hRHTqFQB2fyWynAzDpL6NqJSUgbSo5gAD-RHPDJ-48g6WpKrbQ896zm5QcVdaa4uMg' },
              { title: 'Footwear', tag: 'Kinetic Support', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvYfKlTnh781rd_UnYNVq8hYp9z5tUm8t0jxzAQdhsAuUkGHre66chlxs10Rtd_KLdCcl08ebC0QoLvfWxVrh3S9QW5e1rg0vUHj84vXn8k3w4P_NgHG0udbnEB5z84RNvYF8SavGfJomdHFZITdRU978-unEI3LK2oUMmRq30N3YxBl4fTjIuYWtEqgOT4_wh1N4aNNTlEMRjekxkS1Ldp0mTGRMlgyu1fG65P2bdhmIjIrK5Re0L3jheFHQEmC7lSjzLB7nKzKc' },
              { title: 'Shuttlecocks', tag: 'Aero Dynamics', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnPeu8HoeLQoOBGfnFY6NuzsihyC2_f5TUb54shmh6P1O6uJbg-r8czsbMhcrDwns2AQGiO1KCl8UxPbdMJ4lJj31VymY1YKqi6rZwiSJnHLWOY5JiRArpnk5VaKUylCK6QOpJcSyr-juGg-XVpqW7pYIzt1t-xixdSKFiL0Oqq_25y0w4D8_C37cPUOgTeZH2VWSpiUuDvJnzLuwSI0S8RkjaY8OkH92Cv4jpqvdhyrX3dc-gqd9Vyc9MW50PMBgxRvrK3VNmYVs' }
            ].map((cat) => (
              <Link 
                key={cat.title}
                to={`/collections/${cat.title.toLowerCase()}`}
                className="group relative aspect-[3/4] bg-white overflow-hidden"
              >
                <img 
                  alt={cat.title} 
                  className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                  src={cat.img}
                />
                <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/40 to-transparent">
                  <span className="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase mb-2">{cat.tag}</span>
                  <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">{cat.title}</h3>
                  <div className="w-0 group-hover:w-full h-[2px] bg-white transition-all duration-500 mt-4"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-40 px-10 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 aspect-video bg-neutral-100 overflow-hidden">
            <img 
              alt="Carbon Detail" 
              className="w-full h-full object-cover grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy5MPkxkMRVyH4CyjNwsg3CleMKdhmFsgvAU_1BZLBRLaFmw_nH6GhIlawzeqSb9Bd0mgM2yB5Czh0jigvnPctglPQSs8jUfkrqxhzvfJdRF2RzJagfoLBkiuU-IOi0yt-oFH9kjpni_yVuL4awjzA_oDPqCUhPjbn4JUi79wtVe8Of2g2DjKV_vxFYPoAiMSeWit9SKiSb2SLLn09wI1Kw7xOhf4P8C8CaYVBVTwczS-pT6mP9V_XVqNfVRp4hmIYwmdgBvM5Mzg"
            />
          </div>
          <div className="md:col-span-5 md:pl-20">
            <h4 className="text-sm font-bold tracking-[0.3em] uppercase text-neutral-400 mb-6">Material Science</h4>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-tight mb-8">
              The Silence of High-Modulus Carbon.
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-10">
              Our proprietary frames use a zero-vibration composite that allows for unprecedented feedback. Every touch is felt. Every smash is pure.
            </p>
            <Link to="/guide" className="inline-flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 border-black pb-2">
              View Technical Specs
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
