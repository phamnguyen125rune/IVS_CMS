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
    <div className={styles.container}>
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
              Thêm role
            </button>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        {error && <div className={styles.errorBox}>{error}</div>}

        <RoleList
          roles={roles}
          selectedRole={selectedRole}
          onSelectRole={handleSelectRole}
          onEdit={openEditModal}
          onDelete={setDeleteTarget}
        />

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

        {loading && <div className={styles.loading}>Đang tải dữ liệu...</div>}
      </main>

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
