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
      className="
        sticky
        top-0
        z-50
        border-b
      "
      style={{
        borderColor: 'var(--border, #e2e8f0)',
      }}
    >
      <div
        className="
          hidden
          items-center
          justify-end
          border-b
          px-6
          py-1.5
          text-xs
          md:flex
        "
        style={{
          background: 'var(--dark-background)',
          borderColor: 'var(--dark-border)',
        }}
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
          style={{
            color: 'var(--dark-text-secondary)',
          }}
        >
          <a
            href="#"
            className="
              transition-colors
              hover:text-[var(--primary)]
            "
            aria-label="Chia sẻ"
          >
            <Share2 size={12} />
          </a>

          <a
            href="#"
            className="
              transition-colors
              hover:text-[var(--primary)]
            "
            aria-label="Liên kết bên ngoài"
          >
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3">
        <Link href={getLocalizedPath('/')} className="flex items-center gap-2.5">
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              text-base
              font-bold
            "
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            C
          </div>

          <span
            className="
              font-display
              text-lg
              font-bold
            "
            style={{
              color: 'var(--text)',
            }}
          >
            CMS
          </span>
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

        <div className="flex shrink-0 items-center gap-2 overflow-visible">
          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen(!langOpen)}
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                border
                px-3
                py-2
                text-sm
                font-medium
                transition-colors
                hover:bg-[var(--hover)]
                hover:text-[var(--primary)]
              "
              style={{
                color: 'var(--text)',
                borderColor: 'var(--border)',
                background: langOpen ? 'var(--active)' : 'transparent',
              }}
              aria-label="Chọn ngôn ngữ"
              aria-expanded={langOpen}
            >
              <Globe size={14} />

              <span>{activeLang.flag}</span>

              <ChevronDown
                size={12}
                style={{
                  color: langOpen ? 'var(--primary)' : 'var(--text-secondary)',
                }}
              />
            </button>

            {/* Language dropdown */}

            {langOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-1
                  w-44
                  rounded-xl
                  border
                  py-1.5
                  shadow-xl
                "
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                {languages.map((lang) => {
                  const isActive = activeLang.code === lang.code;

                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleLanguageChange(lang.code)}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        px-4
                        py-2
                        text-sm
                        transition-colors
                        hover:bg-[var(--hover)]
                        hover:text-[var(--primary)]
                      "
                      style={{
                        color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                        background: isActive ? 'var(--active)' : undefined,
                        fontWeight: isActive ? 500 : undefined,
                      }}
                    >
                      <span>{lang.flag}</span>

                      <span>{lang.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="
              rounded-lg
              p-2
              transition-colors
              hover:bg-[var(--hover)]
              hover:text-[var(--primary)]
            "
            style={{
              color: 'var(--text)',
            }}
            aria-label="Tìm kiếm"
          >
            <Search size={18} />
          </button>

          <Link
            href={getLocalizedPath('/lien-he')}
            className="
              hidden
              items-center
              rounded-lg
              px-4
              py-2
              text-sm
              font-semibold
              transition-colors
              hover:bg-[var(--primary-hover)]
              md:flex
            "
            style={{
              background: 'var(--primary)',
              color: 'white',
            }}
          >
            Liên hệ ngay
          </Link>

          <button
            type="button"
            className="
              rounded-lg
              p-2
              transition-colors
              hover:bg-[var(--hover)]
              hover:text-[var(--primary)]
              lg:hidden
            "
            style={{
              color: 'var(--text)',
            }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div
          className="
            border-t
            px-6
            py-3
          "
          style={{
            background: 'var(--surface-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="
              mx-auto
              flex
              max-w-xl
              items-center
              gap-3
            "
          >
            <Search
              size={18}
              style={{
                color: 'var(--text-muted)',
              }}
            />

            <input
              autoFocus
              placeholder="Tìm kiếm bài viết, dự án..."
              className="
                flex-1
                bg-transparent
                text-sm
                outline-none
                placeholder:text-[var(--text-placeholder)]
              "
              style={{
                color: 'var(--text)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchOpen(false);
                }
              }}
            />

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="
                rounded-lg
                p-1
                transition-colors
                hover:bg-[var(--hover)]
                hover:text-[var(--primary)]
              "
              style={{
                color: 'var(--text-muted)',
              }}
              aria-label="Đóng tìm kiếm"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div
          className="
            space-y-1
            border-t
            px-4
            py-3
            lg:hidden
          "
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
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
