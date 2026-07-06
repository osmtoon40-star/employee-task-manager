import React from 'react';
import { Card, Avatar, Badge } from '@/components/ui';

export interface WorkloadItem {
  name: string;
  avatar?: string;
  role: string;
  activeTasks: number;
  capacity: number;
}

export const TeamWorkload: React.FC = () => {
  const workloads: WorkloadItem[] = [
    { name: 'Alice Smith', role: 'Principal Engineer', activeTasks: 4, capacity: 5 },
    { name: 'Bob Johnson', role: 'Product Designer', activeTasks: 2, capacity: 3 },
    { name: 'Charlie Green', role: 'Frontend Engineer', activeTasks: 5, capacity: 5 },
    { name: 'Diana Prince', role: 'QA Lead', activeTasks: 1, capacity: 4 }
  ];

  return (
    <Card className="h-full">
      <h4 className="text-[15px] font-semibold text-neutral-800 dark:text-[#F8FAFC] mb-4">Team Workload & Performance</h4>
      <div className="space-y-4">
        {workloads.map((item, idx) => {
          const loadPercentage = (item.activeTasks / item.capacity) * 100;
          const status = loadPercentage >= 100 ? 'danger' : loadPercentage >= 80 ? 'warning' : 'success';
          const badgeLabel = loadPercentage >= 100 ? 'Max Capacity' : `${item.activeTasks}/${item.capacity} Tasks`;

          return (
            <div key={idx} className="flex items-center justify-between text-sm pb-2 border-b border-neutral-100 dark:border-[#334155] last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <Avatar name={item.name} size="sm" />
                <div>
                  <p className="font-semibold text-neutral-800 dark:text-[#F8FAFC]">{item.name}</p>
                  <p className="text-xs text-neutral-450 dark:text-[#94A3B8]">{item.role}</p>
                </div>
              </div>
              <Badge variant={status}>{badgeLabel}</Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TeamWorkload;
