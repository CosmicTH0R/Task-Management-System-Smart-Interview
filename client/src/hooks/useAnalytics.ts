import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/api/task.api';
import type { AnalyticsData } from '@/types';

export function useAnalytics() {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
