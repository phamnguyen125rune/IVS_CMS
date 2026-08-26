import { apiFetch } from '@/utils/api-client';
import { PostCategory, ReqCategoryCreateDTO, ReqCategoryUpdateDTO } from '@/types/category.type';

export class CategoryService {

    async getAllCategories(): Promise<PostCategory[]> {
        const res = await apiFetch<PostCategory[]>('/api/v1/categories');
        return res;
    }


    async getCategoryById(id: number): Promise<PostCategory> {
        const res = await apiFetch<PostCategory>(`/api/v1/categories/${id}`);
        return res;
    }


    async createCategory(payload: ReqCategoryCreateDTO): Promise<PostCategory> {
        const res = await apiFetch<PostCategory>('/api/v1/categories', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return res;
    }

    async updateCategory(id: number, payload: ReqCategoryUpdateDTO): Promise<PostCategory> {
        const res = await apiFetch<PostCategory>(`/api/v1/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
        return res;
    }


    async deleteCategory(id: number): Promise<void> {
        await apiFetch(`/api/v1/categories/${id}`, {
            method: 'DELETE',
        });
    }
}

export const categoryService = new CategoryService();