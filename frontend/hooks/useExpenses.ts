import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { CreateExpenseRequest, ExpenseFilters, UpdateExpenseRequest } from '../types/expense';

function expensesKey(filters: ExpenseFilters) {
  return ['expenses', filters] as const;
}

export function useExpenses(filters: ExpenseFilters = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: expensesKey(filters),
    queryFn: () => api.getExpenses(filters),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['expenses'] });

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
