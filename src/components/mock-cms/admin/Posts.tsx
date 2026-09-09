'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  EyeOff,
  Globe,
  Image as ImageIcon,
  Plus,
  Search,
  Send,
  Trash2,
} from 'lucide-react';

import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import { postService } from '@/services/post.service';
import type { PostStatus, ResPostListDTO } from '@/types/post.type';

const STATUS_OPTIONS: Array<{ value: PostStatus | ''; label: string }> = [
  { value: '', label: 'Tất cả' },
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Bị từ chối' },
  { value: 'PUBLISHED', label: 'Đã xuất bản' },
  { value: 'UNPUBLISHED', label: 'Ngừng xuất bản' },
  { value: 'DELETED', label: 'Đã xóa' },
];

const STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Bản nháp', className: 'bg-slate-100 text-slate-600' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
  PUBLISHED: { label: 'Đã xuất bản', className: 'bg-blue-100 text-blue-700' },
  UNPUBLISHED: { label: 'Ngừng xuất bản', className: 'bg-orange-100 text-orange-700' },
  DELETED: { label: 'Đã xóa', className: 'bg-slate-800 text-white' },
};

export default function Posts() {
  const navigate = useNavigate();
  const requestId = useRef(0);

  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<PostStatus | ''>('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [deletePost, setDeletePost] = useState<ResPostListDTO | null>(null);

  const fetchPosts = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await postService.getPosts(
        {
          keyword: search.trim() || undefined,
          status,
        },
        page,
        pageSize
      );

      if (currentRequest !== requestId.current) return;

      const pages = response.meta?.pages || 0;
      if (pages > 0 && page > pages) {
        setPage(pages);
        return;
      }

      setPosts(response.result || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(pages);
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setPosts([]);
      setTotal(0);
      setTotalPages(0);
      setErrorMessage(error instanceof Error ? error.message : 'Không thể tải danh sách bài viết.');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(fetchPosts, 350);
    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deletePost || busy) return;

    setBusy(true);
    try {
      await postService.deletePost(deletePost.id);
      setDeletePost(null);
      if (posts.length === 1 && page > 1) setPage((current) => current - 1);
      else await fetchPosts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Không thể xóa bài viết.');
    } finally {
      setBusy(false);
    }
  };

  const handleAction = async (
    post: ResPostListDTO,
    action: 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED'
  ) => {
    if (busy) return;

    const message =
      action === 'PENDING'
        ? 'Gửi bài viết này đi kiểm duyệt?'
        : action === 'PUBLISHED'
          ? 'Xuất bản bài viết này?'
          : 'Ngừng xuất bản bài viết này?';

    if (!window.confirm(message)) return;

    setBusy(true);
    setErrorMessage('');
    try {
      if (action === 'UNPUBLISHED') {
        await postService.reviewPost(post.id, {
          action: 'UNPUBLISHED',
          comment: 'Ngừng xuất bản từ trang quản lý bài viết',
        });
      } else {
        await postService.changeStatus(post.id, action);
      }
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Không thể thay đổi trạng thái bài viết.'
      );
    } finally {
      setBusy(false);
    }
  };

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="p-6 relative">
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 flex justify-between gap-4"
        >
          <span>{errorMessage}</span>
          <button className="underline font-medium shrink-0" onClick={fetchPosts}>
            Tải lại
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} bài viết phù hợp bộ lọc</p>
        </div>
        <button
          onClick={() => navigate('/admin/bai-viet/tao-moi')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 shadow-sm transition-opacity"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} /> Tạo bài viết
        </button>
      </div>

      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 min-w-56 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tiêu đề, slug hoặc tóm tắt..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value || 'ALL'}
              type="button"
              onClick={() => {
                setStatus(option.value);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                status === option.value ? 'text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
              style={status === option.value ? { background: 'var(--primary)' } : undefined}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="bg-white rounded-xl border overflow-hidden shadow-sm"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-fixed min-w-[980px]">
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
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => {
                  const statusConfig = STATUS_CONFIG[post.status];
                  return (
                    <tr
                      key={post.id}
                      className="border-t hover:bg-slate-50 transition-colors"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <td className="px-5 py-4">
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
                          <div className="min-w-0 flex-1">
                            <div
                              className="font-semibold text-slate-800 truncate"
                              title={post.title}
                            >
                              {post.title}
                            </div>
                            <div
                              className="text-xs text-slate-400 mt-1 truncate"
                              title={post.summary || ''}
                            >
                              {post.summary || 'Không có tóm tắt'}
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
                        {post.author?.name || 'System'}
                      </td>
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        <div>
                          <span
                            className={
                              post.publishedAt
                                ? 'font-semibold text-slate-700'
                                : 'text-slate-400 italic'
                            }
                          >
                            {post.publishedAt
                              ? `Xuất bản: ${formatDate(post.publishedAt)}`
                              : 'Chưa xuất bản'}
                          </span>
                          <span className="block text-[11px] text-slate-400 mt-0.5">
                            Tạo: {post.createdAt ? formatDate(post.createdAt) : '---'}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${statusConfig.className}`}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {(post.status === 'DRAFT' || post.status === 'REJECTED') && (
                            <button
                              disabled={busy}
                              title="Gửi duyệt"
                              onClick={() => handleAction(post, 'PENDING')}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                            >
                              <Send size={16} />
                            </button>
                          )}
                          {post.status === 'APPROVED' && (
                            <button
                              disabled={busy}
                              title="Xuất bản"
                              onClick={() => handleAction(post, 'PUBLISHED')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                            >
                              <Globe size={16} />
                            </button>
                          )}
                          {post.status === 'PUBLISHED' && (
                            <button
                              disabled={busy}
                              title="Ngừng xuất bản"
                              onClick={() => handleAction(post, 'UNPUBLISHED')}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-50"
                            >
                              <EyeOff size={16} />
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
                    Không tìm thấy bài viết nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && total > 0 && (
          <div
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t bg-slate-50"
            style={{ borderColor: 'var(--border)' }}
          >
            <div className="text-xs text-slate-500">
              Hiển thị <span className="font-semibold text-slate-700">{from}</span> -{' '}
              <span className="font-semibold text-slate-700">{to}</span> trong{' '}
              <span className="font-semibold text-slate-700">{total}</span> bài viết
            </div>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        )}
      </div>

      {deletePost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDeletePost(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
            onClick={(event) => event.stopPropagation()}
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
                disabled={busy}
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 shadow-sm transition-colors w-full disabled:opacity-50"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total <= 1) return null;
  const items = paginationItems(current, total);

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="p-1.5 rounded-lg border text-slate-500 hover:bg-white hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-400">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-colors ${
              current === item
                ? 'text-white border-transparent'
                : 'text-slate-600 bg-white hover:text-blue-600'
            }`}
            style={
              current === item ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }
            }
            aria-current={current === item ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current >= total}
        className="p-1.5 rounded-lg border text-slate-500 hover:bg-white hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function paginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push('ellipsis');
  for (let value = start; value <= end; value += 1) items.push(value);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}

function formatDate(value: string) {
  return value.slice(0, 10).split('-').reverse().join('/');
}
