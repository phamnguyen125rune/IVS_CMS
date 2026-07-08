'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserLogin } from '@/types';

interface NavbarProps {
  user: UserLogin | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        window.location.href = '/login';
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">CMS</div>
        <span className="text-xl font-bold tracking-tight">Apex CMS</span>
      </div>

      {user && (
        <div className="flex items-center gap-6">
          <Link
            href="/users"
            className={`font-medium text-sm transition-colors hover:text-white ${
              pathname.startsWith('/users') ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            Trang chủ
          </Link>
        </div>
      )}

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="text-right">
              <div className="text-sm font-semibold">{user.fullname}</div>
              <div className="text-xs text-gray-400">{user.role?.name}</div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-red-400 border border-red-900/30 rounded hover:bg-red-950/30 hover:border-red-400 transition-all"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-semibold text-blue-400 border border-blue-900/30 rounded hover:bg-blue-950/30 hover:border-blue-400 transition-all"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
}
