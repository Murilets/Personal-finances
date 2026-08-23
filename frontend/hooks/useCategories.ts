import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../services/api';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';

const CATEGORIES_KEY = ['categories'];

export function useCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: api.getCategories,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: CATEGORIES_KEY });

  const create = useMutation({
    mutationFn: (request: CreateCategoryRequest) => api.createCategory(request),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, request }: { id: string; request: UpdateCategoryRequest }) =>
      api.updateCategory(id, request),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: invalidate,
  });

  return {
    categories: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    create,
    update,
    remove,
  };
}
