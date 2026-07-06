export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  avatarUrl?: string;
  joinDate: string;
}

export interface EmployeeFilters {
  department?: string;
  status?: 'active' | 'inactive';
  search?: string;
}
