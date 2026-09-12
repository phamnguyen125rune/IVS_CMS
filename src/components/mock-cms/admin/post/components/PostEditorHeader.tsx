import { ArrowLeft, Save, Send } from 'lucide-react';

interface PostEditorHeaderProps {
  isEditMode: boolean;
  id: number | null;
  disabled: boolean;
  onBack: () => void;
  onSaveDraft: () => void;
  onSubmitReview: () => void;
}

export default function PostEditorHeader({
  isEditMode,
  id,
  disabled,
  onBack,
  onSaveDraft,
  onSubmitReview,
}: PostEditorHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 py-2 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border p-2 shadow-sm transition-colors hover:bg-[var(--hover)]"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1
            className="font-display text-xl font-bold leading-none"
            style={{ color: 'var(--text)' }}
          >
            {isEditMode ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết'}
          </h1>

          <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
            {isEditMode ? `ID: #${id}` : 'Tập trung sáng tạo nội dung'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl px-4 py-2 text-sm font-semibold transition-colors hover:bg-[var(--hover)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          Hủy
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={disabled}
          className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:bg-[var(--hover)] disabled:opacity-50"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
            color: 'var(--text-secondary)',
          }}
        >
          <Save size={15} />
          Lưu nháp
        </button>

        <button
          type="button"
          onClick={onSubmitReview}
          disabled={disabled}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold shadow transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Send size={15} />
          Gửi duyệt
        </button>
      </div>
    </div>
  );
}
