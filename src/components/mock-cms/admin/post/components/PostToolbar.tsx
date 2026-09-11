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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">Quản lý bài viết</h1>
          <p className="text-slate-500 text-sm mt-0.5">{total} bài viết phù hợp bộ lọc</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold hover:opacity-90 shadow-sm transition-opacity"
          style={{ background: 'var(--primary)' }}
        >
          <Plus size={15} /> Tạo bài viết
        </button>
      </div>

      <div
        className="bg-white rounded-xl border p-4 mb-5 flex flex-wrap gap-3 items-center"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="flex-1 min-w-56 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tiêu đề, slug hoặc tóm tắt..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:border-blue-500"
            style={{ borderColor: 'var(--border)' }}
          />
        </div>

        <select
          value={categoryId ?? ''}
          onChange={(event) =>
            onCategoryChange(event.target.value ? Number(event.target.value) : undefined)
          }
          className="px-3 py-2 border rounded-lg text-xs font-medium text-slate-600 bg-white outline-none focus:border-blue-500"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Lọc theo danh mục"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-1.5">
          {POST_STATUS_OPTIONS.map((option) => (
            <button
              key={option.value || 'ALL'}
              type="button"
              onClick={() => onStatusChange(option.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                status === option.value ? 'text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
              style={status === option.value ? { background: 'var(--primary)' } : undefined}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
