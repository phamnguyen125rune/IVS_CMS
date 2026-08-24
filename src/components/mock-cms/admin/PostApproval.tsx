'use client';

/* eslint-disable react/no-unescaped-entities, @next/next/no-img-element */

import { useState } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  X,
  Monitor,
  Smartphone,
  ArrowLeft,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Globe,
  Search,
} from 'lucide-react';

const pendingPosts = [
  {
    id: 1,
    title: 'Hướng dẫn toàn diện về phát triển ứng dụng mobile 2024',
    author: 'Trần Văn Minh',
    category: 'Kiến thức',
    submitted: '11/07/2024 14:30',
    excerpt:
      'Bài viết này cung cấp hướng dẫn chi tiết về các bước phát triển ứng dụng mobile từ giai đoạn lên kế hoạch đến triển khai thực tế, bao gồm cả iOS và Android...',
    wordCount: 2450,
  },
  {
    id: 2,
    title: 'Kiến trúc microservices và lợi ích cho doanh nghiệp hiện đại',
    author: 'Hoàng Minh Tuấn',
    category: 'Kiến thức',
    submitted: '13/07/2024 09:15',
    excerpt:
      'Microservices đang trở thành xu hướng kiến trúc phần mềm hàng đầu. Bài viết phân tích ưu điểm, nhược điểm và các trường hợp sử dụng thực tế trong doanh nghiệp...',
    wordCount: 1890,
  },
  {
    id: 3,
    title: 'Xu hướng chuyển đổi số trong ngành bán lẻ Việt Nam 2024',
    author: 'Ngô Thị Thu',
    category: 'Tin tức',
    submitted: '14/07/2024 08:00',
    excerpt:
      'Ngành bán lẻ Việt Nam đang trải qua một cuộc cách mạng số hóa mạnh mẽ. Báo cáo này tổng hợp những xu hướng nổi bật nhất trong năm 2024...',
    wordCount: 3100,
  },
  {
    id: 4,
    title: 'Bảo mật thông tin và các giải pháp phòng ngừa tấn công mạng',
    author: 'Đặng Quốc Huy',
    category: 'Bảo mật',
    submitted: '14/07/2024 11:20',
    excerpt:
      'Trong bối cảnh tấn công mạng ngày càng tinh vi, bài viết này đề xuất các giải pháp bảo mật toàn diện cho doanh nghiệp từ quy mô vừa đến lớn...',
    wordCount: 2800,
  },
];

type ModalType = 'preview' | 'reject' | null;

export default function PostApproval() {
  const [posts, setPosts] = useState(pendingPosts);
  const [modal, setModal] = useState<{
    type: ModalType;
    post: (typeof pendingPosts)[0] | null;
  }>({ type: null, post: null });
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // State quản lý chế độ xem trước (Desktop / Mobile)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isDesktop = previewMode === 'desktop';

  const approve = (id: number) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setModal({ type: null, post: null });
    showToast('Bài viết đã được duyệt và xuất bản thành công!', 'success');
  };

  const reject = () => {
    if (!modal.post) return;
    setPosts((prev) => prev.filter((p) => p.id !== modal.post!.id));
    setModal({ type: null, post: null });
    setRejectReason('');
    showToast('Đã từ chối bài viết và gửi phản hồi cho tác giả.', 'error');
  };

  return (
    <div className="p-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Kiểm duyệt Bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">{posts.length} bài viết đang chờ duyệt</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <AlertTriangle size={15} className="text-amber-500" />
          <span className="text-sm text-amber-700 font-medium">
            {posts.length} bài cần xét duyệt
          </span>
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
                Bài viết
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tác giả
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Danh mục
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Số từ
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Ngày gửi
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-t hover:bg-slate-50 transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-800 max-w-xs">{post.title}</div>
                  <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">
                    {post.excerpt}
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-600 text-sm whitespace-nowrap">
                  {post.author}
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs font-mono text-slate-500">
                  {post.wordCount.toLocaleString('vi-VN')}
                </td>
                <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                  {post.submitted}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setPreviewMode('desktop'); // Đặt mặc định là desktop khi mở
                        setModal({ type: 'preview', post });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium text-slate-600 hover:bg-slate-50"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <Eye size={13} />
                      Xem trước
                    </button>
                    <button
                      onClick={() => approve(post.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle size={13} />
                      Duyệt
                    </button>
                    <button
                      onClick={() => {
                        setModal({ type: 'reject', post });
                        setRejectReason('');
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600"
                    >
                      <XCircle size={13} />
                      Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400" />
            <p className="font-medium text-slate-600">Không có bài viết nào chờ duyệt</p>
            <p className="text-sm mt-1">Tất cả bài viết đã được xử lý!</p>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}

      {/* Modal 1: CHẾ ĐỘ XEM TRƯỚC (Preview Mode - Đồng bộ với Client PostDetail) */}
      {modal.type === 'preview' && modal.post && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
          onClick={() => setModal({ type: null, post: null })}
        >
          <div
            className="bg-slate-100 sm:rounded-2xl shadow-2xl w-full max-w-[1400px] flex flex-col h-full sm:max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Toolbar */}
            <div
              className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b shrink-0 z-10 shadow-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1.5 rounded flex items-center gap-1.5">
                  <Clock size={14} />
                  <span className="hidden sm:inline">Bài viết Đang chờ duyệt</span>
                </span>
                <div
                  className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg ml-2 border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-all ${
                      isDesktop
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Monitor size={14} />
                    <span className="hidden sm:inline">Máy tính</span>
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-all ${
                      !isDesktop
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Smartphone size={14} />
                    <span className="hidden sm:inline">Điện thoại</span>
                  </button>
                </div>
              </div>
              <button
                onClick={() => setModal({ type: null, post: null })}
                className="text-slate-400 hover:text-slate-700 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                title="Đóng xem trước"
              >
                <X size={18} />
              </button>
            </div>

            {/* Website Preview Container */}
            <div
              className={`flex-1 overflow-y-auto w-full flex justify-center transition-colors ${!isDesktop ? 'bg-slate-200 py-8' : 'bg-slate-100 p-0 sm:p-6'}`}
            >
              <div
                className={`bg-white transition-all duration-300 relative overflow-hidden flex flex-col ${
                  !isDesktop
                    ? 'w-[375px] min-h-[812px] h-[812px] rounded-[2.5rem] border-[14px] border-slate-900 shadow-2xl overflow-y-auto flex-shrink-0 scrollbar-hide'
                    : 'w-full max-w-[1280px] sm:rounded-xl sm:shadow-xl border border-slate-200 h-full overflow-y-auto'
                }`}
              >
                {/* Phone Notch */}
                {!isDesktop && (
                  <div className="sticky top-0 z-50 w-full h-6 bg-transparent flex justify-center pointer-events-none">
                    <div className="w-1/3 h-5 bg-slate-900 rounded-b-xl"></div>
                  </div>
                )}

                {/* Website Header Mockup */}
                <div className="shrink-0">
                  <div
                    className={`bg-[#1e293b] text-slate-300 flex justify-between items-center ${isDesktop ? 'px-8 py-2 text-xs' : 'px-4 py-1.5 text-[10px]'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Phone size={isDesktop ? 12 : 10} /> +84 28 3456 7890
                      </span>
                      {isDesktop && (
                        <span className="flex items-center gap-1.5">
                          <Mail size={12} /> info@cms.vn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <Share2 size={isDesktop ? 12 : 10} />
                    </div>
                  </div>
                  <div
                    className={`bg-white flex justify-between items-center border-b border-slate-100 ${isDesktop ? 'px-8 py-4' : 'px-4 py-3'}`}
                  >
                    <div className="font-bold flex items-center gap-2 text-slate-900">
                      <div
                        className={`bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold ${isDesktop ? 'w-8 h-8 text-sm' : 'w-6 h-6 text-xs'}`}
                      >
                        C
                      </div>
                      <span className={isDesktop ? 'text-xl' : 'text-base'}>CMS</span>
                    </div>
                    {isDesktop && (
                      <div className="flex items-center gap-6 text-[14px] font-medium text-slate-600">
                        <span className="hover:text-blue-600 cursor-pointer">Trang chủ</span>
                        <span className="hover:text-blue-600 cursor-pointer">Giới thiệu</span>
                        <span className="text-blue-600 cursor-pointer">Bài viết ⌄</span>
                        <span className="hover:text-blue-600 cursor-pointer">Dự án ⌄</span>
                        <span className="hover:text-blue-600 cursor-pointer">Tuyển dụng</span>
                        <span className="hover:text-blue-600 cursor-pointer">Liên hệ</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4">
                      {isDesktop && (
                        <div className="flex items-center gap-1.5 border rounded-full px-3 py-1.5 text-xs text-slate-600 cursor-pointer">
                          <Globe size={14} /> VN ⌄
                        </div>
                      )}
                      <Search
                        size={isDesktop ? 18 : 16}
                        className="text-slate-500 cursor-pointer"
                      />
                      {isDesktop && (
                        <button className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                          Liên hệ ngay
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Website Body - PostDetail Layout */}
                <div
                  className={`mx-auto w-full ${isDesktop ? 'max-w-7xl px-8 py-8 grid grid-cols-12 gap-10' : 'px-4 py-5 flex flex-col gap-8'}`}
                >
                  {/* Left Column - Content */}
                  <div className={isDesktop ? 'col-span-8' : ''}>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 hover:text-blue-600 cursor-pointer w-fit">
                      <ArrowLeft size={16} /> Quay lại danh sách bài viết
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {modal.post.category}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                        Trí tuệ nhân tạo
                      </span>
                    </div>

                    <h1
                      className={`font-display font-bold text-slate-900 mb-6 leading-[1.3] ${isDesktop ? 'text-[36px]' : 'text-2xl'}`}
                    >
                      {modal.post.title} và tác động sâu rộng đến doanh nghiệp Việt Nam
                    </h1>

                    <div
                      className={`flex items-center justify-between py-4 border-b border-slate-100 mb-6 ${!isDesktop ? 'flex-col items-start gap-4' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&auto=format"
                          alt="Author"
                          className="w-10 h-10 rounded-full object-cover bg-slate-100"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-800">{modal.post.author}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Chuyên gia Công nghệ · {modal.post.submitted.split(' ')[0]} · 8 phút đọc
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${!isDesktop ? 'w-full justify-end border-t pt-3' : ''}`}
                      >
                        <button className="p-2 border rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                          <Share2 size={16} />
                        </button>
                        <button className="p-2 border rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                          <Bookmark size={16} />
                        </button>
                      </div>
                    </div>

                    <img
                      src={`https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&auto=format`}
                      className="w-full rounded-2xl mb-8 object-cover aspect-[16/9] bg-slate-100"
                      alt="Featured"
                    />

                    <div
                      className={`text-slate-700 leading-relaxed space-y-5 pb-8 ${isDesktop ? 'text-[17px]' : 'text-[15px]'}`}
                    >
                      <p
                        className={`text-slate-900 font-medium ${isDesktop ? 'text-lg' : 'text-base'}`}
                      >
                        {modal.post.excerpt}
                      </p>
                      <p>
                        Năm 2024 đánh dấu bước ngoặt quan trọng trong ứng dụng trí tuệ nhân tạo tại
                        Việt Nam. Từ những mô hình ngôn ngữ lớn (LLM) như GPT-4 và Gemini cho đến
                        các giải pháp AI chuyên biệt cho từng ngành, làn sóng AI đang tái định hình
                        cách doanh nghiệp hoạt động và tạo ra giá trị.
                      </p>

                      <h2
                        className={`font-display font-bold text-slate-900 mt-8 mb-4 ${isDesktop ? 'text-2xl' : 'text-xl'}`}
                      >
                        1. Generative AI: Không còn là thí nghiệm
                      </h2>
                      <p>
                        Nếu năm 2023 là năm của sự thử nghiệm với Generative AI, thì 2024 là năm
                        doanh nghiệp bắt đầu tích hợp nghiêm túc vào quy trình kinh doanh. Theo khảo
                        sát của CMS với 300 doanh nghiệp Việt Nam, 68% đã triển khai ít nhất một ứng
                        dụng AI trong hoạt động hàng ngày.
                      </p>

                      <div
                        className="rounded-2xl p-6 my-6"
                        style={{ background: '#eff6ff', borderLeft: '4px solid var(--primary)' }}
                      >
                        <p className="text-blue-800 font-medium italic">
                          "AI không thay thế con người, mà trao quyền cho con người làm được những
                          điều mà trước đây chỉ là ước mơ." — Nguyễn Văn Hoàng, CEO CMS
                        </p>
                      </div>

                      <h2
                        className={`font-display font-bold text-slate-900 mt-8 mb-4 ${isDesktop ? 'text-2xl' : 'text-xl'}`}
                      >
                        2. AI trong chăm sóc khách hàng
                      </h2>
                      <p>
                        Chatbot và virtual assistant được nâng cấp mạnh mẽ nhờ LLM. Không còn là
                        những bot trả lời cứng nhắc, các hệ thống AI mới có thể hiểu ngữ cảnh, xử lý
                        tiếng Việt tự nhiên và thậm chí có khả năng nhận biết cảm xúc khách hàng.
                      </p>

                      <h2
                        className={`font-display font-bold text-slate-900 mt-8 mb-4 ${isDesktop ? 'text-2xl' : 'text-xl'}`}
                      >
                        3. Thách thức và cơ hội cho doanh nghiệp Việt
                      </h2>
                      <p>
                        Dù tiềm năng rõ ràng, việc ứng dụng AI không phải không có thách thức. Thiếu
                        dữ liệu chất lượng cao, thiếu nhân lực hiểu biết AI, và lo ngại về quyền
                        riêng tư vẫn là ba rào cản lớn nhất.
                      </p>

                      <div
                        className={`grid gap-4 my-8 ${isDesktop ? 'grid-cols-3' : 'grid-cols-1'}`}
                      >
                        {[
                          ['68%', 'Doanh nghiệp đã dùng AI'],
                          ['40-60%', 'Giảm tải CSKH'],
                          ['3.2x', 'ROI trung bình từ AI'],
                        ].map(([num, label]) => (
                          <div
                            key={label}
                            className="text-center p-4 rounded-2xl border"
                            style={{ borderColor: 'var(--border)', background: '#f8fafc' }}
                          >
                            <div className="font-display font-bold text-2xl text-slate-900 mb-1">
                              {num}
                            </div>
                            <div className="text-xs text-slate-500">{label}</div>
                          </div>
                        ))}
                      </div>

                      <h2
                        className={`font-display font-bold text-slate-900 mt-8 mb-4 ${isDesktop ? 'text-2xl' : 'text-xl'}`}
                      >
                        4. Lộ trình ứng dụng AI cho doanh nghiệp
                      </h2>
                      <ul className="space-y-3 mb-6">
                        {[
                          'Bắt đầu với use case đơn giản, đo lường được (chatbot, phân loại email)',
                          'Đầu tư vào dữ liệu — dữ liệu chất lượng là nguyên liệu của AI',
                          'Đào tạo nhân viên hiểu và làm việc cùng AI, không phải chống lại nó',
                          'Thiết lập quy trình kiểm soát chất lượng đầu ra của AI',
                          'Mở rộng dần sang các use case phức tạp hơn sau khi có nền tảng',
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600">
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                              style={{ background: 'var(--primary)' }}
                            >
                              {i + 1}
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      <p>
                        Kết luận: AI năm 2024 không còn là lựa chọn mà là điều kiện cần để duy trì
                        tính cạnh tranh. Doanh nghiệp nào hành động sớm sẽ có lợi thế đáng kể trong
                        3-5 năm tới.
                      </p>
                    </div>

                    <div
                      className="flex flex-wrap gap-2 mt-8 pt-6 border-t"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {['AI', 'Machine Learning', 'Chuyển đổi số', 'Doanh nghiệp', '2024'].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="text-xs px-3 py-1.5 rounded-full border text-slate-600 hover:bg-slate-50 cursor-pointer"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  {/* Right Column - Sidebar */}
                  <div
                    className={`${isDesktop ? 'col-span-4' : 'border-t border-slate-100 pt-8'} space-y-6`}
                  >
                    <div className="border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format"
                        alt="Author"
                        className="w-16 h-16 rounded-full object-cover mb-3 bg-slate-100"
                      />
                      <h4 className="font-bold text-slate-900 text-sm mb-1">{modal.post.author}</h4>
                      <p className="text-xs text-slate-500 mb-4">Chuyên gia Công nghệ · CMS</p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Hơn 8 năm nghiên cứu và ứng dụng AI trong doanh nghiệp. Tác giả của 40+ bài
                        viết chuyên sâu.
                      </p>
                    </div>

                    <div className="border border-slate-100 rounded-2xl p-6 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                      <h4 className="font-bold text-slate-900 text-sm mb-5">Bài viết liên quan</h4>
                      <div className="space-y-4">
                        {[
                          {
                            title: 'Hướng dẫn chuyển đổi số toàn diện cho SME',
                            cat: 'Kiến thức',
                            date: '05/07/2024',
                            img: '1460925895917-afdab827c52f',
                          },
                          {
                            title: 'Cloud Computing: AWS vs Google Cloud vs Azure',
                            cat: 'Công nghệ',
                            date: '15/06/2024',
                            img: '1451187580459-43490279c0fa',
                          },
                          {
                            title: 'Bảo mật thông tin doanh nghiệp: 10 nguyên tắc',
                            cat: 'Bảo mật',
                            date: '28/06/2024',
                            img: '1555949963-aa79dcee981c',
                          },
                        ].map((related, idx) => (
                          <div key={idx} className="flex gap-3 group cursor-pointer">
                            <img
                              src={`https://images.unsplash.com/photo-${related.img}?w=100&h=70&fit=crop&auto=format`}
                              className="w-20 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                              alt="Thumb"
                            />
                            <div className="flex flex-col justify-center">
                              <span className="text-[10px] text-slate-500 font-medium mb-0.5">
                                {related.cat}
                              </span>
                              <h5 className="text-xs font-semibold text-slate-800 leading-snug group-hover:text-blue-600 line-clamp-2">
                                {related.title}
                              </h5>
                              <span className="text-[10px] text-slate-400 mt-1">
                                {related.date}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-blue-600/20">
                      <h4 className="font-bold text-lg mb-2">Đăng ký nhận tin</h4>
                      <p className="text-xs text-blue-100 leading-relaxed mb-4">
                        Nhận bài viết mới nhất và insights hàng tuần từ CMS.
                      </p>
                      <input
                        placeholder="Email của bạn..."
                        className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-900 outline-none mb-3"
                      />
                      <button className="w-full bg-slate-900 text-white font-semibold text-sm py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
                        Đăng ký ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Control Actions */}
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 bg-white shrink-0 border-t shadow-[0_-4px_10px_rgba(0,0,0,0.03)] z-10"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => {
                  setModal({ type: 'reject', post: modal.post });
                  setRejectReason('');
                }}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20"
              >
                <XCircle size={16} />
                <span className="hidden sm:inline">Từ chối bài viết</span>
                <span className="sm:hidden">Từ chối</span>
              </button>
              <button
                onClick={() => approve(modal.post!.id)}
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-600/20"
              >
                <CheckCircle size={16} />
                <span className="hidden sm:inline">Duyệt & Xuất bản ngay</span>
                <span className="sm:hidden">Xuất bản</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Từ chối bài viết */}
      {modal.type === 'reject' && modal.post && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setModal({ type: null, post: null })}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <h3 className="font-display font-bold text-slate-900 text-lg">Từ chối bài viết</h3>
              <button
                onClick={() => setModal({ type: null, post: null })}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                Nhập lý do từ chối để thông báo cho tác giả{' '}
                <strong className="text-slate-900">{modal.post.author}</strong> chỉnh sửa lại bài
                viết.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ví dụ: Nội dung chưa đủ chiều sâu, thiếu nguồn tham khảo đáng tin cậy..."
                  className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none resize-none focus:border-red-400"
                  style={{ borderColor: 'var(--border)' }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Nội dung không phù hợp',
                  'Thiếu nguồn tham khảo',
                  'Vi phạm quy định',
                  'Cần chỉnh sửa thêm',
                ].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRejectReason(r)}
                    className="text-xs px-3 py-1.5 rounded-full border hover:bg-slate-50 text-slate-600 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl"
              style={{ borderColor: 'var(--border)' }}
            >
              <button
                onClick={() => setModal({ type: null, post: null })}
                className="px-4 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-white transition-colors"
                style={{ borderColor: 'var(--border)' }}
              >
                Hủy
              </button>
              <button
                onClick={reject}
                disabled={!rejectReason.trim()}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <XCircle size={14} />
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
