'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, User, LogOut } from 'lucide-react';

interface SidebarProps {
  language: string;
}

export default function Sidebar({ language }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Dashboard', href: `/${language}/dashboard`, icon: LayoutDashboard },
    { label: 'Người dùng', href: `/${language}/users`, icon: Users },
    { label: 'Tài khoản', href: `/${language}/profile`, icon: User },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="text-xl font-bold px-4 py-3 border-b border-slate-800 tracking-wide text-slate-100">
          CMS Admin
        </div>
        <nav className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-slate-800 pt-4 px-2">
        <Link
          href={`/${language}`}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors"
        >
          <LogOut size={18} />
          Về trang chủ
        </Link>
      </div>
    </aside>
  );
}
