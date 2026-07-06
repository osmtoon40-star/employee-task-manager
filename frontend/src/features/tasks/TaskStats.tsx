import React from 'react';
import { Card, Charts, Badge, Avatar } from '@/components/ui';
import { Task } from '@/types';
import { formatDate } from '@/utils';
import { CheckCircle } from 'lucide-react';

export interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks }) => {
  // 1. Calculate Priority distribution
  const priorityCount = tasks.reduce(
    (acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0, urgent: 0 } as Record<Task['priority'], number>
  );

  // 2. Sprint progress
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // 3. Upcoming deadlines (sorted by date)
  const deadlines = [...tasks]
    .filter(t => t.status !== 'completed' && t.status !== 'cancelled')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  // 4. Task completion trends (mock historical chart)
  const completionData = [
    { name: 'Mon', completed: 4 },
    { name: 'Tue', completed: 8 },
    { name: 'Wed', completed: 5 },
    { name: 'Thu', completed: 11 },
    { name: 'Fri', completed: 14 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sprint Progress & Priority Distribution */}
      <Card className="flex flex-col justify-between p-6">
        <div className="text-left">
          <h4 className="text-[15px] font-semibold text-neutral-800 dark:text-[#F8FAFC] mb-4">Sprint Delivery & Health</h4>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-[#334155]">
            <div>
              <p className="text-sm font-medium text-neutral-500">Tasks Completed</p>
              <p className="text-2xl font-bold mt-1 text-neutral-900 dark:text-[#F8FAFC]">{completedCount} / {totalTasks}</p>
            </div>
            <div className="relative w-12 h-12 rounded-full bg-blue-50 dark:bg-[#1E293B] flex items-center justify-center border border-blue-100 dark:border-[#334155]">
              <span className="text-xs font-bold text-blue-600 dark:text-[#93C5FD]">{progressPercent}%</span>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-2 text-left">
          <p className="text-xs font-semibold text-neutral-450 dark:text-[#94A3B8] uppercase tracking-wider">Priority Spread</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 justify-between bg-neutral-50 dark:bg-[#1E293B] p-2 rounded">
              <span className="text-neutral-500">Urgent</span>
              <span className="font-bold text-red-650">{priorityCount.urgent}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-between bg-neutral-50 dark:bg-[#1E293B] p-2 rounded">
              <span className="text-neutral-500">High</span>
              <span className="font-bold text-amber-650">{priorityCount.high}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-between bg-neutral-50 dark:bg-[#1E293B] p-2 rounded">
              <span className="text-neutral-500">Medium</span>
              <span className="font-bold text-blue-600">{priorityCount.medium}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-between bg-neutral-50 dark:bg-[#1E293B] p-2 rounded">
              <span className="text-neutral-500">Low</span>
              <span className="font-bold text-neutral-500">{priorityCount.low}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Completion Trends Chart */}
      <Charts
        title="Completion Velocity (Daily)"
        data={completionData}
        type="bar"
        dataKeys={['completed']}
        colors={['#60A5FA']}
        className="lg:col-span-1"
      />

      {/* Upcoming Deadlines Widget */}
      <Card className="p-6">
        <h4 className="text-[15px] font-semibold text-neutral-800 dark:text-[#F8FAFC] mb-4 text-left">Upcoming Deadlines</h4>
        <div className="space-y-3.5">
          {deadlines.length > 0 ? (
            deadlines.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-3 text-sm pb-2 border-b border-neutral-100 dark:border-[#334155] last:border-0 last:pb-0">
                <div className="space-y-0.5 max-w-[70%] text-left">
                  <p className="font-semibold text-neutral-800 dark:text-[#F8FAFC] truncate">{task.title}</p>
                  <div className="flex items-center gap-1.5">
                    <Avatar name={task.assigneeName} size="sm" className="w-5 h-5 text-[9px]" />
                    <span className="text-xs text-neutral-550 dark:text-[#94A3B8] truncate">{task.assigneeName}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant={task.priority === 'urgent' || task.priority === 'high' ? 'danger' : 'neutral'}>
                    {formatDate(task.dueDate)}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center text-neutral-400">
              <CheckCircle className="w-8 h-8 mb-2 text-green-600" />
              <p className="text-xs font-semibold">All Tasks Completed!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TaskStats;
