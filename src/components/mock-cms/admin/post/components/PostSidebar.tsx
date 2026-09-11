/* eslint-disable @next/next/no-img-element */

import {
  FolderOpen,
  Image as ImageIcon,
  LayoutList,
  Share2,
  Tags,
  UploadCloud,
  X,
} from 'lucide-react';

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
    <div className="space-y-5 xl:col-span-4">
      {/* ================= PHÂN LOẠI ================= */}
      <section
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="mb-4 flex items-center gap-2 border-b pb-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <LayoutList
            size={16}
            style={{ color: 'var(--text-secondary)' }}
          />

          <h2
            className="text-sm font-bold"
            style={{ color: 'var(--text)' }}
          >
            Phân loại
          </h2>
        </div>

        <div className="space-y-5">
          {/* ================= CATEGORY ================= */}
          <div>
            <label
              className="mb-1.5 block text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Danh mục chính
            </label>

            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={onChange}
              className="w-full cursor-pointer rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors focus:border-[var(--primary)]"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value={0} disabled>
                -- Chọn danh mục --
              </option>

              {categories.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* ================= TAGS ================= */}
          <div>
            <label
              className="mb-2 flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Tags size={13} />
              Thẻ bài viết (Tags)
            </label>

            {selectedTags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.tagId}
                    className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-medium"
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary-text)',
                      borderColor: 'var(--primary-soft)',
                    }}
                  >
                    {tag.tagName}

                    <button
                      type="button"
                      onClick={() => onToggleTag(tag.tagId)}
                      className="transition-colors hover:text-[var(--error)]"
                      style={{ color: 'var(--primary-text)' }}
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
                onChange={(event) =>
                  onTagSearchChange(event.target.value)
                }
                onFocus={() => onTagDropdownChange(true)}
                onBlur={() =>
                  window.setTimeout(
                    () => onTagDropdownChange(false),
                    200
                  )
                }
                placeholder="Tìm và chọn thẻ..."
                className="w-full rounded-xl border px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-[var(--text-placeholder)] focus:border-[var(--primary)]"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                }}
              />

              {showTagDropdown && (
                <div
                  className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border shadow-lg"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <button
                        key={tag.tagId}
                        type="button"
                        onMouseDown={(event) =>
                          event.preventDefault()
                        }
                        onClick={() => {
                          onToggleTag(tag.tagId);
                          onTagSearchChange('');
                        }}
                        className="flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors hover:bg-[var(--hover)]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <span>{tag.tagName}</span>

                        <span
                          className="font-mono text-[10px]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          #{tag.slug}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div
                      className="bg-[var(--surface-secondary)] px-4 py-3 text-center text-sm italic"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {availableTagCount === 0
                        ? 'Hệ thống chưa có thẻ nào.'
                        : 'Không tìm thấy thẻ phù hợp.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED IMAGE ================= */}
      <section
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="mb-4 flex items-center justify-between border-b pb-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <ImageIcon
              size={16}
              style={{ color: 'var(--text-secondary)' }}
            />

            <h2
              className="text-sm font-bold"
              style={{ color: 'var(--text)' }}
            >
              Ảnh đại diện
            </h2>
          </div>

          {featuredImageUrl && (
            <button
              type="button"
              onClick={onRemoveFeatured}
              className="text-xs transition-colors hover:underline"
              style={{ color: 'var(--error)' }}
            >
              Xóa
            </button>
          )}
        </div>

        {featuredImageUrl ? (
          <img
            src={featuredImageUrl}
            alt="Ảnh đại diện bài viết"
            className="mb-2 aspect-video w-full rounded-xl border object-cover"
            style={{ borderColor: 'var(--border)' }}
          />
        ) : (
          <div
            className="mb-2 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-3 py-6 text-center"
            style={{
              background: 'var(--surface-secondary)',
              borderColor: 'var(--border)',
            }}
          >
            <UploadCloud
              size={24}
              style={{ color: 'var(--text-muted)' }}
            />

            <span
              className="text-xs font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Chọn ảnh cho bài viết
            </span>

            <div className="mt-1 flex gap-2">
              <label
                className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                }}
              >
                Tải lên

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onImageUpload}
                  disabled={uploadingImage}
                />
              </label>

              <button
                type="button"
                onClick={() => onOpenMedia('featured')}
                className="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-[var(--hover)]"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-secondary)',
                }}
              >
                Thư viện
              </button>
            </div>
          </div>
        )}

        {uploadingImage && (
          <p
            className="mt-2 animate-pulse text-center text-xs font-semibold"
            style={{ color: 'var(--primary)' }}
          >
            Đang tải lên...
          </p>
        )}
      </section>

      {/* ================= SOCIAL / OG ================= */}
      <section
        className="rounded-2xl border p-5 shadow-sm"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div
          className="mb-3 flex items-center gap-2 border-b pb-2"
          style={{ borderColor: 'var(--border)' }}
        >
          <Share2
            size={16}
            className="text-violet-600"
          />

          <h2
            className="text-sm font-bold"
            style={{ color: 'var(--text)' }}
          >
            Mạng xã hội (OG)
          </h2>
        </div>

        <div className="space-y-3">
          {/* ================= OG TITLE ================= */}
          <div>
            <label
              className="mb-1 block text-[11px] font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Tiêu đề
            </label>

            <input
              type="text"
              name="ogTitle"
              value={formData.ogTitle || ''}
              onChange={onChange}
              placeholder="Tiêu đề khi share FB/Zalo..."
              className="w-full rounded-lg border px-3 py-1.5 text-xs outline-none transition-colors focus:border-violet-500"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* ================= OG DESCRIPTION ================= */}
          <div>
            <label
              className="mb-1 block text-[11px] font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Mô tả
            </label>

            <textarea
              name="ogDescription"
              value={formData.ogDescription || ''}
              onChange={onChange}
              rows={2}
              placeholder="Mô tả ngắn..."
              className="w-full resize-none rounded-lg border px-3 py-1.5 text-xs outline-none transition-colors focus:border-violet-500"
              style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
              }}
            />
          </div>

          {/* ================= OG IMAGE ================= */}
          <div>
            <label
              className="mb-1.5 block text-[11px] font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              Ảnh chia sẻ
            </label>

            {formData.ogImageId ? (
              <div className="space-y-2">
                <img
                  src={`/api/v1/media/${formData.ogImageId}/view`}
                  alt="Ảnh chia sẻ bài viết"
                  className="aspect-video w-full rounded-xl border object-cover"
                  style={{ borderColor: 'var(--border)' }}
                />

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: 'var(--primary)' }}
                    onClick={() => onOpenMedia('og')}
                  >
                    Đổi ảnh
                  </button>

                  <button
                    type="button"
                    className="text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: 'var(--error)' }}
                    onClick={onRemoveOg}
                  >
                    Dùng ảnh đại diện
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenMedia('og')}
                className="w-full rounded-xl border border-dashed px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--hover)]"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
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