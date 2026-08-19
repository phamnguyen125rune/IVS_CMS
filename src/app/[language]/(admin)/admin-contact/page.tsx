'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Eye, Trash2, X, Reply, Clock,
  CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Import từ các file đã tách
import type { Contact, PaginationMeta } from '@/types/contact.type';
import { contactService } from '@/services/contact.service';
import { formatDate } from '@/utils/format';

const statusConfig: Record<string, { label: string; color: string; icon: LucideIcon }> = {
  new: { label: 'Mới', color: 'bg-blue-100 text-blue-700', icon: AlertCircle },
  read: { label: 'Đã xem', color: 'bg-slate-100 text-slate-600', icon: Eye },
  replied: {
    label: 'Đã phản hồi',
    color: 'bg-emerald-100 text-emerald-700',
    icon: CheckCircle,
  },
};

export default function Contacts() {
  // States quản lý Data & Filter
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    pageSize: 10,
    pages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);

  // States quản lý Modal & Action
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const getBackendStatus = (filter: string) => {
    switch (filter) {
      case 'Mới': return 'new';
      case 'Đã xem': return 'read';
      case 'Đã phản hồi': return 'replied';
      default: return 'ALL';
    }
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const statusQuery = getBackendStatus(statusFilter);
      // Gọi service thay vì fetch trực tiếp
      const res = await contactService.getContacts(currentPage, 10, statusQuery, search);
      
      if (res?.data) {
        setContacts(res.data.result || []);
        if (res.data.meta) setMeta(res.data.meta);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách liên hệ:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  const handleViewDetail = async (contact: Contact) => {
    try {
      // Gọi service
      const res = await contactService.getContactById(contact.id);
      if (res?.data) {
        setSelectedContact(res.data);
        setReplyText(res.data.replyMessage || '');
        if (contact.status === 'new') {
          fetchContacts();
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết liên hệ:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedContact || !replyText.trim()) return;

    setSubmittingReply(true);
    try {
      // Gọi service
      await contactService.replyContact(selectedContact.id, replyText);
      setSelectedContact(null);
      setReplyText('');
      fetchContacts();
    } catch (error) {
      console.error('Lỗi khi gửi phản hồi:', error);
      alert('Gửi phản hồi thất bại, vui lòng thử lại!');
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteContact = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) return;

    try {
      // Gọi service
      await contactService.deleteContact(id);
      fetchContacts();
    } catch (error) {
      console.error('Lỗi khi xóa liên hệ:', error);
      alert('Xóa liên hệ thất bại!');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Liên hệ</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Tổng số: <span className="font-semibold">{meta.total}</span> liên hệ
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-5 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Tìm theo tên, email, chủ đề..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-1">
          {['Tất cả', 'Mới', 'Đã xem', 'Đã phản hồi'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table & Loading State */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-600" size={28} />
          </div>
        )}

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Người liên hệ</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Chủ đề</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Trạng thái</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Thời gian</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-400">
                  Không tìm thấy danh sách liên hệ phù hợp.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => {
                const sc = statusConfig[contact.status] || statusConfig.new;
                return (
                  <tr key={contact.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800">{contact.name}</div>
                      <div className="text-xs text-slate-400">
                        {contact.email} {contact.company ? `· ${contact.company}` : ''}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-slate-700 max-w-xs truncate">{contact.subject}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock size={11} />
                        {formatDate(contact.createdAt)}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Xem chi tiết"
                          onClick={() => handleViewDetail(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          title="Phản hồi"
                          onClick={() => handleViewDetail(contact)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <Reply size={14} />
                        </button>
                        <button
                          title="Xóa"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination Bar */}
        {meta.pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Trang {meta.page} / {meta.pages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage >= meta.pages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedContact(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-display font-bold text-slate-900">
                Chi tiết liên hệ #{selectedContact.id}
              </h3>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Họ tên</span>
                  <p className="text-slate-800 mt-0.5 font-medium">{selectedContact.name}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Email</span>
                  <p className="text-slate-800 mt-0.5">{selectedContact.email}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Số điện thoại</span>
                  <p className="text-slate-800 mt-0.5">{selectedContact.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Công ty</span>
                  <p className="text-slate-800 mt-0.5">{selectedContact.company || 'Không có'}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Chủ đề</span>
                <p className="text-slate-800 mt-0.5 font-medium">{selectedContact.subject}</p>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Nội dung tin nhắn</span>
                <div className="mt-1.5 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedContact.message}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-medium">Nội dung phản hồi</span>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Nhập nội dung phản hồi tới khách hàng..."
                  className="w-full mt-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none resize-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => setSelectedContact(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Đóng
              </button>
              <button
                disabled={submittingReply || !replyText.trim()}
                onClick={handleSendReply}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                {submittingReply ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Reply size={14} />
                )}
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}