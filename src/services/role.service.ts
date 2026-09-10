import { apiFetch } from '@/utils/api-client';

import { RolePermissions, RoleUser2, CreateRolePayload, UpdateRolePayload } from '@/types';

export interface IRoleService {
  getAllRoles(): Promise<RolePermissions[]>;

  getUserByRoleId(roleId: number): Promise<RoleUser2[]>;

  searchUsersNotInRole(roleId: number, keyword: string): Promise<RoleUser2[]>;

  addUserRole(roleId: number, userIds: number[]): Promise<string>;

  createRole(payload: CreateRolePayload): Promise<RolePermissions>;

  updateRole(roleId: number, payload: UpdateRolePayload): Promise<RolePermissions>;

  deleteRole(roleId: number): Promise<string>;
}

export class RoleService implements IRoleService {
  async getAllRoles(): Promise<RolePermissions[]> {
    return apiFetch<RolePermissions[]>('/api/v1/roles', {
      method: 'GET',
    });
  }

  async getUserByRoleId(roleId: number): Promise<RoleUser2[]> {
    return apiFetch<RoleUser2[]>(`/api/v1/roles/${roleId}/users`, {
      method: 'GET',
    });
  }

  async searchUsersNotInRole(roleId: number, keyword: string): Promise<RoleUser2[]> {
    return apiFetch<RoleUser2[]>(
      `/api/v1/roles/${roleId}/search?keyword=${encodeURIComponent(keyword)}`,
      {
        method: 'GET',
      }
    );
  }

  async addUserRole(roleId: number, userIds: number[]): Promise<string> {
    const response = await apiFetch<{ message: string }>(`/api/v1/roles/${roleId}/users`, {
      method: 'PUT',
      body: JSON.stringify(userIds),
    });

    return response.message;
  }

  async setUsersToDefaultRole(userIds: number[]): Promise<string> {
    const response = await apiFetch<{ message: string }>(`/api/v1/roles/default/users`, {
      method: 'PUT',
      body: JSON.stringify(userIds),
    });

    return response.message;
  }

  async createRole(payload: CreateRolePayload): Promise<RolePermissions> {
    return apiFetch<RolePermissions>('/api/v1/roles', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateRole(roleId: number, payload: UpdateRolePayload): Promise<RolePermissions> {
    return apiFetch<RolePermissions>(`/api/v1/roles/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteRole(roleId: number): Promise<string> {
    return apiFetch<string>(`/api/v1/roles/${roleId}`, {
      method: 'DELETE',
    });
  }
}

export const roleService = new RoleService();
