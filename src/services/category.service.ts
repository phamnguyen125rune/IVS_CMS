import { apiFetch } from '@/utils/api-client';

export const categoryService = {
  // =========================
  // CATEGORY
  // =========================

  getAllCategories: async () => {
    return apiFetch('/api/categories', {
      method: 'GET',
    });
  },

  createCategory: async (data: unknown) => {
    return apiFetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateCategory: async (id: number | string, data: unknown) => {
    return apiFetch(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: number | string) => {
    return apiFetch(`/api/categories/${id}`, {
      method: 'DELETE',
    });
  },

  // =========================
  // TAG
  // =========================

  getAllTags: async () => {
    return apiFetch('/api/tags', {
      method: 'GET',
    });
  },

  createTag: async (data: unknown) => {
    return apiFetch('/api/tags', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateTag: async (id: number | string, data: unknown) => {
    return apiFetch(`/api/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteTag: async (id: number | string) => {
    return apiFetch(`/api/tags/${id}`, {
      method: 'DELETE',
    });
  },
};