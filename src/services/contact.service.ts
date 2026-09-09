import { apiFetch } from '@/utils/api-client';
import type {
  FormDetailFormData,
  FormDetailPaginationResponse,
  SingleFormDetailResponse,
  FormCategoryListResponse,
} from '@/types/contact.type';

export const FormDetailService = {
  // 1. Gửi form liên hệ từ phía khách hàng
  submitForm: (data: Omit<FormDetailFormData, 'consent'>) => {
    return apiFetch('/api/v1/form-details', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2. Lấy danh sách liên hệ
  getFormDetails: (page: number, size: number, status: string, search: string) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      status,
      ...(search.trim() ? { search: search.trim() } : {}),
    });
    return apiFetch<FormDetailPaginationResponse>(`/api/v1/form-details?${queryParams.toString()}`);
  },

  // 3. Lấy chi tiết một liên hệ
  getFormDetailById: (id: number) => {
    return apiFetch<SingleFormDetailResponse>(`/api/v1/form-details/${id}`);
  },

  // 4. Phản hồi liên hệ
  replyFormDetail: (id: number, replyMessage: string) => {
    return apiFetch(`/api/v1/form-details/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  },

  // 5. Xóa liên hệ
  deleteFormDetail: (id: number) => {
    return apiFetch(`/api/v1/form-details/${id}`, {
      method: 'DELETE',
    });
  },

  // 6. Cập nhật trạng thái thủ công (Admin tự đổi status qua Select)
  updateFormDetailStatus: (id: number, status: string) => {
    return apiFetch(`/api/v1/form-details/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // 7. Lấy danh sách Danh mục Form (FormCategory) dùng cho Dropdown
  getAllCategories: () => {
    return apiFetch<FormCategoryListResponse>('/api/v1/form-categories');
  },

  // Thêm danh mục mới
  createCategory: (categoryName: string) => {
    return apiFetch('/api/v1/form-categories', {
      method: 'POST',
      body: JSON.stringify({ categoryName }),
    });
  },

  // Sửa danh mục
  updateCategory: (id: number, categoryName: string) => {
    return apiFetch(`/api/v1/form-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ categoryName }),
    });
  },

  // Xóa danh mục
  deleteCategory: (id: number) => {
    return apiFetch(`/api/v1/form-categories/${id}`, {
      method: 'DELETE',
    });
  },
};
