import { Trash2 } from 'lucide-react';

import type { ResPostListDTO } from '@/types/post.type';

interface PostDeleteDialogProps {
  post: ResPostListDTO | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function PostDeleteDialog({
  post,
  busy,
  onCancel,
  onConfirm,
}: PostDeleteDialogProps) {
  if (!post) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
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
          <span className="font-semibold text-slate-900">&quot;{post.title}&quot;</span>?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full"
            style={{ borderColor: 'var(--border)' }}
          >
            Hủy
          </button>
          <button
            disabled={busy}
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600 shadow-sm transition-colors w-full disabled:opacity-50"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
