import Link from 'next/link';

import { paginationItems } from '@/utils/post-view';

interface PostPaginationProps {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
  ariaLabel?: string;
}

export default function PostPagination({
  page,
  totalPages,
  hrefForPage,
  ariaLabel = 'Phân trang bài viết',
}: PostPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm"
      aria-label={ariaLabel}
    >
      <Link
        rel={page > 1 ? 'prev' : undefined}
        href={hrefForPage(page > 1 ? page - 1 : 1)}
        aria-disabled={page === 1}
        className={`px-3.5 py-2 rounded-xl border bg-white transition-colors ${
          page === 1
            ? 'pointer-events-none opacity-40 text-slate-400'
            : 'text-slate-600 hover:text-blue-600 hover:border-blue-200'
        }`}
        style={{ borderColor: 'var(--border)' }}
      >
        Trước
      </Link>

      {paginationItems(page, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="px-1.5 text-slate-400">
            …
          </span>
        ) : (
          <Link
            key={item}
            href={hrefForPage(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`min-w-10 px-3 py-2 rounded-xl border text-center font-medium transition-colors ${
              item === page
                ? 'text-white border-transparent'
                : 'bg-white text-slate-600 hover:text-blue-600 hover:border-blue-200'
            }`}
            style={
              item === page ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }
            }
          >
            {item}
          </Link>
        )
      )}

      <Link
        rel={page < totalPages ? 'next' : undefined}
        href={hrefForPage(page < totalPages ? page + 1 : totalPages)}
        aria-disabled={page >= totalPages}
        className={`px-3.5 py-2 rounded-xl border bg-white transition-colors ${
          page >= totalPages
            ? 'pointer-events-none opacity-40 text-slate-400'
            : 'text-slate-600 hover:text-blue-600 hover:border-blue-200'
        }`}
        style={{ borderColor: 'var(--border)' }}
      >
        Sau
      </Link>
    </nav>
  );
}
