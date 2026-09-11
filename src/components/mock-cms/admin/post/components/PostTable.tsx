/* eslint-disable @next/next/no-img-element */

import { Edit, EyeOff, Globe, Image as ImageIcon, Send, Trash2 } from 'lucide-react';

import type { ResPostListDTO } from '@/types/post.type';
import { formatPostDate } from '@/utils/post-view';

import { POST_STATUS_CONFIG } from '../post.constants';
import PostPagination from './PostPagination';

interface PostTableProps {
  posts: ResPostListDTO[];
  loading: boolean;
  busy: boolean;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (post: ResPostListDTO) => void;
  onDelete: (post: ResPostListDTO) => void;
  onAction: (post: ResPostListDTO, action: 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED') => void;
}

export default function PostTable({
  posts,
  loading,
  busy,
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onAction,
}: PostTableProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
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
                const statusConfig = POST_STATUS_CONFIG[post.status];
                return (
                  <tr
                    key={post.id}
                    className="border-t hover:bg-slate-50 transition-colors"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {post.featuredMedia ? (
                          <img
                            src={post.featuredMedia}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                            <ImageIcon size={18} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate" title={post.title}>
                            {post.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate mt-0.5">
                            {post.summary || 'Chưa có tóm tắt'}
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
                            ? `Xuất bản: ${formatPostDate(post.publishedAt)}`
                            : 'Chưa xuất bản'}
                        </span>
                        <span className="block text-[11px] text-slate-400 mt-0.5">
                          Tạo: {post.createdAt ? formatPostDate(post.createdAt) : '---'}
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
                            onClick={() => onAction(post, 'PENDING')}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        {post.status === 'APPROVED' && (
                          <button
                            disabled={busy}
                            title="Xuất bản"
                            onClick={() => onAction(post, 'PUBLISHED')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg disabled:opacity-50"
                          >
                            <Globe size={16} />
                          </button>
                        )}
                        {post.status === 'PUBLISHED' && (
                          <button
                            disabled={busy}
                            title="Ngừng xuất bản"
                            onClick={() => onAction(post, 'UNPUBLISHED')}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg disabled:opacity-50"
                          >
                            <EyeOff size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(post)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(post)}
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
          <PostPagination current={page} total={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
