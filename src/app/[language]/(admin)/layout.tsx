'use client';

import { useState } from 'react';
// 1. Dùng routing chuẩn của Next.js
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Shield,
} from 'lucide-react';

const navItems = [
  { label: 'Tổng quan', icon: LayoutDashboard, path: '/admin/tong-quan' },
  { label: 'Quản lý Nhân sự', icon: Users, path: '/admin/nhan-su' },
  { label: 'Quản lý Nhóm nhân sự', icon: Shield, path: '/admin/nhom-nhan-su' },
  { label: 'Quản lý Phân quyền', icon: ShieldCheck, path: '/admin/phan-quyen' },
  { label: 'Quản lý Bài viết', icon: FileText, path: '/admin/bai-viet' },
  { label: 'Quản lý Kiểm duyệt', icon: CheckSquare, path: '/admin/kiem-duyet' },
  { label: 'Quản lý Danh mục', icon: FolderTree, path: '/admin/danh-muc' },
  { label: 'Quản lý Media', icon: ImageIcon, path: '/admin/media' },
  { label: 'Quản lý Biểu mẫu', icon: Mail, path: '/admin/bieu-mau' },
  { label: 'Quản lý Liên hệ', icon: Mail, path: '/admin-contact' },
  { label: 'Cài đặt', icon: Settings, path: '/admin/cai-dat' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 2. Dùng useRouter và usePathname từ next/navigation
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Xử lý xoá token/session nếu có ở đây
    router.push('/admin/login');
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
          {navItems.map((item) => {
            // Kiểm tra link active trong Next.js
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
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
                <p className="text-sm font-semibold text-slate-700">Nguyễn Văn A</p>
                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>
              <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* 3. Trong Next.js Layout, render {children} thay vì <Outlet /> */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">{children}</main>

        {/* Floating Action Button */}
        <Link
          href="/"
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
