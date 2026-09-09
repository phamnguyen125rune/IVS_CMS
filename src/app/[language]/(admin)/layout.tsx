'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Bell, Globe, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import AdminSidebar from '@/components/layout/admin/AdminSidebar';
import AdminFooter from '@/components/layout/admin/AdminFooter';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const params = useParams();

  const language = typeof params?.language === 'string' ? params.language : 'vi';

  const toggleSidebar = () => {
    setSidebarOpen((current) => !current);
  };

  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        font-['Plus_Jakarta_Sans']
      "
      style={{
        background: 'var(--surface-secondary)',
        color: 'var(--text)',
      }}
    >
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <AdminSidebar sidebarOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* ========================================
          MAIN AREA
      ======================================== */}

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* ======================================
            HEADER
        ====================================== */}

        <header
          className="
            z-10
            flex
            h-16
            shrink-0
            items-center
            justify-between
            px-4
            lg:px-8
          "
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          {/* ==================================
              LEFT
          ================================== */}

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggleSidebar}
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
              aria-label={sidebarOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
            >
              {sidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>

          {/* ==================================
              RIGHT
          ================================== */}

          <div className="flex items-center gap-4">
            {/* ==============================
                THEME TOGGLE
            ============================== */}

            <ThemeToggle />

            {/* ==============================
                NOTIFICATION
            ============================== */}

            <button
              type="button"
              className="
                relative
                rounded-full
                p-2
                transition-colors
                hover:bg-[var(--hover)]
                hover:text-[var(--primary)]
              "
              style={{
                color: 'var(--text)',
              }}
              aria-label="Thông báo"
            >
              <Bell size={20} />

              {/* Notification indicator
                  Decorative color - giữ nguyên */}
              <span
                className="
                  absolute
                  right-1.5
                  top-1
                  h-2
                  w-2
                  rounded-full
                  border-2
                  bg-red-500
                "
                style={{
                  borderColor: 'var(--surface)',
                }}
              />
            </button>

            {/* ==============================
                USER
            ============================== */}

            <div
              className="
                flex
                items-center
                gap-3
                border-l
                pl-4
              "
              style={{
                borderLeftColor: 'var(--border)',
              }}
            >
              {/* User information */}

              <div className="hidden text-right sm:block">
                <p
                  className="text-sm font-semibold"
                  style={{
                    color: 'var(--text)',
                  }}
                >
                  Nguyễn Văn A
                </p>

                <p
                  className="text-xs"
                  style={{
                    color: 'var(--text-secondary)',
                  }}
                >
                  Quản trị viên
                </p>
              </div>

              {/* Avatar
                  Decorative / identity color - giữ nguyên */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-blue-100
                  font-bold
                  text-blue-700
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

        <main
          className="
            flex-1
            overflow-y-auto
            p-4
            lg:p-8
          "
          style={{
            background: 'var(--surface-secondary)',
          }}
        >
          {children}
        </main>

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
          rel="noopener noreferrer"
          className="
            fixed
            bottom-6
            right-6
            z-40
            flex
            items-center
            gap-2
            rounded-full
            px-5
            py-3
            font-medium
            shadow-lg
            transition-all
            hover:-translate-y-1
            hover:bg-[var(--primary-hover)]
          "
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
            boxShadow: '0 10px 25px -5px color-mix(in srgb, var(--primary) 30%, transparent)',
          }}
        >
          <Globe size={20} />

          <span className="hidden sm:inline">Xem trang Khách hàng</span>
        </Link>
      </div>
    </div>
  );
}
