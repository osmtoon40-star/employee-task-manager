import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui';
import { Clock, Play, CheckCircle2, XCircle } from 'lucide-react';

interface MetricItem {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface DashboardMetricsProps {
  metrics: MetricItem[];
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ metrics }) => {
  const navigate = useNavigate();

  const getCardStyle = (title: string) => {
    const key = title.toLowerCase();
    if (key.includes('pending')) {
      return {
        bottomAccent: 'border-b-[3px] border-b-amber-500 dark:border-b-amber-600',
        bg: 'bg-white dark:bg-[#111827] hover:bg-amber-50/5 dark:hover:bg-[#1E293B]',
        icon: Clock,
        iconBg: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-100 dark:border-amber-400/20',
        statusKey: 'pending'
      };
    }
    if (key.includes('progress')) {
      return {
        bottomAccent: 'border-b-[3px] border-b-blue-500 dark:border-b-blue-600',
        bg: 'bg-white dark:bg-[#111827] hover:bg-blue-50/5 dark:hover:bg-[#1E293B]',
        icon: Play,
        iconBg: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-400/20',
        statusKey: 'in_progress'
      };
    }
    if (key.includes('completed')) {
      return {
        bottomAccent: 'border-b-[3px] border-b-green-500 dark:border-b-green-600',
        bg: 'bg-white dark:bg-[#111827] hover:bg-green-50/5 dark:hover:bg-[#1E293B]',
        icon: CheckCircle2,
        iconBg: 'bg-green-50 dark:bg-emerald-500/10 text-green-600 dark:text-emerald-300 border border-green-100 dark:border-emerald-400/20',
        statusKey: 'completed'
      };
    }
    // Cancelled
    return {
      bottomAccent: 'border-b-[3px] border-b-red-500 dark:border-b-red-600',
      bg: 'bg-white dark:bg-[#111827] hover:bg-red-50/5 dark:hover:bg-[#1E293B]',
      icon: XCircle,
      iconBg: 'bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-300 border border-red-100 dark:border-rose-400/20',
      statusKey: 'cancelled'
    };
  };

  const handleCardClick = (statusKey: string) => {
    navigate('/tasks', { state: { filterStatus: statusKey } });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, idx) => {
        const style = getCardStyle(metric.title);
        const IconComponent = style.icon;

        return (
          <Card 
            key={idx} 
            onClick={() => handleCardClick(style.statusKey)}
            className={`group relative overflow-hidden cursor-pointer select-none transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg p-8 border border-neutral-200 dark:border-[#334155] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_16px_-4px_rgba(0,0,0,0.02)] dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)] flex flex-col justify-between h-[150px] ${style.bg} ${style.bottomAccent}`}
          >
            <div className="flex items-start justify-between">
              <div className="text-left space-y-2">
                <span className="text-[12px] font-bold text-neutral-450 dark:text-[#94A3B8] uppercase tracking-wider block">
                  {metric.title}
                </span>
                <span className="text-[40px] font-extrabold tracking-tight text-neutral-900 dark:text-[#F8FAFC] block leading-none">
                  {metric.value}
                </span>
              </div>
              <div className={`p-2.5 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105 ${style.iconBg}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            
            {/* Soft inline status label */}
            <div className="text-left text-[12px] font-medium text-neutral-400 dark:text-[#94A3B8] mt-2">
              Click to inspect category tasks
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardMetrics;
