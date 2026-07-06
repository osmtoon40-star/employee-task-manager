import React from 'react';
import { cn } from '@/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className = '',
  children,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-lg p-6 transition-all duration-200 shadow-sm dark:shadow-[0_18px_45px_rgba(2,6,23,0.28)]',
        hoverable && 'hover:shadow-md hover:border-neutral-300 dark:hover:border-[#475569] dark:hover:bg-[#1E293B] cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
