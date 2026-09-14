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
        className="rounded-lg border p-1.5 transition-colors hover:bg-[var(--hover)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
          background: 'var(--surface)',
        }}
        aria-label="Trang trước"
      >
        <ChevronLeft size={16} />
      </button>

      {paginationItems(current, total).map((item, index) =>
        item === 'ellipsis' ? (
          <span
            key={`ellipsis-${index}`}
            className="px-1 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onChange(item)}
            className={`min-w-8 h-8 rounded-lg border px-2 text-xs font-semibold transition-colors ${
              current === item
                ? 'border-transparent'
                : 'hover:bg-[var(--hover)] hover:text-[var(--primary)]'
            }`}
            style={
              current === item
                ? {
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                  }
                : {
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-secondary)',
                  }
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
        className="rounded-lg border p-1.5 transition-colors hover:bg-[var(--hover)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          borderColor: 'var(--border)',
          color: 'var(--text-muted)',
          background: 'var(--surface)',
        }}
        aria-label="Trang sau"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
