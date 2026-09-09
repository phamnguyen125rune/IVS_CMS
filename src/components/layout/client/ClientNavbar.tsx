'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Globe, Share2, ExternalLink, Menu, X } from 'lucide-react';

import ThemeToggle from '@/components/theme/ThemeToggle';

interface MenuItem {
  menuId: number;
  parentId: number | null;
  title: string;
  url: string;
  displayOrder: number;
  level: number;
  visible: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

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

  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const activeLang = languages.find((lang) => lang.code === language) || languages[0];

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);

        const response = await fetch('/api/v1/menus', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Không thể lấy menu: ${response.status}`);
        }

        const data: MenuItem[] = await response.json();

        setMenus(
          data.filter((menu) => menu.visible).sort((a, b) => a.displayOrder - b.displayOrder)
        );
      } catch (error) {
        console.error('Fetch menu error:', error);
        setMenus([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();

    const channel = new BroadcastChannel('menu-updated');

    channel.onmessage = (event) => {
      if (event.data?.type === 'updated') {
        fetchMenus();
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownTimer.current) {
        clearTimeout(dropdownTimer.current);
      }
    };
  }, []);

  const getLocalizedPath = (path: string) => {
    if (!path) {
      return `/${language}`;
    }

    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `/${language}${cleanPath}`;
  };

  const rootMenus = menus
    .filter((menu) => menu.parentId === null)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const getChildren = (parentId: number) => {
    return menus
      .filter((menu) => menu.parentId === parentId)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  };

  const isMenuActive = (menu: MenuItem) => {
    const fullPath = getLocalizedPath(menu.url);

    if (menu.url === '/' || menu.url === '') {
      return pathname === `/${language}` || pathname === `/${language}/`;
    }

    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  const handleLanguageChange = (newLangCode: string) => {
    const segments = pathname.split('/');

    segments[1] = newLangCode;

    const newPath = segments.join('/');

    router.push(newPath);

    setLangOpen(false);
    setMobileOpen(false);
  };

  const closeDropdown = () => {
    if (dropdownTimer.current) {
      clearTimeout(dropdownTimer.current);
    }

    setOpenDropdown(null);
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white border-b"
      style={{
        borderColor: 'var(--border, #e2e8f0)',
      }}
    >
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

      <div className="flex items-center justify-between px-6 py-3">
        <Link href={getLocalizedPath('/')} className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
            style={{
              background: 'var(--primary, #2563eb)',
            }}
          >
            C
          </div>

          <span className="font-display font-bold text-slate-900 text-lg">CMS</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {!loading &&
            rootMenus.map((menu) => {
              const children = getChildren(menu.menuId);
              const fullPath = getLocalizedPath(menu.url);
              const isActive = isMenuActive(menu);

              return (
                <div
                  key={menu.menuId}
                  className="relative"
                  onMouseEnter={() => {
                    if (dropdownTimer.current) {
                      clearTimeout(dropdownTimer.current);
                    }

                    if (children.length > 0) {
                      setOpenDropdown(menu.menuId);
                    }
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
                    {menu.title}

                    {children.length > 0 && <ChevronDown size={13} className="text-slate-400" />}
                  </Link>

                  {children.length > 0 && openDropdown === menu.menuId && (
                    <div
                      className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border py-1.5 w-52 z-50"
                      style={{
                        borderColor: 'var(--border, #e2e8f0)',
                      }}
                    >
                      {children.map((child) => (
                        <Link
                          key={child.menuId}
                          href={getLocalizedPath(child.url)}
                          onClick={closeDropdown}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

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

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <Search size={18} />
          </button>

          <Link
            href={getLocalizedPath('/lien-he')}
            className="hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{
              background: 'var(--primary, #2563eb)',
            }}
          >
            Liên hệ ngay
          </Link>

          <button
            className="lg:hidden p-2 rounded-lg text-slate-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

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

      {mobileOpen && (
        <div
          className="lg:hidden border-t px-4 py-3 bg-white space-y-1"
          style={{
            borderColor: 'var(--border, #e2e8f0)',
          }}
        >
          {!loading &&
            rootMenus.map((menu) => {
              const children = getChildren(menu.menuId);
              const fullPath = getLocalizedPath(menu.url);
              const isActive = isMenuActive(menu);

              return (
                <div key={menu.menuId}>
                  <Link
                    href={fullPath}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'text-blue-600 bg-blue-50 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {menu.title}
                  </Link>

                  {children.length > 0 && (
                    <div className="pl-4 space-y-1 my-1 border-l-2 border-slate-100 ml-3">
                      {children.map((child) => (
                        <Link
                          key={child.menuId}
                          href={getLocalizedPath(child.url)}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-1.5 rounded-md text-xs text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                        >
                          {child.title}
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
