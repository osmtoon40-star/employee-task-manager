import React from 'react';
import { SearchBar, Button } from '@/components/ui';
import { TaskPriority } from '@/types';
import { Download, Plus } from 'lucide-react';

export interface TaskFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  priority: TaskPriority | 'all';
  onPriorityChange: (val: TaskPriority | 'all') => void;
  onExport: () => void;
  onCreateTask: () => void;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  search,
  onSearchChange,
  priority,
  onPriorityChange,
  onExport,
  onCreateTask
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#111827] px-4 py-3 border border-neutral-200 dark:border-[#334155] rounded-lg shadow-sm dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)]">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <SearchBar
          value={search}
          onChange={onSearchChange}
          placeholder="Search by task, employee, status..."
          className="max-w-sm"
        />

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as any)}
          className="px-3 py-2.5 text-[13px] bg-white dark:bg-[#111827] border border-neutral-300 dark:border-[#334155] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-neutral-700 dark:text-[#CBD5E1] w-full sm:w-auto cursor-pointer hover:border-neutral-400 dark:hover:border-[#475569] transition-all"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-1.5" />
          Export CSV
        </Button>
        <Button variant="primary" size="sm" onClick={onCreateTask}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Task
        </Button>
      </div>
    </div>
  );
};

export default TaskFilterBar;
