import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useDashboard from '@/hooks/useDashboard';
import useTasks from '@/hooks/useTasks';
import { DashboardMetrics, ProductivityTrends, TaskStatusChart, TeamWorkload } from '@/features/dashboard';
import { Button, Badge, Avatar } from '@/components/ui';
import { Plus, Download, RefreshCw, ChevronRight } from 'lucide-react';
import { formatDate } from '@/utils';
import { TASK_STATUS_LABELS } from '@/constants';

export const Dashboard: React.FC = () => {
  const { data, loading: dashLoading, error: dashError } = useDashboard();
  const { tasks, loading: tasksLoading, error: tasksError } = useTasks();
  const navigate = useNavigate();

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const handleExportReport = () => {
    const reportData = [
      ['Report Category', 'Count/Value'],
      ['Pending Tasks', '5'],
      ['In Progress Tasks', '3'],
      ['Completed Tasks', '5'],
      ['Cancelled Tasks', '2'],
      ['Total Active Tasks', '15']
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dashboard_report_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPriorityVariant = (p: string) => {
    switch (p) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'neutral';
    }
  };

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'completed': return 'success';
      case 'in_progress': return 'info';
      case 'pending': return 'warning';
      default: return 'neutral';
    }
  };

  // Recent tasks logic - show first 4 tasks
  const recentTasks = useMemo(() => {
    return tasks.slice(0, 4);
  }, [tasks]);

  const isLoading = dashLoading || tasksLoading || isRefreshing;
  const error = dashError || tasksError;

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="text-neutral-500 font-medium text-[13px]">Loading Task Workspace...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-200 dark:border-[#334155]">
        <div className="text-left space-y-1.5">
          <h1 className="text-[32px] leading-[38px] font-bold tracking-tight text-neutral-900 dark:text-[#F8FAFC]">
            Overview Dashboard
          </h1>
          <p className="text-[13px] text-neutral-500 dark:text-[#CBD5E1]">
            Track task progress, monitor team productivity and manage employees efficiently from one centralized workspace.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-1.5 text-neutral-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-1.5 text-neutral-500" />
            Export Report
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/tasks', { state: { openCreateModal: true } })}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      {data && <DashboardMetrics metrics={data.metrics} />}

      {/* Primary Content (Velocity & Status Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProductivityTrends />
        <TaskStatusChart />
      </div>

      {/* Recent Tasks Feed & Team Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks Column */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)] text-left flex flex-col justify-between">
          <div>
            <h3 className="text-[20px] font-semibold text-neutral-800 dark:text-[#F8FAFC] mb-6">
              Recent Tasks
            </h3>
            
            <div className="divide-y divide-neutral-100 dark:divide-[#334155]">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate('/tasks', { state: { viewTaskId: task.id } })}
                  className="group flex items-center justify-between py-4 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-[#1E293B] px-2 rounded-lg transition-all duration-150 ease-in-out"
                >
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="min-w-0 text-left">
                      <p className="text-[14px] font-semibold text-neutral-900 dark:text-[#F8FAFC] truncate group-hover:text-blue-600 dark:group-hover:text-[#93C5FD] transition-colors">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[12px] text-neutral-450 dark:text-[#94A3B8]">
                        <span className="font-medium">Due: {formatDate(task.dueDate)}</span>
                        <span className="text-neutral-300 dark:text-[#475569]">•</span>
                        <div className="flex items-center gap-1.5">
                          <Avatar name={task.assigneeName} size="xs" />
                          <span className="truncate">{task.assigneeName}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <Badge variant={getPriorityVariant(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant={getStatusVariant(task.status)}>
                      {TASK_STATUS_LABELS[task.status]}
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-[#94A3B8] transition-transform duration-150 group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team Workload */}
        <div className="lg:col-span-1">
          <TeamWorkload />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
