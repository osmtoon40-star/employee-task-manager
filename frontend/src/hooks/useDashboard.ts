import { useState, useEffect } from 'react';
import { DashboardSummary } from '@/types';
import dashboardService from '@/services/dashboard';

export const useDashboard = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getOverview();
        if (active) {
          setData(res);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Error fetching dashboard data');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOverview();
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
};

export default useDashboard;
