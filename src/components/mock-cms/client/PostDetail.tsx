/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

import type { ResPostDTO } from '@/types/post.type';
import { postDate } from '@/utils/post-seo';

export default function PostDetail({ post }: { post: ResPostDTO }) {
  const heroImage = post.metadata?.openGraph?.imageUrl || post.mediaList?.[0]?.filePath;
  const authorInitial = (post.author?.name || 'S').trim().charAt(0).toUpperCase();

  return (
    <div lang="vi" className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <article className="lg:col-span-2">
          <Link href="/vi/bai-viet" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft size={15} /> Quay lại danh sách
          </Link>

          <div className="flex items-center gap-2 mb-4">
            {post.category?.name && (
              <span className="text-xs font-medium text-white px-3 py-1 rounded-full" style={{ background: 'var(--primary)' }}>
                {post.category.name}
              </span>
            )}
            {post.publishedAt && (
              <time
                dateTime={postDate(post.publishedAt)}
                className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1"
              >
                <Clock size={12} /> {formatDate(post.publishedAt)}
              </time>
            )}
          </div>

          <h1 className="font-display font-bold text-3xl lg:text-4xl text-slate-900 leading-tight mb-5">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              {authorInitial}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">{post.author?.name || 'System'}</p>
              {post.createdAt && <p className="text-xs text-slate-400 mt-0.5">Tạo ngày {formatDate(post.createdAt)}</p>}
            </div>
          </div>

          {heroImage && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-8 border border-slate-100 shadow-sm flex items-center justify-center">
              <img src={heroImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose max-w-none">
            {post.summary && (
              <p className="text-slate-800 text-lg font-medium leading-relaxed mb-6 italic border-l-4 border-blue-600 pl-4 bg-blue-50/50 py-3 rounded-r-lg">
                {post.summary}
              </p>
            )}
            <div
              className="text-slate-700 text-base leading-relaxed space-y-5 content-html"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {post.tags?.length ? (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-xs px-3 py-1.5 rounded-full border text-slate-600 bg-white"
                  style={{ borderColor: 'var(--border)' }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border p-6 text-center shadow-sm" style={{ borderColor: 'var(--border)' }}>
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
              {authorInitial}
            </div>
            <h2 className="font-display font-semibold text-slate-900 text-lg">{post.author?.name || 'System'}</h2>
            <p className="text-xs font-medium text-blue-600 mt-1 bg-blue-50 inline-block px-3 py-1 rounded-full">Tác giả nội dung</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return value.slice(0, 10).split('-').reverse().join('/');
}
