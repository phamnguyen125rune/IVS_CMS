import Link from 'next/link';
import {
  Award,
  Briefcase,
  ChevronRight,
  Coffee,
  DollarSign,
  Heart,
  Search,
  TrendingUp,
} from 'lucide-react';

import PostPagination from '@/components/mock-cms/client/posts/PostPagination';
import { RECRUITMENT_POST_SECTION } from '@/config/post-sections';
import type { PaginatedResponse, ResPostListDTO } from '@/types/post.type';
import { postListPath, postSectionPath } from '@/utils/post-seo';
import { formatPostDate } from '@/utils/post-view';

interface RecruitmentProps {
  data: PaginatedResponse<ResPostListDTO>;
  keyword: string;
  page: number;
}

const benefits = [
  {
    icon: DollarSign,
    iconClassName: 'text-blue-600',
    title: 'Mức lương cạnh tranh',
    description:
      'Chính sách lương thưởng minh bạch, ghi nhận đúng năng lực và đóng góp của từng thành viên.',
  },
  {
    icon: Heart,
    iconClassName: 'text-pink-600',
    title: 'Chăm sóc sức khỏe',
    description:
      'Môi trường làm việc quan tâm đến sức khỏe, sự cân bằng và trải nghiệm lâu dài của nhân sự.',
  },
  {
    icon: TrendingUp,
    iconClassName: 'text-green-600',
    title: 'Phát triển sự nghiệp',
    description:
      'Cơ hội học hỏi, nâng cao chuyên môn và phát triển theo lộ trình phù hợp với năng lực.',
  },
  {
    icon: Coffee,
    iconClassName: 'text-orange-600',
    title: 'Môi trường năng động',
    description:
      'Không gian làm việc cởi mở, đề cao tinh thần hợp tác, chủ động và sáng tạo.',
  },
] as const;

export default function Recruitment({ data, keyword, page }: RecruitmentProps) {
  const posts = data.result || [];
  const listPath = postListPath(RECRUITMENT_POST_SECTION.basePath);

  const hrefForPage = (nextPage: number) => {
    const query = new URLSearchParams();
    if (keyword) query.set('q', keyword);
    if (nextPage > 1) query.set('page', String(nextPage));
    const suffix = query.toString();
    return `${listPath}${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50" lang="vi">
      <section
        className="border-b"
        style={{
          borderColor: 'var(--border)',
          background:
            'linear-gradient(135deg, var(--hero-start) 0%, var(--hero-middle) 100%)',
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center lg:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600">
            <Award size={16} />
            <span>Nơi phát triển sự nghiệp của bạn</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold leading-tight text-white lg:text-5xl font-display">
            Cùng chúng tôi kiến tạo <br className="hidden md:block" />
            <span className="text-blue-500">tương lai số</span>
          </h1>

          <p className="mb-10 max-w-2xl text-lg text-slate-300">
            Chúng tôi luôn tìm kiếm những tài năng đam mê công nghệ, sáng tạo và không ngại thử
            thách để cùng nhau xây dựng những sản phẩm mang lại giá trị thực cho cộng đồng.
          </p>

          <form action={listPath} method="get" className="relative w-full max-w-2xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="search"
              name="q"
              defaultValue={keyword}
              placeholder={RECRUITMENT_POST_SECTION.searchPlaceholder}
              className="w-full rounded-xl border bg-white py-4 pl-12 pr-24 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
              style={{ borderColor: 'var(--border)' }}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="py-20" style={{ background: 'var(--background)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold font-display" style={{ color: 'var(--text)' }}>
              Tại sao chọn chúng tôi?
            </h2>
            <p className="mx-auto max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              Chúng tôi tin rằng nhân sự là tài sản quý giá nhất. Tại đây, bạn sẽ được trao quyền,
              hỗ trợ và ghi nhận xứng đáng.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="rounded-2xl border p-6 transition-shadow duration-300 hover:shadow-lg"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div
                    className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{ background: 'var(--surface-secondary)' }}
                  >
                    <Icon size={24} className={benefit.iconClassName} />
                  </div>
                  <h3 className="mb-3 text-lg font-bold" style={{ color: 'var(--text)' }}>
                    {benefit.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="border-t py-20"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h2 className="mb-4 text-3xl font-bold font-display" style={{ color: 'var(--text)' }}>
                Vị trí đang tuyển
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                {keyword
                  ? `Kết quả phù hợp với “${keyword}”`
                  : 'Tìm kiếm cơ hội phù hợp với chuyên môn và định hướng của bạn.'}
              </p>
            </div>
            <div
              className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
              style={{ background: 'var(--surface-tertiary)', color: 'var(--text-secondary)' }}
            >
              <Briefcase size={16} />
              {data.meta.total} vị trí
            </div>
          </div>

          <div className="space-y-4">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col justify-between gap-5 rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md md:flex-row md:items-center"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                >
                  <div className="min-w-0">
                    <h3
                      className="mb-3 text-lg font-bold transition-colors group-hover:text-blue-600"
                      style={{ color: 'var(--text)' }}
                    >
                      {post.title}
                    </h3>
                    <div
                      className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase size={16} />
                        Cơ hội nghề nghiệp
                      </span>
                      {post.publishedAt ? (
                        <time dateTime={post.publishedAt}>
                          Đăng ngày {formatPostDate(post.publishedAt)}
                        </time>
                      ) : null}
                      {post.author?.name ? <span>Đăng bởi {post.author.name}</span> : null}
                    </div>
                  </div>

                  <Link
                    href={postSectionPath(post.slug, RECRUITMENT_POST_SECTION.basePath)}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-medium transition-colors"
                    style={{ background: 'var(--surface-secondary)', color: 'var(--primary)' }}
                  >
                    Xem chi tiết
                    <ChevronRight size={16} />
                  </Link>
                </article>
              ))
            ) : (
              <div
                className="rounded-2xl border-2 border-dashed py-12 text-center"
                style={{ borderColor: 'var(--border)' }}
              >
                <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {RECRUITMENT_POST_SECTION.emptyTitle}
                </p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {RECRUITMENT_POST_SECTION.emptyDescription}
                </p>
              </div>
            )}
          </div>

          <PostPagination
            page={page}
            totalPages={data.meta.pages}
            hrefForPage={hrefForPage}
            ariaLabel="Phân trang tuyển dụng"
          />
        </div>
      </section>
    </div>
  );
}
