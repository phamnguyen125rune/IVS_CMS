// // src/types/contact.type.ts

// // ==========================================
// // 1. TYPES DÀNH CHO FORM CLIENT
// // ==========================================
// export type ContactFormData = {
//   hoTen: string;
//   email: string;
//   soDienThoai: string;
//   congTy: string;
//   dichVu: string;
//   noiDung: string;
//   consent: boolean;
// };

// export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

// // ==========================================
// // 2. TYPES DÀNH CHO ADMIN
// // ==========================================
// export interface Contact {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   company?: string;
//   service?: string;
//   subject: string;
//   message: string;
//   status: 'new' | 'read' | 'replied' | string;
//   replyMessage?: string;
//   createdAt: string;
// }

// export interface PaginationMeta {
//   page: number;
//   pageSize: number;
//   pages: number;
//   total: number;
// }

// export interface ContactPaginationResponse {
//   statusCode: number;
//   message: string;
//   data: {
//     meta: PaginationMeta;
//     result: Contact[];
//   };
// }

// export interface SingleContactResponse {
//   statusCode: number;
//   message: string;
//   data: Contact;
// }

// ==========================================
// 1. TYPES DÀNH CHO FORM CLIENT
// ==========================================
export type FormDetailFormData = {
  fullName: string;
  email: string;
  phoneNumber: string;
  company?: string;
  formCategoryId: number; // Thay vì dichVu kiểu string như cũ
  message: string;
  consent: boolean;
};

export type FormDetailFormErrors = Partial<Record<keyof FormDetailFormData, string>>;

// ==========================================
// 2. TYPES DÀNH CHO ADMIN
// ==========================================
export interface FormDetail {
  formId: number;
  formCode: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company?: string;
  formCategoryId: number;
  message: string;
  status: 'new' | 'read' | 'replied' | string;
  replyMessage?: string;
  createdAt: string;
}

export interface FormCategory {
  formCategoryId: number;
  categoryName: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface FormDetailPaginationResponse {
  statusCode: number;
  message: string;
  data: {
    meta: PaginationMeta;
    result: FormDetail[];
  };
}

export interface SingleFormDetailResponse {
  statusCode: number;
  message: string;
  data: FormDetail;
}

export interface FormCategoryListResponse {
  statusCode: number;
  message: string;
  data: FormCategory[];
}
