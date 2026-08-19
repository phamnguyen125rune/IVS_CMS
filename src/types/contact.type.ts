// src/types/contact.type.ts

// ==========================================
// 1. TYPES DÀNH CHO FORM CLIENT
// ==========================================
export type ContactFormData = {
  hoTen: string;
  email: string;
  soDienThoai: string;
  congTy: string;
  dichVu: string;
  noiDung: string;
  consent: boolean;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

// ==========================================
// 2. TYPES DÀNH CHO ADMIN
// ==========================================
export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | string;
  replyMessage?: string;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ContactPaginationResponse {
  statusCode: number;
  message: string;
  data: {
    meta: PaginationMeta;
    result: Contact[];
  };
}

export interface SingleContactResponse {
  statusCode: number;
  message: string;
  data: Contact;
}