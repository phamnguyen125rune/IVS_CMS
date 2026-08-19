import type {
  ContactFormData,
  ContactPaginationResponse,
  SingleContactResponse,
} from '@/types/contact.type';

export class ContactApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ContactApiError';
    this.status = status;
  }
}

async function contactFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(path, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ContactApiError(data?.message || 'Có lỗi xảy ra, vui lòng thử lại', res.status);
  }

  return data as T;
}

export const contactService = {
  submitContactForm: (data: Omit<ContactFormData, 'consent'>) => {
    return contactFetch('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getContacts: (page: number, size: number, status: string, search: string) => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      status,
      ...(search.trim() ? { search: search.trim() } : {}),
    });
    return contactFetch<ContactPaginationResponse>(`/api/contacts?${queryParams.toString()}`);
  },

  getContactById: (id: number) => {
    return contactFetch<SingleContactResponse>(`/api/contacts/${id}`);
  },

  replyContact: (id: number, replyMessage: string) => {
    return contactFetch(`/api/contacts/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  },

  deleteContact: (id: number) => {
    return contactFetch(`/api/contacts/${id}`, {
      method: 'DELETE',
    });
  },
};
