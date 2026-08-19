'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @next/next/no-img-element */

import { useState } from "react";
import { Camera, Save, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function Profile() {
  const [saved, setSaved] = useState(false);
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [form, setForm] = useState({
    hoTen: "Nguyễn Văn Admin",
    email: "admin@vietcms.vn",
    soDienThoai: "0901 234 567",
    chucVu: "Quản trị viên hệ thống",
    moTa: "Quản trị toàn bộ nội dung và người dùng trong hệ thống CMS.",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-slate-900">
          Hồ sơ cá nhân
        </h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Cập nhật thông tin và mật khẩu tài khoản
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-5 text-sm text-emerald-700">
          <CheckCircle size={16} />
          Đã lưu thông tin thành công!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        {/* Avatar */}
        <div
          className="bg-white rounded-xl border p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="font-semibold text-slate-800 mb-4 text-sm">
            Ảnh đại diện
          </h2>
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&auto=format"
                className="w-20 h-20 rounded-2xl object-cover"
                alt="Avatar"
              />
              <button
                type="button"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-white border shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50"
                style={{ borderColor: "var(--border)" }}
              >
                <Camera size={13} />
              </button>
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium">
                Tải lên ảnh mới
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PNG, JPG tối đa 2MB. Kích thước khuyến nghị: 400×400px
              </p>
              <button
                type="button"
                className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg border hover:bg-slate-50 text-slate-600"
                style={{ borderColor: "var(--border)" }}
              >
                Chọn tệp
              </button>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div
          className="bg-white rounded-xl border p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="font-semibold text-slate-800 mb-4 text-sm">
            Thông tin cá nhân
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                key: "hoTen",
                label: "Họ và tên",
                placeholder: "Nhập họ và tên",
              },
              {
                key: "email",
                label: "Địa chỉ email",
                placeholder: "email@example.com",
                type: "email",
              },
              {
                key: "soDienThoai",
                label: "Số điện thoại",
                placeholder: "0900 000 000",
              },
              { key: "chucVu", label: "Chức vụ", placeholder: "Nhập chức vụ" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type || "text"}
                  value={(form as any)[field.key]}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Mô tả bản thân
              </label>
              <textarea
                rows={3}
                value={form.moTa}
                onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                placeholder="Giới thiệu ngắn về bản thân..."
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
          </div>
        </div>

        {/* Password */}
        <div
          className="bg-white rounded-xl border p-6"
          style={{ borderColor: "var(--border)" }}
        >
          <h2 className="font-semibold text-slate-800 mb-4 text-sm">
            Đổi mật khẩu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Mật khẩu hiện tại",
                show: showOldPw,
                toggle: () => setShowOldPw(!showOldPw),
              },
              {
                label: "Mật khẩu mới",
                show: showNewPw,
                toggle: () => setShowNewPw(!showNewPw),
              },
              {
                label: "Xác nhận mật khẩu mới",
                show: showNewPw,
                toggle: () => setShowNewPw(!showNewPw),
              },
            ].map((pw, i) => (
              <div key={i}>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  {pw.label}
                </label>
                <div className="relative">
                  <input
                    type={pw.show ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full px-3 pr-10 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={pw.toggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {pw.show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
            style={{ background: "var(--primary)" }}
          >
            <Save size={15} />
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
}


