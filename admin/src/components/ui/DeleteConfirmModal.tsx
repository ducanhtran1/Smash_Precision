'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, title, description, onCancel, onConfirm }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white p-8 max-w-sm w-full outline outline-1 outline-neutral-200 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-red-600 mb-2">{title}</h3>
        <p className="text-[12px] font-medium text-neutral-500 mb-8">{description}</p>
        <div className="flex justify-end gap-4">
          <button 
            onClick={onCancel} 
            className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black"
          >
            CANCEL
          </button>
          <button 
            onClick={onConfirm} 
            className="px-8 py-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition"
          >
            CONFIRM DEL
          </button>
        </div>
      </div>
    </div>
  );
}
