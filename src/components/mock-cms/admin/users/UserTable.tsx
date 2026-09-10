/* eslint-disable @next/next/no-img-element */

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  FileUser,
  KeyRound,
  Loader2,
  Lock,
  RotateCcw,
  Trash2,
  Unlock,
} from 'lucide-react';
import { UserResponse } from '@/types/user.type';
import { resolveAssetUrl } from '@/utils/asset-url';
import {
  formatDateTime,
  getRoleLabel,
  getUserInitial,
  isProfileComplete,
} from './user.utils';
import { UserConfirmAction } from './hooks/useUsers';

interface UserTableProps {
  users: UserResponse[];
  userDirectory: UserResponse[];
  total: number;
  loading: boolean;
  showDeleted: boolean;
  rowsPerPage: number;
  currentPage: number;
  totalPages: number;
  onRowsPerPageChange: (value: number) => void;
  onPageChange: (value: number) => void;
  onDetail: (user: UserResponse) => void;
  onEdit: (user: UserResponse) => void;
  onConfirm: (action: UserConfirmAction) => void;
  isSecurityActionDisabled: (user: UserResponse) => boolean;
}

export default function UserTable({
  users,
  userDirectory,
  total,
  loading,
  showDeleted,
  rowsPerPage,
  currentPage,
  totalPages,
  onRowsPerPageChange,
  onPageChange,
  onDetail,
  onEdit,
  onConfirm,
  isSecurityActionDisabled,
}: UserTableProps) {
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const rangeEnd = Math.min(currentPage * rowsPerPage, total);
  const userNames = new Map(userDirectory.map((user) => [user.userId, user.fullName]));

  return (
    <>
      <div className="mb-3 flex items-center justify-end gap-6 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          <span>Số dòng/trang:</span>
          <select
            value={rowsPerPage}
            onChange={(event) => onRowsPerPageChange(Number(event.target.value))}
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
            {rangeStart} - {rangeEnd} của {total}
          </span>
          <div className="flex items-center gap-1">
            <IconButton
              label="Trang trước"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft size={16} />
            </IconButton>
            <IconButton
              label="Trang sau"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
              <ChevronRight size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      <div
        className="w-full overflow-x-auto rounded-lg border bg-white"
        style={{ borderColor: 'var(--border)' }}
      >
        <table className="w-full min-w-[1120px] text-sm">
          <thead>
            <tr className="border-b bg-slate-50" style={{ borderColor: 'var(--border)' }}>
              <HeaderCell>Người dùng</HeaderCell>
              <HeaderCell>Mã NV</HeaderCell>
              <HeaderCell>Vai trò</HeaderCell>
              <HeaderCell>Hồ sơ</HeaderCell>
              <HeaderCell>Trạng thái</HeaderCell>
              <HeaderCell>Tạo bởi</HeaderCell>
              <HeaderCell>Cập nhật</HeaderCell>
              <HeaderCell align="right">Hành động</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-10 text-center text-slate-500">
                  <Loader2 className="mx-auto mb-2 animate-spin" size={20} />
                  Đang tải danh sách người dùng...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                  {showDeleted
                    ? 'Chưa có tài khoản nào trong danh sách đã xóa.'
                    : 'Chưa tìm thấy người dùng nào.'}
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const securityDisabled = isSecurityActionDisabled(user);
                return (
                  <tr
                    key={user.userId}
                    className="border-t transition-colors hover:bg-slate-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <img
                            src={resolveAssetUrl(user.avatarUrl)}
                            className="h-9 w-9 rounded-lg object-cover"
                            alt={user.fullName}
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                            {getUserInitial(user.fullName)}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-800">{user.fullName}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                      {user.employeeCode || '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${isProfileComplete(user)
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                          }`}
                      >
                        <FileUser size={13} />
                        {isProfileComplete(user) ? 'Đã cập nhật' : 'Chưa đầy đủ'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`flex w-fit items-center gap-1.5 text-xs font-medium ${showDeleted
                          ? 'text-red-500'
                          : user.isActive
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                          }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${showDeleted
                            ? 'bg-red-400'
                            : user.isActive
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            }`}
                        />
                        {showDeleted ? 'Đã xóa' : user.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <AuditInfo by={user.createdBy} at={user.createdAt} userNames={userNames} />
                    </td>
                    <td className="px-5 py-3.5">
                      <AuditInfo by={user.updatedBy} at={user.updatedAt} userNames={userNames} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {!showDeleted && (
                          <IconButton label="Xem chi tiết" onClick={() => onDetail(user)}>
                            <Eye size={14} />
                          </IconButton>
                        )}

                        {showDeleted ? (
                          <>
                            <IconButton
                              label="Khôi phục tài khoản"
                              onClick={() => onConfirm({ type: 'restore', user })}
                            >
                              <RotateCcw size={14} />
                            </IconButton>
                            <IconButton
                              label="Xóa vĩnh viễn"
                              disabled={securityDisabled}
                              onClick={() => onConfirm({ type: 'hard-delete', user })}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <IconButton label="Chỉnh sửa" onClick={() => onEdit(user)}>
                              <Edit size={14} />
                            </IconButton>
                            <IconButton
                              label={user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                              disabled={securityDisabled}
                              onClick={() => onConfirm({ type: 'status', user })}
                            >
                              {user.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                            </IconButton>
                            <IconButton
                              label="Reset mật khẩu"
                              disabled={securityDisabled}
                              onClick={() => onConfirm({ type: 'reset-password', user })}
                            >
                              <KeyRound size={14} />
                            </IconButton>
                            <IconButton
                              label="Xóa mềm"
                              disabled={securityDisabled}
                              onClick={() => onConfirm({ type: 'soft-delete', user })}
                            >
                              <Trash2 size={14} />
                            </IconButton>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function HeaderCell({
  children,
  align = 'left',
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${align === 'right' ? 'text-right' : 'text-left'
        }`}
    >
      {children}
    </th>
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

function AuditInfo({
  by,
  at,
  userNames,
}: {
  by: number | null;
  at: string | null;
  userNames: Map<number, string>;
}) {
  return (
    <div className="min-w-28">
      <div className="text-xs font-semibold text-slate-700">
        {by ? userNames.get(by) || 'Không xác định' : '-'}
      </div>
      <div className="mt-1 whitespace-nowrap text-xs text-slate-400">{formatDateTime(at)}</div>
    </div>
  );
}
