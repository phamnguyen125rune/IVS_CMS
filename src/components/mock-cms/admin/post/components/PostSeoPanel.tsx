import { ChevronDown, ChevronUp, Globe } from 'lucide-react';

import type { ReqPostCreateDTO } from '@/types/post.type';

interface PostSeoPanelProps {
  formData: ReqPostCreateDTO;
  open: boolean;
  onToggle: () => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PostSeoPanel({
  formData,
  open,
  onToggle,
  onChange,
  onCheckbox,
}: PostSeoPanelProps) {
  return (
    <div
      className="overflow-hidden rounded-2xl border shadow-sm"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--hover)]"
        style={{ background: 'var(--surface-secondary)' }}
      >
        <div className="flex items-center gap-2">
          <Globe
            size={18}
            style={{ color: 'var(--success)' }}
          />

          <span
            className="font-display text-sm font-bold"
            style={{ color: 'var(--text)' }}
          >
            Cấu hình SEO & Máy chủ tìm kiếm
          </span>
        </div>

        {open ? (
          <ChevronUp
            size={16}
            style={{ color: 'var(--text-muted)' }}
          />
        ) : (
          <ChevronDown
            size={16}
            style={{ color: 'var(--text-muted)' }}
          />
        )}
      </button>

      {open && (
        <div
          className="space-y-4 border-t p-6"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* ================= META TITLE ================= */}
          <div>
            <label
              className="mb-1.5 flex justify-between text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Thẻ tiêu đề (Meta Title)</span>

              <span
                className="text-xs"
                style={{
                  color:
                    (formData.metaTitle?.length ?? 0) > 60
                      ? 'var(--error)'
                      : 'var(--text-muted)',
                }}
              >
                {formData.metaTitle?.length ?? 0} / 60
              </span>
            </label>

            <input
              type="text"
              name="metaTitle"
              value={formData.metaTitle || ''}
              onChange={onChange}
              placeholder="Ghi đè tiêu đề trên Google..."
              className="w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* ================= META DESCRIPTION ================= */}
          <div>
            <label
              className="mb-1.5 flex justify-between text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span>Thẻ mô tả (Meta Description)</span>

              <span
                className="text-xs"
                style={{
                  color:
                    (formData.metaDescription?.length ?? 0) > 160
                      ? 'var(--error)'
                      : 'var(--text-muted)',
                }}
              >
                {formData.metaDescription?.length ?? 0} / 160
              </span>
            </label>

            <textarea
              name="metaDescription"
              value={formData.metaDescription || ''}
              onChange={onChange}
              rows={2}
              placeholder="Mô tả tóm tắt trên kết quả tìm kiếm..."
              className="w-full resize-none rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* ================= CANONICAL URL ================= */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              URL Thẩm quyền (Canonical URL)
            </label>

            <input
              type="text"
              name="canonicalUrl"
              value={formData.canonicalUrl || ''}
              onChange={onChange}
              placeholder="https://..."
              className="w-full rounded-xl border px-3.5 py-2 font-mono text-sm outline-none transition-colors focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* ================= INDEX / FOLLOW ================= */}
          <div className="flex gap-6 pt-1">
            <label
              className="flex cursor-pointer items-center gap-2 text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              <input
                type="checkbox"
                name="isIndexable"
                checked={formData.isIndexable ?? true}
                onChange={onCheckbox}
                className="h-4 w-4 rounded"
                style={{
                  accentColor: 'var(--primary)',
                }}
              />
              Index (Cho phép chỉ mục)
            </label>

            <label
              className="flex cursor-pointer items-center gap-2 text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              <input
                type="checkbox"
                name="isFollowable"
                checked={formData.isFollowable ?? true}
                onChange={onCheckbox}
                className="h-4 w-4 rounded"
                style={{
                  accentColor: 'var(--primary)',
                }}
              />
              Follow (Theo dõi liên kết)
            </label>
          </div>
        </div>
      )}
    </div>
  );
}