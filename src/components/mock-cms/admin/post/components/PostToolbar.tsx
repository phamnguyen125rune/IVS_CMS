import { Plus, Search } from 'lucide-react';

import type { PostCategory } from '@/types/category.type';
import type { PostStatus } from '@/types/post.type';

import { POST_STATUS_OPTIONS } from '../post.constants';

interface PostToolbarProps {
  total: number;
  search: string;
  status: PostStatus | '';
  categoryId?: number;
  categories: PostCategory[];
  onCreate: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: PostStatus | '') => void;
  onCategoryChange: (value?: number) => void;
}

export default function PostToolbar({
  total,
  search,
  status,
  categoryId,
  categories,
  onCreate,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
}: PostToolbarProps) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold" style={{ color: 'var(--text)' }}>
            Quản lý bài viết
          </h1>

          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {total} bài viết phù hợp bộ lọc
          </p>
        </div>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
          style={{
            background: 'var(--primary)',
            color: 'var(--primary-foreground)',
          }}
        >
          <Plus size={15} />
          Tạo bài viết
        </button>
      </div>

      <div
        className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border p-4"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Search */}
        <div className="relative min-w-56 flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-placeholder)' }}
          />

          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tiêu đề, slug hoặc tóm tắt..."
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--primary)]"
            style={{
              background: 'var(--surface)',
              color: 'var(--text)',
              borderColor: 'var(--border)',
            }}
          />
        </div>

        {/* Category */}
        <select
          value={categoryId ?? ''}
          onChange={(event) =>
            onCategoryChange(event.target.value ? Number(event.target.value) : undefined)
          }
          className="rounded-lg border bg-transparent px-3 py-2 text-xs font-medium outline-none transition-colors focus:border-[var(--primary)]"
          style={{
            background: 'var(--surface)',
            color: 'var(--text-secondary)',
            borderColor: 'var(--border)',
          }}
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>

          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>

        {/* Status */}
        <div className="flex flex-wrap gap-1.5">
          {POST_STATUS_OPTIONS.map((option) => {
            const isActive = status === option.value;

            return (
              <button
                key={option.value || 'ALL'}
                type="button"
                onClick={() => onStatusChange(option.value)}
                className="rounded-lg px-3 py-2 text-xs font-medium transition-colors"
                style={
                  isActive
                    ? {
                        background: 'var(--primary)',
                        color: 'var(--primary-foreground)',
                      }
                    : {
                        color: 'var(--text-muted)',
                      }
                }
                onMouseEnter={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background = 'var(--hover)';
                    event.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
                onMouseLeave={(event) => {
                  if (!isActive) {
                    event.currentTarget.style.background = 'transparent';
                    event.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
