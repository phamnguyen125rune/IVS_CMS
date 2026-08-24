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
    label: 'Quản lý Liên hệ',
    icon: Mail,
    path: '/admin-contact',
  },
  {
    label: 'Cài đặt',
    icon: Settings,
    path: '/admin/cai-dat',
  },
];

export default function AdminSidebar({
  sidebarOpen,
  onToggle,
}: AdminSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const language =
    typeof params?.language === 'string' ? params.language : 'vi';

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
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden"
        />
      )}

      <aside
        className={`
          flex flex-col
          bg-slate-900
          text-slate-300
          transition-all duration-300
          z-30
          shrink-0
          overflow-hidden
          whitespace-nowrap

          ${sidebarOpen ? 'w-64' : 'w-0 lg:w-20'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 bg-slate-950/50 shrink-0">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            C
          </div>

          {sidebarOpen && (
            <span className="font-bold text-white text-lg tracking-tight">
              CMS Admin
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const href = localizePath(item.path, language);

            const isActive =
              pathname === href ||
              pathname.startsWith(`${href}/`);

            return (
              <Link
                key={item.path}
                href={href}
                title={!sidebarOpen ? item.label : undefined}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  text-sm font-medium
                  transition-all

                  ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <item.icon
                  size={20}
                  className="shrink-0"
                />

                {sidebarOpen && (
                  <span className="truncate">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Đăng xuất' : undefined}
            className="
              flex items-center gap-3
              px-4 py-3
              w-full
              rounded-xl
              text-sm font-medium
              text-slate-400
              hover:text-white
              hover:bg-slate-800
              transition-all
            "
          >
            <LogOut
              size={20}
              className="shrink-0"
            />

            {sidebarOpen && (
              <span className="truncate">
                Đăng xuất
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}