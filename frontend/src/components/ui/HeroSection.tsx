import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export function HeroSection() {
  return (
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
          PERFORMANCE<br />IN MONOCHROME.
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
          src="https://res.cloudinary.com/dhachayhw/image/upload/q_auto/f_auto/v1775475293/racket_4k_pwjesv.jpg"
        />
      </div>
    </section>
  );
}
