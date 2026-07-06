import React from 'react';
import { Charts } from '@/components/ui';

export const ProductivityTrends: React.FC = () => {
  const data = [
    { name: 'Mon', Created: 4 },
    { name: 'Tue', Created: 7 },
    { name: 'Wed', Created: 5 },
    { name: 'Thu', Created: 9 },
    { name: 'Fri', Created: 12 },
    { name: 'Sat', Created: 3 },
    { name: 'Sun', Created: 2 },
  ];

  return (
    <Charts
      title="Task Creation Trend"
      data={data}
      type="bar"
      dataKeys={['Created']}
      colors={['#60A5FA']}
    />
  );
};

export default ProductivityTrends;
