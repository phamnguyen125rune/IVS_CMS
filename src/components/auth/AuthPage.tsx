'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  Mail,
  ShieldCheck,
  X,
} from 'lucide-react';

type ModalStep = 'forgot-email' | 'forgot-otp' | 'reset-password' | 'reset-success' | null;

interface ResetVerifyResponse {
  email: string;
  resetToken: string;
}

interface StaffLoginResponse {
  mustChangePassword?: boolean;
}

const emptyOtp = ['', '', '', '', '', ''];

export default function AuthPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const language = (params?.language as string) || 'vi';
  const callbackUrl = searchParams.get('callbackUrl');

  const [loginId, setLoginId] = useState('admin@cms.local');
  const [loginPassword, setLoginPassword] = useState('Admin@123456');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otp, setOtp] = useState(emptyOtp);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const otpValue = useMemo(() => otp.join(''), [otp]);

  useEffect(() => {
    if (countdown <= 0) {
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (modalStep === 'forgot-otp') {
      window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
    }
  }, [modalStep]);

  const request = async <T,>(url: string, options: RequestInit): Promise<T> => {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    }
    return data as T;
  };

  const startOtpCountdown = () => setCountdown(60);

  const resetFeedback = () => {
    setError(null);
    setNotice(null);
  };

  const openModal = (step: ModalStep) => {
    resetFeedback();
    setOtp(emptyOtp);
    setModalStep(step);
  };

  const closeModal = () => {
    setModalStep(null);
    setOtp(emptyOtp);
    setCountdown(0);
    resetFeedback();
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();
    setIsLoading(true);

    try {
      const data = await request<StaffLoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ loginId, password: loginPassword }),
      });
      router.refresh();
      router.push(
        data.mustChangePassword
          ? `/${language}/admin/ho-so`
          : callbackUrl || `/${language}/admin/nhan-su`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập không thành công');
    } finally {
      setIsLoading(false);
    }
  };

  const requestForgotOtp = async (event?: FormEvent) => {
    event?.preventDefault();
    resetFeedback();
    setIsLoading(true);

    try {
      await request('/api/auth/forgot-password/request-otp', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail }),
      });
      startOtpCountdown();
      openModal('forgot-otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không gửi được mã xác minh');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    resetFeedback();
    if (otpValue.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }

    setIsLoading(true);
    try {
      const data = await request<ResetVerifyResponse>('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: forgotEmail, otp: otpValue }),
      });
      setResetToken(data.resetToken);
      openModal('reset-password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mã OTP không hợp lệ');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPassword = async (event: FormEvent) => {
    event.preventDefault();
    resetFeedback();

    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    try {
      await request('/api/auth/forgot-password/reset', {
        method: 'PUT',
        body: JSON.stringify({
          email: forgotEmail,
          resetToken,
          newPassword,
          confirmPassword: confirmNewPassword,
        }),
      });
      setNewPassword('');
      setConfirmNewPassword('');
      openModal('reset-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không đặt lại được mật khẩu');
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) {
      return;
    }
    await requestForgotOtp();
  };

  const updateOtp = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    if (digit && index < emptyOtp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length === 0) {
      return;
    }
    const nextOtp = emptyOtp.map((_, index) => digits[index] || '');
    setOtp(nextOtp);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <main className="min-h-screen bg-[#0f172a] px-4 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl flex-col items-center justify-center gap-6">
        <section className="w-full max-w-[448px] rounded-2xl bg-white px-8 py-8 shadow-2xl shadow-blue-950/30">
          <BrandHeader title="Đăng nhập nhân sự" subtitle="Dành cho nhân viên và quản lý CMS" />

          {error && !modalStep && <Alert tone="error" message={error} />}
          {notice && !modalStep && <Alert tone="success" message={notice} />}

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <Field label="Email hoặc mã nhân viên">
              <input
                type="text"
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                className={inputClass}
                placeholder="admin@cms.local hoặc EMP0001"
                required
              />
            </Field>
            <Field label="Mật khẩu">
              <PasswordInput
                value={loginPassword}
                onChange={setLoginPassword}
                placeholder="Nhập mật khẩu"
                visible={showLoginPassword}
                onToggle={() => setShowLoginPassword((value) => !value)}
              />
            </Field>
            <div className="flex justify-start text-sm">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(loginId.includes('@') ? loginId : '');
                  openModal('forgot-email');
                }}
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                Quên mật khẩu?
              </button>
            </div>
            <PrimaryButton loading={isLoading}>Đăng nhập</PrimaryButton>
            <p className="text-center text-xs text-slate-400">
              Tài khoản demo: <span className="font-semibold text-slate-600">admin@cms.local</span>{' '}
              / <span className="font-semibold text-slate-600">Admin@123456</span>
            </p>
            <p className="text-center text-sm text-slate-500">
              Khách hàng?{' '}
              <Link
                href={`/${language}/register`}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Đăng nhập bằng Google
              </Link>
            </p>
          </form>
        </section>

        <Link
          href={`/${language}/gioi-thieu`}
          className="flex items-center gap-2 text-sm font-medium text-sky-200 hover:text-white"
        >
          <Globe2 size={16} />
          Quay lại website khách hàng
        </Link>
      </div>

      {modalStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/70 px-4 backdrop-blur-sm">
          <section className="relative w-full max-w-[384px] rounded-2xl bg-white px-6 py-6 shadow-2xl shadow-blue-950/40">
            {modalStep !== 'reset-success' && (
              <button
                type="button"
                onClick={closeModal}
                aria-label="Đóng"
                title="Đóng"
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            )}

            {modalStep === 'forgot-email' && (
              <form className="space-y-5 pt-2" onSubmit={requestForgotOtp}>
                <ModalHeader
                  icon={<KeyRound size={24} />}
                  title="Quên mật khẩu?"
                  subtitle="Nhập email đã đăng ký để nhận mã xác minh khôi phục mật khẩu."
                />
                {error && <Alert tone="error" message={error} />}
                <Field label="Email khôi phục">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    className={inputClass}
                    placeholder="admin@cms.local"
                    required
                  />
                </Field>
                <PrimaryButton loading={isLoading}>Gửi mã xác minh</PrimaryButton>
              </form>
            )}

            {modalStep === 'forgot-otp' && (
              <div className="space-y-5 pt-2">
                <ModalHeader
                  icon={<ShieldCheck size={24} />}
                  title="Nhập mã xác minh"
                  subtitle="Mã xác minh khôi phục đã gửi tới:"
                  email={forgotEmail}
                />
                {error && <Alert tone="error" message={error} />}
                <OtpInput
                  value={otp}
                  refs={otpRefs}
                  onChange={updateOtp}
                  onKeyDown={handleOtpKeyDown}
                  onPaste={handleOtpPaste}
                />
                <PrimaryButton loading={isLoading} onClick={verifyOtp}>
                  Xác minh mã
                </PrimaryButton>
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={countdown > 0 || isLoading}
                  className="mx-auto block text-sm font-medium text-slate-400 disabled:cursor-not-allowed enabled:text-blue-600 enabled:hover:text-blue-700"
                >
                  {countdown > 0 ? `Gửi lại mã xác nhận sau ${countdown}s` : 'Gửi lại mã xác nhận'}
                </button>
              </div>
            )}

            {modalStep === 'reset-password' && (
              <form className="space-y-5 pt-2" onSubmit={resetForgotPassword}>
                <ModalHeader
                  icon={<KeyRound size={24} />}
                  title="Đặt lại mật khẩu"
                  subtitle={`Tạo mật khẩu mới cho tài khoản ${forgotEmail}`}
                />
                {error && <Alert tone="error" message={error} />}
                <Field label="Mật khẩu mới">
                  <PasswordInput
                    value={newPassword}
                    onChange={setNewPassword}
                    placeholder="Nhập mật khẩu mới"
                    visible={showNewPassword}
                    onToggle={() => setShowNewPassword((value) => !value)}
                  />
                </Field>
                <Field label="Xác nhận mật khẩu mới">
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(event) => setConfirmNewPassword(event.target.value)}
                    className={inputClass}
                    placeholder="Nhập lại mật khẩu mới"
                    required
                  />
                </Field>
                <PrimaryButton loading={isLoading}>Lưu mật khẩu mới</PrimaryButton>
              </form>
            )}

            {modalStep === 'reset-success' && (
              <div className="space-y-5 py-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 size={30} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">Thành công!</h2>
                  <p className="mt-2 text-sm leading-5 text-slate-500">
                    Mật khẩu của bạn đã được cập nhật thành công. Vui lòng sử dụng mật khẩu mới để
                    đăng nhập.
                  </p>
                </div>
                <PrimaryButton
                  loading={false}
                  onClick={() => {
                    setLoginId(forgotEmail);
                    closeModal();
                    setNotice('Bạn có thể đăng nhập bằng mật khẩu mới.');
                  }}
                >
                  Quay lại đăng nhập
                </PrimaryButton>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function BrandHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-blue-600 text-3xl font-bold text-white shadow-lg shadow-blue-600/30">
        C
      </div>
      <h1 className="mt-5 text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

function ModalHeader({
  icon,
  title,
  subtitle,
  email,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  email?: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
        {icon}
      </div>
      <h2 className="mt-4 text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-5 text-slate-500">{subtitle}</p>
      {email && (
        <span className="mt-2 inline-flex max-w-full items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
          <Mail size={13} />
          <span className="truncate">{email}</span>
        </span>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  visible,
  onToggle,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClass} pr-12`}
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        onClick={onToggle}
        aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        title={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function PrimaryButton({
  children,
  loading,
  onClick,
}: {
  children: React.ReactNode;
  loading: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      disabled={loading}
      className="flex h-12 w-full items-center justify-center rounded-lg bg-blue-600 px-4 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
    >
      {loading ? 'Đang xử lý...' : children}
    </button>
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
      {!isError && <Check size={16} className="mt-0.5 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}

function OtpInput({
  value,
  refs,
  onChange,
  onKeyDown,
  onPaste,
}: {
  value: string[];
  refs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => onChange(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={(event) => {
            event.preventDefault();
            onPaste(event.clipboardData.getData('text'));
          }}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-full rounded-xl border border-slate-300 text-center text-xl font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      ))}
    </div>
  );
}

const inputClass =
  'h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
