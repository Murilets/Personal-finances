export interface TopCategory {
  categoryId: string;
  categoryName: string;
  amount: number;
  color?: string | null;
}

export interface DashboardSummary {
  year: number;
  month: number;
  monthTotal: number;
  overallTotal: number;
  categoryCount: number;
  topCategory: TopCategory | null;
}

export interface CategorySpending {
  categoryId: string;
  name: string;
  amount: number;
  percentage: number;
  color?: string | null;
}

export interface CategoryBreakdown {
  year: number | null;
  month: number | null;
  total: number;
  items: CategorySpending[];
}

export interface MonthOption {
  year: number;
  month: number;
}

// null = "Todos os meses"
export type DashboardPeriod = MonthOption | null;

export type ChartType = 'bar' | 'pie';
