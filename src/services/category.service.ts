import { apiFetch } from '@/utils/api-client';
import type {
  PostCategory,
  ReqCategoryCreateDTO,
  ReqCategoryUpdateDTO,
} from '@/types/category.type';

export class CategoryService {
  getAllCategories(): Promise<PostCategory[]> {
    return apiFetch<PostCategory[]>('/api/v1/categories');
  }

  getCategoryById(id: number): Promise<PostCategory> {
    return apiFetch<PostCategory>(`/api/v1/categories/${id}`);
  }

  createCategory(payload: ReqCategoryCreateDTO): Promise<PostCategory> {
    return apiFetch<PostCategory>('/api/v1/categories', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  updateCategory(id: number, payload: ReqCategoryUpdateDTO): Promise<PostCategory> {
    return apiFetch<PostCategory>(`/api/v1/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  deleteCategory(id: number): Promise<void> {
    return apiFetch<void>(`/api/v1/categories/${id}`, { method: 'DELETE' });
  }
}

export const categoryService = new CategoryService();
