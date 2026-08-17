"use client";

import { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  X,
  Reply,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "Nguyễn Hoàng Nam",
    email: "nam.nguyen@techstart.vn",
    phone: "0908 765 432",
    company: "TechStart Vietnam",
    subject: "Tư vấn giải pháp phần mềm ERP",
    message:
      "Kính gửi Quý công ty, chúng tôi đang tìm kiếm một giải pháp ERP phù hợp với quy mô 200 nhân viên. Mong được tư vấn cụ thể về chi phí và thời gian triển khai.",
    status: "new",
    date: "14/07/2024 09:30",
  },
  {
    id: 2,
    name: "Trần Thị Bảo Châu",
    email: "chau.tran@retailvn.com",
    phone: "0912 345 678",
    company: "RetailVN Corporation",
    subject: "Hợp tác phát triển ứng dụng thương mại điện tử",
    message:
      "Chúng tôi muốn phát triển nền tảng thương mại điện tử B2B riêng. Mong được trao đổi về năng lực và kinh nghiệm của CMS trong lĩnh vực này.",
    status: "read",
    date: "13/07/2024 15:45",
  },
  {
    id: 3,
    name: "Lê Minh Đức",
    email: "duc.le@fintech.io",
    phone: "0934 567 890",
    company: "FinTech Solutions",
    subject: "Bảo mật hệ thống thanh toán trực tuyến",
    message:
      "Chúng tôi cần kiểm tra và nâng cấp hệ thống bảo mật thanh toán hiện tại. Hãy cho chúng tôi biết về dịch vụ security audit của CMS.",
    status: "replied",
    date: "12/07/2024 11:20",
  },
  {
    id: 4,
    name: "Phạm Văn Khoa",
    email: "khoa.pham@logistics.vn",
    phone: "0946 789 012",
    company: "VN Logistics Group",
    subject: "Hệ thống quản lý kho bãi thông minh",
    message:
      "Doanh nghiệp chúng tôi cần giải pháp WMS (Warehouse Management System) tích hợp với các đối tác vận chuyển. Mong nhận được báo giá chi tiết.",
    status: "new",
    date: "11/07/2024 08:15",
  },
  {
    id: 5,
    name: "Ngô Thanh Huyền",
    email: "huyen.ngo@education.vn",
    phone: "0958 901 234",
    company: "EduTech Vietnam",
    subject: "Nền tảng học trực tuyến cho doanh nghiệp",
    message:
      "Chúng tôi muốn xây dựng hệ thống LMS (Learning Management System) cho 5000 nhân viên. Cần tư vấn về kiến trúc hệ thống và phương án triển khai.",
    status: "read",
    date: "10/07/2024 14:00",
  },
];

const statusConfig: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  new: { label: "Mới", color: "bg-blue-100 text-blue-700", icon: AlertCircle },
  read: { label: "Đã xem", color: "bg-slate-100 text-slate-600", icon: Eye },
  replied: {
    label: "Đã phản hồi",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle,
  },
};

export default function Contacts() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [selectedContact, setSelectedContact] = useState<
    (typeof contacts)[0] | null
  >(null);

  const filtered = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "Tất cả" ||
      (statusFilter === "Mới"
        ? c.status === "new"
        : statusFilter === "Đã xem"
          ? c.status === "read"
          : c.status === "replied");
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">
            Quản lý Liên hệ
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {contacts.filter((c) => c.status === "new").length} liên hệ mới chờ
            xử lý
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex-1 min-w-48 relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, chủ đề..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div className="flex gap-1">
          {["Tất cả", "Mới", "Đã xem", "Đã phản hồi"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${statusFilter === s ? "text-white" : "text-slate-500 hover:bg-slate-100"}`}
              style={statusFilter === s ? { background: "var(--primary)" } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="bg-slate-50 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Người liên hệ
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Chủ đề
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Thời gian
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contact) => {
              const sc = statusConfig[contact.status];
              return (
                <tr
                  key={contact.id}
                  className="border-t hover:bg-slate-50 transition-colors"
                  style={{ borderColor: "var(--border)" }}
                >
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-slate-800">
                      {contact.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {contact.email} · {contact.company}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-slate-700 max-w-xs truncate">
                      {contact.subject}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}
                    >
                      {sc.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Clock size={11} />
                      {contact.date}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                        <Reply size={14} />
                      </button>
                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="font-display font-bold text-slate-900">
                Chi tiết liên hệ
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Họ tên", value: selectedContact.name },
                  { label: "Email", value: selectedContact.email },
                  { label: "Số điện thoại", value: selectedContact.phone },
                  { label: "Công ty", value: selectedContact.company },
                ].map((f) => (
                  <div key={f.label}>
                    <span className="text-xs text-slate-400 font-medium">
                      {f.label}
                    </span>
                    <p className="text-slate-800 mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">
                  Chủ đề
                </span>
                <p className="text-slate-800 mt-0.5 font-medium">
                  {selectedContact.subject}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">
                  Nội dung
                </span>
                <div className="mt-1.5 p-4 rounded-xl bg-slate-50 text-sm text-slate-700 leading-relaxed">
                  {selectedContact.message}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium">
                  Phản hồi
                </span>
                <textarea
                  rows={3}
                  placeholder="Nhập nội dung phản hồi..."
                  className="w-full mt-1.5 px-3 py-2.5 border rounded-xl text-sm outline-none resize-none focus:border-blue-500"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>
            <div
              className="flex items-center justify-end gap-2 px-6 py-4 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 rounded-xl border text-sm text-slate-600 hover:bg-slate-50"
                style={{ borderColor: "var(--border)" }}
              >
                Đóng
              </button>
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold"
                style={{ background: "var(--primary)" }}
              >
                <Reply size={14} />
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
