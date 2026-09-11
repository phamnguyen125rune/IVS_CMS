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
      className="overflow-hidden rounded-xl border shadow-sm"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] table-fixed text-sm">
          <thead>
            <tr
              className="border-b"
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
              }}
            >
              <th className="w-[35%] px-5 py-3 text-left text-xs font-semibold uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Bài viết
              </th>

              <th className="w-[15%] px-5 py-3 text-left text-xs font-semibold uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Danh mục
              </th>

              <th className="w-[15%] px-5 py-3 text-left text-xs font-semibold uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Tác giả
              </th>

              <th className="w-[15%] px-5 py-3 text-left text-xs font-semibold uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Thời gian
              </th>

              <th className="w-[10%] px-5 py-3 text-left text-xs font-semibold uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Trạng thái
              </th>

              <th className="w-[10%] px-5 py-3 text-right text-xs font-semibold uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-16 text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  <div
                    className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                    style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }}
                  />
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : posts.length > 0 ? (
              posts.map((post) => {
                const statusConfig = POST_STATUS_CONFIG[post.status];

                return (
                  <tr
                    key={post.id}
                    className="border-t transition-colors hover:bg-[var(--hover)]"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    {/* ================= BÀI VIẾT ================= */}
                    <td className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {post.featuredMedia ? (
                          <img
                            src={post.featuredMedia}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg border object-cover"
                            style={{ borderColor: 'var(--border)' }}
                          />
                        ) : (
                          <div
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border"
                            style={{
                              background: 'var(--surface-tertiary)',
                              borderColor: 'var(--border)',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <ImageIcon size={18} />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div
                            className="truncate font-semibold"
                            style={{ color: 'var(--text)' }}
                            title={post.title}
                          >
                            {post.title}
                          </div>

                          <div
                            className="mt-0.5 truncate text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {post.summary || 'Chưa có tóm tắt'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* ================= DANH MỤC ================= */}
                    <td className="truncate px-5 py-4">
                      <span
                        className="rounded-full border px-2.5 py-1 text-xs font-medium"
                        style={{
                          background: 'var(--surface-tertiary)',
                          color: 'var(--text-secondary)',
                          borderColor: 'var(--border)',
                        }}
                      >
                        {post.category?.name || 'Chung'}
                      </span>
                    </td>

                    {/* ================= TÁC GIẢ ================= */}
                    <td
                      className="truncate px-5 py-4 text-xs font-medium"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {post.author?.name || 'System'}
                    </td>

                    {/* ================= THỜI GIAN ================= */}
                    <td className="whitespace-nowrap px-5 py-4 text-xs">
                      <div>
                        <span
                          className={
                            post.publishedAt
                              ? 'font-semibold'
                              : 'italic'
                          }
                          style={{
                            color: post.publishedAt
                              ? 'var(--text-secondary)'
                              : 'var(--text-muted)',
                          }}
                        >
                          {post.publishedAt
                            ? `Xuất bản: ${formatPostDate(post.publishedAt)}`
                            : 'Chưa xuất bản'}
                        </span>

                        <span
                          className="mt-0.5 block text-[11px]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          Tạo:{' '}
                          {post.createdAt
                            ? formatPostDate(post.createdAt)
                            : '---'}
                        </span>
                      </div>
                    </td>

                    {/* ================= TRẠNG THÁI ================= */}
                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusConfig.className}`}
                      >
                        {statusConfig.label}
                      </span>
                    </td>

                    {/* ================= THAO TÁC ================= */}
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        {(
                          post.status === 'DRAFT' ||
                          post.status === 'REJECTED'
                        ) && (
                          <button
                            disabled={busy}
                            title="Gửi duyệt"
                            onClick={() => onAction(post, 'PENDING')}
                            className="rounded-lg p-1.5 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--primary)' }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background =
                                'var(--primary-light)';
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background =
                                'transparent';
                            }}
                          >
                            <Send size={16} />
                          </button>
                        )}

                        {post.status === 'APPROVED' && (
                          <button
                            disabled={busy}
                            title="Xuất bản"
                            onClick={() => onAction(post, 'PUBLISHED')}
                            className="rounded-lg p-1.5 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--success)' }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background =
                                'var(--success-light)';
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background =
                                'transparent';
                            }}
                          >
                            <Globe size={16} />
                          </button>
                        )}

                        {post.status === 'PUBLISHED' && (
                          <button
                            disabled={busy}
                            title="Ngừng xuất bản"
                            onClick={() => onAction(post, 'UNPUBLISHED')}
                            className="rounded-lg p-1.5 transition-colors disabled:opacity-50"
                            style={{ color: 'var(--warning)' }}
                            onMouseEnter={(event) => {
                              event.currentTarget.style.background =
                                'var(--warning-light)';
                            }}
                            onMouseLeave={(event) => {
                              event.currentTarget.style.background =
                                'transparent';
                            }}
                          >
                            <EyeOff size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => onEdit(post)}
                          className="rounded-lg p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          title="Chỉnh sửa"
                          onMouseEnter={(event) => {
                            event.currentTarget.style.color =
                              'var(--primary)';
                            event.currentTarget.style.background =
                              'var(--primary-light)';
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.color =
                              'var(--text-muted)';
                            event.currentTarget.style.background =
                              'transparent';
                          }}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => onDelete(post)}
                          className="rounded-lg p-1.5 transition-colors"
                          style={{ color: 'var(--text-muted)' }}
                          title="Xóa bài viết"
                          onMouseEnter={(event) => {
                            event.currentTarget.style.color =
                              'var(--error)';
                            event.currentTarget.style.background =
                              'var(--error-light)';
                          }}
                          onMouseLeave={(event) => {
                            event.currentTarget.style.color =
                              'var(--text-muted)';
                            event.currentTarget.style.background =
                              'transparent';
                          }}
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
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Không tìm thấy bài viết nào phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && total > 0 && (
        <div
          className="flex flex-col justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center"
          style={{
            background: 'var(--surface-secondary)',
            borderColor: 'var(--border)',
          }}
        >
          <div
            className="text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            Hiển thị{' '}
            <span
              className="font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {from}
            </span>{' '}
            -{' '}
            <span
              className="font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {to}
            </span>{' '}
            trong{' '}
            <span
              className="font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {total}
            </span>{' '}
            bài viết
          </div>

          <PostPagination
            current={page}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}