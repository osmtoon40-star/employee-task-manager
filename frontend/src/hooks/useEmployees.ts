import { useState, useEffect } from 'react';
import { Employee, EmployeeFilters } from '@/types';
import employeeService from '@/services/employees';

export const useEmployees = (filters?: EmployeeFilters) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const res = await employeeService.list(filters);
        if (active) {
          setEmployees(res);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error fetching employees');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEmployees();
    return () => {
      active = false;
    };
  }, [filters]);

  return { employees, loading, error, setEmployees };
};

export default useEmployees;
