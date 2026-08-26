'use client';
import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, AlertTriangle, X, Monitor, Smartphone, Share2, Bookmark, ArrowLeft } from 'lucide-react';
import { postService } from '@/services/post.service';
import { ResPostListDTO } from '@/types/post.type';

type ModalType = 'preview' | 'reject' | null;

export default function PostApproval() {
  const [posts, setPosts] = useState<ResPostListDTO[]>([]);
  const [modal, setModal] = useState<{ type: ModalType; post: ResPostListDTO | null }>({ type: null, post: null });
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const isDesktop = previewMode === 'desktop';

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPendingPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getPosts({ status: 'PENDING' }, 1, 50); // Chỉ lấy Pending
      setPosts(res.result || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPosts();
  }, []);

  const approve = async (id: number) => {
    try {
      await postService.reviewPost(id, { action: 'APPROVED', comment: 'Duyệt bài tự động' });
      setModal({ type: null, post: null });
      showToast('Bài viết đã được duyệt thành công!', 'success');
      fetchPendingPosts(); // Tải lại
    } catch (err: any) {
      showToast(err?.message || 'Lỗi khi duyệt', 'error');
    }
  };

  const reject = async () => {
    if (!modal.post || !rejectReason.trim()) return;
    try {
      await postService.reviewPost(modal.post.id, { action: 'REJECTED', comment: rejectReason });
      setModal({ type: null, post: null });
      setRejectReason('');
      showToast('Đã trả bài lại cho tác giả.', 'error');
      fetchPendingPosts(); // Tải lại
    } catch (err: any) {
      showToast(err?.message || 'Lỗi khi từ chối', 'error');
    }
  };

  return (
    <div className="p-6">
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-500'}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />} {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Kiểm duyệt bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">{posts.length} bài viết đang chờ duyệt</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          <AlertTriangle size={15} className="text-amber-500" />
          <span className="text-sm text-amber-700 font-medium">Cần xử lý: {posts.length}</span>
        </div>
      </div>

      {/* Bảng Danh sách chờ duyệt */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b">
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Bài viết</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Tác giả</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Danh mục</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Ngày tạo</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <tr key={post.id} className="border-t hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800 max-w-xs truncate">{post.title}</div>
                    <div className="text-xs text-slate-400 mt-1 max-w-xs truncate">{post.summary || 'Không có tóm tắt'}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-600 text-sm">{post.author?.name}</td>
                  <td className="px-5 py-4"><span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{post.category?.name || '---'}</span></td>
                  <td className="px-5 py-4 text-xs text-slate-400">{new Date(post.createdAt!).toLocaleDateString('vi-VN')}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setPreviewMode('desktop'); setModal({ type: 'preview', post }); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium text-slate-600 hover:bg-slate-50"><Eye size={13} /> Xem trước</button>
                      <button onClick={() => approve(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700"><CheckCircle size={13} /> Duyệt</button>
                      <button onClick={() => { setModal({ type: 'reject', post }); setRejectReason(''); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-red-500 hover:bg-red-600"><XCircle size={13} /> Từ chối</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5} className="px-5 py-16 text-center text-slate-500">Tất cả đều sạch sẽ! Không có bài chờ duyệt.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Reject */}
      {modal.type === 'reject' && modal.post && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setModal({ type: null, post: null })}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="font-bold text-lg">Từ chối bài viết</h3>
              <button onClick={() => setModal({ type: null, post: null })} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 mb-4">Gửi lý do trả bài cho tác giả <strong>{modal.post.author?.name}</strong>.</p>
              <textarea
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do chi tiết..."
                className="w-full px-3 py-2.5 border rounded-xl text-sm outline-none focus:border-red-400"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {['Nội dung không phù hợp', 'Thiếu nguồn tham khảo', 'Hình ảnh lỗi'].map(r => (
                  <button key={r} onClick={() => setRejectReason(r)} className="text-xs px-3 py-1.5 rounded-full border hover:bg-slate-50">{r}</button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-slate-50 rounded-b-2xl">
              <button onClick={() => setModal({ type: null, post: null })} className="px-4 py-2 border rounded-xl text-sm">Hủy</button>
              <button onClick={reject} disabled={!rejectReason.trim()} className="px-4 py-2 text-white bg-red-500 rounded-xl text-sm disabled:opacity-50">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}