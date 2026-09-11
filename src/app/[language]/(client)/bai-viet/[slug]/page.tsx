import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import PostDetail from '@/components/mock-cms/client/PostDetail';
import { RECRUITMENT_POST_SECTION } from '@/config/post-sections';
import { postService } from '@/services/post.service';
import type { ResPostDTO, ResPostListDTO } from '@/types/post.type';
import {
  absoluteWebUrl,
  articleSchema,
  getSiteUrl,
  postCanonical,
  postDate,
  postPath,
  postSectionPath,
  postRobots,
  serializeJsonLd,
} from '@/utils/post-seo';

interface PageProps {
  params: Promise<{ language: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await postService.getPublicPostBySlug(slug);
    if (post.status !== 'PUBLISHED') {
      return { title: 'Bài viết không tồn tại', robots: { index: false, follow: false } };
    }
    if (post.category?.id === RECRUITMENT_POST_SECTION.categoryId) {
      return {
        title: post.metadata?.title || post.title,
        description: post.metadata?.description || `Thông tin tuyển dụng ${post.title}`,
        alternates: {
          canonical: postCanonical(post, getSiteUrl(), RECRUITMENT_POST_SECTION.basePath),
        },
        robots: postRobots(post),
      };
    }
    const siteUrl = getSiteUrl();
    const canonical = postCanonical(post, siteUrl);
    const robots = postRobots(post);
    const title = post.metadata?.title || post.title;
    const description = post.metadata?.description || post.summary || '';
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
    return { title: 'Bài viết không tồn tại', robots: { index: false, follow: false } };
  }
}

export default async function SinglePostPage({ params }: PageProps) {
  const { language, slug } = await params;
  if (language !== 'vi') redirect(postPath(slug));

  let post: ResPostDTO;
  try {
    post = await postService.getPublicPostBySlug(slug);
  } catch {
    notFound();
  }

  if (post.status !== 'PUBLISHED') notFound();

  if (post.category?.id === RECRUITMENT_POST_SECTION.categoryId) {
    redirect(postSectionPath(post.slug, RECRUITMENT_POST_SECTION.basePath));
  }

  let recentPosts: ResPostListDTO[] = [];
  try {
    const recruitmentCategoryId = RECRUITMENT_POST_SECTION.categoryId;
    const recentData = post.category?.id
      ? await postService.getPublicPosts(
        { categoryId: post.category.id },
        1,
        6
      )
      : recruitmentCategoryId
        ? await postService.getPublicPostsExcludingCategory(
          {},
          recruitmentCategoryId,
          1,
          6
        )
        : await postService.getPublicPosts({}, 1, 6);
    recentPosts = recentData.result || [];
  } catch {
    recentPosts = [];
  }

  const schema = post.status === 'PUBLISHED' ? articleSchema(post, getSiteUrl()) : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
        />
      )}
      <PostDetail post={post} recentPosts={recentPosts} />
    </>
  );
}
