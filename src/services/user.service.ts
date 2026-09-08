import { ResUserDTO, ResultPaginationDTO, Role, UserCreatePayload } from '@/types';
import { apiFetch } from '@/utils/api-client';

export class UserService {
  async getMyProfile(): Promise<ResUserDTO> {
    return apiFetch<ResUserDTO>('/api/v1/users/me');
  }

  async updateMyProfile(payload: UserCreatePayload): Promise<ResUserDTO> {
    return apiFetch<ResUserDTO>('/api/v1/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async changePassword(payload: { oldPassword: string; newPassword: string }): Promise<void> {
    await apiFetch('/api/v1/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async getUsers(page = 1, size = 10): Promise<ResultPaginationDTO<ResUserDTO>> {
    return apiFetch<ResultPaginationDTO<ResUserDTO>>(`/api/v1/users?page=${page}&size=${size}`);
  }

  async createUser(payload: UserCreatePayload): Promise<ResUserDTO> {
    return apiFetch<ResUserDTO>('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateUser(id: number, payload: UserCreatePayload): Promise<UserCreatePayload> {
    return apiFetch<UserCreatePayload>(`/api/v1/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateUserStatus(id: number, status: string): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getDeletedUsers(): Promise<ResUserDTO[]> {
    return apiFetch<ResUserDTO[]>('/api/v1/users/deleted');
  }

  async softDeleteUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
    });
  }

  async restoreUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/restore`, {
      method: 'PUT',
    });
  }

  async hardDeleteUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/hard`, {
      method: 'DELETE',
    });
  }

  async resetUserPassword(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}/reset-password`, {
      method: 'PUT',
    });
  }

  async deleteUser(id: number): Promise<void> {
    await apiFetch(`/api/v1/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoles(): Promise<Role[]> {
    return apiFetch<Role[]>('/api/v1/roles');
  }

  async uploadMyAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<{ avatarUrl: string }>('/api/v1/users/avatar', {
      method: 'POST',
      body: formData,
    });
  }

  async uploadUserAvatar(id: number, file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return apiFetch<{ avatarUrl: string }>(`/api/v1/users/${id}/avatar`, {
      method: 'POST',
      body: formData,
    });
  }
}

export const userService = new UserService();
