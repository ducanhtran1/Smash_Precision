import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  variant?: 'outline' | 'underline';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = true, icon, variant = 'outline', ...props }, ref) => {
    
    const variants = {
      outline: "bg-white border border-neutral-200 focus:border-black p-3 rounded-none w-full text-sm font-medium",
      underline: "bg-transparent border-0 border-b border-neutral-200 focus:border-black py-2 px-0 w-full text-[11px] font-bold tracking-widest uppercase"
    };

    return (
      <div className={cn("flex flex-col gap-2", fullWidth && "w-full")}>
        {label && (
          <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center text-neutral-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "text-black placeholder:text-neutral-300 outline-none transition-colors focus:ring-0",
              variants[variant],
              icon ? "pl-12" : (variant === 'outline' ? "px-3" : ""),
              error && "border-red-500 text-red-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-[10px] text-red-500 font-bold tracking-wider uppercase mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
