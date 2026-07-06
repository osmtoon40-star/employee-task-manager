import React from 'react';
import { cn } from '@/utils';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Loader: React.FC<LoaderProps> = ({
  className = '',
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  };

  return (
    <div className={cn('flex items-center justify-center', className)} {...(props as any)}>
      <div
        className={cn(
          'animate-spin rounded-full border-neutral-200 border-t-blue-600 dark:border-[#334155] dark:border-t-[#60A5FA]',
          sizes[size]
        )}
      />
    </div>
  );
};

export default Loader;
