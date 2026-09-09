'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { Search, ChevronDown, Globe, Share2, ExternalLink, Menu, X } from 'lucide-react';

import ThemeToggle from '@/components/theme/ThemeToggle';

const navLinks = [
  {
    label: 'Trang chủ',
    path: '',
  },
  {
    label: 'Giới thiệu',
    path: '/gioi-thieu',
  },
  {
    label: 'Bài viết',
    path: '/bai-viet',
    children: [
      {
        label: 'Tất cả bài viết',
        path: '/bai-viet',
      },
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
      {
        label: 'Tất cả dự án',
        path: '/du-an',
      },
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
  {
    label: 'Khách hàng',
    path: '/khach-hang',
  },
  {
    label: 'Tuyển dụng',
    path: '/tuyen-dung',
  },
  {
    label: 'Liên hệ',
    path: '/lien-he',
  },
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
   * /gioi-thieu
   * =>
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
   * =>
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
      className="
        sticky
        top-0
        z-50
        border-b
      "
      style={{
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
      }}
    >
      {/* =====================================================
          TOP BAR
      ====================================================== */}

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

      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-3
        "
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <Link
          href={getLocalizedPath('/')}
          className="
            flex
            items-center
            gap-2.5
          "
        >
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

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================== */}

        <nav
          className="
            hidden
            items-center
            gap-1
            lg:flex
          "
        >
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
                  className="
                    flex
                    items-center
                    gap-1
                    rounded-lg
                    px-3
                    py-2
                    text-sm
                    font-medium
                    transition-colors
                    hover:bg-[var(--hover)]
                    hover:text-[var(--primary)]
                  "
                  style={{
                    color: isActive ? 'var(--primary-text)' : 'var(--text)',
                    background: isActive ? 'var(--active)' : undefined,
                    fontWeight: isActive ? 600 : undefined,
                  }}
                >
                  {link.label}

                  {link.children && (
                    <ChevronDown
                      size={13}
                      style={{
                        color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                      }}
                    />
                  )}
                </Link>

                {/* =================================================
                    DESKTOP DROPDOWN
                ================================================== */}

                {link.children && openDropdown === link.label && (
                  <div
                    className="
                        absolute
                        left-0
                        top-full
                        z-50
                        mt-1
                        w-52
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
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        href={getLocalizedPath(child.path)}
                        onClick={() => setOpenDropdown(null)}
                        className="
                            block
                            px-4
                            py-2
                            text-sm
                            transition-colors
                            hover:bg-[var(--hover)]
                            hover:text-[var(--primary)]
                          "
                        style={{
                          color: 'var(--text-secondary)',
                        }}
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

        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          {/* =================================================
              THEME
          ================================================== */}

          <ThemeToggle />

          {/* =================================================
              LANGUAGE
          ================================================== */}

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

          {/* =================================================
              SEARCH
          ================================================== */}

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

          {/* =================================================
              CTA
          ================================================== */}

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

          {/* =================================================
              MOBILE
          ================================================== */}

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

      {/* =====================================================
          SEARCH
      ====================================================== */}

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

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

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
          {navLinks.map((link) => {
            const fullPath = getLocalizedPath(link.path);

            const isActive =
              link.path === ''
                ? pathname === `/${language}` || pathname === `/${language}/`
                : pathname.startsWith(fullPath);

            return (
              <div key={link.path}>
                <Link
                  href={fullPath}
                  className="
                    block
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition-colors
                    hover:bg-[var(--hover)]
                    hover:text-[var(--primary)]
                  "
                  style={{
                    color: isActive ? 'var(--primary-text)' : 'var(--text)',
                    background: isActive ? 'var(--active)' : undefined,
                    fontWeight: isActive ? 600 : undefined,
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>

                {link.children && (
                  <div
                    className="
                      my-1
                      ml-3
                      space-y-1
                      border-l-2
                      pl-4
                    "
                    style={{
                      borderColor: 'var(--border)',
                    }}
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.path}
                        href={getLocalizedPath(child.path)}
                        onClick={() => setMobileOpen(false)}
                        className="
                          block
                          rounded-md
                          px-3
                          py-1.5
                          text-xs
                          transition-colors
                          hover:bg-[var(--hover)]
                          hover:text-[var(--primary)]
                        "
                        style={{
                          color: 'var(--text-secondary)',
                        }}
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
