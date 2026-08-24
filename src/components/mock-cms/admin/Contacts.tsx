'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { Search, Eye, Trash2, X, Reply, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';

// Đổi thành initialContacts để dùng làm giá trị khởi tạo cho State
const initialContacts = [
  {
    id: 1,
    name: 'Nguyễn Hoàng Nam',
    email: 'nam.nguyen@techstart.vn',
    phone: '0908 765 432',
    company: 'TechStart Vietnam',
    subject: 'Tư vấn giải pháp phần mềm ERP',
    message:
      'Kính gửi Quý công ty, chúng tôi đang tìm kiếm một giải pháp ERP phù hợp với quy mô 200 nhân viên. Mong được tư vấn cụ thể về chi phí và thời gian triển khai.',
    status: 'new',
    date: '14/07/2024 09:30',
  },
  {
    id: 2,
    name: 'Trần Thị Bảo Châu',
    email: 'chau.tran@retailvn.com',
    phone: '0912 345 678',
    company: 'RetailVN Corporation',
    subject: 'Hợp tác phát triển ứng dụng thương mại điện tử',
    message:
      'Chúng tôi muốn phát triển nền tảng thương mại điện tử B2B riêng. Mong được trao đổi về năng lực và kinh nghiệm của CMS trong lĩnh vực này.',
    status: 'read',
    date: '13/07/2024 15:45',
  },
  {
    id: 3,
    name: 'Lê Minh Đức',
    email: 'duc.le@fintech.io',
    phone: '0934 567 890',
    company: 'FinTech Solutions',
    subject: 'Bảo mật hệ thống thanh toán trực tuyến',
    message:
      'Chúng tôi cần kiểm tra và nâng cấp hệ thống bảo mật thanh toán hiện tại. Hãy cho chúng tôi biết về dịch vụ security audit của CMS.',
    status: 'replied',
    date: '12/07/2024 11:20',
  },
  {
    id: 4,
    name: 'Phạm Văn Khoa',
    email: 'khoa.pham@logistics.vn',
    phone: '0946 789 012',
    company: 'VN Logistics Group',
    subject: 'Hệ thống quản lý kho bãi thông minh',
    message:
      'Doanh nghiệp chúng tôi cần giải pháp WMS (Warehouse Management System) tích hợp với các đối tác vận chuyển. Mong nhận được báo giá chi tiết.',
    status: 'new',
    date: '11/07/2024 08:15',
  },
  {
    id: 5,
    name: 'Ngô Thanh Huyền',
    email: 'huyen.ngo@education.vn',
    phone: '0958 901 234',
    company: 'EduTech Vietnam',
    subject: 'Nền tảng học trực tuyến cho doanh nghiệp',
    message:
      'Chúng tôi muốn xây dựng hệ thống LMS (Learning Management System) cho 500 nhân viên. Cần tư vấn về kiến trúc hệ thống và phương án triển khai.',
    status: 'read',
    date: '10/07/2024 14:00',
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'Mới', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  read: { label: 'Đã xem', color: 'bg-slate-100 text-slate-600', icon: Eye },
  replied: {
    label: 'Đã phản hồi',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
  },
};

export default function Contacts() {
  const [contactList, setContactList] = useState(initialContacts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // States quản lý Modal
  const [viewContact, setViewContact] = useState<(typeof initialContacts)[0] | null>(null);
  const [replyContact, setReplyContact] = useState<(typeof initialContacts)[0] | null>(null);
  const [deleteContact, setDeleteContact] = useState<(typeof initialContacts)[0] | null>(null);

  // Lọc dữ liệu
  const filtered = contactList.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'Tất cả' ||
      (statusFilter === 'Mới'
        ? c.status === 'new'
        : statusFilter === 'Đã xem'
          ? c.status === 'read'
          : c.status === 'replied');
    return matchSearch && matchStatus;
  });

  // Đánh dấu đã xem khi mở Modal Xem
  const handleView = (contact: (typeof initialContacts)[0]) => {
    setViewContact(contact);
    if (contact.status === 'new') {
      setContactList((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, status: 'read' } : c))
      );
    }
  };

  // Xử lý gửi phản hồi
  const handleSendReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (replyContact) {
      setContactList((prev) =>
        prev.map((c) => (c.id === replyContact.id ? { ...c, status: 'replied' } : c))
      );
      setReplyContact(null);
    }
  };

  // Xử lý xóa
  const handleDelete = () => {
    if (deleteContact) {
      setContactList((prev) => prev.filter((c) => c.id !== deleteContact.id));
      setDeleteContact(null);
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Biểu mẫu</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {contactList.filter((c) => c.status === 'new').length} biểu mẫu mới chờ xử lý
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, email, chủ đề..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex gap-1">
          {['Tất cả', 'Mới', 'Đã xem', 'Đã phản hồi'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              style={statusFilter === s ? { background: 'var(--primary)' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
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
            {filtered.length > 0 ? (
              filtered.map((contact) => {
                const sc = statusConfig[contact.status];
                return (
                  <tr
                    key={contact.id}
                    className="border-t hover:bg-slate-50 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{contact.name}</div>
                      <div className="text-xs text-slate-400">
                        {contact.email} · {contact.company}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-700 max-w-xs truncate" title={contact.subject}>
                        {contact.subject}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${sc.color}`}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 whitespace-nowrap">
                        <Clock size={11} />
                        {contact.date}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleView(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => setReplyContact(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Phản hồi"
                        >
                          <Reply size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteContact(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Xóa liên hệ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-500">
                  Không tìm thấy liên hệ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. Modal Xem Chi Tiết */}
      {viewContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setViewContact(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <h3 className="font-display font-bold text-slate-900 text-lg">Chi tiết biểu mẫu</h3>
              <button
                onClick={() => setViewContact(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                {[
                  { label: 'Họ tên', value: viewContact.name },
                  { label: 'Email', value: viewContact.email },
                  { label: 'Số điện thoại', value: viewContact.phone },
                  { label: 'Công ty', value: viewContact.company },
                  { label: 'Thời gian gửi', value: viewContact.date },
                ].map((f) => (
                  <div key={f.label}>
                    <span className="text-xs text-slate-400 font-medium block mb-1">{f.label}</span>
                    <p className="text-slate-800 font-medium">{f.value}</p>
                  </div>
                ))}
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">Chủ đề</span>
                <p className="text-slate-800 font-bold text-base">{viewContact.subject}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Nội dung chi tiết
                </span>
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 leading-relaxed shadow-sm">
                  {viewContact.message}
                </div>
              </div>
            </div>
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setViewContact(null)}
                className="px-4 py-2 rounded-xl border text-sm text-slate-600 hover:bg-white transition-colors bg-transparent"
                style={{ borderColor: 'var(--border)' }}
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setReplyContact(viewContact);
                  setViewContact(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-colors"
                style={{ background: 'var(--primary)' }}
              >
                <Reply size={14} />
                Phản hồi ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Phản Hồi (Reply) */}
      {replyContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setReplyContact(null)}
        >
          <form
            onSubmit={handleSendReply}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b bg-emerald-50 rounded-t-2xl"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <h3 className="font-display font-bold text-emerald-900 text-lg flex items-center gap-2">
                  <Reply size={18} className="text-emerald-600" />
                  Phản hồi biểu mẫu
                </h3>
                <p className="text-emerald-700/80 text-xs mt-0.5">
                  Gửi email tới: {replyContact.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyContact(null)}
                className="text-emerald-600/60 hover:text-emerald-800 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">
                  Đang trả lời cho chủ đề:
                </span>
                <p className="text-slate-800 font-semibold bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                  Re: {replyContact.subject}
                </p>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1.5">
                  Nội dung email phản hồi <span className="text-red-500">*</span>
                </span>
                <textarea
                  required
                  rows={6}
                  placeholder={`Chào ${replyContact.name},\n\nCảm ơn bạn đã liên hệ...`}
                  className="w-full px-4 py-3 border rounded-xl text-sm outline-none resize-none focus:border-emerald-500 bg-white"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
            </div>
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 border-t"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                type="button"
                onClick={() => setReplyContact(null)}
                className="px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-600/20"
              >
                <Send size={14} />
                Gửi phản hồi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Modal Xác Nhận Xóa */}
      {deleteContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDeleteContact(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">Xóa biểu mẫu?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa biểu mẫu từ{' '}
              <span className="font-semibold text-slate-900">{deleteContact.name}</span> không?
              <br />
              Thao tác này <strong className="text-red-500">không thể hoàn tác</strong>.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteContact(null)}
                className="px-5 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 transition-colors w-full shadow-sm shadow-red-500/30"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
