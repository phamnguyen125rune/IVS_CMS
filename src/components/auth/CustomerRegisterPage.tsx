'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Globe2, ShieldCheck } from 'lucide-react';

type GoogleCredentialResponse = {
  credential?: string;
};

type CustomerProfile = {
  fullname: string;
  email: string;
  avatarUrl?: string;
  provider: 'google';
  registeredAt: string;
};

type GoogleAccounts = {
  accounts?: {
    id?: {
      initialize: (options: {
        client_id: string;
        callback: (response: GoogleCredentialResponse) => void;
      }) => void;
      renderButton: (
        element: HTMLElement,
        options: { theme: string; size: string; width: number; text: string }
      ) => void;
      disableAutoSelect?: () => void;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}

export default function CustomerRegisterPage() {
  const router = useRouter();
  const params = useParams();
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const language = (params?.language as string) || 'vi';
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const [googleReady, setGoogleReady] = useState(false);
  const [customer, setCustomer] = useState<CustomerProfile | null>(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const rawCustomer = window.localStorage.getItem('customer_profile');
    if (!rawCustomer) {
      return null;
    }

    try {
      return JSON.parse(rawCustomer) as CustomerProfile;
    } catch {
      window.localStorage.removeItem('customer_profile');
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const saveCustomerLocally = useCallback((profile: CustomerProfile) => {
    window.localStorage.setItem('customer_profile', JSON.stringify(profile));
    setCustomer(profile);
  }, []);

  const loginCustomer = useCallback(
    async (payload: { credential: string }) => {
      setError(null);
      setNotice(null);

      try {
        const res = await fetch('/api/customer-auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data?.message || 'Không đăng nhập được bằng Google');
        }

        saveCustomerLocally(data.customer);
        setNotice('Đã lưu phiên khách hàng trên cookie và localStorage');
        window.setTimeout(() => router.push(`/${language}`), 700);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không đăng nhập được bằng Google');
      }
    },
    [language, router, saveCustomerLocally]
  );

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (existingScript) {
      window.setTimeout(() => setGoogleReady(true), 0);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setError('Không tải được Google Sign-In');
    document.head.appendChild(script);
  }, [googleClientId]);

  useEffect(() => {
    if (
      !googleReady ||
      !googleClientId ||
      !googleButtonRef.current ||
      !window.google?.accounts?.id
    ) {
      return;
    }

    googleButtonRef.current.innerHTML = '';
    const googleId = window.google.accounts.id;
    googleId.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        if (!response.credential) {
          setError('Google không trả về thông tin đăng nhập');
          return;
        }
        await loginCustomer({ credential: response.credential });
      },
    });
    googleId.renderButton(googleButtonRef.current, {
      theme: 'outline',
      size: 'large',
      width: 352,
      text: 'signin_with',
    });
  }, [googleReady, googleClientId, loginCustomer]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/70 md:grid-cols-[1fr_420px]">
          <div className="flex min-h-[520px] flex-col justify-between bg-slate-900 p-8 text-white">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold">
                C
              </div>
              <h1 className="mt-8 max-w-md text-3xl font-bold leading-tight">
                Đăng nhập khách hàng
              </h1>
              <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
                Khách hàng chỉ dùng Google để tiếp tục. Thông tin phiên được lưu nhẹ trên cookie và
                localStorage của trình duyệt, không tạo tài khoản nhân sự trong CMS.
              </p>
            </div>

            <Link
              href={`/${language}/login`}
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-sky-200 hover:text-white"
            >
              <Globe2 size={16} />
              Đăng nhập nhân sự
            </Link>
          </div>

          <div className="flex flex-col justify-center p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <ShieldCheck size={28} />
            </div>
            <h2 className="mt-5 text-center text-xl font-bold text-slate-950">
              Tiếp tục bằng Google
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Không dùng mật khẩu, không ghi vào database nhân sự. Hồ sơ khách hàng chỉ nằm ở trình
              duyệt hiện tại.
            </p>

            {error && <Alert tone="error" message={error} />}
            {notice && <Alert tone="success" message={notice} />}

            <div className="mt-7 flex min-h-11 justify-center">
              {googleClientId ? (
                <div ref={googleButtonRef} />
              ) : (
                <div className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  Cần cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID để bật Google Sign-In thật.
                </div>
              )}
            </div>

            {customer && (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <div className="font-semibold">Đang đăng nhập Google:</div>
                <div className="mt-1 truncate">{customer.email}</div>
              </div>
            )}

            <Link
              href={`/${language}`}
              className="mt-6 inline-flex justify-center text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Quay lại trang khách hàng
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Alert({ tone, message }: { tone: 'error' | 'success'; message: string }) {
  const isError = tone === 'error';
  return (
    <div
      className={`mt-5 flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
        isError
          ? 'border-red-200 bg-red-50 text-red-600'
          : 'border-emerald-200 bg-emerald-50 text-emerald-700'
      }`}
    >
      {!isError && <CheckCircle2 size={16} className="mt-0.5 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
