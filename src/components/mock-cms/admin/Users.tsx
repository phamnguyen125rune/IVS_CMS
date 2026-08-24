'use client';

/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */

import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Lock, Unlock, ChevronLeft, ChevronRight } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Nguyễn Văn Admin',
    email: 'admin@vietcms.vn',
    role: 'Quản trị viên',
    status: 'active',
    lastLogin: '14/07/2024 09:32',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 2,
    name: 'Trần Thị Hương',
    email: 'huong.tran@vietcms.vn',
    role: 'Biên tập viên',
    status: 'active',
    lastLogin: '14/07/2024 08:15',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 3,
    name: 'Lê Văn Phúc',
    email: 'phuc.le@vietcms.vn',
    role: 'Tác giả',
    status: 'active',
    lastLogin: '13/07/2024 17:45',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 4,
    name: 'Phạm Thị Lan',
    email: 'lan.pham@vietcms.vn',
    role: 'Kiểm duyệt viên',
    status: 'active',
    lastLogin: '13/07/2024 14:20',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 5,
    name: 'Hoàng Minh Tuấn',
    email: 'tuan.hoang@vietcms.vn',
    role: 'Tác giả',
    status: 'locked',
    lastLogin: '10/07/2024 11:00',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 6,
    name: 'Ngô Thị Thu',
    email: 'thu.ngo@vietcms.vn',
    role: 'Biên tập viên',
    status: 'active',
    lastLogin: '12/07/2024 16:30',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 7,
    name: 'Đặng Quốc Huy',
    email: 'huy.dang@vietcms.vn',
    role: 'Tác giả',
    status: 'active',
    lastLogin: '11/07/2024 09:15',
    avatar:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=32&h=32&fit=crop&auto=format',
  },
  {
    id: 8,
    name: 'Bùi Thị Mai',
    email: 'mai.bui@vietcms.vn',
    role: 'Kiểm duyệt viên',
    status: 'locked',
    lastLogin: '08/07/2024 15:00',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&auto=format',
  },
];

const roleColors: Record<string, string> = {
  'Quản trị viên': 'bg-blue-100 text-blue-700',
  'Biên tập viên': 'bg-violet-100 text-violet-700',
  'Kiểm duyệt viên': 'bg-cyan-100 text-cyan-700',
  'Tác giả': 'bg-slate-100 text-slate-600',
};

export default function Users() {
  // State bộ lọc và dữ liệu
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [userList, setUserList] = useState(users);

  // State Modals
  const [editModal, setEditModal] = useState<(typeof users)[0] | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lockConfirmModal, setLockConfirmModal] = useState<(typeof users)[0] | null>(null);

  // State phân trang
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  // Đưa người dùng về trang 1 nếu thay đổi bộ lọc tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  // Lọc dữ liệu
  const filtered = userList.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'Tất cả' || u.role === roleFilter;
    const matchStatus =
      statusFilter === 'Tất cả' ||
      (statusFilter === 'Hoạt động' ? u.status === 'active' : u.status === 'locked');
    return matchSearch && matchRole && matchStatus;
  });

  // Tính toán dữ liệu hiển thị theo trang
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginatedUsers = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleLock = (id: number) => {
    setUserList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u
      )
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Nhân sự</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {filtered.length} người dùng được tìm thấy
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} />
          Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên, email..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm outline-none text-slate-600 bg-white cursor-pointer hover:bg-slate-50"
          style={{ borderColor: 'var(--border)' }}
        >
          {['Tất cả', 'Quản trị viên', 'Biên tập viên', 'Kiểm duyệt viên', 'Tác giả'].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm outline-none text-slate-600 bg-white cursor-pointer hover:bg-slate-50"
          style={{ borderColor: 'var(--border)' }}
        >
          {['Tất cả', 'Hoạt động', 'Bị khóa'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-6 mb-3 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span>Số dòng/trang:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1.5 border rounded-lg outline-none cursor-pointer bg-white hover:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          >
            {[5, 10, 15, 20].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <span>
            {Math.min((currentPage - 1) * rowsPerPage + 1, filtered.length)} -{' '}
            {Math.min(currentPage * rowsPerPage, filtered.length)} của {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg border text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: 'var(--border)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Người dùng
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Vai trò
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Đăng nhập cuối
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-slate-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        className="w-8 h-8 rounded-lg object-cover"
                        alt={user.name}
                      />
                      <div>
                        <div className="font-medium text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[user.role] || 'bg-slate-100 text-slate-600'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium w-fit ${
                        user.status === 'active' ? 'text-emerald-600' : 'text-red-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`}
                      />
                      {user.status === 'active' ? 'Hoạt động' : 'Bị khóa'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 font-mono">{user.lastLogin}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditModal(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Chỉnh sửa"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setLockConfirmModal(user)}
                        className={`p-1.5 rounded-lg ${
                          user.status === 'active'
                            ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                      >
                        {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setEditModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-slate-900 mb-4 text-lg">
              Chỉnh sửa người dùng
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Họ và tên', value: editModal.name },
                { label: 'Email', value: editModal.email },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-slate-600 mb-1.5">
                    {f.label}
                  </label>
                  <input
                    defaultValue={f.value}
                    className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                    style={{ borderColor: 'var(--border)' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Vai trò</label>
                <select
                  defaultValue={editModal.role}
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none bg-white focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {['Quản trị viên', 'Biên tập viên', 'Kiểm duyệt viên', 'Tác giả'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)' }}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-slate-900 mb-4 text-lg">
              Thêm người dùng mới
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Họ và tên</label>
                <input
                  placeholder="Nhập họ và tên..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Vai trò</label>
                <select
                  defaultValue="Tác giả"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none bg-white focus:border-blue-500"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {['Quản trị viên', 'Biên tập viên', 'Kiểm duyệt viên', 'Tác giả'].map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: 'var(--primary)' }}
              >
                Thêm mới
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Lock/Unlock Modal */}
      {lockConfirmModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setLockConfirmModal(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display font-bold text-slate-900 mb-2 text-lg">
              Xác nhận {lockConfirmModal.status === 'active' ? 'khóa' : 'mở khóa'} tài khoản
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn {lockConfirmModal.status === 'active' ? 'khóa' : 'mở khóa'} tài
              khoản của người dùng{' '}
              <span className="font-semibold text-slate-900">{lockConfirmModal.name}</span> không?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setLockConfirmModal(null)}
                className="px-4 py-2 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  toggleLock(lockConfirmModal.id);
                  setLockConfirmModal(null);
                }}
                className={`px-4 py-2 rounded-xl text-white text-sm font-semibold transition-colors ${
                  lockConfirmModal.status === 'active'
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-emerald-500 hover:bg-emerald-600'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
