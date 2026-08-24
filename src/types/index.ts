// ============================================================
// Domain Types — Định nghĩa kiểu dữ liệu toàn dự án
//
// Quy tắc:
//   - Type dùng ở 1 file duy nhất → khai báo ngay trong file đó
//   - Type dùng ở nhiều nơi → khai báo tại đây
//
// Trạng thái: PLACEHOLDER — sẽ được bổ sung khi Java team
// hoàn thiện entity. Các field có thể thay đổi.
// ============================================================

// ----------------------------
// Auth / User
// ----------------------------

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: Role;
  employeeCode?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Role {
  id: number;
  name: string; // VD: 'ADMIN', 'EDITOR', 'VIEWER'
  description?: string;
  active?: boolean;
  permissions: string[]; // VD: ['post:create', 'post:publish']
}

export interface RoleLogin {
  id: number;
  name: string;
  permissions: string[];
}

export interface UserLogin {
  id: number;
  fullname: string;
  email: string;
  role?: RoleLogin | null;
  employeeCode?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  access_token: string;
  user: UserLogin;
}

export interface RoleUser {
  id: number;
  name: string;
}

export interface ResUserDTO {
  id: number;
  fullname: string;
  email: string;
  avatarUrl?: string | null;
  phone?: string | null;
  age?: number;
  address?: string | null;
  gender?: string | null;
  employeeCode?: string | null;
  dateOfBirth?: string | null;
  status: string;
  role?: RoleUser | null;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface UserCreatePayload {
  fullname?: string;
  email: string;
  phone?: string;
  age?: number;
  address?: string;
  gender?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  roleId?: number;
}

export interface ResultPaginationDTO<T> {
  meta: {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
  };
  result: T[];
}

// ----------------------------
// Content / Post (Bài viết)
// ----------------------------

// PLACEHOLDER: Cần Java team xác nhận field list
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string; // HTML từ rich text editor
  excerpt?: string; // Tóm tắt ngắn
  status: ContentStatus;
  authorId: string;
  categoryId?: string;
  tags: Tag[];
  featuredImageId?: string; // ID trong MediaFile
  locale: string; // VD: 'vi', 'en'
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Trạng thái workflow bài viết (theo yêu cầu team nội dung)
export type ContentStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ARCHIVED' | 'TRASH';

// ----------------------------
// Category & Tag
// ----------------------------

// PLACEHOLDER
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string; // hỗ trợ danh mục lồng nhau
  locale: string;
}

// PLACEHOLDER
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// ----------------------------
// Media / File Upload
// ----------------------------

// PLACEHOLDER: Đường dẫn file phụ thuộc chiến lược lưu trữ (Local / Cloud)
export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string; // VD: 'image/webp', 'application/pdf'
  sizeBytes: number;
  url: string; // URL public để hiển thị
  storageType: 'LOCAL' | 'S3' | 'CLOUDINARY';
  width?: number; // chỉ có nếu là ảnh
  height?: number;
  uploadedAt: string;
}

// ----------------------------
// Settings / Config hệ thống
// ----------------------------

// PLACEHOLDER
export interface SystemSettings {
  siteName: string;
  logoUrl?: string;
  supportedLocales: string[]; // VD: ['vi', 'en']
  defaultLocale: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: Record<string, string>;
}

// ----------------------------
// API Response wrapper
// ----------------------------

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
