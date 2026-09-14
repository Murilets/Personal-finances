import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import { DashboardPeriod } from '../types/dashboard';

export const DASHBOARD_KEY = ['dashboard'] as const;

export function useDashboardSummary() {
  const query = useQuery({
    queryKey: [...DASHBOARD_KEY, 'summary'],
    queryFn: api.getDashboardSummary,
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useCategoryBreakdown(period: DashboardPeriod) {
  const query = useQuery({
    queryKey: [...DASHBOARD_KEY, 'by-category', period],
    queryFn: () => api.getDashboardByCategory(period),
    // mantém o gráfico anterior visível enquanto o novo período carrega
    placeholderData: keepPreviousData,
  });

  return {
    breakdown: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useDashboardMonths() {
  const query = useQuery({
    queryKey: [...DASHBOARD_KEY, 'months'],
    queryFn: api.getDashboardMonths,
  });

  return {
    months: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
