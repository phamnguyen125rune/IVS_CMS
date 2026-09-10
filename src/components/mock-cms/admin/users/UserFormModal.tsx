/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent } from 'react';
import { ImagePlus, Loader2, Save, X } from 'lucide-react';
import { UserFormValues, UserResponse, UserRoleOption } from '@/types/user.type';
import { resolveAssetUrl } from '@/utils/asset-url';
import { getUserInitial } from './user.utils';

interface UserFormModalProps {
  form: UserFormValues;
  editingUser: UserResponse | null;
  defaultRole: UserRoleOption | null;
  saving: boolean;
  uploadingAvatar: boolean;
  onChange: (patch: Partial<UserFormValues>) => void;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function UserFormModal({
  form,
  editingUser,
  defaultRole,
  saving,
  uploadingAvatar,
  onChange,
  onAvatarChange,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  const isEditing = Boolean(editingUser);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
      onClick={onClose}
    >
      <form
        onSubmit={onSubmit}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {isEditing ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {isEditing
                ? `Mã nhân viên: ${editingUser?.employeeCode || '-'}`
                : 'Tài khoản mới dùng mật khẩu mặc định 123456'}
            </p>
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

        <div className="overflow-y-auto px-6 py-5">
          {isEditing && (
            <div className="mb-5 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {form.avatarUrl ? (
                <img
                  src={resolveAssetUrl(form.avatarUrl)}
                  alt={form.fullName}
                  className="h-20 w-20 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-700">
                  {getUserInitial(form.fullName)}
                </div>
              )}
              <div className="min-w-52 flex-1">
                <div className="text-sm font-semibold text-slate-800">Ảnh đại diện</div>
                <p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF hoặc WebP; tối đa 5MB.</p>
              </div>
              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
                {uploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
                Chọn ảnh
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={onAvatarChange}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Họ và tên" required>
              <input
                value={form.fullName}
                onChange={(event) => onChange({ fullName: event.target.value })}
                className={inputClass}
                placeholder="Nhập họ và tên"
                required
              />
            </Field>

            <Field label="Email" required>
              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange({ email: event.target.value })}
                className={inputClass}
                placeholder="name@company.com"
                required
              />
            </Field>

            <Field label="Số điện thoại">
              <input
                value={form.phoneNumber}
                onChange={(event) => onChange({ phoneNumber: event.target.value })}
                className={inputClass}
                placeholder="0900000000"
              />
            </Field>

            <Field label="Giới tính">
              <select
                value={form.gender}
                onChange={(event) =>
                  onChange({ gender: event.target.value as UserFormValues['gender'] })
                }
                className={inputClass}
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHERS">Khác</option>
              </select>
            </Field>

            <Field label="Ngày sinh">
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(event) => onChange({ dateOfBirth: event.target.value })}
                className={inputClass}
              />
            </Field>

            <Field label="Vai trò">
              <div
                aria-disabled="true"
                className={`${inputClass} pointer-events-none flex items-center !border-slate-300 !bg-slate-200 !text-slate-500 opacity-60`}
              >
                {defaultRole?.roleName || 'Đang tải...'}
              </div>
            </Field>

            <div className="md:col-span-2">
              <Field label="Địa chỉ">
                <input
                  value={form.address}
                  onChange={(event) => onChange({ address: event.target.value })}
                  className={inputClass}
                  placeholder="Nhập địa chỉ"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex min-w-32 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isEditing ? 'Lưu thay đổi' : 'Thêm mới'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-600">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500';
