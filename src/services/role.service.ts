import { apiFetch } from '@/utils/api-client';
import { RolePermissions } from '@/types';

export interface IRoleService {
  getAllRoles(): Promise<RolePermissions[]>;
}

export class RoleService implements IRoleService {
  async getAllRoles(): Promise<RolePermissions[]> {
    return apiFetch<RolePermissions[]>('/api/v1/roles', {
      method: 'GET',
    });
  }
}

export const roleService = new RoleService();
