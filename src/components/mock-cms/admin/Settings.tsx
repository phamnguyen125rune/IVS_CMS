'use client';

 

import { useState } from "react";
import {
  Globe,
  Bell,
  Shield,
  Palette,
  CheckCircle,
  Save,
  MapPin,
  Phone,
  Mail,
  Share2,
  PlayCircle,
  Briefcase,
  MessageCircle,
  X,
  Edit,
  History, // Thêm icon lịch sử
  Search, // Thêm icon tìm kiếm
  Calendar, // Thêm icon lịch
} from "lucide-react";

const tabs = [
  { key: "general", label: "Thông tin chung", icon: Globe },
  { key: "notification", label: "Thông báo", icon: Bell },
  { key: "security", label: "Bảo mật", icon: Shield },
  { key: "appearance", label: "Giao diện", icon: Palette },
  { key: "logs", label: "Nhật ký hệ thống", icon: History }, // Tab mới
];

// Dữ liệu mẫu cho Nhật ký hệ thống
const mockLogs = [
  {
    id: 1,
    time: "31/07/2026 10:30:00",
    account: "admin@cms.vn",
    action: "Cập nhật cài đặt hệ thống",
    target: "Giao diện tối",
    ip: "192.168.1.10",
  },
  {
    id: 2,
    time: "31/07/2026 09:15:22",
    account: "hoang.tran@cms.vn",
    action: "Xóa bài viết",
    target: "Bài viết #1024",
    ip: "113.160.14.22",
  },
  {
    id: 3,
    time: "30/07/2026 15:45:10",
    account: "lan.le@cms.vn",
    action: "Duyệt bài viết",
    target: "Bài viết #1028",
    ip: "14.232.112.5",
  },
  {
    id: 4,
    time: "30/07/2026 08:00:05",
    account: "admin@cms.vn",
    action: "Đăng nhập thành công",
    target: "Hệ thống",
    ip: "192.168.1.10",
  },
  {
    id: 5,
    time: "29/07/2026 16:20:00",
    account: "hoang.tran@cms.vn",
    action: "Tạo tài khoản mới",
    target: "User: test@cms.vn",
    ip: "113.160.14.22",
  },
  {
    id: 6,
    time: "29/07/2026 11:10:00",
    account: "admin@cms.vn",
    action: "Khóa tài khoản",
    target: "User: spammer@mail.com",
    ip: "192.168.1.10",
  },
  {
    id: 7,
    time: "28/07/2026 14:05:00",
    account: "lan.le@cms.vn",
    action: "Từ chối bài viết",
    target: "Bài viết #1020",
    ip: "14.232.112.5",
  },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [isFooterModalOpen, setIsFooterModalOpen] = useState(false);

  // States cho bộ lọc Nhật ký
  const [logSearch, setLogSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Lọc dữ liệu nhật ký (Mô phỏng)
  const filteredLogs = mockLogs.filter(
    (log) =>
      log.account.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()),
  );

  return (
    <div className="p-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Quản lý Cài đặt
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Cấu hình hệ thống và tùy chỉnh nền tảng
          </p>
        </div>
        {/* Chỉ hiển thị nút Lưu khi KHÔNG phải tab Nhật ký (Read-only) */}
        {activeTab !== "logs" && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ background: "var(--primary)" }}
          >
            <Save size={16} />
            Lưu cài đặt
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 mb-5 text-sm text-emerald-700">
          <CheckCircle size={16} />
          Cài đặt đã được lưu thành công!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-5 pb-20">
        {/* Sidebar tabs */}
        <div className="w-full md:w-52 flex-shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
                  activeTab === key
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings content */}
        <div className="flex-1 max-w-5xl">
          {/* TAB: THÔNG TIN CHUNG */}
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* 1. Cài đặt hệ thống cơ bản */}
              <div
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <h2 className="font-semibold text-slate-900 font-display mb-5">
                  Hệ thống cơ bản
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Tên công ty nội bộ
                    </label>
                    <input
                      defaultValue="CMS Technology"
                      className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Ngôn ngữ mặc định
                    </label>
                    <select
                      defaultValue="Tiếng Việt"
                      className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none bg-white focus:border-blue-500"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <option>Tiếng Việt</option>
                      <option>English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Block gọi Modal Footer */}
              <div
                className="bg-white rounded-xl border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <h2 className="font-semibold text-slate-900 font-display mb-1">
                    Cấu hình Giao diện Footer
                  </h2>
                  <p className="text-sm text-slate-500">
                    Chỉnh sửa thông tin công ty, mạng xã hội, menu điều hướng và
                    bản quyền.
                  </p>
                </div>
                <button
                  onClick={() => setIsFooterModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <Edit size={16} />
                  Chỉnh sửa Footer
                </button>
              </div>
            </div>
          )}

          {/* TAB: THÔNG BÁO */}
          {activeTab === "notification" && (
            <div
              className="bg-white rounded-xl border p-6"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="font-semibold text-slate-900 font-display mb-5">
                Cài đặt thông báo
              </h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Thông báo bài viết mới chờ duyệt",
                    desc: "Nhận email khi có bài viết mới cần kiểm duyệt",
                    checked: true,
                  },
                  {
                    label: "Thông báo liên hệ mới",
                    desc: "Nhận email khi có yêu cầu liên hệ từ khách hàng",
                    checked: true,
                  },
                  {
                    label: "Thông báo người dùng mới",
                    desc: "Nhận email khi có người dùng đăng ký mới",
                    checked: false,
                  },
                  {
                    label: "Thông báo hệ thống",
                    desc: "Nhận email về các cập nhật và bảo trì hệ thống",
                    checked: true,
                  },
                ].map((n, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between py-3 border-b last:border-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {n.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4 mt-0.5">
                      <input
                        type="checkbox"
                        defaultChecked={n.checked}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: BẢO MẬT */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div
                className="bg-white rounded-xl border p-6"
                style={{ borderColor: "var(--border)" }}
              >
                <h2 className="font-semibold text-slate-900 font-display mb-5">
                  Cài đặt bảo mật
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Số lần đăng nhập tối đa", value: "5" },
                    { label: "Thời gian phiên (phút)", value: "120" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">
                        {f.label}
                      </label>
                      <input
                        type="number"
                        defaultValue={f.value}
                        className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                        style={{ borderColor: "var(--border)" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GIAO DIỆN */}
          {activeTab === "appearance" && (
            <div
              className="bg-white rounded-xl border p-6"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="font-semibold text-slate-900 font-display mb-5">
                Tùy chỉnh giao diện
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">
                    Chế độ hiển thị
                  </label>
                  <div className="flex gap-2">
                    {["Sáng", "Tối", "Tự động"].map((mode) => (
                      <button
                        key={mode}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium ${
                          mode === "Sáng"
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                        style={
                          mode !== "Sáng"
                            ? { borderColor: "var(--border)" }
                            : {}
                        }
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NHẬT KÝ HỆ THỐNG */}
          {activeTab === "logs" && (
            <div
              className="bg-white rounded-xl border overflow-hidden flex flex-col"
              style={{ borderColor: "var(--border)" }}
            >
              {/* Header & Filters */}
              <div
                className="p-5 border-b space-y-4"
                style={{ borderColor: "var(--border)" }}
              >
                <div>
                  <h2 className="font-semibold text-slate-900 font-display">
                    Nhật ký hệ thống
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Theo dõi toàn bộ lịch sử thao tác của các tài khoản (Dữ liệu
                    chỉ đọc).
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  {/* Tìm kiếm */}
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={logSearch}
                      onChange={(e) => setLogSearch(e.target.value)}
                      placeholder="Tìm theo tài khoản hoặc thao tác..."
                      className="w-full pl-9 pr-3 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>

                  {/* Lọc khoảng thời gian */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-8 pr-3 py-2 border rounded-xl text-sm outline-none text-slate-600 focus:border-blue-500 bg-transparent"
                        style={{ borderColor: "var(--border)" }}
                      />
                    </div>
                    <span className="text-slate-400 text-sm">-</span>
                    <div className="relative">
                      <Calendar
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-8 pr-3 py-2 border rounded-xl text-sm outline-none text-slate-600 focus:border-blue-500 bg-transparent"
                        style={{ borderColor: "var(--border)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bảng dữ liệu Read-only */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr
                      className="bg-slate-50 border-b"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <th className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">
                        Thời gian
                      </th>
                      <th className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">
                        Tài khoản thực hiện
                      </th>
                      <th className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">
                        Thao tác (Hành động)
                      </th>
                      <th className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">
                        Đối tượng bị tác động
                      </th>
                      <th className="px-5 py-3 font-semibold text-slate-500 whitespace-nowrap">
                        Địa chỉ IP
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                            {log.time}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-slate-800">
                            {log.account}
                          </td>
                          <td className="px-5 py-3.5 text-slate-700">
                            {log.action}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            {log.target}
                          </td>
                          <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">
                            {log.ip}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-5 py-10 text-center text-slate-500"
                        >
                          Không tìm thấy nhật ký nào phù hợp.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Info */}
              <div
                className="p-4 border-t flex justify-between items-center text-sm text-slate-500 bg-slate-50/50"
                style={{ borderColor: "var(--border)" }}
              >
                <span>Hiển thị {filteredLogs.length} kết quả</span>
                <div className="flex gap-1">
                  <button
                    className="px-3 py-1 border rounded-lg hover:bg-white disabled:opacity-50"
                    disabled
                  >
                    Trang trước
                  </button>
                  <button
                    className="px-3 py-1 border rounded-lg hover:bg-white disabled:opacity-50"
                    disabled
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL CHỈNH SỬA FOOTER ================= */}
      {isFooterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 lg:p-8"
          onClick={() => setIsFooterModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col overflow-hidden max-h-[95vh] sm:max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-5 sm:p-6 border-b shrink-0 bg-white"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <h2 className="font-semibold text-slate-900 font-display text-lg">
                  Chỉnh sửa Giao diện Footer
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Chỉnh sửa trực tiếp vào các ô nhập liệu bên dưới.
                </p>
              </div>
              <button
                onClick={() => setIsFooterModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto bg-[#0f172a] p-6 sm:p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Cột 1: Thông tin thương hiệu & Social */}
                <div className="lg:col-span-4 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                      C
                    </div>
                    <input
                      defaultValue="CMS"
                      className="bg-transparent border-b border-slate-700 text-white font-bold text-xl outline-none focus:border-blue-500 pb-1 w-full"
                      placeholder="Tên thương hiệu"
                    />
                  </div>
                  <textarea
                    rows={4}
                    defaultValue="Công ty giải pháp công nghệ hàng đầu Việt Nam. Chúng tôi kiến tạo những sản phẩm số giúp doanh nghiệp phát triển bền vững."
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 outline-none focus:border-blue-500 resize-none leading-relaxed"
                    placeholder="Mô tả công ty..."
                  />
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Mạng xã hội
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                        <Share2 size={16} />
                      </div>
                      <input
                        defaultValue="https://facebook.com/cms"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link Facebook"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                        <PlayCircle size={16} />
                      </div>
                      <input
                        defaultValue="https://youtube.com/cms"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link YouTube"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                        <Briefcase size={16} />
                      </div>
                      <input
                        defaultValue="https://linkedin.com/cms"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link LinkedIn"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                        <MessageCircle size={16} />
                      </div>
                      <input
                        defaultValue="https://zalo.me/cms"
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Link Zalo"
                      />
                    </div>
                  </div>
                </div>

                {/* Cột 2: Điều hướng */}
                <div className="lg:col-span-2 space-y-5">
                  <input
                    defaultValue="Điều hướng"
                    className="bg-transparent border-b border-slate-700 text-white font-semibold outline-none focus:border-blue-500 pb-1 w-full"
                    placeholder="Tiêu đề cột 1"
                  />
                  <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-400 text-xs leading-relaxed italic">
                    Các liên kết trong cột này (Trang chủ, Giới thiệu...) được
                    hệ thống tự động lấy từ cấu hình{" "}
                    <strong className="text-slate-300">Menu Footer 1</strong>.
                  </div>
                </div>

                {/* Cột 3: Dịch vụ */}
                <div className="lg:col-span-2 space-y-5">
                  <input
                    defaultValue="Dịch vụ"
                    className="bg-transparent border-b border-slate-700 text-white font-semibold outline-none focus:border-blue-500 pb-1 w-full"
                    placeholder="Tiêu đề cột 2"
                  />
                  <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-400 text-xs leading-relaxed italic">
                    Các liên kết trong cột này (Phát triển phần mềm, Thiết kế
                    UI/UX...) được hệ thống tự động lấy từ cấu hình{" "}
                    <strong className="text-slate-300">Menu Footer 2</strong>.
                  </div>
                </div>

                {/* Cột 4: Liên hệ */}
                <div className="lg:col-span-4 space-y-5">
                  <input
                    defaultValue="Liên hệ"
                    className="bg-transparent border-b border-slate-700 text-white font-semibold outline-none focus:border-blue-500 pb-1 w-full"
                    placeholder="Tiêu đề cột Liên hệ"
                  />
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={18}
                        className="text-blue-400 mt-2 shrink-0"
                      />
                      <textarea
                        rows={2}
                        defaultValue="Tầng 12, 141 Lê Duẩn, Q.1, TP.HCM"
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500 resize-none"
                        placeholder="Địa chỉ"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-blue-400 shrink-0" />
                      <input
                        defaultValue="+84 28 3456 7890"
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Số điện thoại"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail size={18} className="text-blue-400 shrink-0" />
                      <input
                        defaultValue="info@cms.vn"
                        className="flex-1 bg-slate-800/50 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
                        placeholder="Email liên hệ"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thanh dưới cùng (Bottom Bar) */}
              <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <input
                  defaultValue="© 2024 CMS. Bảo lưu mọi quyền."
                  className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-slate-400 text-sm outline-none w-full md:w-1/2"
                  placeholder="Thông tin bản quyền..."
                />
                <div className="w-full md:w-1/2 md:text-right">
                  <input
                    defaultValue="Chính sách bảo mật, Điều khoản sử dụng, Cookie"
                    className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-blue-500 text-slate-400 text-sm outline-none w-full md:text-right"
                    placeholder="Liên kết phụ (ngăn cách bởi dấu phẩy)"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer (Buttons) */}
            <div
              className="p-4 sm:p-6 border-t bg-slate-50 flex justify-end gap-3 shrink-0"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setIsFooterModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-white bg-transparent transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  setIsFooterModalOpen(false);
                  handleSave();
                }}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                style={{ background: "var(--primary)" }}
              >
                Lưu cấu hình
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


