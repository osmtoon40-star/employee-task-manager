import React from 'react';
import { cn } from '@/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  className = '',
  variant = 'neutral',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide';
  const variants = {
    success: 'bg-green-50 text-green-700 dark:bg-emerald-500/10 dark:text-emerald-300 border border-green-200/50 dark:border-emerald-400/20',
    warning: 'bg-orange-50 text-orange-700 dark:bg-amber-500/10 dark:text-amber-300 border border-orange-200/50 dark:border-amber-400/20',
    danger: 'bg-red-50 text-red-700 dark:bg-rose-500/10 dark:text-rose-300 border border-red-200/50 dark:border-rose-400/20',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 border border-blue-200/50 dark:border-blue-400/20',
    neutral: 'bg-neutral-50 text-neutral-600 dark:bg-[#273449] dark:text-[#CBD5E1] border border-neutral-200/50 dark:border-[#334155]',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
