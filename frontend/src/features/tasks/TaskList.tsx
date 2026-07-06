import React, { useState } from 'react';
import { Table, Badge, Avatar, Pagination } from '@/components/ui';
import { Task } from '@/types';
import { TASK_STATUS_LABELS } from '@/constants';
import { formatDate } from '@/utils';
import { Eye, Edit2, Trash2 } from 'lucide-react';

export interface TaskListProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onView, onEdit, onDelete }) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(tasks.length / itemsPerPage));

  const paginatedTasks = tasks.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getPriorityVariant = (p: Task['priority']) => {
    switch (p) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusVariant = (s: Task['status']) => {
    switch (s) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      default: return 'neutral'; // cancelled
    }
  };

  return (
    <div className="space-y-4">
      <Table headers={['Task Title', 'Assigned Employee', 'Priority', 'Status', 'Due Date', 'Actions']}>
        {paginatedTasks.map((task) => (
          <tr 
            key={task.id} 
            className="hover:bg-neutral-50/50 dark:hover:bg-[#1E293B] transition-colors duration-150"
          >
            <td className="px-6 py-4">
              <div className="text-left">
                <p className="font-semibold text-neutral-900 dark:text-[#F8FAFC]">
                  {task.title}
                </p>
                <p className="text-xs text-neutral-450 dark:text-[#94A3B8] mt-0.5 line-clamp-1 max-w-md">
                  {task.description}
                </p>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Avatar name={task.assigneeName} size="sm" />
                <span className="text-sm font-medium text-neutral-700 dark:text-[#CBD5E1]">
                  {task.assigneeName}
                </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant={getPriorityVariant(task.priority)}>
                {task.priority}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant={getStatusVariant(task.status)}>
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-550 dark:text-[#94A3B8]">
              {formatDate(task.dueDate)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <div className="flex items-center justify-end gap-2.5">
                <button 
                  onClick={() => onView(task)} 
                  title="View Task"
                  className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:text-green-700 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/20 dark:hover:bg-emerald-500/15 w-8 h-8 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onEdit(task)} 
                  title="Edit Task"
                  className="bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/20 dark:hover:bg-blue-500/15 w-8 h-8 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => onDelete(task)} 
                  title="Delete Task"
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/20 dark:hover:bg-rose-500/15 w-8 h-8 rounded-full transition-all duration-150 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default TaskList;
