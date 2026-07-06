import { ROUTES } from '@/constants/routes';

export interface RouteItem {
  path: string;
  componentName: 'Dashboard' | 'Tasks' | 'EmployeeDirectory';
  layout: 'DashboardLayout';
}

export const routeConfig: RouteItem[] = [
  {
    path: ROUTES.DASHBOARD,
    componentName: 'Dashboard',
    layout: 'DashboardLayout',
  },
  {
    path: ROUTES.TASKS,
    componentName: 'Tasks',
    layout: 'DashboardLayout',
  },
  {
    path: ROUTES.EMPLOYEE_DIRECTORY,
    componentName: 'EmployeeDirectory',
    layout: 'DashboardLayout',
  },
];
