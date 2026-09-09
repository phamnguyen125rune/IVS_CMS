import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Blog from '@/components/mock-cms/client/Blog';
import { categoryService } from '@/services/category.service';
import { postService } from '@/services/post.service';
import { getSiteUrl } from '@/utils/post-seo';

interface PageProps {
  params: Promise<{ language: string }>;
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = await searchParams;
  const page = parsePositiveInt(query.page) || 1;
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/vi/bai-viet${page > 1 ? `?page=${page}` : ''}`;
  const filtered = Boolean(query.q?.trim() || query.category);

  return {
    title: 'Bài viết',
    description: 'Danh sách bài viết đã xuất bản.',
    alternates: { canonical },
    robots: { index: !filtered, follow: true },
  };
}

export default async function BlogPage({ params, searchParams }: PageProps) {
  const [{ language }, query] = await Promise.all([params, searchParams]);

  if (language !== 'vi') {
    const redirectQuery = new URLSearchParams();
    if (query.q) redirectQuery.set('q', query.q);
    if (query.category) redirectQuery.set('category', query.category);
    if (query.page) redirectQuery.set('page', query.page);
    redirect(`/vi/bai-viet${redirectQuery.size ? `?${redirectQuery}` : ''}`);
  }

  const page = parsePositiveInt(query.page) || 1;
  const categoryId = query.category ? parsePositiveInt(query.category) : undefined;
  if (query.category && !categoryId) notFound();

  const [data, categories] = await Promise.all([
    postService.getPosts(
      {
        status: 'PUBLISHED',
        keyword: query.q?.trim() || undefined,
        categoryId,
      },
      page,
      10
    ),
    categoryService.getAllCategories(),
  ]);

  if (page > Math.max(1, data.meta.pages)) notFound();

  return (
    <Blog
      data={data}
      categories={categories}
      keyword={query.q?.trim() || ''}
      categoryId={categoryId}
      page={page}
    />
  );
}

function parsePositiveInt(value?: string) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}
