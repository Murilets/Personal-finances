import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { CreateExpenseRequest, ExpenseFilters, UpdateExpenseRequest } from '../types/expense';
import { DASHBOARD_KEY } from './useDashboard';

function expensesKey(filters: ExpenseFilters) {
  return ['expenses', filters] as const;
}

export function useExpenses(filters: ExpenseFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: expensesKey(filters),
    queryFn: () => api.getExpenses(filters),
  });

  // despesas alteram os totais do dashboard
  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['expenses'] }),
      queryClient.invalidateQueries({ queryKey: DASHBOARD_KEY }),
    ]);

  const create = useMutation({
    mutationFn: (request: CreateExpenseRequest) => api.createExpense(request),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateExpenseRequest }) =>
      api.updateExpense(id, request),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteExpense(id),
    onSuccess: invalidate,
  });

  return {
    expenses: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    create,
    update,
    remove,
  };
}
