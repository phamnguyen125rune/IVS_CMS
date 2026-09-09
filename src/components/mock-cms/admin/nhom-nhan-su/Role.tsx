'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

import { Users, Search, Plus, Trash2, Pencil, Save, X, UserPlus, RefreshCw } from 'lucide-react';

import styles from './Role.module.css';

import { useRole } from './useRole';

import { RolePermissions, RoleUser2 } from '@/types';

export default function RoleManagement() {
  const {
    roles,
    loading,
    saving,
    error,

    fetchRoles,
    fetchRoleMembers,
    saveRoleMembers,
    searchUsersNotInRole,
    createRole,
    updateRole,
    deleteRole,
  } = useRole();

  const [selectedRole, setSelectedRole] = useState<RolePermissions | null>(null);

  const [members, setMembers] = useState<RoleUser2[]>([]);

  const [memberSearch, setMemberSearch] = useState('');

  const [appliedMemberSearch, setAppliedMemberSearch] = useState('');

  const [showRoleModal, setShowRoleModal] = useState(false);

  const [editingRole, setEditingRole] = useState<RolePermissions | null>(null);

  const [roleName, setRoleName] = useState('');

  const [roleDescription, setRoleDescription] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<RolePermissions | null>(null);

  const [hasChanged, setHasChanged] = useState(false);

  const [addMemberSearch, setAddMemberSearch] = useState('');

  const [appliedAddMemberSearch, setAppliedAddMemberSearch] = useState('');

  const [availableUsers, setAvailableUsers] = useState<RoleUser2[]>([]);

  const [pendingMembers, setPendingMembers] = useState<RoleUser2[]>([]);

  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const [availableMembers, setAvailableMembers] = useState<RoleUser2[]>([]);

  const [selectedNewMembers, setSelectedNewMembers] = useState<RoleUser2[]>([]);

  const [memberSearchKeyword, setMemberSearchKeyword] = useState('');

  const [searchingMembers, setSearchingMembers] = useState(false);

  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  const handleSelectRole = async (role: RolePermissions) => {
    if (selectedRole?.roleId === role.roleId) {
      return;
    }

    setSelectedRole(role);

    setMemberSearch('');

    const data = await fetchRoleMembers(role.roleId);

    setMembers(data);

    setHasChanged(false);
  };

  /**
   * =========================================================
   * SEARCH USER
   * =========================================================
   */

  const handleSearchMembers = async () => {
    if (!selectedRole) {
      return;
    }

    try {
      setSearchingMembers(true);
      setAddMemberError(null);

      const data = await searchUsersNotInRole(selectedRole.roleId, memberSearchKeyword);

      setAvailableMembers(data);
    } catch (err) {
      console.error('Failed to search members:', err);

      setAddMemberError(err instanceof Error ? err.message : 'Không thể tìm kiếm thành viên');

      setAvailableMembers([]);
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

      // keyword = ''
      // => backend trả về toàn bộ user
      // chưa thuộc role hiện tại
      const data = await searchUsersNotInRole(selectedRole.roleId, '');

      setAvailableMembers(data);
    } catch (err) {
      console.error('Failed to load available members:', err);

      setAddMemberError(err instanceof Error ? err.message : 'Không thể tải danh sách thành viên');
    } finally {
      setSearchingMembers(false);
    }
  };

  const handleSearchMember = (e: FormEvent) => {
    e.preventDefault();
    setAppliedMemberSearch(memberSearch.trim());
  };

  const handleSelectMember = (user: RoleUser2) => {
    setSelectedNewMembers((prev) => {
      // Không cho chọn trùng
      const alreadySelected = prev.some((item) => item.userId === user.userId);

      if (alreadySelected) {
        return prev;
      }

      return [...prev, user];
    });

    // Xóa khỏi danh sách bên trái
    setAvailableMembers((prev) => prev.filter((item) => item.userId !== user.userId));
  };

  const handleCancelAddMember = (user: RoleUser2) => {
    setSelectedNewMembers((prev) => prev.filter((item) => item.userId !== user.userId));

    // Trả lại bên trái
    setAvailableMembers((prev) => [...prev, user]);
  };

  const filteredMembers = useMemo(() => {
    const keyword = appliedMemberSearch.trim().toLowerCase();
    if (!keyword) {
      return members;
    }
    return members.filter(
      (user) =>
        String(user.userId).includes(keyword) ||
        user.employeeCode.toLowerCase().includes(keyword) ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
    );
  }, [members, appliedMemberSearch]);

  const handleSearchAvailableUsers = async (e: FormEvent) => {
    e.preventDefault();

    const keyword = addMemberSearch.trim();

    if (!keyword) {
      setAvailableUsers([]);
      setAppliedAddMemberSearch('');
      return;
    }

    setAppliedAddMemberSearch(keyword);

    // TODO:
    // Gọi API tìm kiếm user ở đây
    //
    // const data = await searchUsers(keyword);
    //
    // setAvailableUsers(data);

    setAvailableUsers([]);
  };

  const handleSelectAvailableUser = (user: RoleUser2) => {
    const alreadyMember = members.some((member) => member.userId === user.userId);

    const alreadyPending = pendingMembers.some((member) => member.userId === user.userId);

    if (alreadyMember || alreadyPending) {
      return;
    }

    setPendingMembers((prev) => [...prev, user]);

    setAvailableUsers((prev) => prev.filter((item) => item.userId !== user.userId));
  };

  const modalMembers = [
    ...members.map((user) => ({
      ...user,
      isPending: false,
    })),

    ...pendingMembers.map((user) => ({
      ...user,
      isPending: true,
    })),
  ];

  const handleCompleteAddMembers = async () => {
    if (!selectedRole) {
      return;
    }

    // Không có user mới
    if (selectedNewMembers.length === 0) {
      return;
    }

    try {
      setAddMemberError(null);

      await saveRoleMembers(selectedRole.roleId, selectedNewMembers);

      // Thành công
      setIsAddMemberModalOpen(false);

      setSelectedNewMembers([]);

      setAvailableMembers([]);

      setMemberSearchKeyword('');
    } catch (err) {
      console.error('Failed to add members:', err);

      setAddMemberError(err instanceof Error ? err.message : 'Không thể thêm thành viên');
    }
  };

  /**
   * =========================================================
   * REMOVE MEMBER
   * =========================================================
   */

  const handleRemoveMember = (userId: number) => {
    setMembers((prev) => prev.filter((user) => user.userId !== userId));

    setHasChanged(true);
  };

  /**
   * =========================================================
   * SAVE MEMBERS
   * =========================================================
   */

  const handleSaveMembers = async () => {
    if (!selectedRole) {
      return;
    }

    try {
      await saveRoleMembers(selectedRole.roleId, members);

      setHasChanged(false);

      alert('Đã lưu danh sách thành viên');
    } catch {
      alert('Lưu danh sách thành viên thất bại');
    }
  };

  /**
   * =========================================================
   * RESET
   * =========================================================
   */

  const handleReset = async () => {
    if (!selectedRole) {
      return;
    }

    const data = await fetchRoleMembers(selectedRole.roleId);

    setMembers(data);

    setHasChanged(false);
  };

  /**
   * =========================================================
   * CREATE / UPDATE ROLE
   * =========================================================
   */

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

  const handleSubmitRole = async (e: FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      return;
    }

    try {
      if (editingRole) {
        await updateRole(editingRole.roleId, {
          roleName,
          roleDescription,
        });
      } else {
        await createRole({
          roleName,
          roleDescription,
        });
      }

      await fetchRoles();

      setShowRoleModal(false);
      setEditingRole(null);
    } catch (error) {
      console.error('Lỗi lưu role:', error);

      alert(editingRole ? 'Cập nhật role thất bại' : 'Tạo role thất bại');
    }
  };

  /**
   * =========================================================
   * DELETE ROLE
   * =========================================================
   */

  const handleDeleteRole = async (role: RolePermissions) => {
    try {
      console.log('Deleting role:', role);

      console.log('Deleting role ID:', role.roleId);

      await deleteRole(role.roleId);

      if (selectedRole?.roleId === role.roleId) {
        setSelectedRole(null);
        setMembers([]);
      }

      setDeleteTarget(null);

      await fetchRoles();
    } catch (error) {
      console.error('Lỗi xóa role:', error);

      alert('Xóa role thất bại');
    }
  };

  /**
   * =========================================================
   * FILTER SEARCH RESULTS
   * =========================================================
   */

  return (
    <div className={styles.container}>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className={styles.headerSection}>
        <div className={styles.headerInner}>
          <div className={styles.headerContent}>
            <div>
              <div className={styles.headerLabel}>User Management</div>

              <h1 className={styles.headerTitle}>Quản lý nhóm nhân sự</h1>

              <p className={styles.headerDescription}>
                Quản lý role và danh sách thành viên thuộc từng nhóm người dùng trong hệ thống.
              </p>
            </div>

            <button type="button" onClick={openCreateModal} className={styles.createRoleBtn}>
              <Plus size={18} />
              Thêm role
            </button>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        {/* =================================================
            ERROR
        ================================================= */}

        {error && <div className={styles.errorBox}>{error}</div>}

        {/* =================================================
            ROLE CARDS
        ================================================= */}

        <section className={styles.roleSection}>
          {roles.map((role) => {
            const isActive = selectedRole?.roleId === role.roleId;

            return (
              <div
                key={role.roleId}
                className={`${styles.roleCard} ${isActive ? styles.roleCardActive : ''}`}
                onClick={() => handleSelectRole(role)}
              >
                <div className={styles.roleCardTop}>
                  <div className={styles.roleIcon}>
                    <Users size={22} />
                  </div>

                  <div className={styles.roleActions}>
                    <button
                      type="button"
                      className={styles.iconBtn}
                      onClick={(e) => {
                        e.stopPropagation();

                        openEditModal(role);
                      }}
                      title="Chỉnh sửa role"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className={`${styles.iconBtn} ${styles.deleteBtn}`}
                      onClick={(e) => {
                        e.stopPropagation();

                        setDeleteTarget(role);
                      }}
                      title="Xóa role"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <h2 className={styles.roleName}>{role.roleName}</h2>

                <p className={styles.roleDescription}>{role.roleDescription || 'Chưa có mô tả'}</p>

                <div className={styles.memberCount}>
                  <Users size={15} />

                  <span>{role.memmberCount ?? 0} thành viên</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* =================================================
            MEMBERS
        ================================================= */}

        {selectedRole ? (
          <section className={styles.memberPanel}>
            {/* HEADER */}

            <div className={styles.memberPanelHeader}>
              <div>
                <div className={styles.memberLabel}>Thành viên của nhóm</div>

                <h2 className={styles.memberTitle}>{selectedRole.roleName}</h2>

                <p className={styles.memberDescription}>
                  Hiện có {selectedRole.memmberCount} thành viên trong nhóm.
                </p>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.addMemberHeaderBtn}
                  onClick={openAddMemberModal}
                >
                  <UserPlus size={16} />
                  Thêm thành viên
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  disabled={!hasChanged || saving}
                  className={styles.resetBtn}
                >
                  <RefreshCw size={16} />
                  Hoàn tác
                </button>

                <button
                  type="button"
                  onClick={handleSaveMembers}
                  disabled={!hasChanged || saving}
                  className={styles.saveBtn}
                >
                  <Save size={16} />

                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </div>

            {/* SEARCH */}

            <form className={styles.searchSection} onSubmit={handleSearchMember}>
              {' '}
              <div className={styles.searchInputWrapper}>
                {' '}
                <Search size={18} className={styles.searchIcon} />{' '}
                <input
                  type="text"
                  className={styles.searchInput}
                  value={memberSearchKeyword}
                  onChange={(e) => setMemberSearchKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchMembers();
                    }
                  }}
                  placeholder="Nhập mã nhân viên, họ tên hoặc email..."
                />{' '}
              </div>{' '}
              <button
                className={styles.searchBtn}
                onClick={handleSearchMembers}
                disabled={searchingMembers}
              >
                <Search size={16} />

                {searchingMembers ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </form>
            {/* =================================================
              TABLE
          ================================================= */}

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Employee ID</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((user) => (
                      <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.employeeCode}</td>
                        <td>
                          <div className={styles.userName}>{user.fullName}</div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.removeMemberBtn}
                            onClick={() => handleRemoveMember(user.userId)}
                          >
                            <Trash2 size={15} /> Bỏ khỏi nhóm
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className={styles.emptyCell}>
                        Không có thành viên này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className={styles.selectRoleEmpty}>
            <Users size={32} />

            <h3>Chọn một role</h3>

            <p>Nhấn vào role phía trên để xem và quản lý danh sách thành viên.</p>
          </div>
        )}

        {loading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      </main>
      {/* =====================================================
          ADD USER MODAL
      ===================================================== */}

      {isAddMemberModalOpen && selectedRole && (
        <div className={styles.modalOverlay}>
          <div className={styles.addMemberModal}>
            <div className={styles.modalHeader}>
              <div>
                <h2>Thêm thành viên</h2>

                <p>
                  Thêm thành viên vào role: <strong>{selectedRole.roleName}</strong>
                </p>
              </div>
              <button type="button" className={styles.closeModalBtn} onClick={closeAddMemberModal}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.addMemberContent}>
              {/* LEFT */}
              <div className={styles.availableMembersPanel}>
                <div className={styles.panelTitle}>Tìm kiếm thành viên</div>

                <form className={styles.addMemberSearch} onSubmit={handleSearchAvailableUsers}>
                  <div className={styles.searchInputWrapper}>
                    <Search size={17} className={styles.searchIcon} />

                    <input
                      type="text"
                      value={addMemberSearch}
                      onChange={(e) => setAddMemberSearch(e.target.value)}
                      placeholder="Nhập mã nhân viên, họ tên hoặc email..."
                      className={styles.searchInput}
                    />
                  </div>

                  <button type="submit" className={styles.searchBtn}>
                    <Search size={16} />
                    Tìm kiếm
                  </button>
                </form>

                <div className={styles.availableMembersList}>
                  {searchingMembers ? (
                    <div className={styles.emptySearchResult}>Đang tìm kiếm thành viên...</div>
                  ) : availableMembers.length === 0 ? (
                    <div className={styles.emptySearchResult}>Thành viên không tồn tại</div>
                  ) : (
                    availableMembers.map((user) => (
                      <button
                        key={user.userId}
                        type="button"
                        className={styles.availableUserItem}
                        onClick={() => handleSelectMember(user)}
                      >
                        <div className={styles.availableUserEmployeeCode}>{user.employeeCode}</div>

                        <div className={styles.availableUserName}>{user.fullName}</div>

                        <div className={styles.availableUserRole}>
                          Đang thuộc role: {user.roleId}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div className={styles.selectedMembersPanel}>
                <div className={styles.panelTitle}>Thành viên trong role</div>
                <div className={styles.selectedMembersList}>
                  {members.length === 0 && selectedNewMembers.length === 0 ? (
                    <div className={styles.emptyMemberList}>Chưa có thành viên</div>
                  ) : (
                    <>
                      {/* Thành viên cũ */}
                      {members.map((user) => (
                        <div key={`existing-${user.userId}`} className={styles.selectedMemberItem}>
                          <div>
                            <div className={styles.memberEmployeeCode}>{user.employeeCode}</div>

                            <div className={styles.memberFullName}>{user.fullName}</div>

                            <div className={styles.memberEmail}>{user.email}</div>
                          </div>

                          {/* Thành viên cũ KHÔNG có nút Hủy */}
                        </div>
                      ))}

                      {/* Thành viên mới */}
                      {selectedNewMembers.map((user) => (
                        <div key={`new-${user.userId}`} className={styles.selectedMemberItem}>
                          <div>
                            <div className={styles.memberEmployeeCode}>{user.employeeCode}</div>

                            <div className={styles.memberFullName}>{user.fullName}</div>

                            <div className={styles.memberEmail}>{user.email}</div>
                          </div>

                          <button
                            type="button"
                            className={styles.cancelAddBtn}
                            onClick={() => handleCancelAddMember(user)}
                          >
                            <X size={14} />
                            Hủy
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button type="button" className={styles.cancelBtn} onClick={closeAddMemberModal}>
                Hủy
              </button>
              <button
                type="button"
                className={styles.completeBtn}
                onClick={handleCompleteAddMembers}
                disabled={saving || selectedNewMembers.length === 0}
              >
                {saving ? 'Đang xử lý...' : 'Hoàn tất'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE / EDIT MODAL
      ===================================================== */}

      {showRoleModal && (
        <div className={styles.modalOverlay} onClick={() => setShowRoleModal(false)}>
          <form
            onSubmit={handleSubmitRole}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>{editingRole ? 'Chỉnh sửa role' : 'Thêm role mới'}</h3>

              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className={styles.closeBtn}
              >
                <X size={20} />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Tên role</label>

                <input
                  required
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Ví dụ: Manager"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Mô tả</label>

                <textarea
                  rows={4}
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  placeholder="Nhập mô tả cho role..."
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className={styles.cancelBtn}
              >
                Hủy
              </button>

              <button type="submit" className={styles.saveBtn}>
                <Save size={16} />

                {editingRole ? 'Cập nhật' : 'Tạo role'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => !saving && setDeleteTarget(null)}>
          <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteIcon}>
              <Trash2 size={24} />
            </div>

            <h3>Xóa role?</h3>

            <p>
              Bạn có chắc chắn muốn xóa role <strong>{deleteTarget.roleName}</strong>?
            </p>

            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={saving}
                className={styles.cancelBtn}
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={() => handleDeleteRole(deleteTarget)}
                disabled={saving}
                className={styles.confirmDeleteBtn}
              >
                {saving ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
