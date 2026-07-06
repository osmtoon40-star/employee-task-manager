import { DashboardSummary } from '@/types';

export const dashboardService = {
  getOverview: async (): Promise<DashboardSummary> => {
    return {
      metrics: [
        { title: 'Pending Tasks', value: 5, change: '+1 this week', trend: 'up' },
        { title: 'In Progress Tasks', value: 3, change: '+2 today', trend: 'up' },
        { title: 'Completed Tasks', value: 5, change: '+4 this sprint', trend: 'up' },
        { title: 'Cancelled Tasks', value: 2, change: '0 change', trend: 'neutral' }
      ],
      activities: [
        { id: '1', user: 'Alice Smith', action: 'completed task', target: 'Recharts Integration', timestamp: '2 hours ago' },
        { id: '2', user: 'Bob Johnson', action: 'created task', target: 'Design System Audit', timestamp: '4 hours ago' },
        { id: '3', user: 'Charlie Green', action: 'moved to review', target: 'Dark Mode Implementation', timestamp: '6 hours ago' },
        { id: '4', user: 'Diana Prince', action: 'added comment on', target: 'Accessibility Compliance Review', timestamp: '1 day ago' },
      ]
    };
  }
};

export default dashboardService;
