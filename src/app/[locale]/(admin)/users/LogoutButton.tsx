'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.refresh();
        window.location.href = '/login';
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-3 bg-red-600 hover:bg-red-750 active:bg-red-800 text-white text-sm font-bold rounded transition-all shadow-md"
    >
      Đăng xuất tài khoản
    </button>
  );
}
