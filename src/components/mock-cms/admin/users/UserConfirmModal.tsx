import { Loader2 } from 'lucide-react';

interface UserConfirmModalProps {
  title: string;
  description: string;
  actionLabel: string;
  tone: 'danger' | 'success' | 'primary';
  saving: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function UserConfirmModal({
  title,
  description,
  actionLabel,
  tone,
  saving,
  onClose,
  onConfirm,
}: UserConfirmModalProps) {
  const toneClass =
    tone === 'danger'
      ? 'bg-[var(--error)] hover:bg-[var(--error)]'
      : tone === 'success'
        ? 'bg-[var(--success)] hover:bg-[var(--success)]'
        : 'bg-[var(--primary)] hover:bg-[var(--primary-hover)]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-lg p-6 shadow-2xl"
        style={{ background: 'var(--surface)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <h3
          className="mb-2 text-lg font-bold"
          style={{ color: 'var(--text)' }}
        >
          {title}
        </h3>

        <p
          className="mb-6 text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-60"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            Hủy
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className={`flex min-w-24 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 ${toneClass}`}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}