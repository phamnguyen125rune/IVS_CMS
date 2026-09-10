import {
  ChangePasswordRequest,
  UserAvatarResponse,
  UserCreateRequest,
  UserCreateResponse,
  UserPaginationResponse,
  UserProfileUpdateRequest,
  UserResponse,
  UserStatus,
  UserUpdateRequest,
  UserUpdateResponse,
} from '@/types/user.type';
import { apiFetch } from '@/utils/api-client';

export interface IUserService {
  getMyProfile(): Promise<UserResponse>;
  updateMyProfile(payload: UserProfileUpdateRequest): Promise<UserResponse>;
  changePassword(payload: ChangePasswordRequest): Promise<void>;
  getUsers(page?: number, size?: number): Promise<UserPaginationResponse>;
  getUserById(id: number): Promise<UserResponse>;
  createUser(payload: UserCreateRequest): Promise<UserCreateResponse>;
  updateUser(id: number, payload: UserUpdateRequest): Promise<UserUpdateResponse>;
  updateUserStatus(id: number, status: UserStatus): Promise<void>;
  getDeletedUsers(): Promise<UserResponse[]>;
  softDeleteUser(id: number): Promise<void>;
  restoreUser(id: number): Promise<void>;
  hardDeleteUser(id: number): Promise<void>;
  resetUserPassword(id: number): Promise<void>;
  uploadMyAvatar(file: File): Promise<UserAvatarResponse>;
  uploadUserAvatar(id: number, file: File): Promise<UserAvatarResponse>;
}

export class UserService implements IUserService {
  getMyProfile(): Promise<UserResponse> {
    return apiFetch<UserResponse>('/api/v1/users/me');
  }

  updateMyProfile(payload: UserProfileUpdateRequest): Promise<UserResponse> {
    return apiFetch<UserResponse>('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async changePassword(payload: ChangePasswordRequest): Promise<void> {
    await apiFetch('/api/v1/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  getUsers(page = 1, size = 10): Promise<UserPaginationResponse> {
    const query = new URLSearchParams({ page: String(page), size: String(size) });
    return apiFetch<UserPaginationResponse>(`/api/v1/users?${query.toString()}`);
  }

  getUserById(id: number): Promise<UserResponse> {
    return apiFetch<UserResponse>(`/api/v1/users/${id}`);
  }

  createUser(payload: UserCreateRequest): Promise<UserCreateResponse> {
    return apiFetch<UserCreateResponse>('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  updateUser(id: number, payload: UserUpdateRequest): Promise<UserUpdateResponse> {
    return apiFetch<UserUpdateResponse>(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateUserStatus(id: number, status: UserStatus): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  getDeletedUsers(): Promise<UserResponse[]> {
    return apiFetch<UserResponse[]>('/api/v1/users/deleted');
  }

  async softDeleteUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}`, { method: 'DELETE' });
  }

  async restoreUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/restore`, { method: 'PUT' });
  }

  async hardDeleteUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/hard`, { method: 'DELETE' });
  }

  async resetUserPassword(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/reset-password`, { method: 'PUT' });
  }

  uploadMyAvatar(file: File): Promise<UserAvatarResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<UserAvatarResponse>('/api/v1/users/avatar', {
      method: 'POST',
      body: formData,
    });
  }

  uploadUserAvatar(id: number, file: File): Promise<UserAvatarResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<UserAvatarResponse>(`/api/v1/users/${id}/avatar`, {
      method: 'POST',
      body: formData,
    });
  }
}

export const userService = new UserService();
