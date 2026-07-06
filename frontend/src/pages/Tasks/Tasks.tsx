import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useTasks from '@/hooks/useTasks';
import useEmployees from '@/hooks/useEmployees';
import { TaskFilterBar, TaskList, TaskStatusTabs } from '@/features/tasks';
import { Modal, Button } from '@/components/ui';
import { TaskStatus, TaskPriority, Task } from '@/types';
import { useForm } from 'react-hook-form';
import { Calendar, User, Info, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils';

interface TaskFormInput {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  assigneeName: string;
}

export const Tasks: React.FC = () => {
  const { tasks, loading, error, setTasks } = useTasks();
  const { employees } = useEmployees();
  const location = useLocation();
  const navigate = useNavigate();
  const routeState = location.state as { openCreateModal?: boolean; filterStatus?: TaskStatus; viewTaskId?: string } | null;

  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>(routeState?.filterStatus || 'all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(() => Boolean(routeState?.openCreateModal));
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const { register, handleSubmit, reset, formState: { errors, touchedFields } } = useForm<TaskFormInput>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'pending',
      assigneeName: ''
    }
  });

  const [pendingViewTaskId, setPendingViewTaskId] = useState<string | null>(null);

  // Open modal or filter if redirected from Dashboard with state
  useEffect(() => {
    if (routeState) {
      if (routeState.openCreateModal) {
        setEditingTask(null);
        reset({
          title: '',
          description: '',
          dueDate: new Date().toISOString().split('T')[0],
          priority: 'medium',
          status: 'pending',
          assigneeName: ''
        });
        setIsFormModalOpen(true);
      }
      if (routeState.filterStatus) {
        setStatusFilter(routeState.filterStatus);
      }
      if (routeState.viewTaskId) {
        setPendingViewTaskId(routeState.viewTaskId);
      }
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, navigate, reset, routeState]);

  // Open task detail viewer when tasks list resolves
  useEffect(() => {
    if (pendingViewTaskId && tasks.length > 0) {
      const foundTask = tasks.find(t => t.id === pendingViewTaskId);
      if (foundTask) {
        setViewingTask(foundTask);
      }
      setPendingViewTaskId(null);
    }
  }, [pendingViewTaskId, tasks]);

  // Open edit modal
  const handleEditOpen = (task: Task) => {
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
      assigneeName: task.assigneeName
    });
    setIsFormModalOpen(true);
  };

  // Open delete confirmation
  const handleDeleteOpen = (task: Task) => {
    setDeletingTask(task);
  };

  // Handle delete confirm
  const handleDeleteConfirm = () => {
    if (deletingTask) {
      setTasks(prev => prev.filter(t => t.id !== deletingTask.id));
      setDeletingTask(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Task Title', 'Status', 'Priority', 'Assignee', 'Due Date'],
      ...filteredTasks.map((t) => [t.title, t.status, t.priority, t.assigneeName, t.dueDate])
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_export_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onSubmit = (data: TaskFormInput) => {
    if (editingTask) {
      // Edit mode
      setTasks(prev => prev.map(t => t.id === editingTask.id ? { ...t, ...data } : t));
    } else {
      // Create mode
      const selectedEmp = employees.find(e => e.name === data.assigneeName);
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        assigneeId: selectedEmp?.id || `emp-${Date.now()}`,
        assigneeName: data.assigneeName
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsFormModalOpen(false);
    setEditingTask(null);
    reset();
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const getInputClass = (fieldName: keyof TaskFormInput) => {
    const hasError = !!errors[fieldName];
    const isTouched = touchedFields[fieldName];
    return [
      'w-full px-3 py-2 text-sm bg-white dark:bg-[#111827] dark:text-[#F8FAFC] dark:placeholder-[#94A3B8] border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-all duration-150',
      hasError 
        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
        : isTouched 
          ? 'border-green-500 focus:border-green-600 focus:ring-green-500/20' 
          : 'border-neutral-200 dark:border-[#334155] focus:border-blue-600 dark:focus:border-[#60A5FA] focus:ring-blue-500/20'
    ].join(' ');
  };

  if (loading && !isFormModalOpen) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="text-neutral-500 font-medium animate-pulse-subtle">Loading Tasks Board...</span>
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

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Title Header */}
      <div className="text-left">
          <h1 className="text-[38px] leading-[44px] font-bold tracking-tight text-neutral-900 dark:text-[#F8FAFC]">
          Tasks Board
        </h1>
        <p className="text-base text-neutral-500 dark:text-[#CBD5E1] mt-1.5">
          Coordinate, track, and assign sprint deliverables across the operations pipeline.
        </p>
      </div>

      {/* Status filter tabs */}
      <TaskStatusTabs
        tasks={tasks}
        active={statusFilter}
        onChange={setStatusFilter}
      />

      {/* Filter controls */}
      <TaskFilterBar
        search={search}
        onSearchChange={setSearch}
        priority={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onExport={handleExport}
        onCreateTask={() => {
          setEditingTask(null);
          reset({
            title: '',
            description: '',
            dueDate: todayStr,
            priority: 'medium',
            status: 'pending',
            assigneeName: ''
          });
          setIsFormModalOpen(true);
        }}
      />

      {/* Roster table */}
      <TaskList 
        tasks={filteredTasks} 
        onView={(task) => setViewingTask(task)}
        onEdit={handleEditOpen}
        onDelete={handleDeleteOpen}
      />

      {/* Create/Edit Task Modal */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTask(null);
        }} 
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1]">Task Title</label>
            <input
              type="text"
              placeholder="e.g. Design review checklist"
              className={getInputClass('title')}
              {...register('title', { 
                required: 'Task title is required',
                minLength: { value: 3, message: 'Minimum length is 3 characters' },
                maxLength: { value: 80, message: 'Maximum length is 80 characters' }
              })}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5 text-left">
            <label className="block text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1]">Description</label>
            <textarea
              rows={3}
              placeholder="Provide context and dependencies..."
              className={getInputClass('description')}
              {...register('description', { 
                required: 'Description is required',
                maxLength: { value: 500, message: 'Maximum length is 500 characters' }
              })}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1]">Due Date</label>
              <input
                type="date"
                className={getInputClass('dueDate')}
                {...register('dueDate', { 
                  required: 'Due date is required',
                  validate: (val) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const selected = new Date(val);
                    selected.setHours(0, 0, 0, 0);
                    return selected >= today || 'Cannot select past dates';
                  }
                })}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1]">Priority</label>
              <select
                className={getInputClass('priority')}
                {...register('priority', { required: 'Priority is required' })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              {errors.priority && <p className="text-xs text-red-500 mt-1">{errors.priority.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1]">Status</label>
              <select
                className={getInputClass('status')}
                {...register('status', { required: 'Status is required' })}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {errors.status && <p className="text-xs text-red-500 mt-1">{errors.status.message}</p>}
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-[13px] font-semibold text-neutral-500 dark:text-[#CBD5E1]">Assign Employee</label>
              <select
                className={getInputClass('assigneeName')}
                {...register('assigneeName', { required: 'Assigned employee is required' })}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.name}>
                    {emp.name} ({emp.department})
                  </option>
                ))}
              </select>
              {errors.assigneeName && <p className="text-xs text-red-500 mt-1">{errors.assigneeName.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-[#334155]">
            <Button 
              variant="outline" 
              size="sm" 
              type="button"
              onClick={() => {
                setIsFormModalOpen(false);
                setEditingTask(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Task Details Modal */}
      <Modal
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        title="Task Details"
      >
        {viewingTask && (
          <div className="space-y-6 text-left">
            <div>
              <span className="text-xs font-semibold text-neutral-450 uppercase tracking-wider block">Task Name</span>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-[#F8FAFC] mt-1">{viewingTask.title}</h3>
            </div>

            <div>
              <span className="text-xs font-semibold text-neutral-450 uppercase tracking-wider block">Description</span>
              <p className="text-sm text-neutral-600 dark:text-[#CBD5E1] mt-1.5 bg-neutral-50 dark:bg-[#1E293B] p-3 rounded-md border border-neutral-200/50 dark:border-[#334155] whitespace-pre-wrap text-left">
                {viewingTask.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-[#1E293B] p-3 rounded-md border border-neutral-100 dark:border-[#334155] text-left">
                <span className="text-[11px] font-semibold text-neutral-450 uppercase tracking-wider block">Assigned Employee</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-sm font-semibold text-neutral-800 dark:text-[#F8FAFC]">{viewingTask.assigneeName}</span>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-[#1E293B] p-3 rounded-md border border-neutral-100 dark:border-[#334155] text-left">
                <span className="text-[11px] font-semibold text-neutral-450 uppercase tracking-wider block">Status</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-sm font-semibold text-neutral-800 dark:text-[#F8FAFC] capitalize">{viewingTask.status.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-[#1E293B] p-3 rounded-md border border-neutral-100 dark:border-[#334155] text-left">
                <span className="text-[11px] font-semibold text-neutral-450 uppercase tracking-wider block">Priority</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-sm font-semibold text-neutral-800 dark:text-[#F8FAFC] capitalize">{viewingTask.priority}</span>
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-[#1E293B] p-3 rounded-md border border-neutral-100 dark:border-[#334155] text-left">
                <span className="text-[11px] font-semibold text-neutral-450 uppercase tracking-wider block">Due Date</span>
                <div className="flex items-center gap-2 mt-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-sm font-semibold text-neutral-800 dark:text-[#F8FAFC]">{formatDate(viewingTask.dueDate)}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-neutral-100 dark:border-[#334155] pt-4 flex items-center justify-between text-xs text-neutral-450 dark:text-[#94A3B8]">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Created Date: {formatDate(new Date().toISOString().split('T')[0])}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setViewingTask(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingTask}
        onClose={() => setDeletingTask(null)}
        title="Delete Task?"
      >
        {deletingTask && (
          <div className="space-y-5 text-left">
            <p className="text-sm text-neutral-600 dark:text-[#CBD5E1]">
              This action cannot be undone. The task <span className="font-semibold text-neutral-800 dark:text-[#F8FAFC]">"{deletingTask.title}"</span> will be permanently deleted from the workspace.
            </p>
            <div className="flex justify-end gap-2 pt-4 border-t border-neutral-100 dark:border-[#334155]">
              <Button variant="outline" size="sm" onClick={() => setDeletingTask(null)}>
                Cancel
              </Button>
              <Button variant="outline" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/15 border-red-200 dark:border-rose-400/20" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tasks;
