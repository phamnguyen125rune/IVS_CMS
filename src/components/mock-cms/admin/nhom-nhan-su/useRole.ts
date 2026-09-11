import { useCallback, useEffect, useState } from 'react';

import { roleService } from '@/services/role.service';

import { RolePermissions, RoleUser2, CreateRolePayload, UpdateRolePayload } from '@/types';

export function useRole() {
  // =========================================================
  // ROLE STATE
  // =========================================================

  const [members, setMembers] = useState<RoleUser2[]>([]);
  const [roles, setRoles] = useState<RolePermissions[]>([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // GET ALL ROLES
  // =========================================================

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await roleService.getAllRoles();

      setRoles(data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);

      setError(err instanceof Error ? err.message : 'Không thể tải danh sách role');
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // GET MEMBERS OF CURRENT ROLE
  // =========================================================

  const fetchRoleMembers = useCallback(async (roleId: number): Promise<RoleUser2[]> => {
    try {
      setLoading(true);
      setError(null);

      const data = await roleService.getUserByRoleId(roleId);

      setMembers(data);

      return data;
    } catch (err) {
      console.error('Failed to fetch role members:', err);

      setError(err instanceof Error ? err.message : 'Không thể tải danh sách thành viên');

      setMembers([]);

      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // SEARCH USERS NOT IN ROLE
  //
  // keyword = ''
  // => lấy tất cả user chưa thuộc role
  //
  // keyword != ''
  // => tìm user chưa thuộc role
  // =========================================================

  const searchUsers = useCallback(async (roleId: number, keyword: string): Promise<RoleUser2[]> => {
    try {
      const searchValue = keyword.trim();

      const data = await roleService.searchUsersNotInRole(roleId, searchValue);

      return data;
    } catch (err) {
      console.error('Failed to search users not in role:', err);

      throw err;
    }
  }, []);

  const searchUsersNotInRole = useCallback(
    async (roleId: number, keyword: string): Promise<RoleUser2[]> => {
      try {
        setError(null);

        const data = await roleService.searchUsersNotInRole(roleId, keyword);

        return data;
      } catch (err) {
        console.error('Failed to search users not in role:', err);

        setError(err instanceof Error ? err.message : 'Không thể tìm kiếm thành viên');

        return [];
      }
    },
    []
  );
  // =========================================================
  // ADD USERS TO ROLE
  //
  // Chỉ gửi những user mới được chọn.
  // =========================================================

  const saveRoleMembers = useCallback(async (roleId: number, users: RoleUser2[]): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      const userIds = users.map((user) => user.userId);

      await roleService.addUserRole(roleId, userIds);
    } catch (err) {
      console.error('Failed to save role members:', err);

      setError(err instanceof Error ? err.message : 'Không thể thêm thành viên');

      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // =========================================================
  // CREATE ROLE
  // =========================================================

  const createRole = useCallback(async (payload: CreateRolePayload): Promise<RolePermissions> => {
    try {
      setSaving(true);
      setError(null);

      const newRole = await roleService.createRole(payload);

      setRoles((prev) => [...prev, newRole]);

      return newRole;
    } catch (err) {
      console.error('Failed to create role:', err);

      setError(err instanceof Error ? err.message : 'Không thể tạo role');

      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // =========================================================
  // UPDATE ROLE
  // =========================================================

  const updateRole = useCallback(
    async (roleId: number, payload: UpdateRolePayload): Promise<RolePermissions> => {
      try {
        setSaving(true);
        setError(null);

        const updatedRole = await roleService.updateRole(roleId, payload);

        setRoles((prev) => prev.map((role) => (role.roleId === roleId ? updatedRole : role)));

        return updatedRole;
      } catch (err) {
        console.error('Failed to update role:', err);

        setError(err instanceof Error ? err.message : 'Không thể cập nhật role');

        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  // =========================================================
  // DELETE ROLE
  // =========================================================

  const deleteRole = useCallback(async (roleId: number): Promise<void> => {
    try {
      setSaving(true);
      setError(null);

      await roleService.deleteRole(roleId);

      setRoles((prev) => prev.filter((role) => role.roleId !== roleId));

      setMembers([]);
    } catch (err) {
      console.error('Failed to delete role:', err);

      setError(err instanceof Error ? err.message : 'Không thể xóa role');

      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // SET DEFAULT ROLE

  const setUsersToDefaultRole = useCallback(async (userIds: number[]) => {
    try {
      setSaving(true);

      const message = await roleService.setUsersToDefaultRole(userIds);

      return message;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Không thể đưa thành viên về nhóm mặc định'
      );
      throw error;
    } finally {
      setSaving(false);
    }
  }, []);

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    members,
    loading,
    saving,
    error,

    fetchRoles,
    fetchRoleMembers,

    // search user chưa thuộc role
    searchUsers,

    // add user vào role
    saveRoleMembers,
    searchUsersNotInRole,

    setUsersToDefaultRole,
    createRole,
    updateRole,
    deleteRole,
  };
}
