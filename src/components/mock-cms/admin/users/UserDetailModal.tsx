/* eslint-disable @next/next/no-img-element */

import { Loader2, X } from 'lucide-react';
import { UserResponse } from '@/types/user.type';
import { resolveAssetUrl } from '@/utils/asset-url';
import {
  formatDate,
  formatDateTime,
  getGenderLabel,
  getRoleLabel,
  getUserInitial,
} from './user.utils';

interface UserDetailModalProps {
  user: UserResponse | null;
  userDirectory: UserResponse[];
  loading: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, userDirectory, loading, onClose }: UserDetailModalProps) {
  if (!loading && !user) return null;

  const userNames = new Map(userDirectory.map((item) => [item.userId, item.fullName]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Chi tiết người dùng</h2>
            <p className="mt-0.5 text-xs text-slate-500">Dữ liệu lấy trực tiếp từ API chi tiết User.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            <Loader2 className="mx-auto mb-2 animate-spin" size={20} />
            Đang tải chi tiết...
          </div>
        ) : user ? (
          <div className="p-6">
            <div className="mb-6 flex items-center gap-4 rounded-lg bg-slate-50 p-4">
              {user.avatarUrl ? (
                <img
                  src={resolveAssetUrl(user.avatarUrl)}
                  alt={user.fullName}
                  className="h-16 w-16 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
                  {getUserInitial(user.fullName)}
                </div>
              )}
              <div>
                <div className="text-lg font-bold text-slate-900">{user.fullName}</div>
                <div className="text-sm text-slate-500">{user.email}</div>
                <div className="mt-1 text-xs font-medium text-blue-600">
                  {user.employeeCode || 'Chưa có mã nhân viên'} · {getRoleLabel(user.role)}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Info label="Số điện thoại" value={user.phoneNumber || 'Chưa cập nhật'} />
              <Info label="Giới tính" value={getGenderLabel(user.gender)} />
              <Info label="Ngày sinh" value={formatDate(user.dateOfBirth)} />
              <Info label="Trạng thái" value={user.isActive ? 'Hoạt động' : 'Bị khóa'} />
              <Info label="Tài khoản hệ thống" value={user.isSystem ? 'Có' : 'Không'} />
              <Info label="Nhóm người dùng" value={getRoleLabel(user.role)} />
              <div className="sm:col-span-2">
                <Info label="Địa chỉ" value={user.address || 'Chưa cập nhật'} />
              </div>
              <Info
                label="Tạo"
                value={`${user.createdBy ? userNames.get(user.createdBy) || 'Không xác định' : '-'} · ${formatDateTime(user.createdAt)}`}
              />
              <Info
                label="Cập nhật"
                value={`${user.updatedBy ? userNames.get(user.updatedBy) || 'Không xác định' : '-'} · ${formatDateTime(user.updatedAt)}`}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 break-words text-sm font-medium text-slate-800">{value}</div>
    </div>
  );
}
