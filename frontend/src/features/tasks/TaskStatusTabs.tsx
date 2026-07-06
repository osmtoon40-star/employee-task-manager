import React from 'react';
import { Task, TaskStatus } from '@/types';
import { cn } from '@/utils';

type FilterValue = TaskStatus | 'all';

interface Tab {
  value: FilterValue;
  label: string;
}

const TABS: Tab[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface TaskStatusTabsProps {
  tasks: Task[];
  active: FilterValue;
  onChange: (val: FilterValue) => void;
}

export const TaskStatusTabs: React.FC<TaskStatusTabsProps> = ({ tasks, active, onChange }) => {
  const counts: Record<FilterValue, number> = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    cancelled: tasks.filter(t => t.status === 'cancelled').length,
  };

  return (
    <div
      className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-[#111827] rounded-lg border border-neutral-200 dark:border-[#334155] w-fit"
      role="tablist"
      aria-label="Filter tasks by status"
    >
      {TABS.map(({ value, label }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(value)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 cursor-pointer whitespace-nowrap',
              isActive
                ? 'bg-white dark:bg-[#1E293B] text-neutral-900 dark:text-[#F8FAFC] shadow-sm border border-neutral-200 dark:border-[#334155]'
                : 'text-neutral-500 dark:text-[#94A3B8] hover:text-neutral-800 dark:hover:text-[#F8FAFC] hover:bg-white/60 dark:hover:bg-[#334155]'
            )}
          >
            {label}
            <span
              className={cn(
                'text-[11px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center tabular-nums transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-200 dark:bg-[#273449] text-neutral-500 dark:text-[#CBD5E1]'
              )}
            >
              {counts[value]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatusTabs;
