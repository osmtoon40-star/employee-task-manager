import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { cn } from '@/utils';

export interface ChartsProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  data: { name: string; [key: string]: any }[];
  type?: 'line' | 'bar' | 'area' | 'pie';
  dataKeys: string[];
  colors?: string[];
}

export const Charts: React.FC<ChartsProps> = ({
  className = '',
  title,
  data,
  type = 'line',
  dataKeys,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
  ...props
}) => {
  const tooltipStyle = {
    background: 'var(--app-tooltip-bg)',
    borderRadius: '8px',
    border: '1px solid var(--app-tooltip-border)',
    boxShadow: 'var(--app-shadow)',
    color: 'var(--app-tooltip-text)'
  };
  const labelStyle = { fontWeight: 700, color: 'var(--app-tooltip-text)' };
  const legendFormatter = (value: string) => (
    <span className="text-neutral-600 dark:text-[#CBD5E1]">{value}</span>
  );

  return (
    <div className={cn('bg-white dark:bg-[#111827] border border-neutral-200 dark:border-[#334155] rounded-lg p-6 shadow-sm dark:shadow-[0_18px_45px_rgba(2,6,23,0.25)]', className)} {...(props as any)}>
      <h4 className="text-[15px] font-semibold text-neutral-800 dark:text-[#F8FAFC] mb-4 text-left">{title}</h4>
      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--app-chart-grid)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" formatter={legendFormatter} />
              {dataKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              ))}
            </LineChart>
          ) : type === 'area' ? (
            <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                {dataKeys.map((key, i) => {
                  const id = `gradient-${key}-${i}`;
                  return (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors[i % colors.length]} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={colors[i % colors.length]} stopOpacity={0.0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--app-chart-grid)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" formatter={legendFormatter} />
              {dataKeys.map((key, i) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[i % colors.length]}
                  strokeWidth={2}
                  fill={`url(#gradient-${key}-${i})`}
                />
              ))}
            </AreaChart>
          ) : type === 'pie' ? (
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey={dataKeys[0] || 'value'}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={legendFormatter} />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--app-chart-grid)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-10} />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={labelStyle}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" formatter={legendFormatter} />
              {dataKeys.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[i % colors.length]}
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Charts;
