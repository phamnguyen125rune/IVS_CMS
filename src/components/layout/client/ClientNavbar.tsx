'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Globe, Share2, ExternalLink, Menu, X } from 'lucide-react';

import ThemeToggle from '@/components/theme/ThemeToggle';

const navLinks = [
  { label: 'Trang chủ', path: '' },

  { label: 'Giới thiệu', path: '/gioi-thieu' },

  {
    label: 'Bài viết',
    path: '/bai-viet',
    children: [
      { label: 'Tất cả bài viết', path: '/bai-viet' },
      {
        label: 'Tin tức công ty',
        path: '/bai-viet?danh-muc=tin-tuc',
      },
      {
        label: 'Kiến thức chuyên ngành',
        path: '/bai-viet?danh-muc=kien-thuc',
      },
    ],
  },

  {
    label: 'Dự án',
    path: '/du-an',
    children: [
      { label: 'Tất cả dự án', path: '/du-an' },
      {
        label: 'Dự án nổi bật',
        path: '/du-an?loai=noi-bat',
      },
      {
        label: 'Đã hoàn thành',
        path: '/du-an?loai=hoan-thanh',
      },
    ],
  },

  { label: 'Khách hàng', path: '/khach-hang' },

  { label: 'Tuyển dụng', path: '/tuyen-dung' },

  { label: 'Liên hệ', path: '/lien-he' },
];

const languages = [
  {
    code: 'vi',
    label: 'Tiếng Việt',
    flag: '🇻🇳',
  },
  {
    code: 'en',
    label: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'ja',
    label: '日本語',
    flag: '🇯🇵',
  },
];

interface ClientNavbarProps {
  language: string;
}

export default function ClientNavbar({ language }: ClientNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeLang = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    return () => {
      if (dropdownTimer.current) {
        clearTimeout(dropdownTimer.current);
      }
    };
  }, []);

  /*
   * Tạo URL có prefix language
   *
   * Ví dụ:
   * /gioi-thieu
   *
   * =>
   *
   * /vi/gioi-thieu
   */
  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
  };

  /*
   * Đổi ngôn ngữ nhưng giữ nguyên trang hiện tại
   *
   * /vi/gioi-thieu
   *
   * =>
   *
   * /en/gioi-thieu
   */
  const handleLanguageChange = (newLangCode: string) => {
    const segments = pathname.split('/');

    segments[1] = newLangCode;

    const newPath = segments.join('/');

    router.push(newPath);

    setLangOpen(false);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <div
        className="hidden md:flex items-center justify-end px-6 py-1.5 text-xs text-slate-500 border-b"
        style={{
          background: '#0f172a',
          borderColor: '#1e293b',
        }}
      >
        <div className="flex items-center gap-3 text-slate-400">
          <a href="#" className="hover:text-white transition-colors">
            <Share2 size={12} />
          </a>

          <a href="#" className="hover:text-white transition-colors">
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}

        <Link href={getLocalizedPath('/')} className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
            style={{
              background: 'var(--primary, #2563eb)',
            }}
          >
            C
          </div>

          <span className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>
            CMS
          </span>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const fullPath = getLocalizedPath(link.path);

            const isActive =
              link.path === ''
                ? pathname === `/${language}` || pathname === `/${language}/`
                : pathname.startsWith(fullPath);

            return (
              <div
                key={link.path}
                className="relative"
                onMouseEnter={() => {
                  if (dropdownTimer.current) {
                    clearTimeout(dropdownTimer.current);
                  }

                  setOpenDropdown(link.label);
                }}
                onMouseLeave={() => {
                  dropdownTimer.current = setTimeout(() => {
                    setOpenDropdown(null);
                  }, 150);
                }}
              >
                <Link
                  href={fullPath}
                  className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}

                  {link.children && <ChevronDown size={13} className="text-slate-400" />}
                </Link>

                {/* Dropdown */}

                {link.children && openDropdown === link.label && (
                  <div
                    className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border py-1.5 w-52 z-50"
                    style={{
                      borderColor: 'var(--border, #e2e8f0)',
                    }}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        href={getLocalizedPath(child.path)}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex items-center gap-2">
          {/* Theme */}

          <ThemeToggle />

          {/* Language */}

          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 border transition-colors"
              style={{
                borderColor: 'var(--border, #e2e8f0)',
              }}
            >
              <Globe size={14} />

              <span>{activeLang.flag}</span>

              <ChevronDown size={12} />
            </button>

            {langOpen && (
              <div
                className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border py-1.5 w-44 z-50"
                style={{
                  borderColor: 'var(--border, #e2e8f0)',
                }}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-3 px-4 py-2 w-full text-sm transition-colors ${
                      activeLang.code === lang.code
                        ? 'text-blue-600 bg-blue-50 font-medium'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang.flag}</span>

                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Search size={18} />
          </button>

          {/* CTA */}

          <Link
            href={getLocalizedPath('/lien-he')}
            className="hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: 'var(--primary, #2563eb)',
            }}
          >
            Liên hệ ngay
          </Link>

          {/* Mobile */}

          <button
            className="lg:hidden p-2 rounded-lg text-slate-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* =====================================================
          SEARCH
      ====================================================== */}

      {searchOpen && (
        <div
          className="border-t px-6 py-3 bg-slate-50/50"
          style={{
            borderColor: 'var(--border, #e2e8f0)',
          }}
        >
          <div className="flex items-center gap-3 max-w-xl mx-auto">
            <Search size={18} className="text-slate-400" />

            <input
              autoFocus
              placeholder="Tìm kiếm bài viết, dự án..."
              className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchOpen(false);
                }
              }}
            />

            <button
              onClick={() => setSearchOpen(false)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 bg-white space-y-1"
          style={{
            borderColor: 'var(--border, #e2e8f0)',
          }}
        >
          {navLinks.map((link) => {
            const fullPath = getLocalizedPath(link.path);

            const isActive =
              link.path === '' ? pathname === `/${language}` : pathname.startsWith(fullPath);

            return (
              <div key={link.path}>
                <Link
                  href={fullPath}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>

                {link.children && (
                  <div className="pl-4 space-y-1 my-1 border-l-2 border-slate-100 ml-3">
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        href={getLocalizedPath(child.path)}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-1.5 rounded-md text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}
