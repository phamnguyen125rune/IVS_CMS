'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, CheckCircle, XCircle, AlertTriangle, X, Search } from 'lucide-react';

import { postService } from '@/services/post.service';
import { ResPostListDTO } from '@/types/post.type';

type ModalType = 'preview' | 'reject' | null;
type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function PostApproval() {
  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [activeStatus, setActiveStatus] = useState<ApprovalStatus>('PENDING');
  const [search, setSearch] = useState('');

  const [modal, setModal] = useState<{
    type: ModalType;
    post: ResPostListDTO | null;
  }>({
    type: null,
    post: null,
  });

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
  // GET POSTS (Dùng useCallback để tái sử dụng an toàn)
  // =========================
  const fetchPosts = useCallback(async (status: ApprovalStatus) => {
    try {
      setLoading(true);
      const res = await postService.getPosts(
        {
          status,
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
      fetchPosts('PENDING');
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
      fetchPosts('PENDING');
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
    activeStatus === 'PENDING'
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

        {activeStatus === 'PENDING' && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
            <AlertTriangle size={15} className="text-amber-500" />
            <span className="text-sm text-amber-700 font-medium">Cần xử lý: {posts.length}</span>
          </div>
        )}
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
          {(['PENDING', 'APPROVED', 'REJECTED'] as ApprovalStatus[]).map((status) => (
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
                const sc = statusConfig[activeStatus];

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
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}
                      >
                        {sc.label}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setModal({
                              type: 'preview',
                              post,
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600"
                          title="Xem trước"
                        >
                          <Eye size={14} />
                        </button>

                        {activeStatus === 'PENDING' && (
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

      {/* MODAL REJECT */}
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
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-red-400"
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
