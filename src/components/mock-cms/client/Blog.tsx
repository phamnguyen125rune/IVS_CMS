/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

import type { PostCategory } from '@/types/category.type';
import type { PaginatedResponse, ResPostListDTO } from '@/types/post.type';
import { postPath } from '@/utils/post-seo';

interface Props {
  data: PaginatedResponse<ResPostListDTO>;
  categories: PostCategory[];
  keyword: string;
  categoryId?: number;
  page: number;
}

export default function Blog({ data, categories, keyword, categoryId, page }: Props) {
  const posts = data.result || [];
  const showFeatured = page === 1 && !keyword && !categoryId;
  const featured = showFeatured ? posts[0] : undefined;
  const rest = showFeatured ? posts.slice(1) : posts;

  const listHref = (nextPage: number, nextCategory = categoryId) => {
    const query = new URLSearchParams();
    if (keyword) query.set('q', keyword);
    if (nextCategory) query.set('category', String(nextCategory));
    if (nextPage > 1) query.set('page', String(nextPage));
    const suffix = query.toString();
    return `/vi/bai-viet${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <div lang="vi">
      <section
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-sm font-semibold uppercase tracking-widest mb-3 text-blue-400">
            Tin tức
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            Kiến thức & Insights
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mb-8">
            Cập nhật bài viết, kiến thức chuyên sâu và thông tin mới nhất từ đội ngũ CMS.
          </p>
          <form
            action="/vi/bai-viet"
            method="get"
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 max-w-lg"
          >
            <Search size={16} className="text-white/60" />
            <input
              name="q"
              defaultValue={keyword}
              placeholder="Tìm kiếm bài viết..."
              className="bg-transparent text-white placeholder:text-white/50 outline-none flex-1 text-sm min-w-0"
            />
            {categoryId ? <input type="hidden" name="category" value={categoryId} /> : null}
            <button className="text-xs font-semibold text-white/90">Tìm</button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href={listHref(1, 0)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              !categoryId ? 'text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'
            }`}
            style={
              !categoryId ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }
            }
          >
            Tất cả
          </Link>
          {categories.map((category) => {
            const active = category.categoryId === categoryId;
            return (
              <Link
                key={category.categoryId}
                href={listHref(1, category.categoryId)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  active ? 'text-white' : 'bg-white border text-slate-600 hover:bg-slate-50'
                }`}
                style={active ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }}
              >
                {category.categoryName}
              </Link>
            );
          })}
        </div>

        {featured && (
          <Link href={postPath(featured.slug)} className="group block mb-10">
            <div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl overflow-hidden border hover:shadow-xl transition-all bg-white"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="aspect-video overflow-hidden bg-slate-100">
                {featured.featuredMedia ? (
                  <img
                    src={featured.featuredMedia}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100" />
                )}
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="text-xs font-semibold text-white px-3 py-1 rounded-full"
                    style={{ background: 'var(--primary)' }}
                  >
                    Mới nhất
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                    {featured.category?.name || 'Bài viết'}
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl text-slate-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {featured.title}
                </h2>
                {featured.summary && (
                  <p className="text-slate-500 leading-relaxed mb-5 line-clamp-3">
                    {featured.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{featured.author?.name || 'System'}</span>
                  {featured.publishedAt && (
                    <>
                      <span>·</span>
                      <time dateTime={featured.publishedAt}>
                        {formatDate(featured.publishedAt)}
                      </time>
                    </>
                  )}
                </div>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                  Đọc bài viết <ArrowRight size={15} />
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <Link key={post.id} href={postPath(post.slug)} className="group block">
              <article
                className="rounded-2xl overflow-hidden border hover:shadow-lg transition-all bg-white h-full"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="aspect-video overflow-hidden bg-slate-100">
                  {post.featuredMedia ? (
                    <img
                      src={post.featuredMedia}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-100" />
                  )}
                </div>
                <div className="p-5 flex flex-col h-[220px]">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                      {post.category?.name || 'Bài viết'}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
                      {post.summary}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-400 truncate">
                      {post.author?.name || 'System'}
                      {post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
                    </div>
                    <span className="text-xs font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all shrink-0">
                      Đọc tiếp <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {!posts.length && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium text-slate-600">Không tìm thấy bài viết phù hợp</p>
            <p className="text-sm mt-1">Thử thay đổi từ khóa tìm kiếm hoặc danh mục khác.</p>
          </div>
        )}

        {data.meta.pages > 1 && (
          <nav
            className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm"
            aria-label="Phân trang bài viết"
          >
            <Link
              rel={page > 1 ? 'prev' : undefined}
              href={page > 1 ? listHref(page - 1) : listHref(1)}
              aria-disabled={page === 1}
              className={`px-3.5 py-2 rounded-xl border bg-white transition-colors ${page === 1 ? 'pointer-events-none opacity-40 text-slate-400' : 'text-slate-600 hover:text-blue-600 hover:border-blue-200'}`}
              style={{ borderColor: 'var(--border)' }}
            >
              Trước
            </Link>

            {paginationItems(page, data.meta.pages).map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="px-1.5 text-slate-400">
                  …
                </span>
              ) : (
                <Link
                  key={item}
                  href={listHref(item)}
                  aria-current={item === page ? 'page' : undefined}
                  className={`min-w-10 px-3 py-2 rounded-xl border text-center font-medium transition-colors ${
                    item === page
                      ? 'text-white border-transparent'
                      : 'bg-white text-slate-600 hover:text-blue-600 hover:border-blue-200'
                  }`}
                  style={
                    item === page
                      ? { background: 'var(--primary)' }
                      : { borderColor: 'var(--border)' }
                  }
                >
                  {item}
                </Link>
              )
            )}

            <Link
              rel={page < data.meta.pages ? 'next' : undefined}
              href={page < data.meta.pages ? listHref(page + 1) : listHref(data.meta.pages)}
              aria-disabled={page >= data.meta.pages}
              className={`px-3.5 py-2 rounded-xl border bg-white transition-colors ${page >= data.meta.pages ? 'pointer-events-none opacity-40 text-slate-400' : 'text-slate-600 hover:text-blue-600 hover:border-blue-200'}`}
              style={{ borderColor: 'var(--border)' }}
            >
              Sau
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return value.slice(0, 10).split('-').reverse().join('/');
}

function paginationItems(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const items: Array<number | 'ellipsis'> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push('ellipsis');
  for (let value = start; value <= end; value += 1) items.push(value);
  if (end < total - 1) items.push('ellipsis');
  items.push(total);
  return items;
}
