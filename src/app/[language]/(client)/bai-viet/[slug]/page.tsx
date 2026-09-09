import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import PostDetail from '@/components/mock-cms/client/PostDetail';
import { postService } from '@/services/post.service';
import {
  absoluteWebUrl,
  articleSchema,
  getSiteUrl,
  postCanonical,
  postDate,
  postPath,
  postRobots,
  serializeJsonLd,
} from '@/utils/post-seo';

interface PageProps {
  params: Promise<{ language: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await postService.getPostBySlug(slug);
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

  try {
    const post = await postService.getPostBySlug(slug);
    if (!post) notFound();

    const schema = post.status === 'PUBLISHED' ? articleSchema(post, getSiteUrl()) : null;

    return (
      <>
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
          />
        )}
        <PostDetail post={post} />
      </>
    );
  } catch {
    notFound();
  }
}
