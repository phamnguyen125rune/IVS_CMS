'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import { getDictionary } from '@/utils/i18n';

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const language = (params?.language as string) || 'vi';
  const dict = getDictionary(language).login;

  const [loginId, setLoginId] = useState('cms@gmail.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || dict.error_failed);
      }

     if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      }

      router.refresh();
      router.push(`/${language}/admin-contact`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi kết nối';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar user={null} />
      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md border border-gray-200">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">{dict.title}</h2>

          {error && (
            <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict.username}
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                placeholder={dict.username_placeholder}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {dict.password}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                placeholder={dict.password_placeholder}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded bg-blue-600 p-2 font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-400 cursor-pointer"
            >
              {isLoading ? dict.loading : dict.button}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}