'use client';

import { useRoleManagement } from './useRoleManagement';

import MemberPanel from './components/MemberPanel';
import RoleList from './components/RoleList';

import AddMemberModal from './components/modal/AddMemberModal';
import RoleFormModal from './components/modal/RoleFormModal';
import DeleteRoleModal from './components/modal/DeleteRoleModal';

import styles from './Role.module.css';

export default function RoleManagement() {
  const {
    roles,
    loading,
    saving,
    error,

    currentUserId,

    selectedRole,
    members,
    hasChanged,

    isAddMemberModalOpen,
    availableMembers,
    selectedNewMembers,
    memberSearchKeyword,
    searchingMembers,
    addMemberError,

    showRoleModal,
    editingRole,
    roleName,
    roleDescription,

    deleteTarget,

    handleSelectRole,
    handleRemoveMember,
    handleSaveMembers,
    handleReset,

    openAddMemberModal,
    closeAddMemberModal,
    handleSearchMembers,
    handleSelectMember,
    handleCancelAddMember,
    handleCompleteAddMembers,

    openCreateModal,
    openEditModal,
    closeRoleModal,
    handleSubmitRole,

    setDeleteTarget,
    handleDeleteRole,

    setMemberSearchKeyword,
    setRoleName,
    setRoleDescription,
  } = useRoleManagement();

  console.log('Role.tsx currentUserId:', currentUserId);

  return (
    <div
      className="relative p-6"
      style={{
        color: 'var(--text)',
      }}
    >
      {/* =================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="
              font-display text-xl
              font-bold
            "
            style={{
              color: 'var(--text)',
            }}
          >
            Quản lý nhóm nhân sự
          </h1>

          <p
            className="mt-0.5 text-sm"
            style={{
              color: 'var(--text-secondary)',
            }}
          >
            Quản lý role và danh sách thành viên thuộc từng nhóm người dùng trong hệ thống.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            rounded-lg px-4 py-2
            text-sm font-semibold
            transition-colors
          "
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          Thêm role
        </button>
      </div>

      {/* =================================================
          ERROR
      ================================================== */}

      {error && <div className={styles.errorBox}>{error}</div>}

      {/* =================================================
          ROLE LIST
      ================================================== */}

      <RoleList
        roles={roles}
        selectedRole={selectedRole}
        onSelectRole={handleSelectRole}
        onEdit={openEditModal}
        onDelete={setDeleteTarget}
      />

      {/* =================================================
          MEMBER PANEL
      ================================================== */}

      {selectedRole ? (
        <MemberPanel
          currentUserId={currentUserId}
          role={selectedRole}
          members={members}
          saving={saving}
          hasChanged={hasChanged}
          onAddMember={openAddMemberModal}
          onSave={handleSaveMembers}
          onReset={handleReset}
          onRemoveMember={handleRemoveMember}
        />
      ) : (
        <div className={styles.selectRoleEmpty}>
          <h3>Chọn một role</h3>

          <p>Nhấn vào role phía trên để xem và quản lý danh sách thành viên.</p>
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================== */}

      {loading && <div className={styles.loading}>Đang tải dữ liệu...</div>}

      {/* =================================================
          ADD MEMBER MODAL
      ================================================== */}

      {selectedRole && (
        <AddMemberModal
          open={isAddMemberModalOpen}
          role={selectedRole}
          members={members}
          availableMembers={availableMembers}
          selectedNewMembers={selectedNewMembers}
          searching={searchingMembers}
          saving={saving}
          error={addMemberError}
          searchKeyword={memberSearchKeyword}
          onSearchKeywordChange={setMemberSearchKeyword}
          onClose={closeAddMemberModal}
          onSearch={handleSearchMembers}
          onSelectMember={handleSelectMember}
          onCancelMember={handleCancelAddMember}
          onComplete={handleCompleteAddMembers}
        />
      )}

      {/* =================================================
          ROLE FORM MODAL
      ================================================== */}

      <RoleFormModal
        open={showRoleModal}
        editingRole={editingRole}
        roleName={roleName}
        roleDescription={roleDescription}
        onRoleNameChange={setRoleName}
        onRoleDescriptionChange={setRoleDescription}
        onClose={closeRoleModal}
        onSubmit={handleSubmitRole}
      />

      {/* =================================================
          DELETE ROLE MODAL
      ================================================== */}

      <DeleteRoleModal
        role={deleteTarget}
        saving={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            handleDeleteRole(deleteTarget);
          }
        }}
      />
    </div>
  );
}
