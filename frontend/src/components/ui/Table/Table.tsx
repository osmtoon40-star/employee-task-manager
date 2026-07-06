import React from 'react';
import { cn } from '@/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  headers: string[];
}

export const Table: React.FC<TableProps> = ({
  className = '',
  headers,
  children,
  ...props
}) => {
  return (
    <div className="w-full overflow-x-auto border border-neutral-200 dark:border-[#334155] rounded-lg shadow-sm dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)]">
      <table className={cn('min-w-full divide-y divide-neutral-200 dark:divide-[#334155] text-left', className)} {...props}>
        <thead className="bg-neutral-50 dark:bg-[#1E293B] sticky top-0">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-6 py-3.5 text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1] uppercase tracking-wider select-none"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#111827] divide-y divide-neutral-100 dark:divide-[#334155] text-sm text-neutral-700 dark:text-[#CBD5E1]">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
