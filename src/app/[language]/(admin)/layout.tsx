'use client';

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  FileText,
  CheckSquare,
  FolderTree,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  Globe,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from 'lucide-react';
import { localizePath } from '@/components/navigation/LocalizedLink';
import { ResUserDTO, RoleUser } from '@/types';
import { resolveAssetUrl } from '@/utils/asset-url';
import {
  buildSessionEventUrl,
  clearStaffSessionToken,
  installStaffSessionFetch,
} from '@/utils/session-auth';

const navItems = [
  { label: 'Tổng quan', icon: LayoutDashboard, path: '/admin/tong-quan', adminOnly: true },
  { label: 'Hồ sơ cá nhân', icon: UserRound, path: '/admin/ho-so' },
  { label: 'Quản lý Nhân sự', icon: Users, path: '/admin/nhan-su', adminOnly: true },
  { label: 'Quản lý Phân quyền', icon: ShieldCheck, path: '/admin/phan-quyen', adminOnly: true },
  { label: 'Quản lý Bài viết', icon: FileText, path: '/admin/bai-viet', adminOnly: true },
  { label: 'Quản lý Kiểm duyệt', icon: CheckSquare, path: '/admin/kiem-duyet', adminOnly: true },
  { label: 'Quản lý Danh mục', icon: FolderTree, path: '/admin/danh-muc', adminOnly: true },
  { label: 'Quản lý Media', icon: ImageIcon, path: '/admin/media', adminOnly: true },
  { label: 'Quản lý Biểu mẫu', icon: Mail, path: '/admin/bieu-mau', adminOnly: true },
  { label: 'Quản lý Liên hệ', icon: Mail, path: '/admin-contact', adminOnly: true },
  { label: 'Cài đặt', icon: Settings, path: '/admin/cai-dat', adminOnly: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<ResUserDTO | null>(null);

  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const language = typeof params?.language === 'string' ? params.language : 'vi';
  const canUseAdminMenus = isAdminRole(currentUser?.role);
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || canUseAdminMenus);

  useEffect(() => installStaffSessionFetch(), []);

  useEffect(() => {
    let active = true;
    let redirecting = false;
    let sessionUserId: number | null = null;

    const invalidateSession = (reason: 'auth' | 'locked' = 'locked') => {
      if (!active || redirecting) {
        return;
      }
      redirecting = true;
      clearStaffSessionToken();
      fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
      router.replace(
        reason === 'locked' ? `/${language}/login?reason=locked` : `/${language}/login`
      );
    };

    const loadProfile = async () => {
      try {
        const response = await fetch('/api/auth/profile', { cache: 'no-store' });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          if (response.status === 401) {
            invalidateSession('auth');
          } else if ([403, 404].includes(response.status)) {
            invalidateSession('locked');
          }
          throw new Error(data?.message || 'Không thể tải hồ sơ');
        }

        if (active) {
          const profile = data as ResUserDTO;
          if (profile.deleted || profile.status === 'LOCKED') {
            invalidateSession('locked');
            return;
          }
          sessionUserId = profile.id;
          setCurrentUser(profile);
          if (!isAdminRole(profile.role) && isRestrictedAdminPath(pathname)) {
            router.replace(`/${language}/admin/ho-so`);
          }
        }
      } catch {
        if (active) {
          setCurrentUser(null);
        }
      }
    };

    loadProfile();
    const sessionEvents = new EventSource(buildSessionEventUrl());
    sessionEvents.addEventListener('connected', (event) => {
      const data = parseSessionEvent(event);
      if (data.userId) {
        sessionUserId = data.userId;
      }
    });
    sessionEvents.addEventListener('account_locked', (event) => {
      const data = parseSessionEvent(event);
      if (!data.userId || data.userId === sessionUserId) {
        invalidateSession('locked');
      }
    });
    sessionEvents.onerror = () => {
      sessionEvents.close();
      void loadProfile();
    };
    const timer = window.setInterval(loadProfile, 30000);

    return () => {
      active = false;
      sessionEvents.close();
      window.clearInterval(timer);
    };
  }, [language, pathname, router]);

  const handleLogout = async () => {
    clearStaffSessionToken();
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    router.push(`/${language}/login`);
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Plus_Jakarta_Sans'] overflow-hidden">
      {/* Sidebar Overlay (cho mobile) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
        />
      )}

      {/* Sidebar - Dark Theme */}
      <aside
        className={`flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 z-30 shrink-0 overflow-hidden whitespace-nowrap ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 bg-slate-950/50 shrink-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            C
          </div>
          {sidebarOpen && (
            <span className="font-bold text-white text-lg tracking-tight">CMS Admin</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {visibleNavItems.map((item) => {
            const href = localizePath(item.path, language);
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.path}
                href={href}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} className="shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Đăng xuất' : undefined}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="truncate">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header - Light Theme */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">
                  {currentUser?.fullname || 'Người dùng'}
                </p>
                <p className="text-xs text-slate-500">{roleLabel(currentUser?.role)}</p>
              </div>
              {currentUser?.avatarUrl ? (
                <img
                  src={resolveAssetUrl(currentUser.avatarUrl)}
                  alt={currentUser.fullname || 'Ảnh đại diện'}
                  className="w-9 h-9 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {getInitial(currentUser?.fullname)}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">{children}</main>

        {/* Floating Action Button */}
        <Link
          href={`/${language}`}
          target="_blank"
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg shadow-blue-600/30 flex items-center gap-2 font-medium transition-transform hover:-translate-y-1 z-40"
        >
          <Globe size={20} className="shrink-0" />
          <span className="hidden sm:inline">Xem trang Khách hàng</span>
        </Link>
      </div>
    </div>
  );
}

function roleLabel(role?: RoleUser | null) {
  const roleName = role?.name?.trim().toUpperCase();
  if (roleName === 'SUPER_ADMIN') return 'Quản trị hệ thống';
  if (roleName === 'ADMIN') return 'Quản trị viên';
  if (roleName === 'USER') return 'Nhân sự';
  if (roleName === 'NORMAL_USER') return 'Người dùng';
  return role?.name || 'Chưa có vai trò';
}

function getInitial(name?: string | null) {
  return name?.trim().charAt(0).toUpperCase() || 'U';
}

function isAdminRole(role?: RoleUser | null) {
  const roleName = role?.name?.trim().toUpperCase();
  return roleName === 'ADMIN' || roleName === 'SUPER_ADMIN';
}

function isRestrictedAdminPath(pathname: string) {
  const pathWithoutLocale = pathname.replace(/^\/(vi|en|ja)(?=\/|$)/, '') || '/';
  return (
    (pathWithoutLocale.startsWith('/admin') && !pathWithoutLocale.startsWith('/admin/ho-so')) ||
    pathWithoutLocale.startsWith('/admin-contact')
  );
}

function parseSessionEvent(event: Event) {
  if (!('data' in event) || typeof event.data !== 'string') {
    return {};
  }

  try {
    return JSON.parse(event.data) as { userId?: number };
  } catch {
    return {};
  }
}
