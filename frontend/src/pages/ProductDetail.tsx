import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductsContext';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();
  
  const product = products.find(p => p.id === id);

  if (loading) return <div className="pt-40 px-10 text-center uppercase tracking-widest text-[10px]">Loading Item Specs...</div>;
  if (!product) return <div className="pt-40 px-10">Product not found.</div>;

  return (
    <div className="pt-32 pb-20 px-10 max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        {/* Gallery Section */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="col-span-2 aspect-[4/5] bg-neutral-50 overflow-hidden">
            <img 
              className="w-full h-full object-cover grayscale brightness-95" 
              src={product.imageUrl} 
              alt={product.name}
            />
          </div>
          {/* Mock additional images */}
          <div className="aspect-square bg-neutral-50 overflow-hidden">
            <img 
              className="w-full h-full object-cover grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpM4njCbsB805A_LaTHzeGPPL_hosRqIyaYnxFjMcbrJT8vn1gaBzgjJjiBJSrBnEKZoMzivzzADhT1JY-CGF_hmNU7aJVGen1ZDtWoqm6N4_lJZgD0uliUR4usiUOU7a9rgFju5qK136G3jn_994I-GGp7L-fdJv211j3Bmfflkv8uYXR68xIesNbIc0rBG_Ay4gvqZ0jMUJhizxAJ14ZPtBwAc_BK9S3yb4tucUi_oPQx7Mx5wtRPjL5YQuA2sHMB8K1-PqhnME" 
              alt="Detail 1"
            />
          </div>
          <div className="aspect-square bg-neutral-50 overflow-hidden mt-12">
            <img 
              className="w-full h-full object-cover grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7DOoDNTo55gVtO_g3sok4nNGF5FV2xeSuP3_lRaoMarD6WLRodg4quyw9F_a2T3NQR5_qSs3HGd6KOEowvdYR_xwoIaIHEFz2p5-LYEtdWpzX5qP54RmjO_7R6RkZDEAQUj34bNauT7cJbqL24vQVx9mBgXo4uBG4f2IpeNBoec5XudnE_imkNHFTpP2QTkUbMGEUM54xXg0NRwSpKnQX6NjZRa_zc-ZeyIx-Eq_8P-z7-Fj_auvCAQhhllK_Sj28-S_Pva08w_0" 
              alt="Detail 2"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="sticky top-40 space-y-12">
            <header className="space-y-4">
              <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-neutral-500">
                {product.category.toUpperCase()} SERIES
              </p>
              <h1 className="text-6xl font-black tracking-tighter leading-none uppercase">
                {product.name}
              </h1>
              <p className="text-xl font-light text-neutral-600 max-w-md leading-relaxed">
                {product.description}
              </p>
            </header>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  addToCart(product);
                  navigate('/checkout');
                }}
                className="bg-black text-white py-4 px-12 text-[12px] font-bold tracking-[0.1em] hover:bg-neutral-800 transition-all"
              >
                ADD TO BAG
              </button>
              <button className="border border-neutral-200 text-black py-4 px-12 text-[12px] font-bold tracking-[0.1em] hover:bg-neutral-50 transition-all">
                FIND YOUR SPEC
              </button>
            </div>

            {/* Technical Specs */}
            <section className="pt-12 border-t border-neutral-100">
              <h3 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold mb-8">TECHNICAL DATA</h3>
              <div className="space-y-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-baseline py-2 border-b border-neutral-50">
                    <span className="text-[10px] tracking-widest uppercase text-neutral-500">{key}</span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
