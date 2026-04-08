import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  href?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  href,
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-black text-white hover:bg-neutral-800",
    outline: "bg-transparent border border-neutral-200 text-black hover:border-black",
    ghost: "bg-transparent text-neutral-500 hover:text-black",
    danger: "bg-transparent text-red-700 hover:text-red-500",
    link: "bg-transparent text-black border-b border-black hover:opacity-70 pb-1 rounded-none",
  };

  const sizes = {
    sm: "px-3 py-1 text-[9px]",
    md: "px-6 py-3 text-[10px]",
    lg: "px-8 py-4 text-[11px]",
    icon: "p-0",
  };

  const classes = cn(
    baseStyles,
    variants[variant],
    variant !== 'link' && sizes[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? 'PROCESSING...' : children}
    </button>
  );
}
