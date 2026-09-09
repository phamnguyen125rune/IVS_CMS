/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { ArrowLeft, Clock, Hash } from "lucide-react";
import type { ResPostDTO, ResPostListDTO } from "@/types/post.type";
import { postDate, postPath } from "@/utils/post-seo";
import { getPostDisplayTags } from "@/utils/post-display-tags";

interface PostDetailProps {
  post: ResPostDTO;
  recentPosts?: ResPostListDTO[];
}

export default function PostDetail({
  post,
  recentPosts = [],
}: PostDetailProps) {
  const displayTags = getPostDisplayTags(post);
  const heroImage =
    post.metadata?.openGraph?.imageUrl || post.mediaList?.[0]?.filePath;
  const authorInitial = (post.author?.name || "S")
    .trim()
    .charAt(0)
    .toUpperCase();
  const visibleRecentPosts = recentPosts
    .filter((item) => item.id !== post.id)
    .slice(0, 5);

  return (
    <div lang="vi" className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* CỘT TRÁI: NỘI DUNG BÀI VIẾT */}
        <article className="lg:col-span-2 min-w-0">
          <Link
            href="/vi/bai-viet"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 mb-6 transition-colors"
          >
            <ArrowLeft size={15} /> Quay lại danh sách
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.category?.name && (
              <span className="text-xs font-medium text-white px-3 py-1 rounded-full bg-blue-600">
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

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
              {authorInitial}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 text-sm">
                {post.author?.name || "System"}
              </p>
              {post.createdAt && (
                <p className="text-xs text-slate-400 mt-0.5">
                  Tạo ngày {formatDate(post.createdAt)}
                </p>
              )}
            </div>
          </div>

          {heroImage && (
            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-8 border border-slate-100 shadow-sm flex items-center justify-center">
              <img
                src={heroImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
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

          <section
            className="mt-10 pt-6 border-t border-slate-200"
            aria-labelledby="post-tags-title"
          >
            <div className="flex items-center gap-2 mb-4">
              <Hash size={16} className="text-blue-600" />
              <h2
                id="post-tags-title"
                className="font-display font-semibold text-slate-900 text-lg"
              >
                Thẻ bài viết
              </h2>
            </div>
            {displayTags.length ? (
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tagName) => (
                  <span
                    key={tagName}
                    className="text-sm px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-blue-600 transition-colors font-medium"
                  >
                    #{tagName}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Bài viết chưa có thẻ.</p>
            )}
          </section>
        </article>

        {/* CỘT PHẢI: SIDEBAR */}
        <aside className="space-y-6 lg:sticky lg:top-24 self-start">
          {/* 1. Thông tin tác giả */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-3xl mx-auto mb-4 border-4 border-white shadow-sm">
              {authorInitial}
            </div>
            <h2 className="font-display font-semibold text-slate-900 text-lg">
              {post.author?.name || "System"}
            </h2>
            <p className="text-xs font-medium text-blue-600 mt-1 bg-blue-50 inline-block px-3 py-1 rounded-full">
              Tác giả bài viết
            </p>
          </div>

          {/* 2. Bài viết liên quan */}
          {visibleRecentPosts.length > 0 && (
            <section
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
              aria-labelledby="recent-posts-title"
            >
              <div className="mb-4">
                <h2
                  id="recent-posts-title"
                  className="font-display font-bold text-slate-900 text-lg"
                >
                  Bài viết liên quan
                </h2>
              </div>
              <div className="divide-y divide-slate-200">
                {visibleRecentPosts.map((item) => (
                  <Link
                    key={item.id}
                    href={postPath(item.slug)}
                    className="group flex gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                      {item.featuredMedia ? (
                        <img
                          src={item.featuredMedia}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1.5">
                        {item.publishedAt ? (
                          <time dateTime={postDate(item.publishedAt)}>
                            {formatDate(item.publishedAt)}
                          </time>
                        ) : null}
                        {item.category?.name ? (
                          <>
                            <span>•</span>
                            <span className="truncate">
                              {item.category.name}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}

function formatDate(value: string) {
  return value.slice(0, 10).split("-").reverse().join("/");
}
