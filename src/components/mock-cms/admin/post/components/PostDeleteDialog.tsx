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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 text-center shadow-xl"
        style={{ background: 'var(--surface)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: 'var(--error-light)',
            color: 'var(--error)',
          }}
        >
          <Trash2 size={24} />
        </div>

        <h3 className="mb-2 font-display text-lg font-bold" style={{ color: 'var(--text)' }}>
          Xóa bài viết?
        </h3>

        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          Bạn có chắc chắn muốn xóa bài viết <br />
          <span className="font-semibold" style={{ color: 'var(--text)' }}>
            &quot;{post.title}&quot;
          </span>
          ?
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="w-full rounded-xl border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--hover)]"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface)',
              color: 'var(--text-secondary)',
            }}
          >
            Hủy
          </button>

          <button
            disabled={busy}
            onClick={onConfirm}
            className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
            style={{
              background: 'var(--error)',
              color: 'var(--primary-foreground)',
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
