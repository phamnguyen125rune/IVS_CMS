'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { getDictionary, Locale } from '@/utils/i18n';

/**
 * Trang đăng nhập hệ thống (Login Page).
 * Sử dụng giao diện mẫu từ Comprehensive CMS Platform và kết nối API xác thực của IVS_CMS.
 *
 * Luồng CSR: Browser gửi yêu cầu POST đến Next.js API Route (/api/auth/login),
 * sau đó API Route sẽ gọi dịch vụ Java backend để lấy JWT token và lưu vào HTTP-Only cookie.
 */
export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const language = ((params?.language as string) || 'vi') as Locale;
  const dict = getDictionary(language).login;

  const [loginId, setLoginId] = useState('admin@cms.local');
  const [password, setPassword] = useState('Admin@123456');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Chuyển đổi ngôn ngữ trang đăng nhập.
   *
   * @param newLang - Ngôn ngữ cần chuyển ('vi' | 'en' | 'ja')
   */
  const switchLanguage = (newLang: Locale) => {
    if (newLang === language) return;
    router.push(`/${newLang}/login`);
  };

  /**
   * Xử lý sự kiện đăng nhập tài khoản.
   * Gửi dữ liệu loginId và password đến /api/auth/login.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // CSR: Gọi API route /api/auth/login của Next.js
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || dict.error_failed);
      }

      router.refresh();
      router.push(`/${language}/profile`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : dict.error_failed;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs select-none">
        <button
          type="button"
          onClick={() => switchLanguage('vi')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            language === 'vi'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          VI
        </button>
        <button
          type="button"
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => switchLanguage('ja')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
            language === 'ja'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          JA
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 mb-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg">
            V
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{dict.title}</h1>
          <p className="text-slate-500 text-sm mt-2">{dict.subtitle}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-6 border border-red-100">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {dict.username}
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900"
              placeholder={dict.username_placeholder}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {dict.password}
            </label>
            <div className="relative">
              <input
                type={isPasswordVisible ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-slate-900"
                placeholder={dict.password_placeholder}
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                aria-label={isPasswordVisible ? dict.hide_password : dict.show_password}
              >
                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-500/30 disabled:bg-blue-400 cursor-pointer"
            >
              {isLoading ? dict.loading : dict.button}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {dict.demo_account}:{' '}
            <span className="font-semibold text-slate-700">admin@cms.local</span>
          </p>
        </div>
      </div>

      <Link
        href={`/${language}`}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
      >
        <span>🌐</span> {dict.back_to_client}
      </Link>
    </div>
  );
}
