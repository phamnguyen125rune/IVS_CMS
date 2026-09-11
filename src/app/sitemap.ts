import type { MetadataRoute } from 'next';

import { RECRUITMENT_POST_SECTION } from '@/config/post-sections';
import { postService } from '@/services/post.service';
import { getSiteUrl, postPath, postSectionPath } from '@/utils/post-seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const fixedEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/vi` },
    { url: `${siteUrl}/vi/bai-viet` },
    { url: `${siteUrl}/vi/tuyen-dung` },
  ];

  try {
    const data = await postService.getPublicPosts({}, 1, 1000);
    const posts: MetadataRoute.Sitemap = data.result.map((post) => {
      const isRecruitment = post.category?.id === RECRUITMENT_POST_SECTION.categoryId;
      return {
        url: `${siteUrl}${isRecruitment
            ? postSectionPath(post.slug, RECRUITMENT_POST_SECTION.basePath)
            : postPath(post.slug)
          }`,
        lastModified: post.updatedAt || post.publishedAt || post.createdAt,
      };
    });
    return [...fixedEntries, ...posts];
  } catch {
    return fixedEntries;
  }
}
