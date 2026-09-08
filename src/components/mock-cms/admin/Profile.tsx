'use client';

/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {
  CheckCircle2,
  ImagePlus,
  KeyRound,
  Loader2,
  Save,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { ResUserDTO, UserCreatePayload } from '@/types';
import { calculateAge } from '@/utils/age';
import { resolveAssetUrl } from '@/utils/asset-url';

const DEFAULT_PASSWORD = '123456';

type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const emptyProfileForm: UserCreatePayload = {
  fullname: '',
  email: '',
  phone: '',
  age: 0,
  address: '',
  gender: 'OTHER',
  dateOfBirth: '',
};

const emptyPasswordForm: PasswordForm = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default function Profile() {
  const [profile, setProfile] = useState<ResUserDTO | null>(null);
  const [form, setForm] = useState<UserCreatePayload>(emptyProfileForm);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(emptyPasswordForm);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch('/api/auth/profile')
      .then(readJson)
      .then((data: ResUserDTO) => {
        if (!active) return;
        setProfile(data);
        setForm({
          fullname: data.fullname || '',
          email: data.email,
          phone: data.phone || '',
          age: calculateAge(data.dateOfBirth),
          address: data.address || '',
          gender: data.gender || 'OTHER',
          dateOfBirth: data.dateOfBirth || '',
          avatarUrl: data.avatarUrl || '',
        });
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Không tải được hồ sơ');
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setSavingProfile(true);
    clearFeedback();

    try {
      const data = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: form.fullname?.trim(),
          phone: form.phone?.trim(),
          age: calculateAge(form.dateOfBirth),
          address: form.address?.trim(),
          gender: form.gender || 'OTHER',
          dateOfBirth: form.dateOfBirth || undefined,
        }),
      }).then(readJson);

      setProfile(data);
      setMessage('Đã lưu thông tin hồ sơ cá nhân');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được hồ sơ');
    } finally {
      setSavingProfile(false);
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingAvatar(true);
    clearFeedback();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const data = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData,
      }).then(readJson);

      setForm((value) => ({ ...value, avatarUrl: data.avatarUrl }));
      setProfile((value) => (value ? { ...value, avatarUrl: data.avatarUrl } : value));
      setMessage('Đã cập nhật ảnh đại diện');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không upload được ảnh đại diện');
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    clearFeedback();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    setSavingPassword(true);
    try {
      await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      }).then(readJson);

      setPasswordForm(emptyPasswordForm);
      setMessage('Đã đổi mật khẩu. Bây giờ bạn có thể sử dụng đầy đủ các chức năng CMS.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đổi được mật khẩu');
    } finally {
      setSavingPassword(false);
    }
  }

  function clearFeedback() {
    setError(null);
    setMessage(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Hồ sơ cá nhân</h1>
          <p className="mt-1 text-sm text-slate-500">
            Nhân sự tự cập nhật thông tin cá nhân và đổi mật khẩu tại đây.
          </p>
        </div>
        {profile && (
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
            {profile.avatarUrl ? (
              <img
                src={resolveAssetUrl(profile.avatarUrl)}
                className="h-10 w-10 rounded-lg object-cover"
                alt={profile.fullname}
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 font-bold text-blue-700">
                {getInitial(profile.fullname)}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold text-slate-900">{profile.email}</div>
              <div className="text-xs text-slate-500">
                {profile.employeeCode || 'Chưa có mã'} · {profile.role?.name || 'Chưa có vai trò'}
              </div>
            </div>
          </div>
        )}
      </div>

      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            error
              ? 'border-red-200 bg-red-50 text-red-600'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          {message && !error && <CheckCircle2 className="mr-2 inline-block" size={16} />}
          {error || message}
        </div>
      )}

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Nếu tài khoản mới được admin tạo, mật khẩu mặc định là{' '}
        <span className="font-bold">{DEFAULT_PASSWORD}</span>. Vui lòng đổi mật khẩu trước khi dùng
        các chức năng khác.
      </div>

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          <Loader2 className="mx-auto mb-2 animate-spin" size={22} />
          Đang tải hồ sơ...
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <form
            onSubmit={saveProfile}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <SectionTitle icon={<UserRound size={18} />} title="Thông tin cá nhân" />
            <div className="mt-5 flex flex-wrap items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {form.avatarUrl ? (
                <img
                  src={resolveAssetUrl(form.avatarUrl)}
                  className="h-20 w-20 rounded-lg object-cover"
                  alt={form.fullname || 'Ảnh đại diện'}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-blue-100 text-xl font-bold text-blue-700">
                  {getInitial(form.fullname || profile?.fullname || '')}
                </div>
              )}
              <div className="min-w-56 flex-1">
                <div className="text-sm font-semibold text-slate-800">Ảnh đại diện</div>
                <p className="mt-1 text-xs text-slate-500">
                  Chọn ảnh từ thư mục máy tính để đưa vào dự án.
                </p>
              </div>
              <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700">
                {uploadingAvatar ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ImagePlus size={16} />
                )}
                Chọn ảnh
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={uploadAvatar}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Họ và tên">
                <input
                  value={form.fullname || ''}
                  onChange={(event) =>
                    setForm((value) => ({ ...value, fullname: event.target.value }))
                  }
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Email đăng nhập">
                <input value={form.email} className={inputClass} disabled />
              </Field>
              <Field label="Số điện thoại">
                <input
                  value={form.phone || ''}
                  onChange={(event) =>
                    setForm((value) => ({ ...value, phone: event.target.value }))
                  }
                  className={inputClass}
                  placeholder="0900000000"
                />
              </Field>
              <Field label="Giới tính">
                <select
                  value={form.gender || 'OTHER'}
                  onChange={(event) =>
                    setForm((value) => ({ ...value, gender: event.target.value }))
                  }
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
                  onChange={(event) =>
                    setForm((value) => ({ ...value, dateOfBirth: event.target.value }))
                  }
                  className={inputClass}
                />
              </Field>
              <Field label="Tuổi tự tính">
                <input
                  value={calculateAge(form.dateOfBirth) || ''}
                  className={inputClass}
                  placeholder="Tự tính theo ngày sinh"
                  disabled
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Địa chỉ">
                  <input
                    value={form.address || ''}
                    onChange={(event) =>
                      setForm((value) => ({ ...value, address: event.target.value }))
                    }
                    className={inputClass}
                    placeholder="Nhập địa chỉ"
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Lưu hồ sơ
            </button>
          </form>

          <form
            onSubmit={changePassword}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <SectionTitle icon={<KeyRound size={18} />} title="Đổi mật khẩu" />
            <div className="mt-5 space-y-4">
              <Field label="Mật khẩu hiện tại">
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(event) =>
                    setPasswordForm((value) => ({ ...value, oldPassword: event.target.value }))
                  }
                  className={inputClass}
                  placeholder={DEFAULT_PASSWORD}
                  required
                />
              </Field>
              <Field label="Mật khẩu mới">
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) =>
                    setPasswordForm((value) => ({ ...value, newPassword: event.target.value }))
                  }
                  className={inputClass}
                  required
                />
              </Field>
              <Field label="Nhập lại mật khẩu mới">
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) =>
                    setPasswordForm((value) => ({
                      ...value,
                      confirmPassword: event.target.value,
                    }))
                  }
                  className={inputClass}
                  required
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingPassword ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShieldCheck size={16} />
              )}
              Đổi mật khẩu
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
      {icon}
      {title}
    </div>
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

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

const inputClass =
  'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500';
