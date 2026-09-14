/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { ResPostListDTO } from '@/types/post.type';
import { postSectionPath } from '@/utils/post-seo';
import { formatPostDate } from '@/utils/post-view';

interface PostFeaturedCardProps {
  post: ResPostListDTO;
  basePath: string;
  badge: string;
  detailLabel: string;
}

export default function PostFeaturedCard({
  post,
  basePath,
  badge,
  detailLabel,
}: PostFeaturedCardProps) {
  return (
    <Link href={postSectionPath(post.slug, basePath)} className="group block mb-10">
      <article
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 rounded-2xl overflow-hidden border hover:shadow-xl transition-all"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="aspect-video overflow-hidden bg-slate-100">
          {post.featuredMedia ? (
            <img
              src={post.featuredMedia}
              alt={post.title}
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
              {badge}
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {post.category?.name || 'Bài viết'}
            </span>
          </div>

          <h2
            className="font-display font-bold text-2xl leading-tight mb-3 group-hover:text-[var(--primary)] transition-colors"
            style={{ color: 'var(--text)' }}
          >
            {post.title}
          </h2>

          {post.summary && (
            <p className="text-slate-500 leading-relaxed mb-5 line-clamp-3">{post.summary}</p>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{post.author?.name || 'System'}</span>
            {post.publishedAt && (
              <>
                <span>·</span>
                <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
              </>
            )}
          </div>

          <div
            className="mt-5 flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all"
            style={{ color: 'var(--primary)' }}
          >
            {detailLabel} <ArrowRight size={15} />
          </div>
        </div>
      </article>
    </Link>
  );
}
