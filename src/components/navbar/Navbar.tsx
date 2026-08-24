'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { UserLogin } from '@/types';
import { getDictionary } from '@/utils/i18n';
import ThemeToggle from '@/components/theme/ThemeToggle';

interface NavbarProps {
  user: UserLogin | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname() || '';
  const router = useRouter();

  // Extract language segment from pathname (e.g., /vi/profile -> vi)
  const segments = pathname.split('/');
  const language = ['en', 'ja'].includes(segments[1]) ? segments[1] : 'vi';
  const dict = getDictionary(language).navbar;

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.refresh();
        window.location.href = `/${language}/login`;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const switchLanguage = (newLang: 'vi' | 'en' | 'ja') => {
    if (newLang === language) return;
    const nextSegments = [...segments];
    if (['vi', 'en', 'ja'].includes(nextSegments[1])) {
      nextSegments[1] = newLang;
    } else {
      nextSegments.splice(1, 0, newLang);
    }
    router.push(nextSegments.join('/') || '/');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-800 text-white sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">
          CMS
        </div>
        <span className="text-xl font-bold tracking-tight">Apex CMS</span>
      </div>

      {user && (
        <div className="flex items-center gap-6">
          <Link
            href={`/${language}/users`}
            className={`font-medium text-sm transition-colors hover:text-white ${
              pathname.startsWith(`/${language}/users`) ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {dict.home}
          </Link>
        </div>
      )}

      <div className="flex items-center gap-6">
        {/* Language Toggler */}
        <div className="flex bg-gray-950 p-0.5 rounded-lg border border-gray-800 text-xs select-none">
          <button
            onClick={() => switchLanguage('vi')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              language === 'vi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-450 hover:text-white'
            }`}
          >
            VI
          </button>
          <button
            onClick={() => switchLanguage('en')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-450 hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => switchLanguage('ja')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
              language === 'ja'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-450 hover:text-white'
            }`}
          >
            JA
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-right">
                <div className="text-sm font-semibold">{user.fullname}</div>
                <div className="text-xs text-gray-400">{user.role?.name}</div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-400 border border-red-900/30 rounded hover:bg-red-950/30 hover:border-red-400 transition-all cursor-pointer"
              >
                {dict.logout}
              </button>
            </>
          ) : (
            <Link
              href={`/${language}/login`}
              className="px-4 py-2 text-sm font-semibold text-blue-400 border border-blue-900/30 rounded hover:bg-blue-950/30 hover:border-blue-400 transition-all"
            >
              {dict.login}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
