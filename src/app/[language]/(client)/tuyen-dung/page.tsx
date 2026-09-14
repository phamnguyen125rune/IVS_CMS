import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Recruitment from '@/components/mock-cms/client/Recruitment';
import { RECRUITMENT_POST_SECTION } from '@/config/post-sections';
import { postService } from '@/services/post.service';
import { getSiteUrl, postListPath } from '@/utils/post-seo';

interface PageProps {
  params: Promise<{ language: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const query = await searchParams;
  const page = parsePositiveInt(query.page) || 1;
  const siteUrl = getSiteUrl();
  const listPath = postListPath(RECRUITMENT_POST_SECTION.basePath);
  const canonical = `${siteUrl}${listPath}${page > 1 ? `?page=${page}` : ''}`;

  return {
    title: 'Tuyển dụng',
    description: RECRUITMENT_POST_SECTION.description,
    alternates: { canonical },
    robots: { index: !query.q?.trim(), follow: true },
  };
}

export default async function RecruitmentPage({ params, searchParams }: PageProps) {
  const [{ language }, query] = await Promise.all([params, searchParams]);
  const listPath = postListPath(RECRUITMENT_POST_SECTION.basePath);

  if (language !== 'vi') {
    const redirectQuery = new URLSearchParams();
    if (query.q) redirectQuery.set('q', query.q);
    if (query.page) redirectQuery.set('page', query.page);
    redirect(`${listPath}${redirectQuery.size ? `?${redirectQuery}` : ''}`);
  }

  const page = parsePositiveInt(query.page) || 1;
  const data = await postService.getPublicPosts(
    {
      keyword: query.q?.trim() || undefined,
      categoryId: RECRUITMENT_POST_SECTION.categoryId,
    },
    page,
    10
  );

  if (page > Math.max(1, data.meta.pages)) notFound();

  return <Recruitment data={data} keyword={query.q?.trim() || ''} page={page} />;
}

function parsePositiveInt(value?: string) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}
