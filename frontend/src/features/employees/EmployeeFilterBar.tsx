import React from 'react';
import { SearchBar } from '@/components/ui';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/utils';

export interface EmployeeFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  activeDepartment: string;
  onDepartmentSelect: (dept: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export const EmployeeFilterBar: React.FC<EmployeeFilterBarProps> = ({
  search,
  onSearchChange,
  activeDepartment,
  onDepartmentSelect,
  viewMode,
  onViewModeChange,
}) => {
  const departments = ['All', 'Engineering', 'Product Design', 'Management', 'Operations'];

  return (
    <div className="flex flex-col gap-4 bg-white dark:bg-[#111827] p-4 border border-neutral-200 dark:border-[#334155] rounded-lg shadow-sm dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search employees by name, email, or role..."
          className="max-w-md"
        />

        {/* View Toggle */}
        <div className="flex items-center border border-neutral-200 dark:border-[#334155] rounded-md p-1 bg-neutral-50 dark:bg-[#1E293B] shrink-0">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              'p-1.5 rounded transition-all cursor-pointer',
              viewMode === 'grid'
                ? 'bg-white dark:bg-[#111827] text-blue-600 dark:text-[#93C5FD] shadow-sm'
                : 'text-neutral-500 dark:text-[#94A3B8] hover:text-neutral-700 dark:hover:text-[#F8FAFC]'
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn(
              'p-1.5 rounded transition-all cursor-pointer',
              viewMode === 'list'
                ? 'bg-white dark:bg-[#111827] text-blue-600 dark:text-[#93C5FD] shadow-sm'
                : 'text-neutral-500 dark:text-[#94A3B8] hover:text-neutral-700 dark:hover:text-[#F8FAFC]'
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Department Chips */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-[#334155]">
        {departments.map((dept) => {
          const isActive = activeDepartment === dept;
          return (
            <button
              key={dept}
              onClick={() => onDepartmentSelect(dept)}
              className={cn(
                'px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer',
                isActive
                  ? 'bg-blue-600 border-transparent text-white shadow-sm'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:bg-[#111827] dark:border-[#334155] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B]'
              )}
            >
              {dept}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeFilterBar;
