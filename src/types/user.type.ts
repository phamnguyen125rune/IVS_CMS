export type UserGender = 'FEMALE' | 'MALE' | 'OTHERS';
export type UserStatus = 'ACTIVE' | 'LOCKED';

export interface UserRole {
  roleId: number;
  roleName: string;
}

/**
 * DTO trả về từ UserController cho danh sách, chi tiết và hồ sơ hiện tại.
 * Mapping 1-1 với ResUserDTO của BE.
 */
export interface UserResponse {
  userId: number;
  employeeCode: string | null;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: UserGender | null;
  address: string | null;
  isActive: boolean;
  isSystem: boolean;
  role: UserRole | null;
  createdAt: string | null;
  createdBy: number | null;
  updatedAt: string | null;
  updatedBy: number | null;
}

/** Mapping 1-1 với ReqUserCreateDTO. */
export interface UserCreateRequest {
  fullName: string;
  email: string;
  password: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  gender?: UserGender | null;
  dateOfBirth?: string | null;
}

/** Mapping 1-1 với ResUserCreateDTO. */
export interface UserCreateResponse {
  userId: number;
  employeeCode: string | null;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: UserGender | null;
  address: string | null;
  isActive: boolean;
  role: UserRole | null;
  createdAt: string | null;
  createdBy: number | null;
}

/** Mapping 1-1 với ReqUserUpdateDTO. */
export interface UserUpdateRequest {
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  gender?: UserGender | null;
  dateOfBirth?: string | null;
  isActive?: boolean | null;
}

/** BE hiện trả lại ReqUserUpdateDTO sau khi cập nhật. */
export type UserUpdateResponse = UserUpdateRequest;

/** Mapping đúng ReqUpdateProfileDTO; BE profile vẫn dùng fullname/phone/age. */
export interface UserProfileUpdateRequest {
  fullname: string;
  phone?: string | null;
  age: number;
  address?: string | null;
  gender?: UserGender | null;
  dateOfBirth?: string | null;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserPaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface UserPaginationResponse {
  meta: UserPaginationMeta;
  result: UserResponse[];
}

export interface UserAvatarResponse {
  avatarUrl: string;
}

/** Dữ liệu cần dùng từ GET /api/v1/roles trên màn hình quản lý User. */
export interface UserRoleOption {
  roleId: number;
  roleName: string;
  roleDescription?: string | null;
  isActive: boolean;
  isSystem: boolean;
}

/** State form phía FE; không phải DTO gửi trực tiếp sang BE. */
export interface UserFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gender: UserGender;
  dateOfBirth: string;
  avatarUrl: string;
}
