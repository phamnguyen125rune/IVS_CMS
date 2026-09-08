'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, ChevronLeft, ChevronRight, Globe } from 'lucide-react';

import { postService } from '@/services/post.service';
import { ResPostListDTO, PostStatus } from '@/types/post.type';

const statusMap: Record<string, PostStatus | ''> = {
  'Tất cả': '',
  'Đã xuất bản': 'PUBLISHED',
  'Đã duyệt': 'APPROVED',
  'Chờ duyệt': 'PENDING',
  'Bản nháp': 'DRAFT',
  'Từ chối': 'REJECTED',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-700' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  DRAFT: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-600' },
  REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
  DELETED: { label: 'Đã xóa', className: 'bg-slate-800 text-white' },
};

export default function Posts() {
  const navigate = useNavigate();
  const [postList, setPostList] = useState<ResPostListDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Params Server-side
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal State
  const [deletePost, setDeletePost] = useState<ResPostListDTO | null>(null);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await postService.getPosts(
        {
          keyword: search,
          status: statusMap[statusFilter],
        },
        page,
        pageSize
      );
      setPostList(res.result || []);
      setTotal(res.meta?.total || 0);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
      setPostList([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, pageSize]);

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchPosts]);

  // Xử lý Xóa bài viết
  const handleDelete = async () => {
    if (deletePost) {
      try {
        await postService.deletePost(deletePost.id);
        fetchPosts();
      } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
      } finally {
        setDeletePost(null);
      }
    }
  };

  // FIX: Trả lại API changeStatus cho đúng quyền hạn của Tác giả.
  // Nhớ sửa Backend để không chặn thao tác này nếu bài đã ở trạng thái APPROVED.
  const handlePublish = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xuất bản bài viết này lên hệ thống ngay bây giờ?')) {
      try {
        await postService.changeStatus(id, 'PUBLISHED');
        fetchPosts();
      } catch (error: any) {
        alert(error.message || 'Lỗi khi đăng bài');
      }
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">Tổng cộng {total} bài viết</p>
        </div>
        <button
          onClick={() => navigate('/admin/bai-viet/tao-moi')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 shadow-sm transition-opacity"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} /> Tạo bài viết
        </button>
      </div>

      {/* SEARCH + FILTER STATUS */}
      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Tìm kiếm theo tiêu đề..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.keys(statusMap).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              style={statusFilter === s ? { background: 'var(--primary)' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div
        className="bg-white rounded-xl border overflow-hidden shadow-sm"
        style={{ borderColor: 'var(--border)' }}
      >
        <table className="w-full text-sm table-fixed">
          <thead>
            <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-[35%]">
                Bài viết
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-[15%]">
                Danh mục
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-[15%]">
                Tác giả
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-[15%]">
                Thời gian
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-[10%]">
                Trạng thái
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase w-[10%]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center text-slate-500">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : postList.length > 0 ? (
              postList.map((post) => {
                const sc = statusConfig[post.status] || {
                  label: post.status,
                  className: 'bg-slate-100 text-slate-700',
                };
                return (
                  <tr
                    key={post.id}
                    className="border-t hover:bg-slate-50 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-4 w-full">
                      <div className="flex items-center gap-3">
                        {post.featuredMedia ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={post.featuredMedia}
                            alt={post.title}
                            className="w-16 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                        ) : (
                          <div className="w-16 h-12 rounded-lg bg-slate-100 shrink-0 border border-slate-200 border-dashed flex items-center justify-center">
                            <ImageIcon size={16} className="text-slate-300" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1 overflow-hidden">
                          <div className="font-semibold text-slate-800 truncate block" title={post.title}>
                            {post.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 truncate block" title={post.summary}>
                            {post.summary || 'Không có mô tả'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 truncate">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">
                        {post.category?.name || 'Chung'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-medium text-xs truncate">
                      {post.author?.name || 'Admin System'}
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      {post.publishedAt ? (
                        <div>
                          <span className="font-semibold text-slate-700">
                            {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">
                            Tạo: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : '---'}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-400 italic">Chưa xuất bản</span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">
                            Tạo: {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : '---'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${sc.className}`}
                      >
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {post.status === 'APPROVED' && (
                          <button
                            onClick={() => handlePublish(post.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Xuất bản (Đăng bài ngay)"
                          >
                            <Globe size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => navigate(`/admin/bai-viet/sua/${post.id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => setDeletePost(post)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Xóa bài viết"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                  Không tìm thấy bài viết nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PAGINATION INFO */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t bg-slate-50" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs text-slate-500">
              Hiển thị <span className="font-semibold text-slate-700">{Math.min((page - 1) * pageSize + 1, total)}</span> - <span className="font-semibold text-slate-700">{Math.min(page * pageSize, total)}</span> trong <span className="font-semibold text-slate-700">{total}</span> bài viết
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border text-slate-500 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
                style={{ borderColor: 'var(--border)' }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs font-medium text-slate-600 px-2">Trang {page} / {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                className="p-1.5 rounded-lg border text-slate-500 hover:bg-white hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-transparent"
                style={{ borderColor: 'var(--border)' }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DELETE */}
      {deletePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDeletePost(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="font-display font-bold text-slate-900 text-lg mb-2">Xóa bài viết?</h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn xóa bài viết <br />
              <span className="font-semibold text-slate-900">&quot;{deletePost.title}&quot;</span>?
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
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/30 transition-colors w-full"
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