import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  href?: string; // If provided, renders as a Link
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
    outline: "bg-transparent border border-neutral-200 text-black hover:bg-neutral-50",
    ghost: "bg-transparent text-neutral-500 hover:text-black",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[9px]",
    md: "px-8 py-3 text-[10px]",
    lg: "px-11 py-4 text-[12px]",
    icon: "p-2",
  };

  const classes = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link to={href} className={classes}>
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
