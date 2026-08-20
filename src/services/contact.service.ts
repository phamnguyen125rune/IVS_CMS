import { apiFetch } from '@/utils/api-client';
import type {
  ContactFormData,
  ContactPaginationResponse,
  SingleContactResponse,
} from '@/types/contact.type';

export const contactService = {
  // 1. Gửi form liên hệ từ phía khách hàng
  submitContactForm: (data: Omit<ContactFormData, 'consent'>) => {
    return apiFetch('/api/v1/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 2. Lấy danh sách liên hệ
  getContacts: (page: number, size: number, status: string, search: string) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      status,
      ...(search.trim() ? { search: search.trim() } : {}),
    });
    return apiFetch<ContactPaginationResponse>(`/api/v1/contacts?${queryParams.toString()}`);
  },

  // 3. Lấy chi tiết một liên hệ
  getContactById: (id: number) => {
    return apiFetch<SingleContactResponse>(`/api/v1/contacts/${id}`);
  },

  // 4. Phản hồi liên hệ
  replyContact: (id: number, replyMessage: string) => {
    return apiFetch(`/api/v1/contacts/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  },

  // 5. Xóa liên hệ
  deleteContact: (id: number) => {
    return apiFetch(`/api/v1/contacts/${id}`, {
      method: 'DELETE',
    });
  },


  // 6. Cập nhật trạng thái
  updateContactStatus: (id: number, status: string) => {
    return apiFetch(`/api/v1/contacts/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
   };