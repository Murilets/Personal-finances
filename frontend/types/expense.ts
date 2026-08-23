import { Category } from './category';

export interface Expense {
  id: string;
  amount: number;
  date: string;
  categoryId: string;
  note: string | null;
  category: Category;
}

export interface CreateExpenseRequest {
  amount: number;
  date: string;
  categoryId: string;
  note?: string | null;
}

export interface UpdateExpenseRequest {
  amount: number;
  date: string;
  categoryId: string;
  note?: string | null;
}

export interface ExpenseFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
}
