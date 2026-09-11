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
    <div className="py-2 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 border rounded-xl hover:bg-slate-100 text-slate-600 bg-white shadow-sm transition-colors"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900 leading-none">
            {isEditMode ? 'Chỉnh sửa bài viết' : 'Soạn thảo bài viết'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isEditMode ? `ID: #${id}` : 'Tập trung sáng tạo nội dung'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={disabled}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 shadow-sm transition-all"
          style={{ borderColor: 'var(--border)' }}
        >
          <Save size={15} /> Lưu nháp
        </button>
        <button
          type="button"
          onClick={onSubmitReview}
          disabled={disabled}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 shadow transition-all"
          style={{ background: 'var(--primary)' }}
        >
          <Send size={15} /> Gửi duyệt
        </button>
      </div>
    </div>
  );
}
