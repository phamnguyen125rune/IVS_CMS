import { FileUser, Plus, Search, Trash2, X } from 'lucide-react';
import { FormEvent } from 'react';
import { UserRoleOption } from '@/types/user.type';

interface UserToolbarProps {
  showDeleted: boolean;
  deletedCount: number;
  searchInput: string;
  searchKeyword: string;
  roleFilter: string;
  roles: UserRoleOption[];
  onToggleDeleted: () => void;
  onCreate: () => void;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClearSearch: () => void;
  onRoleFilterChange: (value: string) => void;
}

export default function UserToolbar({
  showDeleted,
  deletedCount,
  searchInput,
  searchKeyword,
  roleFilter,
  roles,
  onToggleDeleted,
  onCreate,
  onSearchInputChange,
  onSearchSubmit,
  onClearSearch,
  onRoleFilterChange,
}: UserToolbarProps) {
  return (
    <div
      className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-white p-4"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggleDeleted}
          className="flex min-h-10 items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          style={{ borderColor: 'var(--border)' }}
        >
          {showDeleted ? <FileUser size={15} /> : <Trash2 size={15} />}
          {showDeleted ? 'Danh sách người dùng' : `Đã xóa (${deletedCount})`}
        </button>

        {!showDeleted && (
          <button
            type="button"
            onClick={onCreate}
            className="flex min-h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 transition-colors hover:bg-blue-700"
          >
            <Plus size={15} />
            Thêm người dùng
          </button>
        )}
      </div>

      <form
        onSubmit={onSearchSubmit}
        className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2"
      >
        <div className="relative min-w-64 flex-1 lg:max-w-3xl">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(event) => onSearchInputChange(event.target.value)}
            placeholder="Tên, email, mã nhân viên, số điện thoại..."
            className="h-10 w-full rounded-lg border py-2 pl-9 pr-10 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            style={{ borderColor: 'var(--border)' }}
          />
          {(searchInput || searchKeyword) && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <Search size={15} />
          Tìm
        </button>

        <select
          value={roleFilter}
          onChange={(event) => onRoleFilterChange(event.target.value)}
          className="h-10 shrink-0 rounded-lg border bg-white px-3 text-sm text-slate-600 outline-none"
          style={{ borderColor: 'var(--border)' }}
        >
          <option value="ALL">Tất cả vai trò</option>
          {roles.map((role) => (
            <option key={role.roleId} value={role.roleId}>
              {formatRoleName(role.roleName)}
            </option>
          ))}
        </select>
      </form>
    </div>
  );
}

function formatRoleName(name: string) {
  return name
    .toLowerCase()
    .split('_')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
