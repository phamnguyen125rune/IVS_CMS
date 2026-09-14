'use client';

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  UserAvatarResponse,
  UserCreateRequest,
  UserFormValues,
  UserPaginationResponse,
  UserResponse,
  UserRoleOption,
  UserStatus,
  UserUpdateRequest,
} from '@/types/user.type';
import { isSuperAdmin } from '../user.utils';

export const DEFAULT_USER_PASSWORD = '123456';

const PAGE_FETCH_SIZE = 100;
const ACCEPTED_AVATAR_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);
const MAX_AVATAR_SIZE = 5 * 1024 * 1024;

const EMPTY_FORM: UserFormValues = {
  fullName: '',
  email: '',
  phoneNumber: '',
  address: '',
  gender: 'OTHERS',
  dateOfBirth: '',
  avatarUrl: '',
};

export type UserConfirmAction =
  | { type: 'status'; user: UserResponse }
  | { type: 'reset-password'; user: UserResponse }
  | { type: 'soft-delete'; user: UserResponse }
  | { type: 'restore'; user: UserResponse }
  | { type: 'hard-delete'; user: UserResponse };

export function useUsers() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [deletedUsers, setDeletedUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<UserRoleOption[]>([]);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleted, setShowDeleted] = useState(false);

  const [form, setForm] = useState<UserFormValues>(EMPTY_FORM);
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmAction, setConfirmAction] = useState<UserConfirmAction | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    const firstPage = await requestJson<UserPaginationResponse>(
      `/api/users?page=1&size=${PAGE_FETCH_SIZE}`
    );
    const pages = Math.max(1, firstPage.meta?.pages || 1);

    if (pages === 1) {
      setUsers(firstPage.result || []);
      return;
    }

    const remaining = await Promise.all(
      Array.from({ length: pages - 1 }, (_, index) =>
        requestJson<UserPaginationResponse>(`/api/users?page=${index + 2}&size=${PAGE_FETCH_SIZE}`)
      )
    );

    setUsers([firstPage, ...remaining].flatMap((page) => page.result || []));
  }, []);

  const loadDeletedUsers = useCallback(async () => {
    const data = await requestJson<UserResponse[]>('/api/users/deleted');
    setDeletedUsers(Array.isArray(data) ? data : []);
  }, []);

  const loadRoles = useCallback(async () => {
    const data = await requestJson<UserRoleOption[]>('/api/roles');
    setRoles(Array.isArray(data) ? data : []);
  }, []);

  const loadCurrentUser = useCallback(async () => {
    try {
      setCurrentUser(await requestJson<UserResponse>('/api/auth/profile'));
    } catch {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadUsers(), loadDeletedUsers(), loadRoles(), loadCurrentUser()]);
      } catch (loadError) {
        if (active) {
          setError(getErrorMessage(loadError, 'Không tải được dữ liệu quản lý người dùng'));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [loadCurrentUser, loadDeletedUsers, loadRoles, loadUsers]);

  const visibleUsers = showDeleted ? deletedUsers : users;

  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return visibleUsers.filter((user) => {
      const matchesKeyword =
        !keyword ||
        user.fullName.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.employeeCode || '').toLowerCase().includes(keyword) ||
        (user.phoneNumber || '').toLowerCase().includes(keyword);

      const matchesRole =
        roleFilter === 'ALL' || String(user.role?.roleId ?? '') === String(roleFilter);

      return matchesKeyword && matchesRole;
    });
  }, [roleFilter, searchKeyword, visibleUsers]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / rowsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const clearFeedback = useCallback(() => {
    setMessage(null);
    setError(null);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchInput('');
    setSearchKeyword('');
    setRoleFilter('ALL');
    setCurrentPage(1);
  }, []);

  function openCreateModal() {
    clearFeedback();
    setEditingUser(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditModal(user: UserResponse) {
    clearFeedback();
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      gender: user.gender || 'OTHERS',
      dateOfBirth: user.dateOfBirth || '',
      avatarUrl: user.avatarUrl || '',
    });
    setFormOpen(true);
  }

  async function openDetail(user: UserResponse) {
    clearFeedback();
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailUser(user);
    try {
      setDetailUser(await requestJson<UserResponse>(`/api/users/${user.userId}`));
    } catch (detailError) {
      setError(getErrorMessage(detailError, 'Không tải được chi tiết người dùng'));
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setDetailOpen(false);
    setDetailUser(null);
  }

  function updateForm(patch: Partial<UserFormValues>) {
    setForm((current) => ({ ...current, ...patch }));
  }

  async function submitUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearFeedback();

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();

    if (!fullName) {
      setError('Họ và tên không được để trống');
      return;
    }
    if (!email) {
      setError('Email không được để trống');
      return;
    }
    setSaving(true);
    try {
      if (editingUser) {
        const payload: UserUpdateRequest = {
          fullName,
          email,
          avatarUrl: nullableText(form.avatarUrl),
          phoneNumber: nullableText(form.phoneNumber),
          address: nullableText(form.address),
          gender: form.gender,
          dateOfBirth: form.dateOfBirth || null,
        };

        await requestJson(`/api/users/${editingUser.userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setMessage(`Đã cập nhật người dùng ${fullName}`);
      } else {
        const payload: UserCreateRequest = {
          fullName,
          email,
          password: DEFAULT_USER_PASSWORD,
          avatarUrl: nullableText(form.avatarUrl),
          phoneNumber: nullableText(form.phoneNumber),
          address: nullableText(form.address),
          gender: form.gender,
          dateOfBirth: form.dateOfBirth || null,
        };

        await requestJson('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        setMessage(`Đã tạo người dùng ${fullName}. Mật khẩu mặc định: ${DEFAULT_USER_PASSWORD}`);
      }

      setFormOpen(false);
      setEditingUser(null);
      await Promise.all([loadUsers(), loadDeletedUsers()]);
    } catch (submitError) {
      setError(getErrorMessage(submitError, 'Không lưu được người dùng'));
    } finally {
      setSaving(false);
    }
  }

  async function uploadEditingAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !editingUser) return;

    if (!ACCEPTED_AVATAR_TYPES.has(file.type)) {
      setError('Ảnh đại diện chỉ hỗ trợ JPEG, PNG, GIF hoặc WebP');
      return;
    }
    if (file.size > MAX_AVATAR_SIZE) {
      setError('Ảnh đại diện không được vượt quá 5MB');
      return;
    }

    setUploadingAvatar(true);
    clearFeedback();
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await requestJson<UserAvatarResponse>(
        `/api/users/${editingUser.userId}/avatar`,
        {
          method: 'POST',
          body: formData,
        }
      );

      updateForm({ avatarUrl: data.avatarUrl });
      setEditingUser((current) => (current ? { ...current, avatarUrl: data.avatarUrl } : current));
      setUsers((current) =>
        current.map((user) =>
          user.userId === editingUser.userId ? { ...user, avatarUrl: data.avatarUrl } : user
        )
      );
      setMessage(`Đã cập nhật ảnh đại diện của ${editingUser.fullName}`);
    } catch (uploadError) {
      setError(getErrorMessage(uploadError, 'Không upload được ảnh đại diện'));
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function executeConfirmAction() {
    if (!confirmAction) return;

    const { type, user } = confirmAction;
    setSaving(true);
    clearFeedback();

    try {
      if (type === 'status') {
        const status: UserStatus = user.isActive ? 'LOCKED' : 'ACTIVE';
        await requestJson(`/api/users/${user.userId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });
        setMessage(`${status === 'ACTIVE' ? 'Đã mở khóa' : 'Đã khóa'} tài khoản ${user.fullName}`);
        await loadUsers();
      }

      if (type === 'reset-password') {
        await requestJson(`/api/users/${user.userId}/reset-password`, { method: 'PUT' });
        setMessage(`Đã reset mật khẩu của ${user.fullName} về ${DEFAULT_USER_PASSWORD}`);
      }

      if (type === 'soft-delete') {
        await requestJson(`/api/users/${user.userId}`, { method: 'DELETE' });
        setMessage(`Đã xóa mềm tài khoản ${user.fullName}`);
        await Promise.all([loadUsers(), loadDeletedUsers()]);
      }

      if (type === 'restore') {
        await requestJson(`/api/users/${user.userId}/restore`, { method: 'PUT' });
        setMessage(`Đã khôi phục tài khoản ${user.fullName}`);
        await Promise.all([loadUsers(), loadDeletedUsers()]);
      }

      if (type === 'hard-delete') {
        await requestJson(`/api/users/${user.userId}/hard`, { method: 'DELETE' });
        setMessage(`Đã xóa vĩnh viễn tài khoản ${user.fullName}`);
        await loadDeletedUsers();
      }

      setConfirmAction(null);
    } catch (actionError) {
      setError(getErrorMessage(actionError, 'Thao tác với người dùng thất bại'));
    } finally {
      setSaving(false);
    }
  }

  function toggleDeletedView() {
    setShowDeleted((current) => !current);
    resetFilters();
    clearFeedback();
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchKeyword(searchInput.trim());
    setCurrentPage(1);
  }

  function clearSearch() {
    setSearchInput('');
    setSearchKeyword('');
    setCurrentPage(1);
  }

  function isSecurityActionDisabled(user: UserResponse) {
    return currentUser?.userId === user.userId || isSuperAdmin(user);
  }

  return {
    users,
    deletedUsers,
    roles,
    filteredUsers,
    paginatedUsers,
    totalPages,
    searchInput,
    searchKeyword,
    roleFilter,
    rowsPerPage,
    currentPage,
    showDeleted,
    form,
    editingUser,
    formOpen,
    detailUser,
    detailOpen,
    detailLoading,
    confirmAction,
    loading,
    saving,
    uploadingAvatar,
    message,
    error,
    setSearchInput,
    setRoleFilter,
    setRowsPerPage,
    setCurrentPage,
    setFormOpen,
    setConfirmAction,
    openCreateModal,
    openEditModal,
    openDetail,
    closeDetail,
    updateForm,
    submitUser,
    uploadEditingAvatar,
    executeConfirmAction,
    toggleDeletedView,
    submitSearch,
    clearSearch,
    isSecurityActionDisabled,
  };
}

async function requestJson<T = unknown>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const text = await response.text();
  const data = text ? safeParseJson(text) : null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : 'Có lỗi xảy ra, vui lòng thử lại';
    throw new Error(message);
  }

  return data as T;
}

function safeParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function nullableText(value: string) {
  const normalized = value.trim();
  return normalized || null;
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
