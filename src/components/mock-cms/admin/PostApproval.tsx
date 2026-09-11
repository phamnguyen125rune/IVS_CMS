'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Eye,
  Globe,
  Search,
  Share2,
  X,
  XCircle,
} from 'lucide-react';

import { postService } from '@/services/post.service';
import type { ResPostDTO, ResPostListDTO } from '@/types/post.type';

type ModalType = 'preview' | 'reject' | null;
type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

const APPROVAL_STATUS_OPTIONS: Array<{ value: ApprovalStatus; label: string }> = [
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Bị từ chối' },
];

const statusConfig: Record<
  ApprovalStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: 'Chờ duyệt',
    className:
      'bg-[var(--warning-light)] text-[var(--warning)]',
  },
  APPROVED: {
    label: 'Đã duyệt',
    className:
      'bg-[var(--success-light)] text-[var(--success)]',
  },
  REJECTED: {
    label: 'Bị từ chối',
    className:
      'bg-[var(--error-light)] text-[var(--error)]',
  },
};

export default function PostApproval() {
  const requestId = useRef(0);

  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [activeStatus, setActiveStatus] =
    useState<ApprovalStatus>('PENDING');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [modal, setModal] = useState<{
    type: ModalType;
    post: ResPostDTO | ResPostListDTO | null;
  }>({ type: null, post: null });

  const [previewLoading, setPreviewLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3000);
  };

  const fetchPosts = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await postService.getPosts(
        {
          status: activeStatus,
          keyword: search.trim() || undefined,
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
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Không thể tải danh sách kiểm duyệt.'
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, [activeStatus, page, search]);

  useEffect(() => {
    const timer = window.setTimeout(fetchPosts, 350);

    return () => window.clearTimeout(timer);
  }, [fetchPosts]);

  const handleOpenPreview = async (postItem: ResPostListDTO) => {
    setModal({ type: 'preview', post: postItem });
    setPreviewLoading(true);

    try {
      const detailPost = await postService.getPostById(postItem.id);
      setModal({ type: 'preview', post: detailPost });
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Không thể tải chi tiết bài viết.',
        'error'
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const approve = async (id: number) => {
    try {
      await postService.reviewPost(id, {
        action: 'APPROVED',
        comment: 'Bài viết đã được duyệt',
      });

      setModal({ type: null, post: null });

      showToast('Bài viết đã được duyệt.', 'success');

      if (posts.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchPosts();
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Không thể duyệt bài viết.',
        'error'
      );
    }
  };

  const reject = async () => {
    if (!modal.post || !rejectReason.trim()) return;

    try {
      await postService.reviewPost(modal.post.id, {
        action: 'REJECTED',
        comment: rejectReason.trim(),
      });

      setModal({ type: null, post: null });
      setRejectReason('');

      showToast('Bài viết đã bị từ chối.', 'success');

      if (posts.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await fetchPosts();
      }
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : 'Không thể từ chối bài viết.',
        'error'
      );
    }
  };

  const pageTitle =
    activeStatus === 'PENDING'
      ? 'Bài viết chờ duyệt'
      : activeStatus === 'APPROVED'
        ? 'Bài viết đã duyệt'
        : 'Bài viết bị từ chối';

  const from =
    total === 0 ? 0 : (page - 1) * pageSize + 1;

  const to = Math.min(page * pageSize, total);

  return (
    <div
      className="relative p-6"
      style={{ color: 'var(--text)' }}
    >
      {/* ================= TOAST ================= */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-xl ${
            toast.type === 'success'
              ? 'bg-[var(--success)]'
              : 'bg-[var(--error)]'
          }`}
          style={{ color: 'var(--primary-foreground)' }}
        >
          {toast.type === 'success' ? (
            <CheckCircle size={16} />
          ) : (
            <XCircle size={16} />
          )}

          {toast.message}
        </div>
      )}

      {/* ================= ERROR ================= */}
      {errorMessage && (
        <div
          role="alert"
          className="mb-4 flex justify-between gap-4 rounded-xl p-4 text-sm"
          style={{
            background: 'var(--error-light)',
            color: 'var(--error)',
          }}
        >
          <span>{errorMessage}</span>

          <button
            className="shrink-0 font-medium underline"
            onClick={fetchPosts}
          >
            Tải lại
          </button>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="font-display text-xl font-bold"
            style={{ color: 'var(--text)' }}
          >
            {pageTitle}
          </h1>

          <p
            className="mt-0.5 text-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            {total} bài viết phù hợp bộ lọc
          </p>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div
        className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border p-4"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="relative min-w-56 flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-placeholder)' }}
          />

          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Tìm theo tiêu đề, slug hoặc tóm tắt..."
            className="
              w-full rounded-lg border
              py-2 pl-9 pr-3 text-sm outline-none
              focus:border-[var(--primary)]
            "
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {APPROVAL_STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setActiveStatus(option.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                activeStatus === option.value
                  ? ''
                  : 'hover:bg-[var(--hover)]'
              }`}
              style={
                activeStatus === option.value
                  ? {
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }
                  : {
                      color: 'var(--text-muted)',
                    }
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div
        className="overflow-hidden rounded-xl border"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr
                className="border-b"
                style={{
                  background: 'var(--surface-secondary)',
                  borderColor: 'var(--border)',
                }}
              >
                <th
                  className="px-5 py-3 text-left text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Tiêu đề
                </th>

                <th
                  className="px-5 py-3 text-left text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Danh mục
                </th>

                <th
                  className="px-5 py-3 text-left text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Tác giả
                </th>

                <th
                  className="px-5 py-3 text-left text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Ngày tạo
                </th>

                <th
                  className="px-5 py-3 text-left text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Trạng thái
                </th>

                <th
                  className="px-5 py-3 text-right text-xs font-semibold uppercase"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <div
                      className="
                        mx-auto mb-3 h-8 w-8 animate-spin
                        rounded-full border-4
                        border-[var(--primary)]
                        border-t-transparent
                      "
                    />

                    Đang tải...
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => {
                  const currentStatus =
                    post.status as ApprovalStatus;

                  const currentStatusConfig =
                    statusConfig[currentStatus];

                  return (
                    <tr
                      key={post.id}
                      className="border-t hover:bg-[var(--hover)]"
                      style={{
                        borderColor: 'var(--border)',
                      }}
                    >
                      {/* TITLE */}
                      <td className="px-5 py-3.5">
                        <div
                          className="max-w-sm truncate font-medium"
                          style={{ color: 'var(--text)' }}
                        >
                          {post.title}
                        </div>

                        <div
                          className="mt-1 max-w-sm truncate text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {post.summary || 'Không có tóm tắt'}
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-5 py-3.5">
                        <span
                          className="
                            rounded-full px-2.5 py-1 text-xs
                          "
                          style={{
                            background: 'var(--surface-tertiary)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {post.category?.name || 'Không có'}
                        </span>
                      </td>

                      {/* AUTHOR */}
                      <td
                        className="px-5 py-3.5 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {post.author?.name || 'System'}
                      </td>

                      {/* CREATED DATE */}
                      <td
                        className="px-5 py-3.5 text-xs"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {post.createdAt
                          ? formatDate(post.createdAt)
                          : '---'}
                      </td>

                      {/* STATUS */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${currentStatusConfig.className}`}
                        >
                          {currentStatusConfig.label}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              handleOpenPreview(post)
                            }
                            className="
                              rounded-lg p-1.5
                              transition-colors
                              hover:text-[var(--primary)]
                            "
                            style={{
                              color: 'var(--text-muted)',
                            }}
                            title="Xem trước"
                          >
                            <Eye size={14} />
                          </button>

                          {currentStatus === 'PENDING' && (
                            <>
                              <button
                                onClick={() =>
                                  approve(post.id)
                                }
                                className="
                                  rounded-lg p-1.5
                                  transition-colors
                                  hover:text-[var(--success)]
                                "
                                style={{
                                  color: 'var(--text-muted)',
                                }}
                                title="Duyệt bài"
                              >
                                <CheckCircle size={14} />
                              </button>

                              <button
                                onClick={() => {
                                  setModal({
                                    type: 'reject',
                                    post,
                                  });
                                  setRejectReason('');
                                }}
                                className="
                                  rounded-lg p-1.5
                                  transition-colors
                                  hover:text-[var(--error)]
                                "
                                style={{
                                  color: 'var(--text-muted)',
                                }}
                                title="Từ chối"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
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
                    Không có bài viết ở trạng thái này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}
        {!loading && total > 0 && (
          <div
            className="
              flex flex-col justify-between gap-3
              border-t px-5 py-4
              sm:flex-row sm:items-center
            "
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

            <Pagination
              current={page}
              total={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </div>

      {/* =========================================================
          MODAL 1: PREVIEW
          ========================================================= */}
      {modal.type === 'preview' && modal.post && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/70 p-4 backdrop-blur-sm
            sm:p-6
          "
          onClick={() =>
            setModal({
              type: null,
              post: null,
            })
          }
        >
          <div
            className="
              flex h-full max-h-[92vh]
              w-full max-w-[1400px]
              flex-col overflow-hidden
              rounded-2xl shadow-2xl
            "
            style={{
              background: 'var(--surface-tertiary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ================= PREVIEW HEADER ================= */}
            <div
              className="
                z-10 flex shrink-0
                items-center justify-between
                border-b px-6 py-3
                shadow-sm
              "
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="
                    flex items-center gap-1.5
                    rounded px-2.5 py-1.5
                    text-xs font-semibold
                  "
                  style={{
                    background: 'var(--warning-light)',
                    color: 'var(--warning)',
                  }}
                >
                  <Clock size={14} />

                  <span>
                    {statusConfig[
                      (modal.post.status as ApprovalStatus) ||
                        'PENDING'
                    ]?.label || 'Đang kiểm duyệt'}
                  </span>
                </span>

                <span
                  className="
                    border-l pl-3
                    text-xs font-medium
                  "
                  style={{
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border)',
                  }}
                >
                  Chế độ xem trước (Giao diện Desktop)
                </span>
              </div>

              <button
                onClick={() =>
                  setModal({
                    type: null,
                    post: null,
                  })
                }
                className="
                  rounded-full p-1.5
                  transition-colors
                  hover:bg-[var(--hover)]
                "
                style={{
                  color: 'var(--text-muted)',
                  background: 'var(--surface-tertiary)',
                }}
                title="Đóng xem trước"
              >
                <X size={18} />
              </button>
            </div>

            {/* ================= PREVIEW CONTENT ================= */}
            <div
              className="
                flex w-full flex-1
                justify-center
                overflow-y-auto
                p-4
                sm:p-6
              "
              style={{
                background: 'var(--surface-tertiary)',
              }}
            >
              <div
                className="
                  flex h-full
                  w-full max-w-[1280px]
                  flex-col overflow-y-auto
                  rounded-xl
                  border
                  shadow-xl
                "
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                }}
              >
                {/* ================= MOCKUP HEADER ================= */}

                <div
                  className="
                    shrink-0
                    border-b
                    select-none
                    pointer-events-none
                  "
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* TOP BAR OF MOCKUP */}
                  <div
                    className="
                      flex items-center
                      justify-end
                      border-b px-6 py-1
                      text-xs
                    "
                    style={{
                      background: '#0f172a',
                      borderColor: '#1e293b',
                      color: '#94a3b8',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="cursor-pointer hover:text-white">
                        <Share2 size={12} />
                      </span>

                      <span className="cursor-pointer hover:text-white">
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>

                  {/* MAIN NAV */}
                  <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="
                          flex h-9 w-9
                          items-center justify-center
                          rounded-xl
                          text-base font-bold text-white
                        "
                        style={{
                          background: 'var(--primary)',
                        }}
                      >
                        C
                      </div>

                      <span
                        className="
                          font-display
                          text-lg font-bold
                        "
                        style={{
                          color: 'var(--text)',
                        }}
                      >
                        CMS
                      </span>
                    </div>

                    <nav className="flex items-center gap-1">
                      {[
                        {
                          label: 'Trang chủ',
                          hasChildren: false,
                          active: false,
                        },
                        {
                          label: 'Giới thiệu',
                          hasChildren: false,
                          active: false,
                        },
                        {
                          label: 'Bài viết',
                          hasChildren: true,
                          active: true,
                        },
                        {
                          label: 'Dự án',
                          hasChildren: true,
                          active: false,
                        },
                        {
                          label: 'Khách hàng',
                          hasChildren: false,
                          active: false,
                        },
                        {
                          label: 'Tuyển dụng',
                          hasChildren: false,
                          active: false,
                        },
                        {
                          label: 'Liên hệ',
                          hasChildren: false,
                          active: false,
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`
                            flex items-center gap-1
                            rounded-lg px-3 py-2
                            text-sm font-medium
                            ${
                              item.active
                                ? 'font-semibold text-blue-600'
                                : 'text-slate-600 hover:text-slate-900'
                            }
                          `}
                        >
                          <span>{item.label}</span>

                          {item.hasChildren && (
                            <ChevronDown
                              size={13}
                              className="text-slate-400"
                            />
                          )}
                        </div>
                      ))}
                    </nav>

                    <div className="flex items-center gap-2">
                      <div
                        className="
                          flex items-center gap-1.5
                          rounded-lg border
                          px-2.5 py-1.5
                          text-xs font-medium
                        "
                        style={{
                          color: '#475569',
                          borderColor: '#e2e8f0',
                          background: '#ffffff',
                        }}
                      >
                        <Globe
                          size={13}
                          className="text-slate-500"
                        />

                        <span>🇻🇳</span>

                        <ChevronDown
                          size={11}
                          className="text-slate-400"
                        />
                      </div>

                      <div
                        className="
                          rounded-lg p-1.5
                          text-slate-500
                          hover:bg-slate-50
                        "
                      >
                        <Search size={17} />
                      </div>

                      <div
                        className="
                          rounded-lg px-4 py-2
                          text-sm font-semibold
                          text-white shadow-sm
                        "
                        style={{
                          background: 'var(--primary)',
                        }}
                      >
                        Liên hệ ngay
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= POST BODY ================= */}
                <div
                  className="
                    mx-auto grid
                    w-full max-w-7xl
                    grid-cols-12
                    gap-10
                    px-8 py-8
                  "
                >
                  {/* MAIN COLUMN */}
                  <div className="col-span-8">
                    <div
                      className="
                        mb-6 flex w-fit
                        cursor-pointer items-center gap-2
                        text-sm
                        hover:text-blue-600
                      "
                      style={{
                        color: '#64748b',
                      }}
                    >
                      <ArrowLeft size={16} />
                      Quay lại danh sách bài viết
                    </div>

                    <div className="mb-4 flex gap-2">
                      {modal.post.category?.name && (
                        <span
                          className="
                            rounded-full
                            bg-blue-600
                            px-3 py-1
                            text-xs font-semibold
                            text-white
                          "
                        >
                          {modal.post.category.name}
                        </span>
                      )}
                    </div>

                    <h1
                      className="
                        mb-6
                        font-display
                        text-[32px]
                        font-bold
                        leading-[1.3]
                      "
                      style={{
                        color: '#0f172a',
                      }}
                    >
                      {modal.post.title}
                    </h1>

                    <div
                      className="
                        mb-6 flex
                        items-center justify-between
                        border-b py-4
                      "
                      style={{
                        borderColor: '#f1f5f9',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-full
                            bg-blue-100
                            text-sm font-bold
                            text-blue-600
                          "
                        >
                          {modal.post.author?.name?.charAt(0) ||
                            'A'}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {modal.post.author?.name ||
                              'Tác giả ẩn danh'}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {modal.post.createdAt
                              ? formatDate(modal.post.createdAt)
                              : 'Vừa xong'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          className="
                            rounded-full border
                            p-2 text-slate-400
                            transition-colors
                            hover:text-slate-600
                          "
                        >
                          <Share2 size={16} />
                        </button>

                        <button
                          className="
                            rounded-full border
                            p-2 text-slate-400
                            transition-colors
                            hover:text-slate-600
                          "
                        >
                          <Bookmark size={16} />
                        </button>
                      </div>
                    </div>

                    {/* FEATURED IMAGE */}
                    {(() => {
                      const imageUrl =
                        'featuredMedia' in modal.post &&
                        modal.post.featuredMedia
                          ? modal.post.featuredMedia
                          : 'mediaList' in modal.post &&
                              modal.post.mediaList?.[0]?.filePath
                            ? modal.post.mediaList[0].filePath
                            : null;

                      return imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          className="
                            mb-8 aspect-[16/9]
                            w-full rounded-2xl
                            bg-slate-100 object-cover
                          "
                          alt={modal.post.title}
                        />
                      ) : null;
                    })()}

                    {/* CONTENT */}
                    <div className="space-y-5 pb-8 text-[16px] text-slate-700 leading-relaxed">
                      {modal.post.summary && (
                        <p className="text-lg font-medium text-slate-900">
                          {modal.post.summary}
                        </p>
                      )}

                      {previewLoading ? (
                        <div className="py-10 text-center text-slate-400">
                          Đang tải toàn bộ nội dung bài viết...
                        </div>
                      ) : 'content' in modal.post &&
                        modal.post.content ? (
                        <div
                          className="
                            prose max-w-none
                            text-slate-800
                            leading-relaxed
                          "
                          dangerouslySetInnerHTML={{
                            __html: modal.post.content,
                          }}
                        />
                      ) : (
                        <p className="italic text-slate-500">
                          Nội dung chi tiết chưa được cung cấp.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ================= SIDEBAR ================= */}
                  <div className="col-span-4 space-y-6">
                    <div
                      className="
                        flex flex-col
                        items-center
                        rounded-2xl
                        border
                        p-6
                        text-center
                        shadow-sm
                      "
                      style={{
                        background: 'var(--surface)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      <div
                        className="
                          mb-3 flex
                          h-16 w-16
                          items-center justify-center
                          rounded-full
                          text-xl font-bold
                        "
                        style={{
                          background: 'var(--primary-light)',
                          color: 'var(--primary)',
                        }}
                      >
                        {modal.post.author?.name?.charAt(0) ||
                          'A'}
                      </div>

                      <h4
                        className="mb-1 text-sm font-bold"
                        style={{
                          color: 'var(--text)',
                        }}
                      >
                        {modal.post.author?.name ||
                          'Tác giả ẩn danh'}
                      </h4>

                      <p
                        className="mb-2 text-xs"
                        style={{
                          color: 'var(--text-muted)',
                        }}
                      >
                        Người đóng góp nội dung
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= PREVIEW FOOTER ================= */}
            <div
              className="
                z-10 flex shrink-0
                items-center justify-end
                gap-3 border-t
                px-6 py-4
                shadow-sm
              "
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
              }}
            >
              {modal.post.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setModal({
                        type: 'reject',
                        post: modal.post,
                      });
                      setRejectReason('');
                    }}
                    className="
                      flex items-center gap-1.5
                      rounded-xl
                      bg-[var(--error)]
                      px-5 py-2.5
                      text-sm font-medium
                      text-[var(--primary-foreground)]
                      shadow-sm
                      hover:opacity-90
                    "
                  >
                    <XCircle size={16} />
                    <span>Từ chối bài viết</span>
                  </button>

                  <button
                    onClick={() =>
                      approve(modal.post!.id)
                    }
                    className="
                      flex items-center gap-1.5
                      rounded-xl
                      bg-[var(--success)]
                      px-5 py-2.5
                      text-sm font-medium
                      text-[var(--primary-foreground)]
                      shadow-sm
                      hover:opacity-90
                    "
                  >
                    <CheckCircle size={16} />
                    <span>Duyệt bài viết</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: REJECT
          ========================================================= */}
      {modal.type === 'reject' && modal.post && (
        <div
          className="
            fixed inset-0 z-[60]
            flex items-center justify-center
            bg-black/40 p-4
            backdrop-blur-sm
          "
          onClick={() =>
            setModal({
              type: null,
              post: null,
            })
          }
        >
          <div
            className="
              w-full max-w-md
              overflow-hidden
              rounded-2xl
              shadow-xl
            "
            style={{
              background: 'var(--surface)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div
              className="
                flex items-center
                justify-between
                border-b
                px-6 py-4
              "
              style={{
                borderColor: 'var(--border)',
              }}
            >
              <h3
                className="text-lg font-bold"
                style={{
                  color: 'var(--text)',
                }}
              >
                Từ chối bài viết
              </h3>

              <button
                onClick={() =>
                  setModal({
                    type: null,
                    post: null,
                  })
                }
                className="transition-colors hover:text-[var(--text)]"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6">
              <p
                className="mb-4 text-sm"
                style={{
                  color: 'var(--text-secondary)',
                }}
              >
                Gửi lý do trả bài cho tác giả{' '}
                <strong style={{ color: 'var(--text)' }}>
                  {modal.post.author?.name}
                </strong>
                .
              </p>

              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) =>
                  setRejectReason(e.target.value)
                }
                placeholder="Nhập lý do chi tiết..."
                className="
                  w-full resize-none
                  rounded-xl border
                  px-3 py-2.5
                  text-sm outline-none
                  focus:border-[var(--error)]
                "
                style={{
                  background: 'var(--surface)',
                  color: 'var(--text)',
                  borderColor: 'var(--border)',
                }}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  'Nội dung không phù hợp',
                  'Thiếu nguồn tham khảo',
                  'Hình ảnh lỗi',
                ].map((reason) => (
                  <button
                    key={reason}
                    onClick={() =>
                      setRejectReason(reason)
                    }
                    className="
                      rounded-full
                      border
                      px-3 py-1.5
                      text-xs
                      transition-colors
                      hover:bg-[var(--hover)]
                    "
                    style={{
                      color: 'var(--text-secondary)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* MODAL FOOTER */}
            <div
              className="
                flex justify-end
                gap-3 rounded-b-2xl
                border-t px-6 py-4
              "
              style={{
                background: 'var(--surface-secondary)',
                borderColor: 'var(--border)',
              }}
            >
              <button
                onClick={() =>
                  setModal({
                    type: null,
                    post: null,
                  })
                }
                className="
                  rounded-xl
                  border
                  px-4 py-2
                  text-sm
                  transition-colors
                  hover:bg-[var(--hover)]
                "
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--border)',
                  background: 'var(--surface)',
                }}
              >
                Hủy
              </button>

              <button
                onClick={reject}
                disabled={!rejectReason.trim()}
                className="
                  rounded-xl
                  bg-[var(--error)]
                  px-4 py-2
                  text-sm
                  text-[var(--primary-foreground)]
                  disabled:opacity-50
                "
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
      {/* PREVIOUS */}
      <button
        type="button"
        onClick={() =>
          onChange(Math.max(1, current - 1))
        }
        disabled={current === 1}
        className="
          rounded-lg
          border
          p-1.5
          transition-colors
          hover:bg-[var(--hover)]
          hover:text-[var(--primary)]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        style={{
          color: 'var(--text-muted)',
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-xs"
            style={{
              color: 'var(--text-placeholder)',
            }}
          >
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`
              min-w-8 h-8
              rounded-lg
              border
              px-2
              text-xs font-semibold
              transition-colors
              ${
                current !== item
                  ? 'hover:text-[var(--primary)] hover:bg-[var(--hover)]'
                  : ''
              }
            `}
            style={
              current === item
                ? {
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    borderColor: 'transparent',
                  }
                : {
                    background: 'var(--surface)',
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border)',
                  }
            }
            aria-current={
              current === item ? 'page' : undefined
            }
          >
            {item}
          </button>
        )
      )}

      {/* NEXT */}
      <button
        type="button"
        onClick={() =>
          onChange(Math.min(total, current + 1))
        }
        disabled={current >= total}
        className="
          rounded-lg
          border
          p-1.5
          transition-colors
          hover:bg-[var(--hover)]
          hover:text-[var(--primary)]
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
        style={{
          color: 'var(--text-muted)',
          borderColor: 'var(--border)',
          background: 'var(--surface)',
        }}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

function paginationItems(
  current: number,
  total: number
): Array<number | 'ellipsis'> {
  if (total <= 7) {
    return Array.from(
      { length: total },
      (_, index) => index + 1
    );
  }

  const items: Array<number | 'ellipsis'> = [1];

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) {
    items.push('ellipsis');
  }

  for (
    let value = start;
    value <= end;
    value += 1
  ) {
    items.push(value);
  }

  if (end < total - 1) {
    items.push('ellipsis');
  }

  items.push(total);

  return items;
}

function formatDate(value: string) {
  return value
    .slice(0, 10)
    .split('-')
    .reverse()
    .join('/');
}