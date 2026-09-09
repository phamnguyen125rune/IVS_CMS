'use client';

import {
  LocalizedLink as Link,
  useLocalizedNavigate as useNavigate,
} from '@/components/navigation/LocalizedLink';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: 'var(--background)' }}
    >
      {/* =========================================================
          Illustration
          ========================================================= */}
      <div className="relative mb-10">
        {/* Decorative circles */}
        <div
          className="absolute -inset-16 rounded-full opacity-5"
          style={{ background: 'var(--primary)' }}
        />

        <div
          className="absolute -inset-8 rounded-full opacity-10"
          style={{ background: 'var(--primary)' }}
        />

        {/* Big 404 */}
        <div className="relative text-center">
          <div
            className="font-display font-bold select-none leading-none"
            style={{
              fontSize: 180,
              color: 'var(--border-strong)',
              letterSpacing: -8,
            }}
          >
            404
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {/* Robot illustration */}
              <div
                className="w-28 h-28 mx-auto rounded-3xl flex flex-col items-center justify-center relative"
                style={{
                  background:
                    'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
                }}
              >
                {/* Robot eyes */}
                <div className="flex gap-3 mb-2">
                  <div className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>

                  <div className="w-4 h-4 rounded-full bg-white/80 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-slate-800" />
                  </div>
                </div>

                {/* Robot mouth */}
                <div className="w-8 h-1.5 rounded-full bg-white/60" />

                {/* Antenna */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-0.5 h-4 bg-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          Content
          ========================================================= */}
      <div className="text-center max-w-md">
        <h1
          className="font-display text-3xl font-bold mb-3"
          style={{ color: 'var(--text)' }}
        >
          Ôi! Trang không tìm thấy
        </h1>

        <p
          className="text-base leading-relaxed mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          Có vẻ như trang bạn đang tìm kiếm đã bị di chuyển, xóa, hoặc chưa
          bao giờ tồn tại. Đừng lo, robot của chúng tôi đang cố tìm kiếm nó!
        </p>

        {/* =========================================================
            Action buttons
            ========================================================= */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: 'var(--primary)' }}
          >
            <Home size={15} />
            Về trang chủ
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm transition-colors hover:bg-[var(--hover)]"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            <ArrowLeft size={15} />
            Quay lại
          </button>
        </div>

        {/* =========================================================
            Quick links
            ========================================================= */}
        <div
          className="rounded-2xl border p-5"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: 'var(--text-muted)' }}
          >
            Những trang bạn có thể muốn thăm
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Trang chủ', path: '/' },
              { label: 'Giới thiệu', path: '/gioi-thieu' },
              { label: 'Dự án', path: '/du-an' },
              { label: 'Bài viết', path: '/bai-viet' },
              { label: 'Liên hệ', path: '/lien-he' },
              { label: 'Admin', path: '/admin/login' },
            ].map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-[var(--hover)] hover:text-[var(--primary)]"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}