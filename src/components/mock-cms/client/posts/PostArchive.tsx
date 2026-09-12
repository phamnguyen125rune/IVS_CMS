import Link from 'next/link';
import { Search } from 'lucide-react';

import type { PostSectionConfig } from '@/config/post-sections';
import type { PostCategory } from '@/types/category.type';
import type { PaginatedResponse, ResPostListDTO } from '@/types/post.type';
import { postListPath } from '@/utils/post-seo';

import PostCard from './PostCard';
import PostFeaturedCard from './PostFeaturedCard';
import PostPagination from './PostPagination';

interface PostArchiveProps {
  data: PaginatedResponse<ResPostListDTO>;
  section: PostSectionConfig;
  keyword: string;
  page: number;
  categories?: PostCategory[];
  categoryId?: number;
}

export default function PostArchive({
  data,
  section,
  keyword,
  page,
  categories = [],
  categoryId,
}: PostArchiveProps) {
  const posts = data.result || [];
  const showFeatured = page === 1 && !keyword;
  const featured = showFeatured ? posts[0] : undefined;
  const rest = showFeatured ? posts.slice(1) : posts;
  const listPath = postListPath(section.basePath);

  const listHref = (nextPage: number, nextCategory = categoryId) => {
    const query = new URLSearchParams();
    if (keyword) query.set('q', keyword);
    if (section.showCategoryFilter && nextCategory) query.set('category', String(nextCategory));
    if (nextPage > 1) query.set('page', String(nextPage));
    const suffix = query.toString();
    return `${listPath}${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <div lang="vi">
      <section
        className="py-16 lg:py-20"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--primary)' }}
          >
            {section.eyebrow}
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
            {section.title}
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mb-8">{section.description}</p>

          <form
            action={listPath}
            method="get"
            className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 max-w-lg"
          >
            <Search size={16} className="text-white/60" />
            <input
              name="q"
              defaultValue={keyword}
              placeholder={section.searchPlaceholder}
              className="bg-transparent text-white placeholder:text-white/50 outline-none flex-1 text-sm min-w-0"
            />
            {section.showCategoryFilter && categoryId ? (
              <input type="hidden" name="category" value={categoryId} />
            ) : null}
            <button className="text-xs font-semibold text-white/90">Tìm</button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {section.showCategoryFilter && categories.length > 0 && (
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
                  style={
                    active ? { background: 'var(--primary)' } : { borderColor: 'var(--border)' }
                  }
                >
                  {category.categoryName}
                </Link>
              );
            })}
          </div>
        )}

        {featured && (
          <PostFeaturedCard
            post={featured}
            basePath={section.basePath}
            badge={section.featuredBadge}
            detailLabel={section.detailLabel}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              basePath={section.basePath}
              detailLabel={section.detailLabel}
            />
          ))}
        </div>

        {!posts.length && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg font-medium text-slate-600">{section.emptyTitle}</p>
            <p className="text-sm mt-1">{section.emptyDescription}</p>
          </div>
        )}

        <PostPagination
          page={page}
          totalPages={data.meta.pages}
          hrefForPage={(nextPage) => listHref(nextPage)}
          ariaLabel={`Phân trang ${section.eyebrow.toLowerCase()}`}
        />
      </div>
    </div>
  );
}
