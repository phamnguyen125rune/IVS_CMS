'use client';

import { useEffect, useState } from 'react';

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';

import type {
  FormCategory,
  FormDetailFormData,
  FormDetailFormErrors,
} from '@/types/contact.type';

import { FormDetailService } from '@/services/contact.service';
import { settingService } from '@/services/setting.service';
import type { GeneralInfo } from '@/types/setting.type';

export default function Contact() {
  // ================================
  // Initial form
  // ================================

  const initialForm: FormDetailFormData = {
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    formCategoryId: 0,
    message: '',
    consent: false,
  };

  // ================================
  // State
  // ================================

  const [form, setForm] = useState<FormDetailFormData>(initialForm);

  const [categories, setCategories] = useState<FormCategory[]>([]);

  const [generalInfo, setGeneralInfo] = useState<GeneralInfo | null>(null);

  const [errors, setErrors] = useState<FormDetailFormErrors>({});

  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [generalInfoLoading, setGeneralInfoLoading] = useState(true);

  const [serverError, setServerError] = useState<string | null>(null);

  // ================================
  // Load categories
  // ================================

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await FormDetailService.getAllCategories();

        if (res?.data) {
          setCategories(res.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh mục form:', error);
      }
    };

    fetchCategories();
  }, []);

  // ================================
  // Load general information
  // ================================

  useEffect(() => {
    let mounted = true;

    const fetchGeneralInfo = async () => {
      try {
        const res = await settingService.getGeneralInfo();

        if (mounted && res?.data) {
          setGeneralInfo(res.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin liên hệ:', error);
      } finally {
        if (mounted) {
          setGeneralInfoLoading(false);
        }
      }
    };

    fetchGeneralInfo();

    return () => {
      mounted = false;
    };
  }, []);

  // ================================
  // Validation
  // ================================

  const validate = (): FormDetailFormErrors => {
    const e: FormDetailFormErrors = {};

    if (!form.fullName.trim()) {
      e.fullName = 'Vui lòng nhập họ và tên';
    }

    if (!form.email.trim()) {
      e.email = 'Vui lòng nhập địa chỉ email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Địa chỉ email không hợp lệ';
    }

    if (!form.phoneNumber.trim()) {
      e.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,11}$/.test(form.phoneNumber.replace(/\s/g, ''))) {
      e.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (form.formCategoryId === 0) {
      e.formCategoryId = 'Vui lòng chọn danh mục dịch vụ';
    }

    if (!form.message.trim()) {
      e.message = 'Vui lòng nhập nội dung tin nhắn';
    } else if (form.message.trim().length < 20) {
      e.message = 'Nội dung phải có ít nhất 20 ký tự';
    }

    if (!form.consent) {
      e.consent = 'Bạn cần đồng ý với điều khoản bảo mật';
    }

    return e;
  };

  // ================================
  // Submit
  // ================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setServerError(null);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await FormDetailService.submitForm({
        fullName: form.fullName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        company: form.company,
        formCategoryId: Number(form.formCategoryId),
        message: form.message,
      });

      setSubmitted(true);
      setErrors({});
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau!';

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // Form field helper
  // ================================

  const setField = <K extends keyof FormDetailFormData>(
    key: K,
    value: FormDetailFormData[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
      }));
    }
  };

  // ================================
  // Input class
  // ================================

  const inputClass = (key: keyof FormDetailFormErrors) => {
    const hasError = Boolean(errors[key]);

    return `
      w-full
      px-3.5
      py-2.5
      border
      rounded-xl
      text-sm
      outline-none
      transition-all
      focus:ring-2
      placeholder:text-[var(--text-placeholder)]
      ${
        hasError
          ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
          : 'focus:border-[var(--primary)] focus:ring-[var(--primary-light)]'
      }
    `;
  };

  // ================================
  // Reset form
  // ================================

  const handleReset = () => {
    setSubmitted(false);
    setForm(initialForm);
    setErrors({});
    setServerError(null);
  };

  // ================================
  // Dynamic contact information
  // ================================

  const contactInformation = [
    {
      icon: MapPin,
      label: 'Địa chỉ',
      value: generalInfo?.address || 'Chưa cập nhật',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      icon: Phone,
      label: 'Điện thoại',
      value: generalInfo?.companyPhoneNumber || 'Chưa cập nhật',
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      icon: Mail,
      label: 'Email',
      value: generalInfo?.email || 'Chưa cập nhật',
      color: 'text-violet-600 bg-violet-50',
    },
    {
      icon: Clock,
      label: 'Giờ làm việc',
      value: generalInfo?.workingHours || 'Chưa cập nhật',
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  // ================================
  // Render
  // ================================

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
      }}
    >
      {/* =========================================
          Hero Header
      ========================================== */}

      <section
        className="py-16"
        style={{
          background: `linear-gradient(
            135deg,
            var(--hero-start) 0%,
            var(--hero-middle) 100%
          )`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--primary)' }}
          >
            Liên hệ
          </div>

          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Hãy kết nối với chúng tôi
          </h1>

          <p
            className="text-base max-w-xl"
            style={{ color: 'var(--dark-text-secondary)' }}
          >
            {generalInfo?.websiteDescription ||
              `Đội ngũ chuyên gia của ${
                generalInfo?.companyName || 'CMS'
              } sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất cho doanh nghiệp của bạn.`}
          </p>
        </div>
      </section>

      {/* =========================================
          Main Container
      ========================================== */}

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* =====================================
              Left: Contact information
          ====================================== */}

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2
                className="font-display text-2xl font-bold mb-5"
                style={{ color: 'var(--text)' }}
              >
                Thông tin liên hệ
              </h2>

              <div className="space-y-4">
                {contactInformation.map(
                  ({ icon: Icon, label, value, color }) => (
                    <div key={label} className="flex items-start gap-4">
                      {/* Decorative icon color - giữ nguyên */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <div
                          className="text-xs font-semibold uppercase tracking-wide mb-1"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {label}
                        </div>

                        <div
                          className="text-sm whitespace-pre-line leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {generalInfoLoading ? 'Đang tải...' : value}
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* =================================
                Google Map
            ================================== */}

            <div
              className="rounded-2xl overflow-hidden border aspect-video relative shadow-sm"
              style={{
                background: 'var(--surface-tertiary)',
                borderColor: 'var(--border)',
              }}
            >
              {generalInfo?.mapEmbedUrl ? (
                <iframe
                  title={`Bản đồ vị trí ${
                    generalInfo.companyName || 'công ty'
                  }`}
                  src={generalInfo.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-sm"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Chưa cập nhật bản đồ
                </div>
              )}
            </div>
          </div>

          {/* =====================================
              Right: Contact form
          ====================================== */}

          <div className="lg:col-span-3">
            {submitted ? (
              /* =================================
                 Success state
              ================================== */

              <div className="h-full flex items-center justify-center">
                <div
                  className="text-center py-16 px-8 rounded-2xl border w-full shadow-sm"
                  style={{
                    background: 'var(--success-light)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle
                      size={32}
                      className="text-emerald-600"
                    />
                  </div>

                  <h3
                    className="font-display font-bold text-xl mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    Gửi yêu cầu thành công!
                  </h3>

                  <p
                    className="mb-6 max-w-md mx-auto text-sm"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Cảm ơn bạn đã liên hệ. Đội ngũ{' '}
                    {generalInfo?.companyName || 'CMS'} đã nhận được thông tin
                    và sẽ phản hồi trong vòng 24 giờ làm việc.
                  </p>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              </div>
            ) : (
              /* =================================
                 Form
              ================================== */

              <div
                className="rounded-2xl border p-8 shadow-sm"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <h2
                  className="font-display text-2xl font-bold mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  Gửi yêu cầu tư vấn
                </h2>

                <p
                  className="text-sm mb-6"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong 24
                  giờ.
                </p>

                {/* Server error */}

                {serverError && (
                  <div
                    className="mb-4 p-3 rounded-xl text-xs flex items-center gap-2"
                    style={{
                      background: 'var(--error-light)',
                      border: '1px solid var(--border)',
                      color: 'var(--error)',
                    }}
                  >
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                >
                  {/* =================================
                      Full name + Email
                  ================================== */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Họ và tên{' '}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setField('fullName', e.target.value)
                        }
                        placeholder="Nguyễn Văn A"
                        className={inputClass('fullName')}
                        style={{
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          borderColor: errors.fullName
                            ? undefined
                            : 'var(--border)',
                        }}
                      />

                      {errors.fullName && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={11} />
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Email <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setField('email', e.target.value)
                        }
                        placeholder="email@company.vn"
                        className={inputClass('email')}
                        style={{
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          borderColor: errors.email
                            ? undefined
                            : 'var(--border)',
                        }}
                      />

                      {errors.email && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={11} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* =================================
                        Phone
                    ================================== */}

                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Số điện thoại{' '}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        value={form.phoneNumber}
                        onChange={(e) =>
                          setField('phoneNumber', e.target.value)
                        }
                        placeholder="0900 000 000"
                        className={inputClass('phoneNumber')}
                        style={{
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          borderColor: errors.phoneNumber
                            ? undefined
                            : 'var(--border)',
                        }}
                      />

                      {errors.phoneNumber && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={11} />
                          {errors.phoneNumber}
                        </p>
                      )}
                    </div>

                    {/* =================================
                        Company
                    ================================== */}

                    <div>
                      <label
                        className="block text-xs font-medium mb-1.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Công ty
                      </label>

                      <input
                        value={form.company || ''}
                        onChange={(e) =>
                          setField('company', e.target.value)
                        }
                        placeholder="Tên công ty (nếu có)"
                        className={inputClass('company')}
                        style={{
                          background: 'var(--surface)',
                          color: 'var(--text)',
                          borderColor: errors.company
                            ? undefined
                            : 'var(--border)',
                        }}
                      />
                    </div>
                  </div>

                  {/* =================================
                      Category
                  ================================== */}

                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Danh mục yêu cầu{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <select
                      value={form.formCategoryId}
                      onChange={(e) =>
                        setField(
                          'formCategoryId',
                          Number(e.target.value),
                        )
                      }
                      className={inputClass('formCategoryId')}
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        borderColor: errors.formCategoryId
                          ? undefined
                          : 'var(--border)',
                      }}
                    >
                      <option value={0}>-- Chọn dịch vụ --</option>

                      {categories.map((cat) => (
                        <option
                          key={cat.formCategoryId}
                          value={cat.formCategoryId}
                        >
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>

                    {errors.formCategoryId && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />
                        {errors.formCategoryId}
                      </p>
                    )}
                  </div>

                  {/* =================================
                      Message
                  ================================== */}

                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      Nội dung tin nhắn{' '}
                      <span className="text-red-500">*</span>
                    </label>

                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setField('message', e.target.value)
                      }
                      placeholder="Mô tả nhu cầu, quy mô dự án và thông tin khác bạn muốn chia sẻ..."
                      className={`${inputClass('message')} resize-none`}
                      style={{
                        background: 'var(--surface)',
                        color: 'var(--text)',
                        borderColor: errors.message
                          ? undefined
                          : 'var(--border)',
                      }}
                    />

                    {errors.message && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* =================================
                      Consent
                  ================================== */}

                  <div>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={form.consent}
                        onChange={(e) =>
                          setField('consent', e.target.checked)
                        }
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />

                      <label
                        htmlFor="consent"
                        className="text-xs select-none cursor-pointer"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Tôi đồng ý với{' '}
                        <a
                          href="#"
                          className="hover:underline"
                          style={{ color: 'var(--primary)' }}
                        >
                          Chính sách bảo mật
                        </a>{' '}
                        và cho phép{' '}
                        {generalInfo?.companyName || 'CMS'} liên hệ với tôi
                        theo thông tin đã cung cấp.
                      </label>
                    </div>

                    {errors.consent && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* =================================
                      Submit
                  ================================== */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      w-full
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      rounded-xl
                      font-semibold
                      text-sm
                      transition-all
                      disabled:opacity-70
                      disabled:cursor-not-allowed
                      shadow-md
                    "
                    style={{
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                        Đang gửi yêu cầu...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Gửi yêu cầu tư vấn
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}