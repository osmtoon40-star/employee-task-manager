import React from 'react';
import { DashboardSummary } from '@/types';

export interface DashboardOverviewProps {
  data: DashboardSummary;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.metrics.map((metric, i) => (
          <div key={i} className="p-6 bg-white dark:bg-[#1E293B] border border-neutral-200 dark:border-[#334155] rounded-lg shadow-sm dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)]">
            <p className="text-sm font-medium text-neutral-500 dark:text-[#94A3B8]">{metric.title}</p>
            <p className="text-2xl font-bold mt-2 text-neutral-900 dark:text-[#F8FAFC]">{metric.value}</p>
            <p className={`text-xs mt-1 ${metric.trend === 'up' ? 'text-green-600 dark:text-emerald-300' : 'text-neutral-500 dark:text-[#94A3B8]'}`}>{metric.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
