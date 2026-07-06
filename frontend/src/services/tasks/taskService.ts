import { Task, TaskFilters } from '@/types';

export const taskService = {
  list: async (_filters?: TaskFilters): Promise<Task[]> => {
    return [
      { id: 'task-1', title: 'Upgrade React to v19', description: 'Upgrade from React 18 to React 19 and fix peer dependency issues.', status: 'in_progress', priority: 'high', dueDate: '2026-07-15', assigneeId: 'emp-1', assigneeName: 'Alice Smith' },
      { id: 'task-2', title: 'Document TypeScript Interfaces', description: 'Define strict TS typings for all feature modules and shared components.', status: 'pending', priority: 'medium', dueDate: '2026-07-20', assigneeId: 'emp-2', assigneeName: 'Bob Johnson' },
      { id: 'task-3', title: 'Design System Audit', description: 'Review all components for consistency in spacing, colors, and typography.', status: 'completed', priority: 'high', dueDate: '2026-07-12', assigneeId: 'emp-2', assigneeName: 'Bob Johnson' },
      { id: 'task-4', title: 'CI/CD Pipeline Setup', description: 'Configure GitHub Actions for automated testing and deployment.', status: 'pending', priority: 'urgent', dueDate: '2026-07-10', assigneeId: 'emp-9', assigneeName: 'Ivan Cruz' },
      { id: 'task-5', title: 'Employee Directory Search', description: 'Implement fuzzy search and department filtering on the employee roster.', status: 'completed', priority: 'medium', dueDate: '2026-07-05', assigneeId: 'emp-3', assigneeName: 'Charlie Green' },
      { id: 'task-6', title: 'Dashboard KPI Metrics', description: 'Wire up API endpoints for real-time KPI cards in the dashboard.', status: 'in_progress', priority: 'high', dueDate: '2026-07-18', assigneeId: 'emp-1', assigneeName: 'Alice Smith' },
      { id: 'task-7', title: 'Accessibility Compliance Review', description: 'Audit WCAG 2.1 AA compliance for all interactive elements.', status: 'pending', priority: 'medium', dueDate: '2026-07-25', assigneeId: 'emp-4', assigneeName: 'Diana Prince' },
      { id: 'task-8', title: 'Performance Profiling', description: 'Run Lighthouse and React DevTools profiler to identify render bottlenecks.', status: 'cancelled', priority: 'low', dueDate: '2026-07-30', assigneeId: 'emp-3', assigneeName: 'Charlie Green' },
      { id: 'task-9', title: 'Recharts Integration', description: 'Replace placeholder chart components with fully configured Recharts instances.', status: 'completed', priority: 'high', dueDate: '2026-07-03', assigneeId: 'emp-2', assigneeName: 'Bob Johnson' },
      { id: 'task-10', title: 'Dark Mode Implementation', description: 'Implement persistent dark/light theme toggle using Tailwind dark classes.', status: 'completed', priority: 'medium', dueDate: '2026-07-14', assigneeId: 'emp-3', assigneeName: 'Charlie Green' },
      { id: 'task-11', title: 'Multi-tenant Database Schema', description: 'Design database tables to support logical separation of client data.', status: 'pending', priority: 'urgent', dueDate: '2026-07-22', assigneeId: 'emp-5', assigneeName: 'Ethan Hunt' },
      { id: 'task-12', title: 'API Load Testing', description: 'Test endpoints with high concurrency using k6 or Artillery.', status: 'cancelled', priority: 'medium', dueDate: '2026-07-08', assigneeId: 'emp-9', assigneeName: 'Ivan Cruz' },
      { id: 'task-13', title: 'Mobile App Layout Design', description: 'Design layout wireframes and key flows for the upcoming mobile client.', status: 'in_progress', priority: 'medium', dueDate: '2026-07-29', assigneeId: 'emp-12', assigneeName: 'Laura Palmer' },
      { id: 'task-14', title: 'Write End-to-End Tests', description: 'Implement Playwright test suites covering critical user flows.', status: 'pending', priority: 'low', dueDate: '2026-07-26', assigneeId: 'emp-11', assigneeName: 'Kevin Malone' },
      { id: 'task-15', title: 'Security vulnerability patch', description: 'Audit dependencies and update packages with high vulnerability ratings.', status: 'completed', priority: 'urgent', dueDate: '2026-07-04', assigneeId: 'emp-1', assigneeName: 'Alice Smith' },
    ];
  }
};

export default taskService;
