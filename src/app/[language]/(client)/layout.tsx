'use client';

import { useState, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ChevronDown,
  Globe,
  Share2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
} from 'lucide-react';
import { FaFacebook, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const navLinks = [
  { label: 'Trang chủ', path: '' },
  { label: 'Giới thiệu', path: '/gioi-thieu' },
  {
    label: 'Bài viết',
    path: '/bai-viet',
    children: [
      { label: 'Tất cả bài viết', path: '/bai-viet' },
      { label: 'Tin tức công ty', path: '/bai-viet?danh-muc=tin-tuc' },
      { label: 'Kiến thức chuyên ngành', path: '/bai-viet?danh-muc=kien-thuc' },
    ],
  },
  {
    label: 'Dự án',
    path: '/du-an',
    children: [
      { label: 'Tất cả dự án', path: '/du-an' },
      { label: 'Dự án nổi bật', path: '/du-an?loai=noi-bat' },
      { label: 'Đã hoàn thành', path: '/du-an?loai=hoan-thanh' },
    ],
  },
  { label: 'Tuyển dụng', path: '/tuyen-dung' },
  { label: 'Liên hệ', path: '/lien-he' },
];

const languages = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

interface ClientLayoutProps {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
}

export default function ClientLayout({ children, params }: ClientLayoutProps) {
  // Unbox params trong Client Component (Next.js 15+)
  const { language } = use(params);
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Lấy thông tin ngôn ngữ hiện tại
  const activeLang = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    return () => {
      if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    };
  }, []);

  // Helper tạo URL có chứa param language
  const getLocalizedPath = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
  };

  // Đổi ngôn ngữ và giữ nguyên đường dẫn hiện tại
  const handleLanguageChange = (newLangCode: string) => {
    const segments = pathname.split('/');
    segments[1] = newLangCode; // Thay thế mã ngôn ngữ ở phân đoạn đầu tiên
    const newPath = segments.join('/');
    router.push(newPath);
    setLangOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-50 bg-white border-b"
        style={{ borderColor: 'var(--border, #e2e8f0)' }}
      >
        {/* Top bar */}
        <div
          className="hidden md:flex items-center justify-end px-6 py-1.5 text-xs text-slate-500 border-b"
          style={{ background: '#0f172a', borderColor: '#1e293b' }}
        >
          {/* <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Phone size={11} />
              +84 28 3456 7890
            </span>
            <span className="flex items-center gap-1.5">
              <Mail size={11} />
              info@cms.vn
            </span>
          </div> */}
          <div className="flex items-center gap-3 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              <Share2 size={12} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Main nav */}
        <div className="flex items-center justify-between px-6 py-3">
          <Link href={getLocalizedPath('/')} className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-base"
              style={{ background: 'var(--primary, #2563eb)' }}
            >
              C
            </div>
            <span className="font-display font-bold text-slate-900 text-lg">CMS</span>
          </Link>

          {/* Desktop nav */}
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
                    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
                    setOpenDropdown(link.label);
                  }}
                  onMouseLeave={() => {
                    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 150);
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

                  {/* Dropdown Menu */}
                  {link.children && openDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-xl border py-1.5 w-52 z-50"
                      style={{ borderColor: 'var(--border, #e2e8f0)' }}
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

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 border transition-colors"
                style={{ borderColor: 'var(--border, #e2e8f0)' }}
              >
                <Globe size={14} />
                <span>{activeLang.flag}</span>
                <ChevronDown size={12} />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl border py-1.5 w-44 z-50"
                  style={{ borderColor: 'var(--border, #e2e8f0)' }}
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

            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
            >
              <Search size={18} />
            </button>

            {/* CTA Button */}
            <Link
              href={getLocalizedPath('/lien-he')}
              className="hidden md:flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--primary, #2563eb)' }}
            >
              Liên hệ ngay
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-500"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar Collapsible */}
        {searchOpen && (
          <div
            className="border-t px-6 py-3 bg-slate-50/50"
            style={{ borderColor: 'var(--border, #e2e8f0)' }}
          >
            <div className="flex items-center gap-3 max-w-xl mx-auto">
              <Search size={18} className="text-slate-400" />
              <input
                autoFocus
                placeholder="Tìm kiếm bài viết, dự án..."
                className="flex-1 text-sm bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
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

        {/* Mobile Nav Menu */}
        {mobileOpen && (
          <div
            className="lg:hidden border-t px-4 py-3 bg-white space-y-1"
            style={{ borderColor: 'var(--border, #e2e8f0)' }}
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
                  >
                    {link.label}
                  </Link>

                  {/* Render sub-links trên Mobile */}
                  {link.children && (
                    <div className="pl-4 space-y-1 my-1 border-l-2 border-slate-100 ml-3">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          href={getLocalizedPath(child.path)}
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

      {/* Page Content Viewport */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer style={{ background: '#0f172a' }} className="text-slate-300">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand Section */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ background: 'var(--primary, #2563eb)' }}
                >
                  C
                </div>
                <span className="font-display font-bold text-white text-lg">CMS</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Công ty giải pháp công nghệ hàng đầu Việt Nam. Chúng tôi kiến tạo những sản phẩm số
                giúp doanh nghiệp phát triển bền vững.
              </p>
              <div className="flex items-center gap-3">
                {[FaFacebook, FaYoutube, FaLinkedin, SiZalo].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    style={{ background: '#1e293b' }}
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h4 className="text-white font-semibold font-display mb-4 text-sm">Điều hướng</h4>
              <ul className="space-y-2.5">
                {[
                  ['Trang chủ', '/'],
                  ['Giới thiệu', '/gioi-thieu'],
                  ['Tuyển dụng', '/tuyen-dung'],
                  ['Dự án', '/du-an'],
                  ['Bài viết', '/bai-viet'],
                  ['Liên hệ', '/lien-he'],
                ].map(([label, path]) => (
                  <li key={path}>
                    <Link
                      href={getLocalizedPath(path)}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-white font-semibold font-display mb-4 text-sm">Dịch vụ</h4>
              <ul className="space-y-2.5">
                {[
                  'Phát triển phần mềm',
                  'Thiết kế UI/UX',
                  'Tư vấn công nghệ',
                  'Chuyển đổi số',
                  'Bảo trì hệ thống',
                ].map((service) => (
                  <li key={service}>
                    <a
                      href="#"
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-semibold font-display mb-4 text-sm">Liên hệ</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-slate-400">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-blue-400" />
                  Tầng 12, 141 Lê Duẩn, Q.1, TP.HCM
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Phone size={14} className="text-blue-400 shrink-0" />
                  +84 28 3456 7890
                </li>
                <li className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Mail size={14} className="text-blue-400 shrink-0" />
                  info@CMS.vn
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500">© 2026 CMS. Bảo lưu mọi quyền.</p>
            <div className="flex items-center gap-5">
              {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Cookie'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
