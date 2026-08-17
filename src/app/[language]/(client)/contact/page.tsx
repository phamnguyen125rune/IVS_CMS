'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

type FormData = {
  hoTen: string;
  email: string;
  soDienThoai: string;
  congTy: string;
  dichVu: string;
  noiDung: string;
  consent: boolean;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Contact() {
  const [form, setForm] = useState<FormData>({
    hoTen: '',
    email: '',
    soDienThoai: '',
    congTy: '',
    dichVu: '',
    noiDung: '',
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate form
  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.hoTen.trim()) e.hoTen = 'Vui lòng nhập họ và tên';
    if (!form.email.trim()) e.email = 'Vui lòng nhập địa chỉ email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Địa chỉ email không hợp lệ';
    if (!form.soDienThoai.trim()) e.soDienThoai = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{9,11}$/.test(form.soDienThoai.replace(/\s/g, '')))
      e.soDienThoai = 'Số điện thoại không hợp lệ';
    if (!form.noiDung.trim()) e.noiDung = 'Vui lòng nhập nội dung tin nhắn';
    else if (form.noiDung.trim().length < 20) e.noiDung = 'Nội dung phải có ít nhất 20 ký tự';
    if (!form.consent) e.consent = 'Bạn cần đồng ý với điều khoản bảo mật';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);

    try {
      // TODO: Gọi API gửi mail / lưu database thực tế ở đây
      // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) });
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitted(true);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const setField = (key: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const inputClass = (key: keyof FormErrors) =>
    `w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-all focus:ring-2 ${
      errors[key]
        ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-100'
        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
    }`;

  return (
    <div>
      {/* Hero Header */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">
            Liên hệ
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Hãy kết nối với chúng tôi
          </h1>
          <p className="text-blue-200 text-base max-w-xl">
            Đội ngũ chuyên gia của CMS sẵn sàng lắng nghe và tư vấn giải pháp phù hợp nhất cho doanh
            nghiệp của bạn.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Thông tin + Bản đồ */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-slate-900 mb-5">
                Thông tin liên hệ
              </h2>
              <div className="space-y-4">
                {[
                  {
                    icon: MapPin,
                    label: 'Địa chỉ',
                    value: 'Tầng 12, 141 Lê Duẩn\nQuận 1, TP. Hồ Chí Minh',
                    color: 'text-blue-600 bg-blue-50',
                  },
                  {
                    icon: Phone,
                    label: 'Điện thoại',
                    value: '+84 28 3456 7890\n+84 28 3456 7891',
                    color: 'text-emerald-600 bg-emerald-50',
                  },
                  {
                    icon: Mail,
                    label: 'Email',
                    value: 'info@cms.vn\nsales@cms.vn',
                    color: 'text-violet-600 bg-violet-50',
                  },
                  {
                    icon: Clock,
                    label: 'Giờ làm việc',
                    value: 'Thứ 2 – Thứ 6: 8:00 – 18:00\nThứ 7: 8:00 – 12:00',
                    color: 'text-amber-600 bg-amber-50',
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                        {label}
                      </div>
                      <div className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Map Embedded Real */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video relative shadow-sm">
              <iframe
                title="Bản đồ vị trí CMS"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324215983!2d106.69463931533413!3d10.776019992321852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a61d19129%3A0xe96825dfa2202d5d!2zMTQxIEzDqiBEdeG6q24sIELhur9uIE5naMOpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1670000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: Form nhập liệu */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-16 px-8 bg-emerald-50 rounded-2xl border border-emerald-200 w-full shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
                    Gửi yêu cầu thành công!
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto text-sm">
                    Cảm ơn bạn đã liên hệ. Đội ngũ CMS đã nhận được thông tin và sẽ phản hồi cho bạn
                    trong vòng 24 giờ làm việc.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        hoTen: '',
                        email: '',
                        soDienThoai: '',
                        congTy: '',
                        dichVu: '',
                        noiDung: '',
                        consent: false,
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Gửi yêu cầu tư vấn
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                  Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại trong 24 giờ.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Họ và tên */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.hoTen}
                        onChange={(e) => setField('hoTen', e.target.value)}
                        placeholder="Nguyễn Văn A"
                        className={inputClass('hoTen')}
                      />
                      {errors.hoTen && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={11} />
                          {errors.hoTen}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                        placeholder="email@company.vn"
                        className={inputClass('email')}
                      />
                      {errors.email && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={11} />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Số điện thoại */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <input
                        value={form.soDienThoai}
                        onChange={(e) => setField('soDienThoai', e.target.value)}
                        placeholder="0900 000 000"
                        className={inputClass('soDienThoai')}
                      />
                      {errors.soDienThoai && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                          <AlertCircle size={11} />
                          {errors.soDienThoai}
                        </p>
                      )}
                    </div>

                    {/* Công ty */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        Công ty
                      </label>
                      <input
                        value={form.congTy}
                        onChange={(e) => setField('congTy', e.target.value)}
                        placeholder="Tên công ty (nếu có)"
                        className={inputClass('congTy')}
                      />
                    </div>
                  </div>

                  {/* Dịch vụ quan tâm */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Dịch vụ quan tâm
                    </label>
                    <select
                      value={form.dichVu}
                      onChange={(e) => setField('dichVu', e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white text-slate-700 transition-all"
                    >
                      <option value="">-- Chọn dịch vụ --</option>
                      {[
                        'Phát triển phần mềm',
                        'Thiết kế UI/UX',
                        'Tư vấn chuyển đổi số',
                        'Cloud & DevOps',
                        'Bảo mật hệ thống',
                        'Phân tích dữ liệu',
                        'Khác',
                      ].map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nội dung tin nhắn */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Nội dung tin nhắn <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.noiDung}
                      onChange={(e) => setField('noiDung', e.target.value)}
                      placeholder="Mô tả nhu cầu, quy mô dự án và thông tin khác bạn muốn chia sẻ..."
                      className={`${inputClass('noiDung')} resize-none`}
                    />
                    {errors.noiDung && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />
                        {errors.noiDung}
                      </p>
                    )}
                  </div>

                  {/* Checkbox Đồng ý */}
                  <div>
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        id="consent"
                        checked={form.consent}
                        onChange={(e) => setField('consent', e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor="consent"
                        className="text-xs text-slate-500 select-none cursor-pointer"
                      >
                        Tôi đồng ý với{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          Chính sách bảo mật
                        </a>{' '}
                        và cho phép CMS liên hệ với tôi theo thông tin đã cung cấp.
                      </label>
                    </div>
                    {errors.consent && (
                      <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                        <AlertCircle size={11} />
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
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
