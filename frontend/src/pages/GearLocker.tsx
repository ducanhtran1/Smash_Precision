import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../types';
import { products } from '../data/products';
import { handleFirestoreError, OperationType } from '../lib/error-handler';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const GearLocker = () => {
  const { user } = useAuth();
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'wishlists', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setSavedProductIds(docSnap.data().productIds || []);
      }
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `wishlists/${user.uid}`);
    });
    return () => unsub();
  }, [user]);

  const removeProduct = async (productId: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'wishlists', user.uid), {
        productIds: arrayRemove(productId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `wishlists/${user.uid}`);
    }
  };

  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  if (!user) return <div className="pt-40 text-center uppercase text-[10px] tracking-widest">Please sign in to access your locker.</div>;

  return (
    <main className="pt-32 pb-40 px-6 md:px-10 max-w-screen-2xl mx-auto">
      <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-neutral-400">Archived Selections</span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none uppercase">YOUR GEAR LOCKER</h1>
        </div>
        <div className="flex gap-4">
          <span className="font-sans text-[11px] tracking-[0.1em] uppercase border-b border-black pb-1">Items ({savedProducts.length.toString().padStart(2, '0')})</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-20">
        {savedProducts.map((product) => (
          <article key={product.id} className="group relative bg-white">
            <div className="aspect-[3/4] overflow-hidden bg-neutral-50 mb-6 relative">
              <img alt={product.name} className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105" src={product.imageUrl} />
              <button 
                onClick={() => removeProduct(product.id)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
            <div className="px-2 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold tracking-tight uppercase leading-tight">{product.name}</h3>
                  <p className="text-[10px] tracking-widest text-neutral-500 uppercase mt-1">{product.subCategory}</p>
                </div>
                <span className="text-sm font-light">${product.price.toFixed(2)}</span>
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <Link to={`/product/${product.id}`} className="w-full py-4 bg-black text-white text-center font-sans text-[11px] tracking-widest uppercase hover:bg-neutral-800 transition-colors">VIEW ITEM</Link>
                <button 
                  onClick={() => removeProduct(product.id)}
                  className="w-full py-4 border border-neutral-100 text-black font-sans text-[11px] tracking-widest uppercase hover:bg-neutral-50 transition-colors"
                >
                  REMOVE
                </button>
              </div>
            </div>
          </article>
        ))}
        {savedProducts.length === 0 && !loading && (
          <div className="col-span-full py-40 text-center text-neutral-400 uppercase text-[10px] tracking-widest">
            Your locker is empty. Explore the archive to add gear.
          </div>
        )}
      </div>
    </main>
  );
};

export default GearLocker;
