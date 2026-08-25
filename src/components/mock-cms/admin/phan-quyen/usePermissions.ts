import { useState, useEffect } from 'react';

import { roleService } from '@/services/role.service';
import { permissionService } from '@/services/permission.service';

import { RolePermissions, Api, Action } from '@/types';

export const usePermissions = () => {
  const [roles, setRoles] = useState<RolePermissions[]>([]);
  const [apis, setApis] = useState<Api[]>([]);
  const [actions, setActions] = useState<Action[]>([]);

  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  /**
   * Format:
   * apiLink:ACTION
   *
   * Ví dụ:
   * user:VIEW
   * role:CREATE
   */
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Load roles
   */
  const fetchRoles = async () => {
    const data = await roleService.getAllRoles();

    setRoles(data);

    if (data.length > 0) {
      setSelectedRole((prev) => (prev === null ? data[0].roleId : prev));
    }
  };

  /**
   * Load APIs
   */
  const fetchApis = async () => {
    const data = await permissionService.getAllApis();

    setApis(data);
  };

  /**
   * Load Actions
   */
  const fetchActions = async () => {
    const data = await permissionService.getAllActions();

    setActions(data);
  };

  /**
   * Load toàn bộ dữ liệu
   */
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);

        await Promise.all([fetchRoles(), fetchApis(), fetchActions()]);
      } catch (error) {
        console.error('Không thể tải dữ liệu permission:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  /**
   * Khi thay đổi Role
   *
   * Convert permission backend trả về
   * thành format thống nhất:
   *
   * apiLink:ACTION
   *
   * Ví dụ:
   * user:VIEW
   */
  useEffect(() => {
    if (selectedRole === null) {
      return;
    }

    const role = roles.find((role) => role.roleId === selectedRole);

    if (!role) {
      setRolePermissions([]);
      return;
    }

    const permissionKeys = (role.permissions ?? []).map(
      (permission) => `${permission.apiLink}:${permission.actionName.toUpperCase()}`
    );

    setRolePermissions(permissionKeys);
  }, [selectedRole, roles]);

  /**
   * Toggle permission
   */
  const handleTogglePermission = (apiLink: string, actionName: string) => {
    const key = `${apiLink}:${actionName.toUpperCase()}`;

    setRolePermissions((prev) => {
      if (prev.includes(key)) {
        return prev.filter((permission) => permission !== key);
      }

      return [...prev, key];
    });
  };

  /**
   * Kiểm tra role có permission không
   */
  const hasPermission = (apiLink: string, actionName: string) => {
    const key = `${apiLink}:${actionName.toUpperCase()}`;

    return rolePermissions.includes(key);
  };

  /**
   * Save permission
   */
  const buildPermissionPayload = () => {
    return rolePermissions.map((permission) => {
      const [apiLink, actionName] = permission.split(':');

      return {
        apiLink,
        actionName,
      };
    });
  };
  const handleSave = async () => {
    if (selectedRole === null) {
      alert('Vui lòng chọn role!');
      return;
    }

    try {
      setIsLoading(true);

      const permissions = buildPermissionPayload();

      console.log('Role ID:', selectedRole);
      console.log('Permissions gửi lên:', permissions);

      const response = await permissionService.updateRolePermissionsByApiLink(selectedRole, {
        permissions,
      });

      console.log('Update permission response:', response);

      /**
       * Cập nhật lại dữ liệu role local
       * để sau khi save UI vẫn giữ trạng thái mới
       */
      setRoles((prevRoles) =>
        prevRoles.map((role) => {
          if (role.roleId !== selectedRole) {
            return role;
          }

          return {
            ...role,
            permissions,
          };
        })
      );

      alert('Cập nhật phân quyền thành công!');
    } catch (error) {
      console.error('Không thể cập nhật permission:', error);

      alert('Không thể cập nhật phân quyền!');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    roles,
    apis,
    actions,

    rolePermissions,

    selectedRole,
    setSelectedRole,

    handleTogglePermission,
    hasPermission,

    handleSave,

    isLoading,
  };
};
