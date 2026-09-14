'use client';
import { FormEvent, useEffect, useState } from 'react';
import { UserService } from '@/services/user.service';

import { RolePermissions, RoleUser2 } from '@/types';

import { useRole } from './useRole';

export function useRoleManagement() {
  // =========================================================
  // ROLE API
  // =========================================================

  const {
    roles,
    loading,
    saving,
    error,

    fetchRoles,
    fetchRoleMembers,
    saveRoleMembers,
    searchUsersNotInRole,
    setUsersToDefaultRole,

    createRole,
    updateRole,
    deleteRole,
  } = useRole();

  // =========================================================
  // SELECTED ROLE
  // =========================================================
  const userService = new UserService();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [selectedRole, setSelectedRole] = useState<RolePermissions | null>(null);

  const [members, setMembers] = useState<RoleUser2[]>([]);

  const [hasChanged, setHasChanged] = useState(false);

  // =========================================================
  // ADD MEMBER MODAL
  // =========================================================

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [availableMembers, setAvailableMembers] = useState<RoleUser2[]>([]);

  const [selectedNewMembers, setSelectedNewMembers] = useState<RoleUser2[]>([]);

  const [memberSearchKeyword, setMemberSearchKeyword] = useState('');

  const [searchingMembers, setSearchingMembers] = useState(false);

  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  // =========================================================
  // ROLE FORM MODAL
  // =========================================================

  const [showRoleModal, setShowRoleModal] = useState(false);

  const [editingRole, setEditingRole] = useState<RolePermissions | null>(null);

  const [roleName, setRoleName] = useState('');

  const [roleDescription, setRoleDescription] = useState('');

  // =========================================================
  // DELETE ROLE
  // =========================================================

  const [deleteTarget, setDeleteTarget] = useState<RolePermissions | null>(null);

  // =========================================================
  // SELECT ROLE
  // =========================================================
  const [removedUserIds, setRemovedUserIds] = useState<number[]>([]);
  const handleSelectRole = async (role: RolePermissions) => {
    setSelectedRole(role);
    setRemovedUserIds([]);

    const users = await fetchRoleMembers(role.roleId);
    setMembers(users);
    setHasChanged(false);
  };

  // =========================================================
  // MEMBER
  // =========================================================

  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const profile = await userService.getMyProfile();

        console.log('PROFILE:', profile);
        console.log('CURRENT USER ID FROM API:', profile.userId);

        setCurrentUserId(profile.userId);
      } catch (error) {
        console.error('Không thể lấy thông tin user hiện tại:', error);
      }
    };

    loadCurrentUser();
  }, []);

  useEffect(() => {
    console.log('CURRENT USER ID STATE:', currentUserId);
  }, [currentUserId]);

  const handleRemoveMember = (userId: number) => {
    setMembers((prev) => prev.filter((user) => user.userId !== userId));

    setRemovedUserIds((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    setHasChanged(true);
  };

  const handleSaveMembers = async () => {
    if (removedUserIds.length === 0) {
      return;
    }

    try {
      const message = await setUsersToDefaultRole(removedUserIds);

      alert(message);

      setRemovedUserIds([]);
      setHasChanged(false);

      if (selectedRole) {
        const updatedMembers = await fetchRoleMembers(selectedRole.roleId);

        setMembers(updatedMembers);
      }
    } catch (error) {
      console.error('Lỗi khi lưu thay đổi:', error);
    }
  };

  const handleReset = async () => {
    if (!selectedRole) {
      return;
    }

    const data = await fetchRoleMembers(selectedRole.roleId);

    setMembers(data);
    setRemovedUserIds([]);
    setHasChanged(false);
  };

  // =========================================================
  // ADD MEMBER MODAL
  // =========================================================

  const openAddMemberModal = async () => {
    if (!selectedRole) {
      return;
    }

    setIsAddMemberModalOpen(true);

    setMemberSearchKeyword('');
    setSelectedNewMembers([]);
    setAvailableMembers([]);
    setAddMemberError(null);

    try {
      setSearchingMembers(true);

      const data = await searchUsersNotInRole(selectedRole.roleId, '');

      setAvailableMembers(data);
    } catch (err) {
      console.error('Failed to load available members:', err);

      setAddMemberError(err instanceof Error ? err.message : 'Không thể tải danh sách thành viên');
    } finally {
      setSearchingMembers(false);
    }
  };

  const closeAddMemberModal = () => {
    setIsAddMemberModalOpen(false);

    setAvailableMembers([]);
    setSelectedNewMembers([]);
    setMemberSearchKeyword('');
    setAddMemberError(null);
  };

  const handleSearchMembers = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      return;
    }

    try {
      setSearchingMembers(true);
      setAddMemberError(null);

      const data = await searchUsersNotInRole(selectedRole.roleId, memberSearchKeyword.trim());

      setAvailableMembers(data);
    } catch (err) {
      console.error('Failed to search members:', err);

      setAddMemberError(err instanceof Error ? err.message : 'Không thể tìm kiếm thành viên');

      setAvailableMembers([]);
    } finally {
      setSearchingMembers(false);
    }
  };

  const handleSelectMember = (user: RoleUser2) => {
    setSelectedNewMembers((prev) => {
      const alreadySelected = prev.some((item) => item.userId === user.userId);

      if (alreadySelected) {
        return prev;
      }

      return [...prev, user];
    });

    setAvailableMembers((prev) => prev.filter((item) => item.userId !== user.userId));
  };

  const handleCancelAddMember = (user: RoleUser2) => {
    setSelectedNewMembers((prev) => prev.filter((item) => item.userId !== user.userId));

    setAvailableMembers((prev) => [...prev, user]);
  };

  const handleCompleteAddMembers = async () => {
    if (!selectedRole) {
      return;
    }

    if (selectedNewMembers.length === 0) {
      return;
    }

    try {
      setAddMemberError(null);

      await saveRoleMembers(selectedRole.roleId, [...members, ...selectedNewMembers]);

      setMembers((prev) => [...prev, ...selectedNewMembers]);

      setIsAddMemberModalOpen(false);
      setSelectedNewMembers([]);
      setAvailableMembers([]);
      setMemberSearchKeyword('');
    } catch (err) {
      console.error('Failed to add members:', err);

      setAddMemberError(err instanceof Error ? err.message : 'Không thể thêm thành viên');
    }
  };

  // =========================================================
  // CREATE / EDIT ROLE
  // =========================================================

  const openCreateModal = () => {
    setEditingRole(null);

    setRoleName('');
    setRoleDescription('');

    setShowRoleModal(true);
  };

  const openEditModal = (role: RolePermissions) => {
    setEditingRole(role);

    setRoleName(role.roleName);
    setRoleDescription(role.roleDescription || '');

    setShowRoleModal(true);
  };

  const closeRoleModal = () => {
    setShowRoleModal(false);
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
  };

  const handleSubmitRole = async (e: FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      return;
    }

    try {
      if (editingRole) {
        await updateRole(editingRole.roleId, {
          roleName: roleName.trim(),
          roleDescription: roleDescription.trim(),
        });
      } else {
        await createRole({
          roleName: roleName.trim(),
          roleDescription: roleDescription.trim(),
        });
      }

      await fetchRoles();

      closeRoleModal();
    } catch (error) {
      console.error('Lỗi lưu role:', error);

      alert(editingRole ? 'Cập nhật role thất bại' : 'Tạo role thất bại');
    }
  };

  // =========================================================
  // DELETE ROLE
  // =========================================================

  const handleDeleteRole = async (role: RolePermissions) => {
    try {
      await deleteRole(role.roleId);

      if (selectedRole?.roleId === role.roleId) {
        setSelectedRole(null);
        setMembers([]);
        setHasChanged(false);
      }

      setDeleteTarget(null);

      await fetchRoles();
    } catch (error) {
      console.error('Lỗi xóa role:', error);

      alert('Xóa role thất bại');
    }
  };

  // =========================================================
  // RETURN
  // =========================================================

  return {
    // API state
    roles,
    loading,
    saving,
    error,

    //User
    currentUserId,

    // Selected role
    selectedRole,
    members,
    hasChanged,

    // Add member
    isAddMemberModalOpen,
    availableMembers,
    selectedNewMembers,
    memberSearchKeyword,
    searchingMembers,
    addMemberError,

    // Role form
    showRoleModal,
    editingRole,
    roleName,
    roleDescription,

    // Delete
    deleteTarget,

    // Selected role
    handleSelectRole,

    // Member
    handleRemoveMember,
    handleSaveMembers,
    handleReset,

    // Add member
    openAddMemberModal,
    closeAddMemberModal,
    handleSearchMembers,
    handleSelectMember,
    handleCancelAddMember,
    handleCompleteAddMembers,

    // Role
    openCreateModal,
    openEditModal,
    closeRoleModal,
    handleSubmitRole,

    // Delete
    setDeleteTarget,
    handleDeleteRole,

    // Input setters
    setMemberSearchKeyword,
    setRoleName,
    setRoleDescription,
  };
}
