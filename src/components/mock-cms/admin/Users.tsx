'use client';

/* eslint-disable @next/next/no-img-element */

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  FileUser,
  KeyRound,
  Loader2,
  Lock,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Unlock,
  X,
} from 'lucide-react';
import { ResUserDTO, Role, RoleUser, UserCreatePayload } from '@/types';

const DEFAULT_PASSWORD = '123456';
const LEGACY_USER_ROLE = 'NORMAL_USER';
const STAFF_ROLE_ORDER = ['USER', 'ADMIN'];
const DEFAULT_FORM: UserCreatePayload = {
  fullname: '',
  email: '',
  phone: '',
  age: 0,
  address: '',
  gender: 'OTHER',
  dateOfBirth: '',
  roleId: undefined,
};

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-blue-100 text-blue-700',
  ADMIN: 'bg-sky-100 text-sky-700',
  USER: 'bg-emerald-100 text-emerald-700',
  NORMAL_USER: 'bg-slate-100 text-slate-600',
};

function rawRoleName(name?: string) {
  return name?.trim().toUpperCase() || '';
}

function normalizeRoleName(name?: string) {
  const roleName = rawRoleName(name);
  return roleName === LEGACY_USER_ROLE ? 'USER' : roleName;
}

function roleLabel(role?: Pick<Role, 'name'> | RoleUser | null) {
  const roleName = normalizeRoleName(role?.name);
  if (roleName === 'ADMIN') return 'Admin';
  if (roleName === 'USER') return 'User';
  return role?.name || 'Chưa gán';
}

function getStaffRoles(source: Role[]) {
  if (source.length === 0) {
    return [];
  }

  const findByName = (name: string) =>
    source.find((role) => rawRoleName(role.name) === name) ||
    (name === 'USER'
      ? source.find((role) => rawRoleName(role.name) === LEGACY_USER_ROLE)
      : undefined);

  return STAFF_ROLE_ORDER.map(findByName).filter((role): role is Role => Boolean(role));
}

export default function Users() {
  const [users, setUsers] = useState<ResUserDTO[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState<UserCreatePayload>(DEFAULT_FORM);
  const [editingUser, setEditingUser] = useState<ResUserDTO | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statusModal, setStatusModal] = useState<ResUserDTO | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<ResUserDTO | null>(null);
  const [deleteUserTarget, setDeleteUserTarget] = useState<ResUserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const creatableRoles = useMemo(() => getStaffRoles(roles), [roles]);

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return users.filter((user) => {
      const roleName = normalizeRoleName(user.role?.name);
      const matchSearch =
        !keyword ||
        user.fullname.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.employeeCode || '').toLowerCase().includes(keyword);
      const matchRole = roleFilter === 'ALL' || roleName === roleFilter;
      const matchStatus = statusFilter === 'ALL' || user.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginatedUsers = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/users?page=1&size=200');
      const data = await readJson(res);
      setUsers(data.result || []);
    } catch (err) {
      setUsers([]);
      setError(getErrorMessage(err, 'Không tải được danh sách nhân sự từ backend. Vui lòng đăng nhập lại.'));
    } finally {
      setLoading(false);
    }
  }

  async function loadRoles() {
    try {
      const res = await fetch('/api/roles');
      const data = await readJson(res);
      setRoles(data || []);
      if (data?.length > 0) {
        const firstCreatableRole = getStaffRoles(data)[0];
        setForm((value) => (value.roleId ? value : { ...value, roleId: firstCreatableRole?.id }));
      }
    } catch (err) {
      setRoles([]);
      setError(getErrorMessage(err, 'Không tải được danh sách vai trò từ backend'));
    }
  }

  function openCreateModal() {
    setForm({
      ...DEFAULT_FORM,
      roleId: creatableRoles[0]?.id,
    });
    setEditingUser(null);
    setIsAddModalOpen(true);
    clearFeedback();
  }

  function openEditModal(user: ResUserDTO) {
    setForm({
      fullname: user.fullname,
      email: user.email,
      phone: user.phone || '',
      age: user.age || 0,
      address: user.address || '',
      gender: user.gender || 'OTHER',
      dateOfBirth: user.dateOfBirth || '',
      avatarUrl: user.avatarUrl || '',
      roleId: user.role?.id,
    });
    setEditingUser(user);
    setIsAddModalOpen(true);
    clearFeedback();
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    clearFeedback();

    const payload = normalizePayload(form);
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      await readJson(res);
      setIsAddModalOpen(false);
      setMessage(
        editingUser
          ? 'Đã cập nhật thông tin người dùng'
          : `Đã tạo tài khoản nhân sự. Mật khẩu mặc định: ${DEFAULT_PASSWORD}`
      );
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, 'Không lưu được nhân sự vào backend'));
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(user: ResUserDTO) {
    const nextStatus = user.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
    setSaving(true);
    clearFeedback();

    try {
      const res = await fetch(`/api/users/${user.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      await readJson(res);
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, status: nextStatus } : item))
      );
      setStatusModal(null);
      setMessage(nextStatus === 'LOCKED' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
    } catch (err) {
      setError(getErrorMessage(err, 'Không cập nhật được trạng thái nhân sự'));
    } finally {
      setSaving(false);
    }
  }

  async function resetPassword(user: ResUserDTO) {
    setSaving(true);
    clearFeedback();

    try {
      const res = await fetch(`/api/users/${user.id}/reset-password`, { method: 'PUT' });
      await readJson(res);
      setResetPasswordUser(null);
      setMessage(`Đã reset mật khẩu của ${user.fullname} về ${DEFAULT_PASSWORD}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Không reset được mật khẩu trên backend'));
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(user: ResUserDTO) {
    setSaving(true);
    clearFeedback();

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      await readJson(res);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      setDeleteUserTarget(null);
      setMessage(`Đã xóa nhân sự ${user.fullname}`);
    } catch (err) {
      setError(getErrorMessage(err, 'Không xóa được nhân sự'));
    } finally {
      setSaving(false);
    }
  }

  function clearFeedback() {
    setError(null);
    setMessage(null);
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Nhân sự</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {filtered.length} người dùng được tìm thấy
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} />
          Thêm nhân sự
        </button>
      </div>

      {(message || error) && (
        <div
          className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            error
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <span>{error || message}</span>
          {error && isAuthError(error) && (
            <Link
              href="/vi/login"
              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
            >
              Đăng nhập lại
            </Link>
          )}
        </div>
      )}

      <div
        className="mb-5 flex flex-wrap gap-3 rounded-lg border bg-white p-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <button
          type="button"
          onClick={openCreateModal}
          className="flex min-h-10 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} />
          Thêm nhân sự mới
        </button>
        <div className="relative min-w-52 flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tên, email, mã nhân viên..."
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600 outline-none"
          style={{ borderColor: 'var(--border)' }}
        >
          <option value="ALL">Tất cả vai trò</option>
          {creatableRoles.map((role) => (
            <option key={role.id} value={normalizeRoleName(role.name)}>
              {roleLabel(role)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-lg border bg-white px-3 py-2 text-sm text-slate-600 outline-none"
          style={{ borderColor: 'var(--border)' }}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="LOCKED">Bị khóa</option>
        </select>
      </div>

      <div className="mb-3 flex items-center justify-end gap-6 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          <span>Số dòng/trang:</span>
          <select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="rounded-lg border bg-white px-2 py-1.5 outline-none"
            style={{ borderColor: 'var(--border)' }}
          >
            {[5, 10, 15, 20].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-3">
          <span>
            {filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} -{' '}
            {Math.min(currentPage * rowsPerPage, filtered.length)} của {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              label="Trang trước"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton
              label="Trang sau"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden rounded-lg border bg-white"
        style={{ borderColor: 'var(--border)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50" style={{ borderColor: 'var(--border)' }}>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Người dùng
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Mã NV
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vai trò
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hồ sơ
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trạng thái
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto mb-2 animate-spin" size={20} />
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                const normalizedUserRole = normalizeRoleName(user.role?.name);

                return (
                  <tr
                    key={user.id}
                    className="border-t transition-colors hover:bg-slate-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            className="h-9 w-9 rounded-lg object-cover"
                            alt={user.fullname}
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                            {getInitial(user.fullname)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-800">{user.fullname}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                      {user.employeeCode || '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          roleColors[normalizedUserRole] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {roleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                          isProfileComplete(user)
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        <FileUser size={13} />
                        {isProfileComplete(user) ? 'Đã cập nhật' : 'Chưa cập nhật'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`flex w-fit items-center gap-1.5 text-xs font-medium ${
                          user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-red-400'
                          }`}
                        />
                        {user.status === 'ACTIVE' ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton label="Chỉnh sửa" onClick={() => openEditModal(user)}>
                          <Edit size={14} />
                        </IconButton>
                        <IconButton
                          label="Reset mật khẩu"
                          onClick={() => setResetPasswordUser(user)}
                        >
                          <KeyRound size={14} />
                        </IconButton>
                        <IconButton
                          label={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'}
                          onClick={() => setStatusModal(user)}
                        >
                          {user.status === 'ACTIVE' ? <Lock size={14} /> : <Unlock size={14} />}
                        </IconButton>
                        <IconButton label="Xóa nhân sự" onClick={() => setDeleteUserTarget(user)}>
                          <Trash2 size={14} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  <p>Chưa tìm thấy nhân sự nào.</p>
                  <button
                    type="button"
                    onClick={openCreateModal}
                    className="mx-auto mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: 'var(--primary)' }}
                  >
                    <Plus size={15} />
                    Thêm nhân sự
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={openCreateModal}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-700"
      >
        <Plus size={18} />
        Thêm nhân sự
      </button>

      {isAddModalOpen && (
        <UserModal
          title={editingUser ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}
          form={form}
          roles={creatableRoles}
          saving={saving}
          isEditing={Boolean(editingUser)}
          onChange={(next) => setForm((value) => ({ ...value, ...next }))}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {statusModal && (
        <ConfirmModal
          title={`Xác nhận ${statusModal.status === 'ACTIVE' ? 'khóa' : 'mở khóa'} tài khoản`}
          description={`Bạn có chắc chắn muốn ${
            statusModal.status === 'ACTIVE' ? 'khóa' : 'mở khóa'
          } tài khoản của ${statusModal.fullname}?`}
          tone={statusModal.status === 'ACTIVE' ? 'danger' : 'success'}
          saving={saving}
          actionLabel="Xác nhận"
          onClose={() => setStatusModal(null)}
          onConfirm={() => updateStatus(statusModal)}
        />
      )}

      {resetPasswordUser && (
        <ConfirmModal
          title="Reset mật khẩu"
          description={`Đưa mật khẩu của ${resetPasswordUser.fullname} về mặc định ${DEFAULT_PASSWORD}?`}
          tone="primary"
          saving={saving}
          actionLabel="Reset"
          onClose={() => setResetPasswordUser(null)}
          onConfirm={() => resetPassword(resetPasswordUser)}
        />
      )}

      {deleteUserTarget && (
        <ConfirmModal
          title="Xóa nhân sự"
          description={`Bạn có chắc chắn muốn xóa nhân sự ${deleteUserTarget.fullname}? Tài khoản sẽ bị xóa vĩnh viễn khỏi database và không đăng nhập được nữa.`}
          tone="danger"
          saving={saving}
          actionLabel="Xóa"
          onClose={() => setDeleteUserTarget(null)}
          onConfirm={() => deleteUser(deleteUserTarget)}
        />
      )}
    </div>
  );
}

function UserModal({
  title,
  form,
  roles,
  saving,
  isEditing,
  onChange,
  onClose,
  onSubmit,
}: {
  title: string;
  form: UserCreatePayload;
  roles: Role[];
  saving: boolean;
  isEditing: boolean;
  onChange: (payload: Partial<UserCreatePayload>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <form
        className="flex max-h-[calc(100vh-48px)] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
            {!isEditing && (
              <p className="mt-1 text-sm text-slate-500">
                Tài khoản mới dùng mật khẩu mặc định {DEFAULT_PASSWORD}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            title="Đóng"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          {!isEditing ? (
            <div className="space-y-4">
              <Field label="Gmail nhân sự">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => onChange({ email: event.target.value })}
                  className={inputClass}
                  placeholder="name@gmail.com"
                  required
                />
              </Field>
              <Field label="Vai trò">
                <select
                  value={form.roleId || ''}
                  onChange={(event) => onChange({ roleId: Number(event.target.value) })}
                  className={inputClass}
                  required
                >
                  <option value="" disabled>
                    Chọn vai trò
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {roleLabel(role)}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                Hệ thống sẽ tạo tài khoản với mật khẩu cố định{' '}
                <span className="font-bold">{DEFAULT_PASSWORD}</span>. Nhân sự đăng nhập lần đầu sẽ
                được chuyển về Hồ sơ để đổi mật khẩu và tự cập nhật thông tin cá nhân.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Họ và tên">
                <input
                  value={form.fullname || ''}
                  onChange={(event) => onChange({ fullname: event.target.value })}
                  className={inputClass}
                  placeholder="Nhập họ và tên"
                  required
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => onChange({ email: event.target.value })}
                  className={inputClass}
                  placeholder="name@company.com"
                  required
                />
              </Field>
              <Field label="Vai trò">
                <select value={form.roleId || ''} className={inputClass} disabled>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {roleLabel(role)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Số điện thoại">
                <input
                  value={form.phone || ''}
                  onChange={(event) => onChange({ phone: event.target.value })}
                  className={inputClass}
                  placeholder="0900000000"
                />
              </Field>
              <Field label="Giới tính">
                <select
                  value={form.gender || 'OTHER'}
                  onChange={(event) => onChange({ gender: event.target.value })}
                  className={inputClass}
                >
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </Field>
              <Field label="Ngày sinh">
                <input
                  type="date"
                  value={form.dateOfBirth || ''}
                  onChange={(event) => onChange({ dateOfBirth: event.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Tuổi">
                <input
                  type="number"
                  min={0}
                  value={form.age || ''}
                  onChange={(event) => onChange({ age: Number(event.target.value || 0) })}
                  className={inputClass}
                  placeholder="0"
                />
              </Field>
              <Field label="Ảnh đại diện">
                <input
                  value={form.avatarUrl || ''}
                  onChange={(event) => onChange({ avatarUrl: event.target.value })}
                  className={inputClass}
                  placeholder="https://..."
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Địa chỉ">
                  <input
                    value={form.address || ''}
                    onChange={(event) => onChange({ address: event.target.value })}
                    className={inputClass}
                    placeholder="Nhập địa chỉ"
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            style={{ borderColor: 'var(--border)' }}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex min-w-32 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
}

function ConfirmModal({
  title,
  description,
  actionLabel,
  tone,
  saving,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  actionLabel: string;
  tone: 'danger' | 'success' | 'primary';
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const toneClass =
    tone === 'danger'
      ? 'bg-red-500 hover:bg-red-600'
      : tone === 'success'
        ? 'bg-emerald-500 hover:bg-emerald-600'
        : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display mb-2 text-lg font-bold text-slate-900">{title}</h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            style={{ borderColor: 'var(--border)' }}
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={`flex min-w-24 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${toneClass}`}
          >
            {saving && <RotateCcw size={14} className="animate-spin" />}
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  disabled,
  children,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={label}
      aria-label={label}
      className="rounded-lg border p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40"
      style={{ borderColor: 'var(--border)' }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">{label}</span>
      {children}
    </label>
  );
}

async function readJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
  }
  return data;
}

function getErrorMessage(err: unknown, fallback: string) {
  return err instanceof Error && err.message ? err.message : fallback;
}

function isAuthError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes('token') || normalized.includes('đăng nhập') || normalized.includes('jwt');
}

function normalizePayload(form: UserCreatePayload): UserCreatePayload {
  return {
    ...form,
    fullname: form.fullname?.trim() || makeStaffNameFromEmail(form.email),
    email: form.email.trim().toLowerCase(),
    phone: form.phone?.trim() || undefined,
    address: form.address?.trim() || undefined,
    avatarUrl: form.avatarUrl?.trim() || undefined,
    dateOfBirth: form.dateOfBirth || undefined,
    roleId: form.roleId,
  };
}

function makeStaffNameFromEmail(email: string) {
  const localPart = email
    .split('@')[0]
    ?.replace(/[._-]+/g, ' ')
    .trim();
  return localPart || 'Nhân sự mới';
}

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

function isProfileComplete(user: ResUserDTO) {
  return Boolean(user.phone && user.address && user.dateOfBirth);
}

const inputClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500';
