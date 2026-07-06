import React from 'react';
import { cn } from '@/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-200 dark:bg-[#273449]',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'circular' && 'h-10 w-10 rounded-full',
        variant === 'rectangular' && 'h-24 w-full rounded-md',
        className
      )}
      {...props}
    />
  );
};

export default Skeleton;
