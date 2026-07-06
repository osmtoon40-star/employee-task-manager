import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/utils';

export interface SearchBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onChange: (val: string) => void;
  onSearch?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  ...props
}) => {
  return (
    <div className={cn('relative w-full max-w-md', className)} {...(props as any)}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 dark:text-[#94A3B8]">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && onSearch) {
            onSearch();
          }
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-[#111827] border border-neutral-300 dark:border-[#334155] rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 dark:focus:border-[#60A5FA] placeholder-neutral-400 dark:placeholder-[#94A3B8] text-neutral-900 dark:text-[#F8FAFC] hover:border-neutral-400 dark:hover:border-[#475569]"
      />
    </div>
  );
};

export default SearchBar;
