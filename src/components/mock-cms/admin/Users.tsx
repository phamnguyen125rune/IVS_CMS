'use client';

import Link from 'next/link';
import UserConfirmModal from './users/UserConfirmModal';
import UserDetailModal from './users/UserDetailModal';
import UserFormModal from './users/UserFormModal';
import UserTable from './users/UserTable';
import UserToolbar from './users/UserToolbar';
import { DEFAULT_USER_PASSWORD, UserConfirmAction, useUsers } from './users/hooks/useUsers';

export default function Users() {
  const user = useUsers();
  const confirm = getConfirmContent(user.confirmAction);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {user.showDeleted ? 'Người dùng đã xóa' : 'Quản lý Nhân sự'}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {user.filteredUsers.length} người dùng được tìm thấy
          </p>
        </div>
      </div>

      {(user.message || user.error) && (
        <div
          className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${user.error
            ? 'border-red-200 bg-red-50 text-red-600'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
        >
          <span>{user.error || user.message}</span>
          {user.error && isAuthError(user.error) && (
            <Link
              href="/vi/login"
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
            >
              Đăng nhập lại
            </Link>
          )}
        </div>
      )}

      <UserToolbar
        showDeleted={user.showDeleted}
        deletedCount={user.deletedUsers.length}
        searchInput={user.searchInput}
        searchKeyword={user.searchKeyword}
        roleFilter={user.roleFilter}
        roles={user.roles}
        onToggleDeleted={user.toggleDeletedView}
        onCreate={user.openCreateModal}
        onSearchInputChange={user.setSearchInput}
        onSearchSubmit={user.submitSearch}
        onClearSearch={user.clearSearch}
        onRoleFilterChange={(value) => {
          user.setRoleFilter(value);
          user.setCurrentPage(1);
        }}
      />

      <UserTable
        users={user.paginatedUsers}
        userDirectory={[...user.users, ...user.deletedUsers]}
        total={user.filteredUsers.length}
        loading={user.loading}
        showDeleted={user.showDeleted}
        rowsPerPage={user.rowsPerPage}
        currentPage={user.currentPage}
        totalPages={user.totalPages}
        onRowsPerPageChange={(value) => {
          user.setRowsPerPage(value);
          user.setCurrentPage(1);
        }}
        onPageChange={user.setCurrentPage}
        onDetail={user.openDetail}
        onEdit={user.openEditModal}
        onConfirm={user.setConfirmAction}
        isSecurityActionDisabled={user.isSecurityActionDisabled}
      />

      {user.formOpen && (
        <UserFormModal
          form={user.form}
          editingUser={user.editingUser}
          defaultRole={user.roles.find((role) => role.roleId === 0) ?? null}
          saving={user.saving}
          uploadingAvatar={user.uploadingAvatar}
          onChange={user.updateForm}
          onAvatarChange={user.uploadEditingAvatar}
          onClose={() => user.setFormOpen(false)}
          onSubmit={user.submitUser}
        />
      )}

      {user.detailOpen && (
        <UserDetailModal
          user={user.detailUser}
          userDirectory={[...user.users, ...user.deletedUsers]}
          loading={user.detailLoading}
          onClose={user.closeDetail}
        />
      )}

      {user.confirmAction && confirm && (
        <UserConfirmModal
          title={confirm.title}
          description={confirm.description}
          actionLabel={confirm.actionLabel}
          tone={confirm.tone}
          saving={user.saving}
          onClose={() => user.setConfirmAction(null)}
          onConfirm={user.executeConfirmAction}
        />
      )}
    </div>
  );
}

function getConfirmContent(action: UserConfirmAction | null) {
  if (!action) return null;

  const { user } = action;

  if (action.type === 'status') {
    return {
      title: user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản',
      description: user.isActive
        ? `Khóa đăng nhập của ${user.fullName}? Tài khoản vẫn còn trong danh sách và có thể mở khóa lại.`
        : `Mở khóa tài khoản ${user.fullName}?`,
      actionLabel: user.isActive ? 'Khóa' : 'Mở khóa',
      tone: user.isActive ? ('danger' as const) : ('success' as const),
    };
  }

  if (action.type === 'reset-password') {
    return {
      title: 'Reset mật khẩu',
      description: `Đưa mật khẩu của ${user.fullName} về mặc định ${DEFAULT_USER_PASSWORD}?`,
      actionLabel: 'Reset',
      tone: 'primary' as const,
    };
  }

  if (action.type === 'soft-delete') {
    return {
      title: 'Xóa người dùng',
      description: `Chuyển ${user.fullName} vào danh sách đã xóa? Có thể khôi phục lại sau.`,
      actionLabel: 'Xóa',
      tone: 'danger' as const,
    };
  }

  if (action.type === 'restore') {
    return {
      title: 'Khôi phục tài khoản',
      description: `Khôi phục ${user.fullName} về danh sách người dùng?`,
      actionLabel: 'Khôi phục',
      tone: 'success' as const,
    };
  }

  return {
    title: 'Xóa vĩnh viễn',
    description: `Xóa vĩnh viễn ${user.fullName}? Thao tác này không thể khôi phục.`,
    actionLabel: 'Xóa vĩnh viễn',
    tone: 'danger' as const,
  };
}

function isAuthError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('token') || normalized.includes('đăng nhập') || normalized.includes('jwt')
  );
}
