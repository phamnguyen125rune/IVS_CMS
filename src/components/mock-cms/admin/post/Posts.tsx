'use client';

/* eslint-disable @typescript-eslint/no-unused-vars, react/no-unescaped-entities */

import { useState } from 'react';
import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckSquare,
  X,
  Eye as EyeIcon,
  Monitor,
  Smartphone,
  ArrowLeft,
  Share2,
  Bookmark,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';

// Dữ liệu mẫu (Giữ nguyên)
const initialPosts = [
  {
    id: 1,
    title: 'Xu hướng công nghệ AI trong năm 2024',
    category: 'Công nghệ',
    author: 'Nguyễn Thị Hoa',
    status: 'published',
    views: 4521,
    date: '10/07/2024',
  },
  {
    id: 2,
    title: 'Hướng dẫn toàn diện về phát triển ứng dụng mobile',
    category: 'Kiến thức',
    author: 'Trần Văn Minh',
    status: 'pending',
    views: 2134,
    date: '11/07/2024',
  },
  {
    id: 3,
    title: 'CMS mở rộng văn phòng tại Hà Nội',
    category: 'Tin tức',
    author: 'Lê Thị Lan',
    status: 'published',
    views: 8765,
    date: '09/07/2024',
  },
  {
    id: 4,
    title: 'Chiến lược SEO hiệu quả cho doanh nghiệp nhỏ',
    category: 'Marketing',
    author: 'Phạm Quốc Bảo',
    status: 'draft',
    views: 0,
    date: '12/07/2024',
  },
  {
    id: 5,
    title: 'Case study: Chuyển đổi số thành công của TechViet',
    category: 'Case Study',
    author: 'Vũ Thị Thu',
    status: 'published',
    views: 6543,
    date: '08/07/2024',
  },
  {
    id: 6,
    title: 'Kiến trúc microservices và lợi ích cho doanh nghiệp',
    category: 'Kiến thức',
    author: 'Hoàng Minh Tuấn',
    status: 'pending',
    views: 1890,
    date: '13/07/2024',
  },
  {
    id: 7,
    title: 'Top 10 framework frontend phổ biến nhất 2024',
    category: 'Công nghệ',
    author: 'Ngô Thị Thu',
    status: 'published',
    views: 9234,
    date: '07/07/2024',
  },
  {
    id: 8,
    title: 'Bảo mật thông tin doanh nghiệp trong thời đại số',
    category: 'Bảo mật',
    author: 'Đặng Quốc Huy',
    status: 'draft',
    views: 0,
    date: '14/07/2024',
  },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  published: {
    label: 'Đã xuất bản',
    className: 'bg-emerald-100 text-emerald-700',
  },
  pending: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  draft: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-600' },
};

export default function Posts() {
  const navigate = useNavigate();
  const [postList, setPostList] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // State cho Modals
  const [viewPost, setViewPost] = useState<(typeof initialPosts)[0] | null>(null);
  const [deletePost, setDeletePost] = useState<(typeof initialPosts)[0] | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const isDesktop = previewMode === 'desktop';

  // Lọc dữ liệu
  const filtered = postList.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'Tất cả' ||
      (statusFilter === 'Đã xuất bản'
        ? p.status === 'published'
        : statusFilter === 'Chờ duyệt'
          ? p.status === 'pending'
          : p.status === 'draft');
    return matchSearch && matchStatus;
  });

  // Xử lý Xóa
  const handleDelete = () => {
    if (deletePost) {
      setPostList(postList.filter((p) => p.id !== deletePost.id));
      setDeletePost(null);
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filtered.length} bài viết</p>
        </div>
        <button
          onClick={() => navigate('/admin/bai-viet/tao-moi')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} /> Tạo bài viết mới
        </button>
      </div>

      {/* Filter bar */}
      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex gap-1">
          {['Tất cả', 'Đã xuất bản', 'Chờ duyệt', 'Bản nháp'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === s ? 'text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
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
                Tiêu đề
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Danh mục
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Tác giả
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Trạng thái
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Lượt xem
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Ngày
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((post) => {
                const sc = statusConfig[post.status];
                return (
                  <tr
                    key={post.id}
                    className="border-t hover:bg-slate-50 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div
                        className="font-medium text-slate-800 max-w-xs truncate cursor-pointer hover:text-blue-600 transition-colors"
                        title={post.title}
                        onClick={() => setViewPost(post)}
                      >
                        {post.title}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs whitespace-nowrap">
                      {post.author}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${sc.className}`}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">
                      {post.views.toLocaleString('vi-VN')}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-400 whitespace-nowrap">
                      {post.date}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === 'pending' && (
                          <button
                            onClick={() => navigate(`/admin/kiem-duyet?id=${post.id}`)}
                            title="Đưa tới trang Kiểm duyệt"
                            className="p-1.5 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                          >
                            <CheckSquare size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => setViewPost(post)}
                          title="Xem trước (Khách hàng)"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        {/* THAY ĐỔI: Chuyển hướng trang sửa thay vì bật Modal */}
                        <button
                          onClick={() => navigate(`/admin/bai-viet/sua/${post.id}`)}
                          title="Chỉnh sửa chi tiết"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeletePost(post)}
                          title="Xóa bài viết"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
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
                <td colSpan={7} className="px-5 py-10 text-center text-slate-500 text-sm">
                  Không tìm thấy bài viết nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: CHẾ ĐỘ XEM TRƯỚC (Rút gọn cho ví dụ) */}
      {viewPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm sm:p-6"
          onClick={() => setViewPost(null)}
        >
          <div
            className="bg-slate-100 sm:rounded-2xl shadow-2xl w-full max-w-[1400px] flex flex-col h-full sm:max-h-[95vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-white border-b">
              <h3 className="font-bold">Đang xem trước: {viewPost.title}</h3>
              <button
                onClick={() => setViewPost(null)}
                className="p-1.5 bg-slate-100 rounded-full hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto w-full p-8 bg-white flex flex-col items-center">
              <h1 className="text-3xl font-bold mb-4">{viewPost.title}</h1>
              <p>Nội dung bài viết mẫu hiển thị tại đây...</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Xác nhận Xóa */}
      {deletePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDeletePost(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">Xóa bài viết?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài viết "{deletePost.title}"?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeletePost(null)}
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
