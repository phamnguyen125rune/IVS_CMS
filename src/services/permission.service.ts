import { apiFetch } from '@/utils/api-client';
import { Api, UpdatePermissionByIdPayload, UpdatePermissionByLinkPayload, PermissionLinkPayload } from '@/types';


const permissionApiLink = '/api/v1/permissions';

export interface IPermissionService {
  getAllApiActions(): Promise<Api[]>;

  updateRolePermissionsById(roleId: number, payload: UpdatePermissionByIdPayload): Promise<string>;

  updateRolePermissionsByApiLink(roleId: number,payload: UpdatePermissionByLinkPayload): Promise<string>;

  checkPermission(payload: PermissionLinkPayload): Promise<boolean>;
}

export class PermissionService implements IPermissionService {
  async getAllApiActions(): Promise<Api[]> {
    return apiFetch<Api[]>(`${permissionApiLink}/apiAction`, {
      method: 'GET',
    });
  }

  async updateRolePermissionsById(
    roleId: number,
    payload: UpdatePermissionByIdPayload
  ): Promise<string> {
    return apiFetch<string>(`${permissionApiLink}/update/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateRolePermissionsByApiLink(
    roleId: number,
    payload: UpdatePermissionByLinkPayload
  ): Promise<string> {
    return apiFetch<string>(`${permissionApiLink}/update/link/${roleId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async checkPermission(payload: PermissionLinkPayload): Promise<boolean>{
    return apiFetch<boolean>(`${permissionApiLink}/check`,{
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const permissionService = new PermissionService();
