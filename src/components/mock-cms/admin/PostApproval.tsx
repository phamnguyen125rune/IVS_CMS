'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  X,
  ArrowLeft,
  Share2,
  Bookmark,
  Globe,
  Search,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';

import { postService } from '@/services/post.service';
import { ResPostListDTO, ResPostDTO } from '@/types/post.type';

type ModalType = 'preview' | 'reject' | null;
type ApprovalStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export default function PostApproval() {
  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [activeStatus, setActiveStatus] = useState<ApprovalStatus>('ALL');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState<{
    type: ModalType;
    post: ResPostDTO | ResPostListDTO | null;
  }>({
    type: null,
    post: null,
  });

  const [previewLoading, setPreviewLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // =========================
  // GET POSTS
  // =========================
  const fetchPosts = useCallback(async (status: ApprovalStatus) => {
    try {
      setLoading(true);
      const res = await postService.getPosts(
        {
          ...(status !== 'ALL' && { status }),
        },
        1,
        50
      );
      setPosts(res.result || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeStatus);
  }, [activeStatus, fetchPosts]);

  // =========================
  // XỬ LÝ MỞ XEM TRƯỚC (GỌI API LẤY CHI TIẾT CONTENT)
  // =========================
  const handleOpenPreview = async (postItem: ResPostListDTO) => {
    setModal({ type: 'preview', post: postItem });
    setPreviewLoading(true);

    try {
      const res =
        (await (postService as any).getPostById?.(postItem.id)) ??
        (await (postService as any).getPost?.(postItem.id));
      if (res?.result) {
        setModal({ type: 'preview', post: res.result });
      } else if (res) {
        setModal({ type: 'preview', post: res });
      }
    } catch (err) {
      console.error('Lỗi khi tải chi tiết bài viết:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  // =========================
  // APPROVE
  // =========================
  const approve = async (id: number) => {
    try {
      await postService.reviewPost(id, {
        action: 'APPROVED',
        comment: 'Duyệt bài tự động',
      });

      setModal({
        type: null,
        post: null,
      });

      showToast('Bài viết đã được duyệt thành công!', 'success');
      fetchPosts(activeStatus);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi khi duyệt';
      showToast(errorMsg, 'error');
    }
  };

  // =========================
  // REJECT
  // =========================
  const reject = async () => {
    if (!modal.post || !rejectReason.trim()) return;

    try {
      await postService.reviewPost(modal.post.id, {
        action: 'REJECTED',
        comment: rejectReason,
      });

      setModal({
        type: null,
        post: null,
      });

      setRejectReason('');
      showToast('Đã trả bài lại cho tác giả.', 'error');
      fetchPosts(activeStatus);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi khi từ chối';
      showToast(errorMsg, 'error');
    }
  };

  // =========================
  // SEARCH FRONTEND
  // =========================
  const filteredPosts = posts.filter((post) => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return true;

    const title = post.title?.toLowerCase() || '';
    const author = post.author?.name?.toLowerCase() || '';

    return title.includes(keyword) || author.includes(keyword);
  });

  // =========================
  // STATUS CONFIG
  // =========================
  const statusConfig: Record<
    ApprovalStatus,
    {
      label: string;
      className: string;
    }
  > = {
    ALL: {
      label: 'Tất cả',
      className: 'bg-slate-100 text-slate-700',
    },
    PENDING: {
      label: 'Chờ duyệt',
      className: 'bg-amber-100 text-amber-700',
    },
    APPROVED: {
      label: 'Đã duyệt',
      className: 'bg-emerald-100 text-emerald-700',
    },
    REJECTED: {
      label: 'Bị từ chối',
      className: 'bg-red-100 text-red-700',
    },
  };

  const pageTitle =
    activeStatus === 'ALL'
      ? 'Tất cả bài viết'
      : activeStatus === 'PENDING'
        ? 'Bài viết chờ duyệt'
        : activeStatus === 'APPROVED'
          ? 'Bài viết đã duyệt'
          : 'Bài viết đã từ chối';

  return (
    <div className="p-6 relative">
      {/* TOAST */}
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

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-slate-500 text-sm mt-0.5">{filteredPosts.length} bài viết</p>
        </div>
      </div>

      {/* SEARCH + STATUS FILTER */}
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
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as ApprovalStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeStatus === status ? 'text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
              style={activeStatus === status ? { background: 'var(--primary)' } : {}}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div
        className="bg-white rounded-xl border overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Tiêu đề
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Danh mục
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Tác giả
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Ngày tạo
              </th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Trạng thái
              </th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  Đang tải...
                </td>
              </tr>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const currentStatus = (post.status as ApprovalStatus) || 'PENDING';
                const currentStatusConfig = statusConfig[currentStatus] || statusConfig.PENDING;

                return (
                  <tr
                    key={post.id}
                    className="border-t hover:bg-slate-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-slate-800 max-w-xs truncate">
                        {post.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">
                        {post.summary || 'Không có tóm tắt'}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                        {post.category?.name || 'Không có'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 text-xs">
                      {post.author?.name || 'System'}
                    </td>

                    <td className="px-5 py-3.5 text-slate-600 text-xs">
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString('vi-VN')
                        : '---'}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${currentStatusConfig.className}`}
                      >
                        {currentStatusConfig.label}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenPreview(post)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600"
                          title="Xem trước"
                        >
                          <Eye size={14} />
                        </button>

                        {currentStatus === 'PENDING' && (
                          <>
                            <button
                              onClick={() => approve(post.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600"
                              title="Duyệt"
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
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  Không tìm thấy bài viết
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
                {/* Mockup Header Web (Đồng bộ ClientNavbar) */}
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
                              ? new Date(modal.post.createdAt).toLocaleDateString('vi-VN')
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
                    <span>Duyệt & Xuất bản ngay</span>
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
