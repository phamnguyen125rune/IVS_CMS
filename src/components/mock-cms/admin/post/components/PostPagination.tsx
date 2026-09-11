import { ChevronLeft, ChevronRight } from 'lucide-react';

import { paginationItems } from '@/utils/post-view';

interface PostPaginationProps {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function PostPagination({ current, total, onChange }: PostPaginationProps) {
  if (total <= 1) return null;

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="p-1.5 rounded-lg border text-slate-500 hover:bg-white hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {paginationItems(current, total).map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-400">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-w-8 h-8 px-2 rounded-lg text-xs font-semibold border transition-colors ${
              current === item
                ? 'text-white border-transparent'
                : 'text-slate-600 bg-white hover:text-blue-600'
            }`}
            style={
              current === item ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }
            }
            aria-current={current === item ? 'page' : undefined}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current >= total}
        className="p-1.5 rounded-lg border text-slate-500 hover:bg-white hover:text-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: 'var(--border)' }}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
