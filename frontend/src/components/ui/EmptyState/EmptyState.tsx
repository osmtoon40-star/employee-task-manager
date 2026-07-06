import React from 'react';
import { cn } from '@/utils';
import { Inbox } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className = '',
  title,
  description,
  action,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#111827] border border-dashed border-neutral-200 dark:border-[#334155] rounded-lg',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 rounded-full bg-neutral-50 dark:bg-[#273449] flex items-center justify-center text-neutral-400 dark:text-[#94A3B8] mb-4">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-[#F8FAFC]">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-[#CBD5E1] max-w-xs mt-1 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
