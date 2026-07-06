import React from 'react';
import { cn } from '@/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-sm border border-transparent',
    secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 dark:bg-[#1E293B] dark:hover:bg-[#263449] dark:text-[#F8FAFC] border border-transparent',
    outline: 'border border-neutral-200 hover:bg-neutral-50 text-neutral-700 dark:border-[#334155] dark:bg-[#111827] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B]',
    ghost: 'hover:bg-neutral-50 text-neutral-700 dark:hover:bg-[#1E293B] dark:text-[#CBD5E1]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
