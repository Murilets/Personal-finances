import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';
import { Category, CreateCategoryRequest, UpdateCategoryRequest } from '../types/category';
import {
  CreateExpenseRequest,
  Expense,
  ExpenseFilters,
  UpdateExpenseRequest,
} from '../types/expense';

const BASE_URL = Platform.select({
  web: 'http://localhost:5132',
  android: 'http://10.0.2.2:5132',
  default: 'http://localhost:5132',
});

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

interface ProblemDetails {
  title?: string;
  detail?: string;
}

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ProblemDetails>) => {
    const problem = error.response?.data;
    const message = problem?.detail || problem?.title || error.message || 'Erro inesperado';
    return Promise.reject(new ApiError(message, error.response?.status));
  }
);

// Categories

export async function getCategories(): Promise<Category[]> {
  const { data } = await client.get<Category[]>('/api/categories');
  return data;
}

export async function createCategory(request: CreateCategoryRequest): Promise<Category> {
  const { data } = await client.post<Category>('/api/categories', request);
  return data;
}

export async function updateCategory(id: string, request: UpdateCategoryRequest): Promise<void> {
  await client.put(`/api/categories/${id}`, request);
}

export async function deleteCategory(id: string): Promise<void> {
  await client.delete(`/api/categories/${id}`);
}

// Expenses

// O backend grava/compara DateTime como timestamptz — precisa vir com Kind=Utc,
// então convertemos a data "AAAA-MM-DD" digitada pelo usuário para ISO UTC antes de enviar.
function toUtcIso(dateOnly?: string): string | undefined {
  if (!dateOnly) return undefined;
  return new Date(`${dateOnly}T00:00:00.000Z`).toISOString();
}

export async function getExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
  const params = {
    startDate: toUtcIso(filters.startDate),
    endDate: toUtcIso(filters.endDate),
    categoryId: filters.categoryId,
  };
  const { data } = await client.get<Expense[]>('/api/expenses', { params });
  return data;
}

export async function createExpense(request: CreateExpenseRequest): Promise<Expense> {
  const { data } = await client.post<Expense>('/api/expenses', request);
  return data;
}

export async function updateExpense(id: string, request: UpdateExpenseRequest): Promise<void> {
  await client.put(`/api/expenses/${id}`, request);
}

export async function deleteExpense(id: string): Promise<void> {
  await client.delete(`/api/expenses/${id}`);
}
