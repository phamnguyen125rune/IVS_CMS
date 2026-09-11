/* eslint-disable @next/next/no-img-element */

import { Image as ImageIcon, LayoutList, Share2, Tags, UploadCloud, X } from 'lucide-react';

import type { PostCategory } from '@/types/category.type';
import type { ReqPostCreateDTO } from '@/types/post.type';
import type { Tag } from '@/types/tag.type';
import type { PostMediaTarget } from '../hooks/usePostEditor';

interface PostSidebarProps {
  formData: ReqPostCreateDTO;
  categories: PostCategory[];
  selectedTags: Tag[];
  filteredTags: Tag[];
  availableTagCount: number;
  tagSearch: string;
  showTagDropdown: boolean;
  featuredImageUrl: string | null;
  uploadingImage: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onTagSearchChange: (value: string) => void;
  onTagDropdownChange: (value: boolean) => void;
  onToggleTag: (tagId: number) => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenMedia: (target: PostMediaTarget) => void;
  onRemoveFeatured: () => void;
  onRemoveOg: () => void;
}

export default function PostSidebar({
  formData,
  categories,
  selectedTags,
  filteredTags,
  availableTagCount,
  tagSearch,
  showTagDropdown,
  featuredImageUrl,
  uploadingImage,
  onChange,
  onTagSearchChange,
  onTagDropdownChange,
  onToggleTag,
  onImageUpload,
  onOpenMedia,
  onRemoveFeatured,
  onRemoveOg,
}: PostSidebarProps) {
  return (
    <div className="xl:col-span-4 space-y-5">
      <section className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <LayoutList size={16} className="text-slate-600" />
          <h2 className="font-bold text-slate-900 text-sm">Phân loại</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1.5">Danh mục chính</label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={onChange}
              className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white cursor-pointer"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value={0} disabled>-- Chọn danh mục --</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
              <Tags size={13} /> Thẻ bài viết (Tags)
            </label>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-medium"
                  >
                    {tag.tagName}
                    <button
                      type="button"
                      onClick={() => onToggleTag(tag.tagId)}
                      className="text-blue-400 hover:text-red-500"
                      title="Gỡ thẻ"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="relative">
              <input
                type="text"
                value={tagSearch}
                onChange={(event) => onTagSearchChange(event.target.value)}
                onFocus={() => onTagDropdownChange(true)}
                onBlur={() => window.setTimeout(() => onTagDropdownChange(false), 200)}
                placeholder="Tìm và chọn thẻ..."
                className="w-full px-3.5 py-2 border rounded-xl text-sm outline-none focus:border-blue-500 bg-white placeholder:text-slate-400"
                style={{ borderColor: 'var(--border)' }}
              />

              {showTagDropdown && (
                <div
                  className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-56 overflow-y-auto"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <button
                        key={tag.tagId}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          onToggleTag(tag.tagId);
                          onTagSearchChange('');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                      >
                        <span>{tag.tagName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">#{tag.slug}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-400 italic text-center bg-slate-50">
                      {availableTagCount === 0 ? 'Hệ thống chưa có thẻ nào.' : 'Không tìm thấy thẻ phù hợp.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <ImageIcon size={16} className="text-slate-600" />
            <h2 className="font-bold text-slate-900 text-sm">Ảnh đại diện</h2>
          </div>
          {featuredImageUrl && (
            <button type="button" onClick={onRemoveFeatured} className="text-xs text-red-500 hover:underline">Xóa</button>
          )}
        </div>

        {featuredImageUrl ? (
          <img src={featuredImageUrl} alt="Ảnh đại diện bài viết" className="w-full aspect-video object-cover rounded-xl border mb-2" />
        ) : (
          <div
            className="px-3 py-6 border rounded-xl bg-slate-50 border-dashed text-center flex flex-col items-center justify-center gap-3 mb-2"
            style={{ borderColor: 'var(--border)' }}
          >
            <UploadCloud size={24} className="text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Chọn ảnh cho bài viết</span>
            <div className="flex gap-2 mt-1">
              <label className="cursor-pointer px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">
                Tải lên
                <input type="file" accept="image/*" className="hidden" onChange={onImageUpload} disabled={uploadingImage} />
              </label>
              <button
                type="button"
                onClick={() => onOpenMedia('featured')}
                className="px-3 py-1.5 bg-white border text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
              >
                Thư viện
              </button>
            </div>
          </div>
        )}

        {uploadingImage && <p className="text-center mt-2 text-xs font-semibold text-blue-600 animate-pulse">Đang tải lên...</p>}
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-5" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
          <Share2 size={16} className="text-violet-600" />
          <h2 className="font-bold text-slate-900 text-sm">Mạng xã hội (OG)</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Tiêu đề</label>
            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle || ''}
              onChange={onChange}
              placeholder="Tiêu đề khi share FB/Zalo..."
              className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-violet-500"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mô tả</label>
            <textarea
              name="ogDescription"
              value={formData.ogDescription || ''}
              onChange={onChange}
              rows={2}
              placeholder="Mô tả ngắn..."
              className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:border-violet-500 resize-none"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">Ảnh chia sẻ</label>
            {formData.ogImageId ? (
              <div className="space-y-2">
                <img
                  src={`/api/v1/media/${formData.ogImageId}/view`}
                  alt="Ảnh chia sẻ bài viết"
                  className="w-full aspect-video object-cover rounded-xl border"
                  style={{ borderColor: 'var(--border)' }}
                />
                <div className="flex gap-3">
                  <button type="button" className="text-xs font-semibold text-blue-600" onClick={() => onOpenMedia('og')}>Đổi ảnh</button>
                  <button type="button" className="text-xs font-semibold text-red-500" onClick={onRemoveOg}>Dùng ảnh đại diện</button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenMedia('og')}
                className="w-full px-3 py-2 border border-dashed rounded-xl text-xs font-medium text-slate-500 hover:text-violet-600 hover:bg-violet-50/40"
                style={{ borderColor: 'var(--border)' }}
              >
                Chọn ảnh OG riêng (mặc định dùng ảnh đại diện)
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
