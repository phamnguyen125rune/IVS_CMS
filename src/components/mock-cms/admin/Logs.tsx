'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import {
  Search,
  Shield,
  FileText,
  Users,
  Settings,
  Lock,
  Upload,
  CheckCircle,
  XCircle,
} from 'lucide-react';

const logs = [
  {
    id: 1001,
    user: 'Nguyễn Văn Admin',
    action: 'Đăng nhập hệ thống',
    module: 'Xác thực',
    ip: '192.168.1.100',
    status: 'success',
    time: '14/07/2024 09:32:15',
  },
  {
    id: 1002,
    user: 'Trần Thị Hương',
    action: 'Tạo bài viết mới: "Xu hướng AI 2024"',
    module: 'Bài viết',
    ip: '192.168.1.105',
    status: 'success',
    time: '14/07/2024 09:45:30',
  },
  {
    id: 1003,
    user: 'Nguyễn Văn Admin',
    action: 'Duyệt bài viết #1045',
    module: 'Bài viết',
    ip: '192.168.1.100',
    status: 'success',
    time: '14/07/2024 10:12:00',
  },
  {
    id: 1004,
    user: 'anon_user_4592',
    action: 'Thử đăng nhập thất bại liên tiếp 3 lần',
    module: 'Xác thực',
    ip: '203.113.45.67',
    status: 'error',
    time: '14/07/2024 10:30:15',
  },
  {
    id: 1005,
    user: 'Lê Văn Phúc',
    action: 'Tải lên 5 tệp media mới',
    module: 'Media',
    ip: '192.168.1.112',
    status: 'success',
    time: '14/07/2024 10:55:00',
  },
  {
    id: 1006,
    user: 'Phạm Thị Lan',
    action: 'Từ chối bài viết #1043',
    module: 'Bài viết',
    ip: '192.168.1.108',
    status: 'success',
    time: '14/07/2024 11:20:45',
  },
  {
    id: 1007,
    user: 'Nguyễn Văn Admin',
    action: 'Cập nhật cài đặt email hệ thống',
    module: 'Cài đặt',
    ip: '192.168.1.100',
    status: 'success',
    time: '14/07/2024 11:45:00',
  },
  {
    id: 1008,
    user: 'Nguyễn Văn Admin',
    action: 'Khóa tài khoản: hoang.tuan@vietcms.vn',
    module: 'Nhân sự',
    ip: '192.168.1.100',
    status: 'warning',
    time: '14/07/2024 13:10:30',
  },
  {
    id: 1009,
    user: 'Hoàng Minh Tuấn',
    action: 'Thử đăng nhập vào tài khoản bị khóa',
    module: 'Xác thực',
    ip: '192.168.1.118',
    status: 'error',
    time: '14/07/2024 13:35:00',
  },
  {
    id: 1010,
    user: 'Trần Thị Hương',
    action: 'Xóa 3 tệp media',
    module: 'Media',
    ip: '192.168.1.105',
    status: 'warning',
    time: '14/07/2024 14:05:15',
  },
  {
    id: 1011,
    user: 'Ngô Thị Thu',
    action: 'Cập nhật quyền vai trò Biên tập viên',
    module: 'Phân quyền',
    ip: '192.168.1.121',
    status: 'success',
    time: '14/07/2024 14:30:00',
  },
  {
    id: 1012,
    user: 'Lê Văn Phúc',
    action: 'Xuất dữ liệu liên hệ (CSV)',
    module: 'Liên hệ',
    ip: '192.168.1.112',
    status: 'success',
    time: '14/07/2024 15:00:45',
  },
];

const moduleIcons: Record<string, any> = {
  'Xác thực': Shield,
  'Bài viết': FileText,
  Media: Upload,
  'Nhân sự': Users,
  'Cài đặt': Settings,
  'Phân quyền': Lock,
  'Liên hệ': FileText,
};

const statusConfig: Record<string, { color: string; bg: string; icon: any }> = {
  success: { color: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle },
  error: { color: 'text-red-700', bg: 'bg-red-50', icon: XCircle },
  warning: { color: 'text-amber-700', bg: 'bg-amber-50', icon: Shield },
};

const modules = [
  'Tất cả',
  'Xác thực',
  'Bài viết',
  'Media',
  'Nhân sự',
  'Cài đặt',
  'Phân quyền',
  'Liên hệ',
];

export default function Logs() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('Tất cả');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase());
    const matchModule = moduleFilter === 'Tất cả' || log.module === moduleFilter;
    const matchStatus = statusFilter === 'Tất cả' || log.status === statusFilter.toLowerCase();
    return matchSearch && matchModule && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Nhật ký</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Audit log — {filtered.length} bản ghi hoạt động
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <Shield size={13} />
          <span>Chỉ xem — không thể chỉnh sửa</span>
        </div>
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
            placeholder="Tìm theo người dùng, hành động..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm outline-none text-slate-600 bg-white"
          style={{ borderColor: 'var(--border)' }}
        >
          {modules.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm outline-none text-slate-600 bg-white"
          style={{ borderColor: 'var(--border)' }}
        >
          {['Tất cả', 'Success', 'Error', 'Warning'].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
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
                ID
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Người dùng
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hành động
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Module
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                IP
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((log) => {
              const sc = statusConfig[log.status];
              const ModuleIcon = moduleIcons[log.module] || FileText;
              return (
                <tr
                  key={log.id}
                  className="border-t hover:bg-slate-50 transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <td className="px-5 py-3 text-xs font-mono text-slate-400">#{log.id}</td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-medium text-slate-700">{log.user}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-slate-600 max-w-xs block truncate">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <ModuleIcon size={12} className="text-slate-400" />
                      {log.module}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-slate-400">{log.ip}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${sc.color} ${sc.bg}`}
                    >
                      <sc.icon size={10} />
                      {log.status === 'success'
                        ? 'Thành công'
                        : log.status === 'error'
                          ? 'Lỗi'
                          : 'Cảnh báo'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs font-mono text-slate-400 whitespace-nowrap">
                    {log.time}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
