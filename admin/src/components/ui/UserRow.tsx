'use client';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string | null;
  isActive: boolean | null;
}

interface UserRowProps {
  item: User;
  onToggleStatus: (id: string, currentStatus: boolean | null) => void;
}

export function UserRow({ item, onToggleStatus }: UserRowProps) {
  const isActive = item.isActive !== false; // Default to active if null
  const userClass = item.role || "STANDARD";
  
  return (
    <div className={`grid grid-cols-[2fr_2fr_1fr_1fr_1fr_150px] gap-6 p-8 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors ${!isActive ? 'opacity-60 grayscale' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-800 flex items-center justify-center text-white text-[10px]">
          {item.name ? item.name.substring(0, 2).toUpperCase() : "?"}
        </div>
        <span className="text-[12px] font-black leading-tight w-24 truncate">{item.name || "UNNAMED"}</span>
      </div>
      <span className="text-[11px] text-neutral-500 font-medium truncate">{item.email}</span>
      <span className="text-[10px] text-neutral-400 font-mono tracking-tighter">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
      <div>
        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 border ${userClass === 'admin' ? 'border-black text-black' : 'border-neutral-300 text-neutral-400'}`}>
          {userClass}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-1 h-1 ${isActive ? 'bg-black' : 'bg-red-500'}`} />
        <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-black' : 'text-red-500'}`}>
          {isActive ? 'ACTIVE' : 'SUSPENDED'}
        </span>
      </div>
      <div className="flex justify-end gap-6 text-[9px] font-bold uppercase tracking-widest">
        <button onClick={() => onToggleStatus(item.id, item.isActive)} className="text-red-700 hover:text-red-500 transition-colors">
          {isActive ? "SUSPEND" : "REACTIVATE"}
        </button>
      </div>
    </div>
  );
}
