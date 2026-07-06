import React, { useState } from 'react';
import { Card, Avatar, Badge, Pagination } from '@/components/ui';
import { Employee } from '@/types';
import { Mail, Briefcase, Calendar } from 'lucide-react';
import { formatDate } from '@/utils';

export interface EmployeeGridProps {
  employees: Employee[];
}

export const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees }) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));

  const paginatedEmployees = employees.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEmployees.map((emp) => (
          <Card key={emp.id} className="relative flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="flex justify-between items-start">
                <Avatar name={emp.name} size="lg" />
                <Badge variant={emp.status === 'active' ? 'success' : 'neutral'}>
                  {emp.status}
                </Badge>
              </div>

              <div className="mt-4 space-y-1 text-left">
                <h4 className="text-base font-semibold text-neutral-900 dark:text-[#F8FAFC]">{emp.name}</h4>
                <p className="text-sm font-medium text-blue-600 dark:text-[#93C5FD]">{emp.role}</p>
              </div>

              <div className="mt-4 space-y-2.5 text-sm text-neutral-500 dark:text-[#CBD5E1] border-t border-neutral-100 dark:border-[#334155] pt-4 text-left">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{emp.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>Joined {formatDate(emp.joinDate)}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default EmployeeGrid;
