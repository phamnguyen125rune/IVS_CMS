import { useState, useEffect, useMemo } from 'react';

import { roleService } from '@/services/role.service';

import { permissionService } from '@/services/permission.service';

import { RolePermissions, Api, Action } from '@/types';

export const usePermissions = () => {
  const [roles, setRoles] = useState<RolePermissions[]>([]);
  const [apis, setApis] = useState<Api[]>([]);

  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const actions = useMemo<Action[]>(() => {
    const actionMap = new Map<number, Action>();

    apis.forEach((api) => {
      api.actions?.forEach((action) => {
        actionMap.set(action.actionId, action);
      });
    });

    return Array.from(actionMap.values()).sort((a, b) => a.actionId - b.actionId);
  }, [apis]);

  const fetchRoles = async () => {
    const data = await roleService.getAllRoles();

    setRoles(data);

    setSelectedRole((previous) => {
      if (previous !== null && data.some((role) => role.roleId === previous)) {
        return previous;
      }

      return data.length > 0 ? data[0].roleId : null;
    });
  };

  const fetchApiActions = async () => {
    const data = await permissionService.getAllApiActions();

    setApis(data);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true);

        await Promise.all([fetchRoles(), fetchApiActions()]);
      } catch (error) {
        console.error('Không thể tải dữ liệu permission:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (selectedRole === null) {
      setRolePermissions([]);

      return;
    }

    const role = roles.find((item) => item.roleId === selectedRole);

    if (!role) {
      setRolePermissions([]);

      return;
    }

    const permissionKeys = (role.permissions ?? []).map(
      (permission) => `${permission.apiLink}:${permission.actionName.toUpperCase()}`
    );

    setRolePermissions(permissionKeys);
  }, [selectedRole, roles]);

  const isActionSupported = (apiLink: string, actionName: string) => {
    const api = apis.find((item) => item.apiLink === apiLink);

    if (!api) {
      return false;
    }

    return api.actions.some(
      (action) => action.actionName.toUpperCase() === actionName.toUpperCase()
    );
  };

  const hasPermission = (apiLink: string, actionName: string) => {
    const key = `${apiLink}:${actionName.toUpperCase()}`;

    return rolePermissions.includes(key);
  };

  const handleTogglePermission = (apiLink: string, actionName: string) => {
    if (!isActionSupported(apiLink, actionName)) {
      return;
    }

    const key = `${apiLink}:${actionName.toUpperCase()}`;

    setRolePermissions((previous) => {
      if (previous.includes(key)) {
        return previous.filter((permission) => permission !== key);
      }

      return [...previous, key];
    });
  };

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

      console.log('Permission payload:', {
        roleId: selectedRole,
        permissions,
      });

      const response = await permissionService.updateRolePermissionsByApiLink(selectedRole, {
        permissions,
      });

      setRoles((previousRoles) =>
        previousRoles.map((role) => {
          if (role.roleId !== selectedRole) {
            return role;
          }

          return {
            ...role,
            permissions,
          };
        })
      );

      alert(response || 'Cập nhật phân quyền thành công!');
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

    hasPermission,

    isActionSupported,

    handleTogglePermission,

    handleSave,

    isLoading,
  };
};
