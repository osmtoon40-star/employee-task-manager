import React, { useState, useMemo } from 'react';
import useEmployees from '@/hooks/useEmployees';
import { EmployeeFilterBar, EmployeeGrid, EmployeeTable } from '@/features/employees';
import { Button } from '@/components/ui';
import { Plus } from 'lucide-react';

export const EmployeeDirectory: React.FC = () => {
  const { employees, loading, error } = useEmployees();
  const [search, setSearch] = useState<string>('');
  const [activeDepartment, setActiveDepartment] = useState<string>('All');
  const [viewMode, onViewModeChange] = useState<'grid' | 'list'>('list');

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase()) ||
        emp.role.toLowerCase().includes(search.toLowerCase());
      const matchesDept = activeDepartment === 'All' || emp.department === activeDepartment;

      return matchesSearch && matchesDept;
    });
  }, [employees, search, activeDepartment]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <span className="text-neutral-500 dark:text-[#94A3B8] font-medium">Loading Directory...</span>
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-[38px] leading-[44px] font-bold tracking-tight text-neutral-900 dark:text-[#F8FAFC]">
            Employee Directory
          </h1>
          <p className="text-base text-neutral-500 dark:text-[#CBD5E1] mt-1.5">
            View team rosters, department alignments, and coordinate active contact shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <EmployeeFilterBar
        search={search}
        onSearchChange={setSearch}
        activeDepartment={activeDepartment}
        onDepartmentSelect={setActiveDepartment}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* Grid or List Views */}
      {viewMode === 'grid' ? (
        <EmployeeGrid employees={filteredEmployees} />
      ) : (
        <EmployeeTable employees={filteredEmployees} />
      )}
    </div>
  );
};

export default EmployeeDirectory;
