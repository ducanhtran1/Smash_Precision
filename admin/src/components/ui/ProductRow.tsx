'use client';

import { Edit2, Trash2 } from "lucide-react";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
}

interface ProductRowProps {
  item: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export function ProductRow({ item, onEdit, onDelete }: ProductRowProps) {
  const isStocked = item.stock > 10;
  const isLow = item.stock > 0 && item.stock <= 10;

  return (
    <div className="grid grid-cols-[80px_3fr_2fr_1fr_1fr_1fr_100px] gap-6 p-6 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors">
      <div className="w-16 h-16 bg-neutral-100 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl.split(',')[0]} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
        ) : (
          <span className="text-[8px] text-neutral-300 font-bold uppercase truncate px-1">No Image</span>
        )}
      </div>
      <div>
        <h4 className="text-[11px] font-black uppercase tracking-tight mb-1">{item.name}</h4>
        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest truncate w-48">{item.description}</p>
      </div>
      <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{item.category}</span>
      <span className="text-[12px] font-black">${Number(item.price).toLocaleString()}</span>
      <span className="text-[11px] text-neutral-600 font-medium">{item.stock} Units</span>
      <div>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 ${isStocked ? 'bg-neutral-100 text-black' :
          isLow ? 'bg-neutral-200 text-black' :
            'border border-neutral-200 text-neutral-400'
          }`}>
          {isStocked ? "IN STOCK" : isLow ? "LOW STOCK" : "OUT OF STOCK"}
        </span>
      </div>
      <div className="flex justify-end gap-3 text-neutral-300 relative z-10">
        <button type="button" onClick={() => onEdit(item)} className="hover:text-black cursor-pointer" title="Edit">
          <Edit2 size={14} />
        </button>
        <button type="button" onClick={(e) => onDelete(item.id, e)} className="hover:text-red-500 cursor-pointer" title="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
