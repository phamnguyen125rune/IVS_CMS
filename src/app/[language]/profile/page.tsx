'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { ResUserDTO } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const language = (params?.language as string) || 'vi';
  const [profile, setProfile] = useState<ResUserDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch('/api/auth/profile')
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || 'Không thể tải hồ sơ');
        }
        return data as ResUserDTO;
      })
      .then((data) => {
        if (active) {
          setProfile(data);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err instanceof Error ? err.message : 'Không thể tải hồ sơ');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(`/${language}/login`);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white">
              C
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-950">Hồ sơ cá nhân</h1>
              <p className="mt-1 text-sm text-slate-500">Thông tin tài khoản đang đăng nhập</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>

        {isLoading && <p className="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">Đang tải hồ sơ...</p>}

        {error && (
          <div className="mt-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {profile && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoItem icon={<UserRound size={18} />} label="Họ và tên" value={profile.fullname} />
            <InfoItem icon={<Mail size={18} />} label="Email" value={profile.email} />
            <InfoItem label="Mã nhân viên" value={profile.employeeCode || 'Chưa có'} />
            <InfoItem icon={<ShieldCheck size={18} />} label="Vai trò" value={profile.role?.name || 'Chưa có'} />
            <InfoItem label="Trạng thái" value={profile.status || 'ACTIVE'} />
            <InfoItem label="Số điện thoại" value={profile.phone || 'Chưa cập nhật'} />
          </div>
        )}
      </section>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
        {icon}
        {label}
      </div>
      <p className="mt-2 break-words text-base font-semibold text-slate-950">{value}</p>
    </div>
  );
}
