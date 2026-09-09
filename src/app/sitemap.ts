import type { MetadataRoute } from 'next';

import { postService } from '@/services/post.service';
import { getSiteUrl, postPath } from '@/utils/post-seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const fixedEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/vi` },
    { url: `${siteUrl}/vi/bai-viet` },
  ];

  try {
    const data = await postService.getPosts({ status: 'PUBLISHED' }, 1, 1000);
    const posts: MetadataRoute.Sitemap = data.result.map((post) => ({
      url: `${siteUrl}${postPath(post.slug)}`,
      lastModified: post.updatedAt || post.publishedAt || post.createdAt,
    }));
    return [...fixedEntries, ...posts];
  } catch {
    return fixedEntries;
  }
}
