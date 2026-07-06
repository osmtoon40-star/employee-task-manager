import { useState, useEffect } from 'react';
import { Task, TaskFilters } from '@/types';
import taskService from '@/services/tasks';

export const useTasks = (filters?: TaskFilters) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await taskService.list(filters);
        if (active) {
          setTasks(res);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error fetching tasks');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTasks();
    return () => {
      active = false;
    };
  }, [filters]);

  return { tasks, loading, error, setTasks };
};

export default useTasks;
