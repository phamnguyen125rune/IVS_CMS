// src/services/contact.service.ts

import { apiFetch } from '@/utils/api-client';
import type { 
  ContactFormData, 
  ContactPaginationResponse, 
  SingleContactResponse 
} from '@/types/contact.type';

export const contactService = {
  // ==========================================
  // [CLIENT] Gửi form liên hệ từ phía khách hàng
  // ==========================================
  submitContactForm: (data: Omit<ContactFormData, 'consent'>) => {
    return apiFetch('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ==========================================
  // [ADMIN] API Quản lý liên hệ
  // ==========================================
  
  // 1. Lấy danh sách liên hệ (có phân trang, lọc)
  getContacts: (page: number, size: number, status: string, search: string) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      status,
      ...(search.trim() ? { search: search.trim() } : {}),
    });
    return apiFetch<ContactPaginationResponse>(`/api/v1/contacts?${queryParams.toString()}`);
  },

  // 2. Lấy chi tiết một liên hệ (backend sẽ tự update status thành 'read')
  getContactById: (id: number) => {
    return apiFetch<SingleContactResponse>(`/api/v1/contacts/${id}`);
  },

  // 3. Phản hồi liên hệ
  replyContact: (id: number, replyMessage: string) => {
    return apiFetch(`/api/v1/contacts/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  },

  // 4. Xóa liên hệ
  deleteContact: (id: number) => {
    return apiFetch(`/api/v1/contacts/${id}`, {
      method: 'DELETE',
    });
  },
};