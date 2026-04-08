'use client';

export interface OrderItem {
  id: string;
  price: number;
  quantity: number;
  product: { name: string };
}
  
export interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: OrderItem[];
}

interface OrderRowProps {
  item: Order;
  onViewDetails: (order: Order) => void;
  getStatusColor: (status: string) => string;
}

export function OrderRow({ item, onViewDetails, getStatusColor }: OrderRowProps) {
  return (
    <div className="grid grid-cols-[200px_2fr_1fr_1fr_1fr_200px] gap-4 p-6 border-b border-neutral-50 items-center hover:bg-neutral-50 transition-colors">
      <span className="text-[11px] font-black font-mono break-all pr-4">{item.id}</span>
      <span className="text-[11px] font-medium">{item.user?.name || item.user?.email || "Unknown Entity"}</span>
      <span className="text-[10px] text-neutral-500 font-mono tracking-tighter">
        {new Date(item.createdAt).toLocaleDateString()}
      </span>
      <span className="text-[11px] font-black">${Number(item.totalAmount).toLocaleString()}</span>
      <div>
        <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-1 ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      <div className="flex justify-end gap-4 text-[8px] font-bold text-neutral-400 uppercase tracking-widest">
        <button onClick={() => onViewDetails(item)} className="hover:text-black hover:border-b hover:border-black transition-all">VIEW DETAILS</button>
      </div>
    </div>
  );
}
