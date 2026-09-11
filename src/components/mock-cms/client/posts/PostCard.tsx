/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import type { ResPostListDTO } from '@/types/post.type';
import { postSectionPath } from '@/utils/post-seo';
import { formatPostDate } from '@/utils/post-view';

interface PostCardProps {
  post: ResPostListDTO;
  basePath: string;
  detailLabel: string;
}

export default function PostCard({ post, basePath, detailLabel }: PostCardProps) {
  return (
    <Link href={postSectionPath(post.slug, basePath)} className="group block h-full">
      <article
        className="rounded-2xl overflow-hidden border hover:shadow-lg transition-all h-full"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
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

        <div className="p-5 flex flex-col min-h-[220px]">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
              {post.category?.name || 'Bài viết'}
            </span>
          </div>

          <h3 className="font-display font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {post.summary ? (
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 flex-1">
              {post.summary}
            </p>
          ) : (
            <div className="flex-1" />
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-400 truncate">
              {post.author?.name || 'System'}
              {post.publishedAt ? ` · ${formatPostDate(post.publishedAt)}` : ''}
            </div>
            <span className="text-xs font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all shrink-0">
              {detailLabel} <ArrowRight size={11} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
