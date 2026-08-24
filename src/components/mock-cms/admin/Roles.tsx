'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect, @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-react';

// --- Mock Data ---
const permissions = {
  'Quản lý Bài viết': ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa', 'Duyệt bài'],
  'Quản lý Người dùng': ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa', 'Khóa tài khoản'],
  'Quản lý Danh mục': ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa'],
  'Quản lý Media': ['Xem', 'Tải lên', 'Xóa'],
  'Quản lý Liên hệ': ['Xem', 'Phản hồi', 'Xóa'],
  'Quản lý Cài đặt': ['Xem', 'Chỉnh sửa'],
  'Quản lý Nhật ký': ['Xem'],
};

const roles = [
  {
    name: 'Quản trị viên',
    desc: 'Toàn quyền quản lý hệ thống',
    users: 2,
    color: 'bg-blue-500',
    perms: {
      'Quản lý Bài viết': ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa', 'Duyệt bài'],
      'Quản lý Người dùng': ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa', 'Khóa tài khoản'],
      'Quản lý Danh mục': ['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa'],
      'Quản lý Media': ['Xem', 'Tải lên', 'Xóa'],
      'Quản lý Liên hệ': ['Xem', 'Phản hồi', 'Xóa'],
      'Quản lý Cài đặt': ['Xem', 'Chỉnh sửa'],
      'Quản lý Nhật ký': ['Xem'],
    },
  },
  {
    name: 'Biên tập viên',
    desc: 'Quản lý nội dung và bài viết',
    users: 5,
    color: 'bg-violet-500',
    perms: {
      'Quản lý Bài viết': ['Xem', 'Tạo mới', 'Chỉnh sửa'],
      'Quản lý Danh mục': ['Xem'],
      'Quản lý Media': ['Xem', 'Tải lên'],
      'Quản lý Liên hệ': ['Xem'],
    },
  },
  {
    name: 'Kiểm duyệt viên',
    desc: 'Kiểm duyệt và phê duyệt nội dung',
    users: 3,
    color: 'bg-cyan-500',
    perms: {
      'Quản lý Bài viết': ['Xem', 'Duyệt bài'],
      'Quản lý Liên hệ': ['Xem', 'Phản hồi'],
    },
  },
  {
    name: 'Tác giả',
    desc: 'Tạo và quản lý bài viết cá nhân',
    users: 12,
    color: 'bg-slate-400',
    perms: {
      'Quản lý Bài viết': ['Xem', 'Tạo mới'],
      'Quản lý Media': ['Xem', 'Tải lên'],
    },
  },
];

// Dữ liệu người dùng mẫu
const mockUsers = [
  {
    id: 1,
    name: 'Nguyễn Văn Admin',
    email: 'admin@vietcms.vn',
    role: 'Quản trị viên',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Trần Admin Phụ',
    email: 'admin2@vietcms.vn',
    role: 'Quản trị viên',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Lê Biên Tập 1',
    email: 'btv1@vietcms.vn',
    role: 'Biên tập viên',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Phạm Biên Tập 2',
    email: 'btv2@vietcms.vn',
    role: 'Biên tập viên',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'Hoàng Biên Tập 3',
    email: 'btv3@vietcms.vn',
    role: 'Biên tập viên',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Ngô Kiểm Duyệt 1',
    email: 'kdv1@vietcms.vn',
    role: 'Kiểm duyệt viên',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 7,
    name: 'Đặng Tác Giả 1',
    email: 'tg1@vietcms.vn',
    role: 'Tác giả',
    avatar:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=32&h=32&fit=crop&auto=format',
  },
];

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Roles() {
  const [activeTab, setActiveTab] = useState<'members' | 'permissions'>('members');
  const [selectedRole, setSelectedRole] = useState(roles[0]);

  // Modal States
  const [changeRoleUser, setChangeRoleUser] = useState<(typeof mockUsers)[0] | null>(null);
  const [isEditPermsOpen, setIsEditPermsOpen] = useState(false);
  const [draftPerms, setDraftPerms] = useState<Record<string, string[]>>({});

  // Modals for Role Management (Add/Edit/Delete)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<(typeof roles)[0] | null>(null);
  const [deletingRole, setDeletingRole] = useState<(typeof roles)[0] | null>(null);

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Reset về trang 1 khi đổi vai trò
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRole]);

  // Lọc user theo vai trò đang chọn
  const filteredUsers = mockUsers.filter((user) => user.role === selectedRole.name);

  // Tính toán dữ liệu hiển thị theo trang
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const hasPermission = (module: string, perm: string) =>
    (selectedRole.perms as any)[module]?.includes(perm);

  const hasDraftPermission = (module: string, perm: string) => draftPerms[module]?.includes(perm);

  // Mở modal chỉnh sửa quyền
  const handleOpenEditPerms = () => {
    // setDraftPerms({ ...selectedRole.perms }); // Clone dữ liệu quyền hiện tại
    setIsEditPermsOpen(true);
  };

  // Toggle Checkbox khi chỉnh sửa quyền
  const togglePermission = (module: string, perm: string) => {
    setDraftPerms((prev) => {
      const modulePerms = prev[module] || [];
      if (modulePerms.includes(perm)) {
        return {
          ...prev,
          [module]: modulePerms.filter((p) => p !== perm),
        };
      } else {
        return {
          ...prev,
          [module]: [...modulePerms, perm],
        };
      }
    });
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Phân quyền</h1>
          <p className="text-slate-500 text-sm mt-0.5">Cấu hình vai trò và quyền hạn người dùng</p>
        </div>
        <button
          onClick={() => {
            setEditingRole(null);
            setIsRoleModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} />
          Thêm vai trò
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Role list */}
        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.name}
              onClick={() => setSelectedRole(role)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedRole.name === role.name
                  ? 'border-blue-500 bg-blue-50/50 shadow-sm'
                  : 'border-transparent bg-white hover:border-slate-200'
              }`}
              style={selectedRole.name !== role.name ? { borderColor: 'var(--border)' } : {}}
            >
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800">{role.name}</div>
                  <div className="text-xs text-slate-400">{role.users} người dùng</div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingRole(role);
                      setIsRoleModalOpen(true);
                    }}
                    title="Chỉnh sửa thông tin vai trò"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingRole(role);
                    }}
                    title="Xóa vai trò này"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{role.desc}</p>
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div
          className="lg:col-span-2 bg-white rounded-xl border overflow-hidden flex flex-col"
          style={{ borderColor: 'var(--border)', minHeight: '500px' }}
        >
          {/* Tabs */}
          <div className="border-b border-slate-100 px-5 flex gap-0">
            {(
              [
                ['members', 'Thành viên'],
                ['permissions', 'Quyền hạn'],
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-3.5 text-sm font-medium transition-colors border-b-2',
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TAB: THÀNH VIÊN */}
          {activeTab === 'members' && (
            <div className="flex flex-col h-full">
              <div
                className="px-5 py-4 border-b flex flex-wrap gap-4 items-center justify-between"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="font-semibold text-slate-800 text-sm">
                  Thành viên có vai trò: {selectedRole.name}
                </h3>

                {/* Pagination Controls */}
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Số dòng:</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2 py-1 border rounded outline-none cursor-pointer hover:border-blue-500 bg-white"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {[5, 10, 15].map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>
                      {Math.min((currentPage - 1) * rowsPerPage + 1, filteredUsers.length)} -{' '}
                      {Math.min(currentPage * rowsPerPage, filteredUsers.length)} của{' '}
                      {filteredUsers.length}
                    </span>
                    <div className="flex gap-1">
                      <button
                        disabled={currentPage === 1 || totalPages === 0}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="p-1 border rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        disabled={currentPage >= totalPages || totalPages === 0}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="p-1 border rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Thành viên
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Email
                      </th>
                      <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b hover:bg-slate-50 transition-colors"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                className="w-8 h-8 rounded-lg object-cover"
                                alt={user.name}
                              />
                              <span className="font-medium text-slate-800">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-slate-500">{user.email}</td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => setChangeRoleUser(user)}
                              className="text-xs font-medium text-blue-600 hover:underline"
                            >
                              Đổi vai trò
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-5 py-10 text-center text-slate-500 text-sm">
                          Chưa có thành viên nào được gán vai trò này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: QUYỀN HẠN */}
          {activeTab === 'permissions' && (
            <div>
              <div
                className="px-5 py-4 border-b flex items-center justify-between"
                style={{ borderColor: 'var(--border)' }}
              >
                <h3 className="font-semibold text-slate-800 text-sm">
                  Phân quyền: {selectedRole.name}
                </h3>
                <button
                  onClick={handleOpenEditPerms}
                  className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1.5"
                >
                  <Edit size={14} /> Chỉnh sửa phân quyền
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                        Module
                      </th>
                      {['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa'].map((p) => (
                        <th
                          key={p}
                          className="text-center px-3 py-3 text-xs font-semibold text-slate-500 uppercase"
                        >
                          {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(permissions).map(([module, perms]) => (
                      <tr
                        key={module}
                        className="border-b hover:bg-slate-50"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <td className="px-5 py-3 font-medium text-slate-700 text-sm whitespace-nowrap">
                          {module}
                        </td>
                        {['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa'].map((p) => (
                          <td key={p} className="px-3 py-3 text-center">
                            <span
                              className={`inline-flex w-5 h-5 rounded-full text-xs items-center justify-center mx-auto ${
                                hasPermission(module, p)
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : 'bg-slate-100 text-slate-300'
                              }`}
                            >
                              {hasPermission(module, p) ? '✓' : '—'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Modal 1: Đổi vai trò người dùng */}
      {changeRoleUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setChangeRoleUser(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-slate-900 text-lg">Đổi vai trò</h3>
              <button
                onClick={() => setChangeRoleUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="mb-5 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border"
              style={{ borderColor: 'var(--border)' }}
            >
              <img
                src={changeRoleUser.avatar}
                alt={changeRoleUser.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <p className="font-medium text-sm text-slate-900">{changeRoleUser.name}</p>
                <p className="text-xs text-slate-500">{changeRoleUser.email}</p>
              </div>
            </div>

            <div className="space-y-1.5 mb-6">
              <label className="text-sm font-medium text-slate-700">Chọn vai trò mới</label>
              <select
                defaultValue={changeRoleUser.role}
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                style={{ borderColor: 'var(--border)' }}
              >
                {roles.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setChangeRoleUser(null)}
                className="px-4 py-2 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={() => setChangeRoleUser(null)}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                style={{ background: 'var(--primary)' }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Chỉnh sửa quyền hạn */}
      {isEditPermsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setIsEditPermsOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between bg-slate-50/50"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <h3 className="font-display font-bold text-slate-900 text-lg">
                  Chỉnh sửa quyền hạn
                </h3>
                <p className="text-sm text-slate-500">
                  Đang chỉnh sửa vai trò:{' '}
                  <strong className="text-blue-600">{selectedRole.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsEditPermsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 flex-1">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">
                      Module
                    </th>
                    {['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa'].map((p) => (
                      <th
                        key={p}
                        className="text-center px-2 py-3 text-xs font-semibold text-slate-500 uppercase"
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissions).map(([module, availablePerms]) => (
                    <tr
                      key={module}
                      className="border-b hover:bg-slate-50"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="px-4 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                        {module}
                      </td>
                      {['Xem', 'Tạo mới', 'Chỉnh sửa', 'Xóa'].map((p) => (
                        <td key={p} className="px-2 py-3.5 text-center">
                          {availablePerms.includes(p) ? (
                            <input
                              type="checkbox"
                              checked={hasDraftPermission(module, p)}
                              onChange={() => togglePermission(module, p)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                            />
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setIsEditPermsOpen(false)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-white bg-transparent"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => setIsEditPermsOpen(false)}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                style={{ background: 'var(--primary)' }}
              >
                Lưu quyền hạn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Thêm / Sửa thông tin vai trò (Tên, Mô tả) */}
      {isRoleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setIsRoleModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-slate-900 text-lg">
                {editingRole ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới'}
              </h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Tên vai trò <span className="text-red-500">*</span>
                </label>
                <input
                  defaultValue={editingRole?.name || ''}
                  placeholder="VD: Kế toán, Trợ lý..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Mô tả chi tiết
                </label>
                <textarea
                  defaultValue={editingRole?.desc || ''}
                  placeholder="Mô tả chức năng và quyền hạn của vai trò này..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white"
                  rows={3}
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-colors"
                style={{ background: 'var(--primary)' }}
              >
                {editingRole ? 'Lưu thay đổi' : 'Tạo vai trò'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Xác nhận xóa vai trò */}
      {deletingRole && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDeletingRole(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">Xóa vai trò này?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa vai trò{' '}
              <span className="font-semibold text-slate-900">{deletingRole.name}</span>
              ? <br />
              Hành động này <strong className="text-red-500">không thể hoàn tác</strong> và người
              dùng thuộc nhóm này sẽ bị mất quyền truy cập tương ứng.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletingRole(null)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={() => setDeletingRole(null)}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors w-full shadow-sm shadow-red-500/30"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
