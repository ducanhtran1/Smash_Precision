import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { HeroSection } from '@/src/components/ui/HeroSection';

const Home = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <HeroSection />

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
              { title: 'Rackets', tag: 'Technical Core', img: 'https://res.cloudinary.com/dhachayhw/image/upload/q_auto/f_auto/v1775475293/CLP_All_Badminton_Racquets_Banner_Mobile_bam9ba.webp' },
              { title: 'Footwear', tag: 'Kinetic Support', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvYfKlTnh781rd_UnYNVq8hYp9z5tUm8t0jxzAQdhsAuUkGHre66chlxs10Rtd_KLdCcl08ebC0QoLvfWxVrh3S9QW5e1rg0vUHj84vXn8k3w4P_NgHG0udbnEB5z84RNvYF8SavGfJomdHFZITdRU978-unEI3LK2oUMmRq30N3YxBl4fTjIuYWtEqgOT4_wh1N4aNNTlEMRjekxkS1Ldp0mTGRMlgyu1fG65P2bdhmIjIrK5Re0L3jheFHQEmC7lSjzLB7nKzKc' },
              { title: 'Shuttlecocks', tag: 'Aero Dynamics', img: 'https://res.cloudinary.com/dhachayhw/image/upload/q_auto/f_auto/v1775475293/badminton-shuttle-sport-bat_kwjakh.jpg' }
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
      {/* Contact Section */}
      <section className="py-40 px-10 bg-black text-white text-center">
        <div className="max-w-screen-2xl mx-auto flex flex-col items-center">
          <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-neutral-400 mb-8 block">02 / 03 OPERATIONS</span>
          <h2 className="text-[clamp(2.5rem,6vw,4rem)] font-black tracking-tighter uppercase leading-tight mb-12">
            CONNECT WITH US
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-5xl mt-10">
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">Email HQ</span>
              <a href="mailto:tdanhaltt18@gmail.com" className="text-sm font-medium tracking-wide hover:text-neutral-300 transition-colors">tdanhaltt18@gmail.com</a>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">Direct Line</span>
              <a href="tel:0965316967" className="text-sm font-medium tracking-wide hover:text-neutral-300 transition-colors">0965316967</a>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">Laboratory Location</span>
              <span className="text-sm font-medium tracking-wide leading-relaxed">Dinh Cong street, Hoang Mai district<br />Ha Noi, Viet Nam</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-500 mb-4">Social</span>
              <a href="https://www.facebook.com/ducanhnew" target="_blank" rel="noopener noreferrer" className="text-sm font-medium tracking-wide hover:text-neutral-300 transition-colors border-b border-white pb-1">Facebook</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
