export interface Category {
  id: string;
  name: string;
  description: string | null;
  color?: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
  color?: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
  color?: string | null;
}
