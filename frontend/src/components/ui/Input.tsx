import React from 'react';
import { cn } from '@/src/lib/utils';

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
      outline: "bg-neutral-50 border border-neutral-200 focus:border-black py-4 pr-4 rounded-none",
      underline: "bg-transparent border-0 border-b border-neutral-200 focus:border-black py-2 px-0"
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
              "w-full text-sm text-black placeholder:text-neutral-400 outline-none transition-colors focus:ring-0",
              variants[variant],
              icon ? "pl-12" : (variant === 'outline' ? "pl-4" : ""),
              error && "border-red-500 text-red-600",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-[10px] text-red-500 font-bold tracking-wider">[ERROR] {error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
