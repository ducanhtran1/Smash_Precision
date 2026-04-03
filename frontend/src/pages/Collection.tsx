import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';

const Collection = () => {
  const { category } = useParams<{ category: string }>();
  
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === category);

  return (
    <div className="pt-32 pb-24 px-10 max-w-screen-2xl mx-auto">
      <header className="mb-24 flex flex-col md:flex-row items-end justify-between gap-12">
        <div className="max-w-2xl">
          <span className="uppercase tracking-[0.2em] text-[10px] text-neutral-400 mb-4 block">
            Archive 01 // {category?.toUpperCase()}
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none mb-8">
            {category === 'all' ? 'The Archive' : category}
          </h1>
          <p className="text-lg text-neutral-600 max-w-md leading-relaxed">
            Engineered for the lateral demands of elite badminton. Minimalist architecture meets maximum kinetic energy return.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="w-24 h-[1px] bg-black mt-4 hidden lg:block"></div>
          <span className="uppercase tracking-widest text-[10px] font-bold">{filteredProducts.length} Results</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {filteredProducts.map((product, idx) => (
          <Link 
            key={product.id} 
            to={`/product/${product.id}`}
            className={idx % 2 === 1 ? "group cursor-pointer lg:mt-24" : "group cursor-pointer"}
          >
            <div className="aspect-[3/4] overflow-hidden bg-neutral-50 mb-6 relative">
              <img 
                alt={product.name} 
                className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-105 transition-transform duration-700" 
                src={product.imageUrl}
              />
              {product.isLimited && (
                <div className="absolute top-6 left-6">
                  <span className="bg-black text-white px-3 py-1 text-[8px] uppercase tracking-[0.3em] font-bold">Limited Edition</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-black group-hover:underline underline-offset-4 decoration-1">
                  {product.name}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">{product.subCategory}</p>
              </div>
              <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collection;
