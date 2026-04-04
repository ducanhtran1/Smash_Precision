import React, { useState } from 'react';
import { useProducts } from '@/src/contexts/ProductsContext';
import { Link } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';

const SearchResults = () => {
  const [query, setQuery] = useState('');
  const { products, loading } = useProducts();
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) return <div className="pt-40 px-10 text-center uppercase tracking-widest text-[10px]">Loading Interface...</div>;

  return (
    <main className="pt-32 pb-24 px-10 max-w-screen-2xl mx-auto min-h-screen">
      <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-3xl">
          <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-neutral-400 mb-4">Search the Archive:</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
            {query || 'EXPLORE'}
          </h1>
        </div>
        <div className="flex items-center gap-4 border-b border-black/20 pb-2 w-full md:w-64">
          <SearchIcon size={16} className="opacity-40" />
          <input 
            className="bg-transparent border-none focus:ring-0 font-sans text-[11px] tracking-[0.1em] uppercase w-full placeholder:text-neutral-400" 
            placeholder="REFINE SEARCH" 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex items-center justify-between mb-16">
        <span className="font-sans text-[11px] tracking-[0.1em] uppercase opacity-60">{filteredProducts.length.toString().padStart(2, '0')} ARCHIVE ITEMS FOUND</span>
      </div>

      <section className="flex flex-col gap-0 border-t border-neutral-100">
        {filteredProducts.map((product) => (
          <Link 
            key={product.id}
            to={`/product/${product.id}`}
            className="group grid grid-cols-1 md:grid-cols-[200px_1fr_150px] gap-10 py-12 items-center border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-500"
          >
            <div className="aspect-square bg-neutral-100 overflow-hidden">
              <img className="w-full h-full object-cover grayscale brightness-110 group-hover:scale-105 transition-transform duration-700" src={product.imageUrl} alt={product.name} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-neutral-400">{product.category} / {product.subCategory}</span>
              <h3 className="text-2xl font-bold tracking-tight uppercase">{product.name}</h3>
              <p className="text-neutral-500 max-w-xl">{product.description}</p>
            </div>
            <div className="flex flex-col items-start md:items-end justify-between h-full gap-4">
              <span className="text-xl font-bold tracking-tight">${product.price.toFixed(2)}</span>
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase font-black border-b-2 border-black pb-0.5 group-hover:opacity-50 transition-opacity">Details</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
};

export default SearchResults;
