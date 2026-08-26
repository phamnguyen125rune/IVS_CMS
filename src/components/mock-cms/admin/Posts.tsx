'use client';
import { useState, useEffect } from 'react';
import { useLocalizedNavigate as useNavigate } from '@/components/navigation/LocalizedLink';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { postService } from '@/services/post.service';
import { ResPostListDTO, PostStatus } from '@/types/post.type';

const statusMap: Record<string, PostStatus | ''> = {
  'Tất cả': '',
  'Đã xuất bản': 'PUBLISHED',
  'Chờ duyệt': 'PENDING',
  'Bản nháp': 'DRAFT',
};

const statusConfig: Record<string, { label: string; className: string }> = {
  PUBLISHED: { label: 'Đã xuất bản', className: 'bg-emerald-100 text-emerald-700' },
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
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [deletePost, setDeletePost] = useState<ResPostListDTO | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await postService.getPosts({
        keyword: search,
        status: statusMap[statusFilter]
      }, page, 10);
      setPostList(res.result || []);
      setTotal(res.meta?.total || 0);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tự động fetch khi search, filter hoặc chuyển trang
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 500); // Debounce search
    return () => clearTimeout(delayDebounceFn);
  }, [search, statusFilter, page]);

  const handleDelete = async () => {
    if (deletePost) {
      try {
        await postService.deletePost(deletePost.id);
        fetchPosts(); // Reload danh sách sau khi xoá
      } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
      } finally {
        setDeletePost(null);
      }
    }
  };

  return (
    <div className="p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý Bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} bài viết tìm thấy</p>
        </div>
        <button
          onClick={() => navigate('/admin/bai-viet/tao-moi')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} /> Tạo bài viết
        </button>
      </div>

      <div className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center" style={{ borderColor: 'var(--border)' }}>
        <div className="flex-1 min-w-48 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>
        <div className="flex gap-1">
          {Object.keys(statusMap).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'text-white' : 'text-slate-500 hover:bg-slate-100'}`}
              style={statusFilter === s ? { background: 'var(--primary)' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b" style={{ borderColor: 'var(--border)' }}>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Tiêu đề</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Danh mục</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Tác giả</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Đang tải...</td></tr>
            ) : postList.length > 0 ? (
              postList.map((post) => {
                const sc = statusConfig[post.status] || { label: post.status, className: 'bg-gray-100 text-gray-700' };
                return (
                  <tr key={post.id} className="border-t hover:bg-slate-50" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-5 py-3.5"><div className="font-medium text-slate-800 max-w-xs truncate">{post.title}</div></td>
                    <td className="px-5 py-3.5"><span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">{post.category?.name || 'Không có'}</span></td>
                    <td className="px-5 py-3.5 text-slate-600 text-xs">{post.author?.name || 'System'}</td>
                    <td className="px-5 py-3.5"><span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.className}`}>{sc.label}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/bai-viet/sua/${post.id}`)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600"><Edit size={14} /></button>
                        <button onClick={() => setDeletePost(post)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">Không tìm thấy bài viết</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {deletePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setDeletePost(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 size={24} className="mx-auto mb-4 text-red-500" />
            <h3 className="font-bold text-lg mb-2">Xóa bài viết?</h3>
            <p className="text-sm text-slate-600 mb-6">Bạn có chắc chắn muốn xóa bài viết "{deletePost.title}"?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletePost(null)} className="px-5 py-2.5 rounded-xl border text-sm text-slate-600">Hủy</button>
              <button onClick={handleDelete} className="px-5 py-2.5 rounded-xl text-white text-sm bg-red-500">Xác nhận xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}