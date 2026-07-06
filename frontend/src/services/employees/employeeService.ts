import { Employee, EmployeeFilters } from '@/types';

export const employeeService = {
  list: async (_filters?: EmployeeFilters): Promise<Employee[]> => {
    return [
      { id: 'emp-1', name: 'Alice Smith', email: 'alice@enterprise.com', role: 'Principal Engineer', department: 'Engineering', status: 'active', joinDate: '2022-03-01' },
      { id: 'emp-2', name: 'Bob Johnson', email: 'bob@enterprise.com', role: 'Senior Product Designer', department: 'Product Design', status: 'active', joinDate: '2023-01-15' },
      { id: 'emp-3', name: 'Charlie Green', email: 'charlie@enterprise.com', role: 'Frontend Engineer', department: 'Engineering', status: 'active', joinDate: '2021-07-20' },
      { id: 'emp-4', name: 'Diana Prince', email: 'diana@enterprise.com', role: 'QA Lead', department: 'Operations', status: 'active', joinDate: '2020-11-05' },
      { id: 'emp-5', name: 'Ethan Hunt', email: 'ethan@enterprise.com', role: 'Engineering Manager', department: 'Management', status: 'active', joinDate: '2019-04-10' },
      { id: 'emp-6', name: 'Fiona Glenanne', email: 'fiona@enterprise.com', role: 'Backend Engineer', department: 'Engineering', status: 'inactive', joinDate: '2022-09-15' },
      { id: 'emp-7', name: 'George Miller', email: 'george@enterprise.com', role: 'Product Manager', department: 'Management', status: 'active', joinDate: '2023-06-01' },
      { id: 'emp-8', name: 'Hannah Lee', email: 'hannah@enterprise.com', role: 'UX Researcher', department: 'Product Design', status: 'active', joinDate: '2021-02-28' },
      { id: 'emp-9', name: 'Ivan Cruz', email: 'ivan@enterprise.com', role: 'DevOps Engineer', department: 'Operations', status: 'active', joinDate: '2020-08-14' },
      { id: 'emp-10', name: 'Julia Roberts', email: 'julia@enterprise.com', role: 'Marketing Lead', department: 'Operations', status: 'active', joinDate: '2023-03-22' },
      { id: 'emp-11', name: 'Kevin Malone', email: 'kevin@enterprise.com', role: 'QA Engineer', department: 'Operations', status: 'active', joinDate: '2022-10-01' },
      { id: 'emp-12', name: 'Laura Palmer', email: 'laura@enterprise.com', role: 'UI Designer', department: 'Product Design', status: 'active', joinDate: '2023-08-12' },
    ];
  }
};

export default employeeService;
