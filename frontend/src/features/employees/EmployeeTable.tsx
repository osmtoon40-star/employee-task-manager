import React, { useState } from 'react';
import { Table, Badge, Avatar, Pagination } from '@/components/ui';
import { Employee } from '@/types';
import { formatDate } from '@/utils';
import { Mail, MoreHorizontal } from 'lucide-react';

export interface EmployeeTableProps {
  employees: Employee[];
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 8;
  const totalPages = Math.max(1, Math.ceil(employees.length / itemsPerPage));

  const paginatedEmployees = employees.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-4">
      <Table headers={['Employee', 'Department', 'Contact', 'Role', 'Status', 'Joined', '']}>
        {paginatedEmployees.map((emp) => (
          <tr
            key={emp.id}
            className="hover:bg-blue-50/30 dark:hover:bg-[#1E293B]/70 transition-colors duration-150 border-b border-neutral-100 dark:border-[#334155] last:border-0"
          >
            {/* Avatar + Name + Email */}
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-3.5">
                <Avatar name={emp.name} size="md" />
                <div className="text-left min-w-0">
                  <p className="text-[14px] font-semibold text-neutral-900 dark:text-[#F8FAFC] truncate">
                    {emp.name}
                  </p>
                  <p className="text-[12px] text-neutral-500 dark:text-[#94A3B8] truncate mt-0.5">
                    {emp.email}
                  </p>
                </div>
              </div>
            </td>

            {/* Department */}
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="text-[13px] font-medium text-neutral-700 dark:text-[#CBD5E1] bg-neutral-100 dark:bg-[#1E293B] px-2.5 py-1 rounded-md">
                {emp.department}
              </span>
            </td>

            {/* Email */}
            <td className="px-6 py-4 whitespace-nowrap">
              <a
                href={`mailto:${emp.email}`}
                className="flex items-center gap-1.5 text-[13px] text-neutral-500 dark:text-[#94A3B8] hover:text-blue-600 dark:hover:text-[#93C5FD] transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-400 group-hover:text-blue-500 transition-colors" />
                {emp.email}
              </a>
            </td>

            {/* Role */}
            <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-neutral-700 dark:text-[#CBD5E1]">
              {emp.role}
            </td>

            {/* Status */}
            <td className="px-6 py-4 whitespace-nowrap">
              <Badge variant={emp.status === 'active' ? 'success' : 'neutral'}>
                {emp.status}
              </Badge>
            </td>

            {/* Joined */}
            <td className="px-6 py-4 whitespace-nowrap text-[13px] text-neutral-500 dark:text-[#94A3B8]">
              {formatDate(emp.joinDate)}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <button className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer text-neutral-400 dark:text-[#94A3B8] hover:text-neutral-600 dark:hover:text-[#F8FAFC]">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </Table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default EmployeeTable;
