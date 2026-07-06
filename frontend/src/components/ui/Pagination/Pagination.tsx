import React from 'react';
import { cn } from '@/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../Button';

export interface PaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  className = '',
  currentPage,
  totalPages,
  onPageChange,
  ...props
}) => {
  return (
    <div className={cn('flex items-center justify-between py-4 bg-white dark:bg-[#111827] border-t border-neutral-200 dark:border-[#334155] px-6', className)} {...(props as any)}>
      <span className="text-[13px] text-neutral-550 dark:text-[#94A3B8]">
        Page <span className="font-semibold text-neutral-700 dark:text-[#CBD5E1]">{currentPage}</span> of{' '}
        <span className="font-semibold text-neutral-700 dark:text-[#CBD5E1]">{totalPages}</span>
      </span>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="w-4 h-4 mr-1 shrink-0" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1 shrink-0" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
