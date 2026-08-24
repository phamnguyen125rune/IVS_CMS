'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Bell, Globe, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import AdminSidebar from '@/components/layout/admin/AdminSidebar';
import AdminFooter from '@/components/layout/admin/AdminFooter';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const params = useParams();

  const language = typeof params?.language === 'string' ? params.language : 'vi';

  return (
    <div className="flex h-screen bg-slate-50 font-['Plus_Jakarta_Sans'] overflow-hidden">
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* ========================================
          MAIN AREA
      ======================================== */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* ======================================
            HEADER
        ====================================== */}

        <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 z-10">
          {/* Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="
                p-2
                rounded-lg
                text-slate-500
                hover:bg-slate-100
                transition-colors
              "
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            {/* Notification */}
            <button
              className="
                p-2
                rounded-full
                text-slate-500
                hover:bg-slate-100
                relative
                transition-colors
              "
            >
              <Bell size={20} />

              <span
                className="
                  absolute
                  top-1
                  right-1.5
                  w-2
                  h-2
                  bg-red-500
                  rounded-full
                  border-2
                  border-white
                "
              />
            </button>

            {/* User */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700">Nguyễn Văn A</p>

                <p className="text-xs text-slate-500">Quản trị viên</p>
              </div>

              <div
                className="
                  w-9 h-9
                  shrink-0
                  rounded-full
                  bg-blue-100
                  text-blue-700
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                A
              </div>
            </div>
          </div>
        </header>

        {/* ======================================
            CONTENT
        ====================================== */}

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">{children}</main>

        {/* ======================================
            FOOTER
        ====================================== */}

        <AdminFooter />

        {/* ======================================
            VIEW CLIENT BUTTON
        ====================================== */}

        <Link
          href={`/${language}`}
          target="_blank"
          className="
            fixed
            bottom-6
            right-6
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-5
            py-3
            rounded-full
            shadow-lg
            shadow-blue-600/30
            flex
            items-center
            gap-2
            font-medium
            transition-transform
            hover:-translate-y-1
            z-40
          "
        >
          <Globe size={20} />

          <span className="hidden sm:inline">Xem trang Khách hàng</span>
        </Link>
      </div>
    </div>
  );
}
