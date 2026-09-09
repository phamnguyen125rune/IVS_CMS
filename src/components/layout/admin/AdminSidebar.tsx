'use client';

import Link from 'next/link';
import { usePathname, useParams, useRouter } from 'next/navigation';
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
} from 'lucide-react';

import { localizePath } from '@/components/navigation/LocalizedLink';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  {
    label: 'Tổng quan',
    icon: LayoutDashboard,
    path: '/admin/tong-quan',
  },
  {
    label: 'Quản lý Nhân sự',
    icon: Users,
    path: '/admin/nhan-su',
  },
  {
    label: 'Quản lý Phân quyền',
    icon: ShieldCheck,
    path: '/admin/phan-quyen',
  },
  {
    label: 'Quản lý Bài viết',
    icon: FileText,
    path: '/admin/bai-viet',
  },
  {
    label: 'Quản lý Kiểm duyệt',
    icon: CheckSquare,
    path: '/admin/kiem-duyet',
  },
  {
    label: 'Quản lý Danh mục',
    icon: FolderTree,
    path: '/admin/danh-muc',
  },
  {
    label: 'Quản lý Media',
    icon: ImageIcon,
    path: '/admin/media',
  },
  {
    label: 'Quản lý Biểu mẫu',
    icon: Mail,
    path: '/admin/bieu-mau',
  },
  {
    label: 'Cài đặt',
    icon: Settings,
    path: '/admin/cai-dat',
  },
];

export default function AdminSidebar({ sidebarOpen, onToggle }: AdminSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const language = typeof params?.language === 'string' ? params.language : 'vi';

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    }).catch(() => null);

    router.push(`/${language}/login`);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div onClick={onToggle} className="fixed inset-0 z-20 bg-slate-900/50 lg:hidden" />
      )}

      <aside
        className={`
          z-30
          flex
          shrink-0
          flex-col
          overflow-hidden
          whitespace-nowrap
          transition-all
          duration-300

          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
        `}
        style={{
          background: 'var(--dark-background)',
          color: 'var(--dark-text-secondary)',
        }}
      >
        {/* Logo */}
        <div
          className="
            flex
            h-16
            shrink-0
            items-center
            gap-3
            px-6
          "
          style={{
            background: 'var(--dark-surface)',
          }}
        >
          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-sm
              font-bold
            "
            style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            C
          </div>

          {sidebarOpen && (
            <span
              className="text-lg font-bold tracking-tight"
              style={{
                color: 'var(--dark-text)',
              }}
            >
              CMS Admin
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const href = localizePath(item.path, language);

            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.path}
                href={href}
                title={!sidebarOpen ? item.label : undefined}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-all
                  hover:text-[var(--dark-text)]
                "
                style={{
                  background: isActive ? 'var(--primary)' : undefined,
                  color: isActive ? 'var(--primary-foreground)' : 'var(--dark-text-secondary)',
                  boxShadow: isActive ? '0 4px 6px -1px rgb(30 58 138 / 0.2)' : undefined,
                }}
              >
                <item.icon size={20} className="shrink-0" />

                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          className="border-t p-4"
          style={{
            borderColor: 'var(--dark-border)',
          }}
        >
          <button
            type="button"
            onClick={handleLogout}
            title={!sidebarOpen ? 'Đăng xuất' : undefined}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-4
              py-3
              text-sm
              font-medium
              transition-all
              hover:bg-[var(--dark-surface)]
              hover:text-[var(--dark-text)]
            "
            style={{
              color: 'var(--dark-text-secondary)',
            }}
          >
            <LogOut size={20} className="shrink-0" />

            {sidebarOpen && <span className="truncate">Đăng xuất</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
