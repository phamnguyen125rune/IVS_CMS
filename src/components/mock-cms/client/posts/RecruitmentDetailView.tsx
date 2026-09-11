/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Briefcase, CalendarDays, UserRound } from 'lucide-react';

import type { PostSectionConfig } from '@/config/post-sections';
import type { ResPostDTO, ResPostListDTO } from '@/types/post.type';
import { postListPath, postSectionPath } from '@/utils/post-seo';
import { formatPostDate } from '@/utils/post-view';

interface RecruitmentDetailViewProps {
  post: ResPostDTO;
  section: PostSectionConfig;
  recentPosts?: ResPostListDTO[];
}

export default function RecruitmentDetailView({
  post,
  section,
  recentPosts = [],
}: RecruitmentDetailViewProps) {
  const heroImage = post.metadata?.openGraph?.imageUrl || post.mediaList?.[0]?.filePath;
  const relatedPosts = recentPosts.filter((item) => item.id !== post.id).slice(0, 4);

  return (
    <div className="bg-slate-50" lang="vi">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10 lg:py-12">
          <Link
            href={postListPath(section.basePath)}
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
          >
            <ArrowLeft size={15} /> {section.backLabel}
          </Link>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-blue-600">
            Thông tin việc làm
          </p>
          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl font-display">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500">
            {post.publishedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={15} />
                Đã đăng ngày {formatPostDate(post.publishedAt)}
              </span>
            ) : null}
            {post.author?.name ? (
              <span className="inline-flex items-center gap-1.5">
                <UserRound size={15} />
                Bởi {post.author.name}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-10 lg:py-14">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 lg:p-12">
          {heroImage ? (
            <div className="mb-9 overflow-hidden rounded-2xl border border-slate-100 bg-slate-100">
              <img
                src={heroImage}
                alt={post.title}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          ) : null}

          <div
            className="content-html prose max-w-none text-base leading-7 text-slate-700 prose-headings:font-display prose-headings:text-slate-900 prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-li:my-1.5 prose-a:text-blue-600 prose-strong:text-slate-900"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {relatedPosts.length > 0 ? (
          <section className="mt-12" aria-labelledby="related-jobs-title">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Tuyển dụng
                </p>
                <h2 id="related-jobs-title" className="text-2xl font-bold text-slate-900 font-display">
                  {section.relatedTitle}
                </h2>
              </div>
              <Link
                href={postListPath(section.basePath)}
                className="hidden items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 sm:inline-flex"
              >
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={postSectionPath(item.slug, section.basePath)}
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                      <Briefcase size={13} /> Cơ hội nghề nghiệp
                    </div>
                    <h3 className="line-clamp-2 font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                      {item.title}
                    </h3>
                    {item.publishedAt ? (
                      <p className="mt-2 text-xs text-slate-400">
                        {formatPostDate(item.publishedAt)}
                      </p>
                    ) : null}
                  </div>
                  <ArrowRight size={18} className="shrink-0 text-slate-300 group-hover:text-blue-600" />
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
