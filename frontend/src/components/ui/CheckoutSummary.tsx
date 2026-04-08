import React from 'react';
import { Verified } from 'lucide-react';
import { Button } from './Button';

interface CheckoutSummaryProps {
  total: number;
  itemsLength: number;
  loading: boolean;
  formId: string;
}

export function CheckoutSummary({ total, itemsLength, loading, formId }: CheckoutSummaryProps) {
  return (
    <div className="sticky top-40 bg-white p-12 space-y-10 border border-neutral-100">
      <h2 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold border-b border-neutral-100 pb-6">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-500 uppercase tracking-wider">Subtotal</span>
          <span className="font-medium">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-neutral-500 uppercase tracking-wider">Shipping</span>
          <span className="font-medium">FREE</span>
        </div>
      </div>
      <div className="pt-6 border-t border-black flex justify-between items-baseline">
        <span className="text-xl font-bold uppercase tracking-tighter">Total</span>
        <span className="text-4xl font-black tracking-tighter">${total.toFixed(2)}</span>
      </div>
      <div className="space-y-4 pt-10">
        <Button
          type="submit"
          form={formId}
          disabled={loading || itemsLength === 0}
          fullWidth
          size="lg"
          isLoading={loading}
        >
          Proceed to Payment
        </Button>
        <p className="text-[9px] text-center text-neutral-400 uppercase tracking-widest leading-relaxed">
          By clicking "Complete Purchase", you agree to our terms of engineering and shipping protocols.
        </p>
      </div>
      <div className="pt-20">
        <div className="bg-neutral-50 p-6 flex items-start gap-4">
          <Verified size={20} className="text-neutral-400" />
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-1">Authenticity Guaranteed</h4>
            <p className="text-[10px] text-neutral-500 leading-relaxed uppercase tracking-tight">Every component is engineered and verified at our central lab prior to dispatch.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
