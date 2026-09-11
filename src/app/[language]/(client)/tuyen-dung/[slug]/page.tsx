import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import RecruitmentDetailView from '@/components/mock-cms/client/posts/RecruitmentDetailView';
import { RECRUITMENT_POST_SECTION } from '@/config/post-sections';
import { postService } from '@/services/post.service';
import type { ResPostListDTO } from '@/types/post.type';
import {
  absoluteWebUrl,
  articleSchema,
  getSiteUrl,
  postCanonical,
  postDate,
  postRobots,
  postSectionPath,
  serializeJsonLd,
} from '@/utils/post-seo';

interface PageProps {
  params: Promise<{ language: string; slug: string }>;
}

function isRecruitmentPost(post: { category?: { id: number }; status: string }) {
  return (
    post.status === 'PUBLISHED' && post.category?.id === RECRUITMENT_POST_SECTION.categoryId
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await postService.getPublicPostBySlug(slug);
    if (!isRecruitmentPost(post)) {
      return { title: 'Tin tuyển dụng không tồn tại', robots: { index: false, follow: false } };
    }

    const siteUrl = getSiteUrl();
    const canonical = postCanonical(post, siteUrl, RECRUITMENT_POST_SECTION.basePath);
    const robots = postRobots(post);
    const title = post.metadata?.title || post.title;
    const description = post.metadata?.description || `Thông tin tuyển dụng ${post.title}`;
    const image = absoluteWebUrl(post.metadata?.openGraph?.imageUrl, siteUrl);

    return {
      title,
      description,
      alternates: { canonical },
      robots,
      openGraph: {
        type: 'article',
        url: canonical,
        title: post.metadata?.openGraph?.title || title,
        description: post.metadata?.openGraph?.description || description,
        publishedTime: postDate(post.publishedAt),
        modifiedTime: postDate(post.updatedAt),
        authors: post.author?.name ? [post.author.name] : undefined,
        images: image ? [{ url: image, alt: title }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.metadata?.openGraph?.title || title,
        description: post.metadata?.openGraph?.description || description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return { title: 'Tin tuyển dụng không tồn tại', robots: { index: false, follow: false } };
  }
}

export default async function RecruitmentDetailPage({ params }: PageProps) {
  const { language, slug } = await params;
  if (language !== 'vi') redirect(postSectionPath(slug, RECRUITMENT_POST_SECTION.basePath));

  try {
    const post = await postService.getPublicPostBySlug(slug);
    if (!isRecruitmentPost(post)) notFound();

    let recentPosts: ResPostListDTO[] = [];
    try {
      const recentData = await postService.getPublicPosts(
        {
          categoryId: RECRUITMENT_POST_SECTION.categoryId,
        },
        1,
        6
      );
      recentPosts = recentData.result || [];
    } catch {
      recentPosts = [];
    }

    const schema = articleSchema(post, getSiteUrl(), {
      basePath: RECRUITMENT_POST_SECTION.basePath,
      listName: 'Tuyển dụng',
    });

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
        <RecruitmentDetailView
          post={post}
          recentPosts={recentPosts}
          section={RECRUITMENT_POST_SECTION}
        />
      </>
    );
  } catch {
    notFound();
  }
}
