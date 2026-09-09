import { apiFetch } from '@/utils/api-client';
import { Api, UpdatePermissionByIdPayload, UpdatePermissionByLinkPayload } from '@/types';

export interface IPermissionService {
  getAllApiActions(): Promise<Api[]>;

  updateRolePermissionsById(roleId: number, payload: UpdatePermissionByIdPayload): Promise<string>;

  updateRolePermissionsByApiLink(
    roleId: number,
    payload: UpdatePermissionByLinkPayload
  ): Promise<string>;
}

export class PermissionService implements IPermissionService {
  async getAllApiActions(): Promise<Api[]> {
    return apiFetch<Api[]>('/api/v1/permissions/apiAction', {
      method: 'GET',
    });
  }

  async updateRolePermissionsById(
    roleId: number,
    payload: UpdatePermissionByIdPayload
  ): Promise<string> {
    return apiFetch<string>(`/api/v1/permissions/update/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateRolePermissionsByApiLink(
    roleId: number,
    payload: UpdatePermissionByLinkPayload
  ): Promise<string> {
    return apiFetch<string>(`/api/v1/permissions/update/link/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }
}

export const permissionService = new PermissionService();
