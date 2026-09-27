import { keepPreviousData, useQuery } from '@tanstack/react-query';
import * as api from '../services/api';
import { DashboardPeriod } from '../types/dashboard';

export const DASHBOARD_KEY = ['dashboard'] as const;

export function useDashboardSummary(period: DashboardPeriod) {
  const query = useQuery({
    // period na chave: trocar o mês dispara nova busca do resumo
    queryKey: [...DASHBOARD_KEY, 'summary', period],
    queryFn: () => api.getDashboardSummary(period),
    placeholderData: keepPreviousData,
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

export function useMonthlyTrend(period: DashboardPeriod) {
  const query = useQuery({
    queryKey: [...DASHBOARD_KEY, 'trend', period],
    queryFn: () => api.getDashboardTrend(period),
    placeholderData: keepPreviousData,
  });

  return {
    trend: query.data,
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
