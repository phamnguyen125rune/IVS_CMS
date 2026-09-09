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

const statusConfig: Record<ApprovalStatus, { label: string; className: string }> = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-amber-100 text-amber-700' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Bị từ chối', className: 'bg-red-100 text-red-700' },
};

export default function PostApproval() {
  const requestId = useRef(0);

  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [activeStatus, setActiveStatus] = useState<ApprovalStatus>('PENDING');
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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
      setErrorMessage(error instanceof Error ? error.message : 'Không thể tải danh sách kiểm duyệt.');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
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
      showToast(error instanceof Error ? error.message : 'Không thể tải chi tiết bài viết.', 'error');
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

      if (posts.length === 1 && page > 1) setPage((current) => current - 1);
      else await fetchPosts();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể duyệt bài viết.', 'error');
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

      if (posts.length === 1 && page > 1) setPage((current) => current - 1);
      else await fetchPosts();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể từ chối bài viết.', 'error');
    }
  };

  const pageTitle =
    activeStatus === 'PENDING'
      ? 'Bài viết chờ duyệt'
      : activeStatus === 'APPROVED'
        ? 'Bài viết đã duyệt'
        : 'Bài viết bị từ chối';

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="p-6 relative">
      {toast && (
        <div
          className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
          {toast.message}
        </div>
      )}

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700 flex justify-between gap-4">
          <span>{errorMessage}</span>
          <button className="underline font-medium shrink-0" onClick={fetchPosts}>Tải lại</button>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} bài viết phù hợp bộ lọc</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center" style={{ borderColor: 'var(--border)' }}>
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
          {APPROVAL_STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setActiveStatus(option.value);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeStatus === option.value ? 'text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
              style={activeStatus === option.value ? { background: 'var(--primary)' } : undefined}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Tiêu đề</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Danh mục</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Tác giả</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Ngày tạo</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Đang tải...
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => {
                  const currentStatus = post.status as ApprovalStatus;
                  const currentStatusConfig = statusConfig[currentStatus];

                  return (
                    <tr key={post.id} className="border-t hover:bg-slate-50" style={{ borderColor: 'var(--border)' }}>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-slate-800 max-w-sm truncate">{post.title}</div>
                        <div className="text-xs text-slate-400 mt-1 max-w-sm truncate">{post.summary || 'Không có tóm tắt'}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{post.category?.name || 'Không có'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 text-xs">{post.author?.name || 'System'}</td>
                      <td className="px-5 py-3.5 text-slate-600 text-xs">{post.createdAt ? formatDate(post.createdAt) : '---'}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${currentStatusConfig.className}`}>{currentStatusConfig.label}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenPreview(post)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600" title="Xem trước">
                            <Eye size={14} />
                          </button>

                          {currentStatus === 'PENDING' && (
                            <>
                              <button onClick={() => approve(post.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600" title="Duyệt bài">
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  setModal({ type: 'reject', post });
                                  setRejectReason('');
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
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
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">Không có bài viết ở trạng thái này</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && total > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-t bg-slate-50" style={{ borderColor: 'var(--border)' }}>
            <div className="text-xs text-slate-500">
              Hiển thị <span className="font-semibold text-slate-700">{from}</span> - <span className="font-semibold text-slate-700">{to}</span> trong <span className="font-semibold text-slate-700">{total}</span> bài viết
            </div>
            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
      {/* ================= MODALS ================= */}

      {/* MODAL 1: PREVIEW (DESKTOP VIEW) */}
      {modal.type === 'preview' && modal.post && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setModal({ type: null, post: null })}
        >
          <div
            className="bg-slate-100 rounded-2xl shadow-2xl w-full max-w-[1400px] flex flex-col h-full max-h-[92vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Toolbar */}
            <div
              className="flex items-center justify-between px-6 py-3 bg-white border-b shrink-0 z-10 shadow-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1.5 rounded flex items-center gap-1.5">
                  <Clock size={14} />
                  <span>
                    {statusConfig[(modal.post.status as ApprovalStatus) || 'PENDING']?.label ||
                      'Đang kiểm duyệt'}
                  </span>
                </span>
                <span className="text-xs font-medium text-slate-500 border-l pl-3">
                  Chế độ xem trước (Giao diện Desktop)
                </span>
              </div>
              <button
                onClick={() => setModal({ type: null, post: null })}
                className="text-slate-400 hover:text-slate-700 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
                title="Đóng xem trước"
              >
                <X size={18} />
              </button>
            </div>

            {/* Container Preview Content */}
            <div className="flex-1 overflow-y-auto w-full p-4 sm:p-6 bg-slate-100 flex justify-center">
              <div className="bg-white rounded-xl shadow-xl border border-slate-200 h-full w-full max-w-[1280px] overflow-y-auto flex flex-col">
                {/* Mockup Header Web */}
                <div className="shrink-0 bg-white border-b border-slate-200 select-none pointer-events-none">
                  <div
                    className="flex items-center justify-end px-6 py-1 text-xs text-slate-400 border-b"
                    style={{ background: '#0f172a', borderColor: '#1e293b' }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="hover:text-white transition-colors cursor-pointer">
                        <Share2 size={12} />
                      </span>
                      <span className="hover:text-white transition-colors cursor-pointer">
                        <ExternalLink size={12} />
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 text-base rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ background: 'var(--primary, #2563eb)' }}
                      >
                        C
                      </div>
                      <span className="font-display font-bold text-slate-900 text-lg">CMS</span>
                    </div>

                    <nav className="flex items-center gap-1">
                      {[
                        { label: 'Trang chủ', hasChildren: false, active: false },
                        { label: 'Giới thiệu', hasChildren: false, active: false },
                        { label: 'Bài viết', hasChildren: true, active: true },
                        { label: 'Dự án', hasChildren: true, active: false },
                        { label: 'Khách hàng', hasChildren: false, active: false },
                        { label: 'Tuyển dụng', hasChildren: false, active: false },
                        { label: 'Liên hệ', hasChildren: false, active: false },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
                            item.active
                              ? 'text-blue-600 font-semibold'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.hasChildren && <ChevronDown size={13} className="text-slate-400" />}
                        </div>
                      ))}
                    </nav>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 bg-white">
                        <Globe size={13} className="text-slate-500" />
                        <span>🇻🇳</span>
                        <ChevronDown size={11} className="text-slate-400" />
                      </div>

                      <div className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-50">
                        <Search size={17} />
                      </div>

                      <div
                        className="flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm"
                        style={{ background: 'var(--primary, #2563eb)' }}
                      >
                        Liên hệ ngay
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body Chi tiết bài viết */}
                <div className="mx-auto w-full max-w-7xl px-8 py-8 grid grid-cols-12 gap-10">
                  <div className="col-span-8">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6 hover:text-blue-600 cursor-pointer w-fit">
                      <ArrowLeft size={16} /> Quay lại danh sách bài viết
                    </div>

                    <div className="flex gap-2 mb-4">
                      {modal.post.category?.name && (
                        <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {modal.post.category.name}
                        </span>
                      )}
                    </div>

                    <h1 className="font-display font-bold text-slate-900 mb-6 leading-[1.3] text-[32px]">
                      {modal.post.title}
                    </h1>

                    <div className="flex items-center justify-between py-4 border-b border-slate-100 mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm">
                          {modal.post.author?.name?.charAt(0) || 'A'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {modal.post.author?.name || 'Tác giả ẩn danh'}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {modal.post.createdAt
                              ? formatDate(modal.post.createdAt)
                              : 'Vừa xong'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 border rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                          <Share2 size={16} />
                        </button>
                        <button className="p-2 border rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                          <Bookmark size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Hiển thị ảnh đại diện */}
                    {(() => {
                      const imageUrl =
                        'featuredMedia' in modal.post && modal.post.featuredMedia
                          ? modal.post.featuredMedia
                          : 'mediaList' in modal.post && modal.post.mediaList?.[0]?.filePath
                            ? modal.post.mediaList[0].filePath
                            : null;

                      return imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl}
                          className="w-full rounded-2xl mb-8 object-cover aspect-[16/9] bg-slate-100"
                          alt={modal.post.title}
                        />
                      ) : null;
                    })()}

                    <div className="text-slate-700 leading-relaxed space-y-5 pb-8 text-[16px]">
                      {modal.post.summary && (
                        <p className="text-slate-900 font-medium text-lg">{modal.post.summary}</p>
                      )}

                      {/* Hiển thị nội dung chi tiết từ API hoặc Skeleton khi tải */}
                      {previewLoading ? (
                        <div className="py-10 text-center text-slate-400">
                          Đang tải toàn bộ nội dung bài viết...
                        </div>
                      ) : 'content' in modal.post && modal.post.content ? (
                        <div
                          className="prose max-w-none text-slate-800 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: modal.post.content }}
                        />
                      ) : (
                        <p className="text-slate-500 italic">
                          Nội dung chi tiết chưa được cung cấp.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sidebar bên phải */}
                  <div className="col-span-4 space-y-6">
                    <div className="border border-slate-100 rounded-2xl p-6 flex flex-col items-center text-center bg-white shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-xl mb-3">
                        {modal.post.author?.name?.charAt(0) || 'A'}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mb-1">
                        {modal.post.author?.name || 'Tác giả ẩn danh'}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">Người đóng góp nội dung</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Toolbar của Modal Preview */}
            <div
              className="flex items-center justify-end gap-3 px-6 py-4 bg-white shrink-0 border-t shadow-sm z-10"
              style={{ borderColor: 'var(--border)' }}
            >
              {modal.post.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      setModal({ type: 'reject', post: modal.post });
                      setRejectReason('');
                    }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 shadow-sm"
                  >
                    <XCircle size={16} />
                    <span>Từ chối bài viết</span>
                  </button>

                  <button
                    onClick={() => approve(modal.post!.id)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
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

      {/* MODAL 2: REJECT */}
      {modal.type === 'reject' && modal.post && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() =>
            setModal({
              type: null,
              post: null,
            })
          }
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg">Từ chối bài viết</h3>
              <button
                onClick={() =>
                  setModal({
                    type: null,
                    post: null,
                  })
                }
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">
                Gửi lý do trả bài cho tác giả <strong>{modal.post.author?.name}</strong>.
              </p>

              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do chi tiết..."
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-red-400 resize-none"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {['Nội dung không phù hợp', 'Thiếu nguồn tham khảo', 'Hình ảnh lỗi'].map(
                  (reason) => (
                    <button
                      key={reason}
                      onClick={() => setRejectReason(reason)}
                      className="text-xs px-3 py-1.5 rounded-full border hover:bg-slate-50"
                    >
                      {reason}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
              <button
                onClick={() =>
                  setModal({
                    type: null,
                    post: null,
                  })
                }
                className="px-4 py-2 border rounded-xl text-sm"
              >
                Hủy
              </button>

              <button
                onClick={reject}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 text-white bg-red-500 rounded-xl text-sm disabled:opacity-50"
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

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (page: number) => void }) {
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
          <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-400">…</span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-colors ${
              current === item ? 'text-white border-transparent' : 'text-slate-600 bg-white hover:text-blue-600'
            }`}
            style={current === item ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }}
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
