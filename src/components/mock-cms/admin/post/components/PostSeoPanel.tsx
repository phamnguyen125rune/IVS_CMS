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
      className="bg-white rounded-2xl border shadow-sm overflow-hidden"
      style={{ borderColor: 'var(--border)' }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50/60 hover:bg-slate-100/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <Globe size={18} className="text-emerald-600" />
          <span className="font-display font-bold text-slate-800 text-sm">
            Cấu hình SEO & Máy chủ tìm kiếm
          </span>
        </div>
        {open ? (
          <ChevronUp size={16} className="text-slate-400" />
        ) : (
          <ChevronDown size={16} className="text-slate-400" />
        )}
      </button>

      {open && (
        <div className="p-6 space-y-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1.5">
              <span>Thẻ tiêu đề (Meta Title)</span>
              <span
                className={`text-xs ${(formData.metaTitle?.length ?? 0) > 60 ? 'text-red-500' : 'text-slate-400'}`}
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
              className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 flex justify-between mb-1.5">
              <span>Thẻ mô tả (Meta Description)</span>
              <span
                className={`text-xs ${(formData.metaDescription?.length ?? 0) > 160 ? 'text-red-500' : 'text-slate-400'}`}
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
              className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 resize-none"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              URL Thẩm quyền (Canonical URL)
            </label>
            <input
              type="text"
              name="canonicalUrl"
              value={formData.canonicalUrl || ''}
              onChange={onChange}
              placeholder="https://..."
              className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none font-mono focus:border-blue-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          <div className="flex gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isIndexable"
                checked={formData.isIndexable ?? true}
                onChange={onCheckbox}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              Index (Cho phép chỉ mục)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isFollowable"
                checked={formData.isFollowable ?? true}
                onChange={onCheckbox}
                className="w-4 h-4 rounded text-blue-600 border-slate-300"
              />
              Follow (Theo dõi liên kết)
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
