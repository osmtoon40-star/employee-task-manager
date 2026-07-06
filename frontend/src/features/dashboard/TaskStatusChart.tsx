import React from 'react';
import { Charts } from '@/components/ui';

export const TaskStatusChart: React.FC = () => {
  const data = [
    { name: 'Pending', value: 5 },
    { name: 'In Progress', value: 3 },
    { name: 'Completed', value: 5 },
    { name: 'Cancelled', value: 2 },
  ];

  return (
    <Charts
      title="Task Status Distribution"
      data={data}
      type="pie"
      dataKeys={['value']}
      colors={['#F59E0B', '#60A5FA', '#34D399', '#F87171']}
    />
  );
};

export default TaskStatusChart;
