import type { ResPostDTO } from '@/types/post.type';

export const POST_LANGUAGE = 'vi';
export const DEFAULT_POST_BASE_PATH = '/bai-viet';

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

function normalizeBasePath(basePath: string): string {
  const normalized = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return normalized.replace(/\/+$/, '') || '/';
}

export function postListPath(basePath = DEFAULT_POST_BASE_PATH): string {
  return `/${POST_LANGUAGE}${normalizeBasePath(basePath)}`;
}

export function postSectionPath(slug: string, basePath = DEFAULT_POST_BASE_PATH): string {
  return `${postListPath(basePath)}/${encodeURIComponent(slug)}`;
}

export function postPath(slug: string): string {
  return postSectionPath(slug, DEFAULT_POST_BASE_PATH);
}

export function absoluteWebUrl(value?: string, siteUrl = getSiteUrl()): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value, siteUrl);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export function postCanonical(
  post: ResPostDTO,
  siteUrl = getSiteUrl(),
  basePath = DEFAULT_POST_BASE_PATH
): string {
  const fallback = new URL(postSectionPath(post.slug, basePath), `${siteUrl}/`).href;
  const configured = absoluteWebUrl(post.metadata?.canonicalUrl, siteUrl);
  if (!configured) return fallback;

  try {
    const configuredUrl = new URL(configured);
    const site = new URL(siteUrl);
    const localHosts = new Set(['localhost', '127.0.0.1']);
    if (!localHosts.has(site.hostname) && localHosts.has(configuredUrl.hostname)) return fallback;
    return configuredUrl.href;
  } catch {
    return fallback;
  }
}

export function postRobots(post: ResPostDTO) {
  if (post.status !== 'PUBLISHED') return { index: false, follow: false };

  const values = new Set(
    (post.metadata?.robots || '')
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(Boolean)
  );

  return {
    index: !values.has('noindex') && !values.has('none'),
    follow: !values.has('nofollow') && !values.has('none'),
  };
}

export function postDate(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}+07:00`;
  return Number.isNaN(Date.parse(normalized)) ? undefined : normalized;
}

interface ArticleSchemaOptions {
  basePath?: string;
  listName?: string;
}

export function articleSchema(
  post: ResPostDTO,
  siteUrl = getSiteUrl(),
  options: ArticleSchemaOptions = {}
) {
  const basePath = options.basePath || DEFAULT_POST_BASE_PATH;
  const canonical = postCanonical(post, siteUrl, basePath);
  const image = absoluteWebUrl(post.metadata?.openGraph?.imageUrl, siteUrl);
  const description = post.metadata?.description || post.summary || undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${canonical}#article`,
        url: canonical,
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        headline: post.metadata?.title || post.title,
        description,
        inLanguage: POST_LANGUAGE,
        datePublished: postDate(post.publishedAt || post.createdAt),
        dateModified: postDate(post.updatedAt || post.publishedAt || post.createdAt),
        author: post.author?.name ? { '@type': 'Person', name: post.author.name } : undefined,
        articleSection: post.category?.name || undefined,
        keywords: post.tags?.map((tag) => tag.name).filter(Boolean),
        image: image ? [image] : undefined,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: options.listName || 'Bài viết',
            item: new URL(postListPath(basePath), `${siteUrl}/`).href,
          },
          { '@type': 'ListItem', position: 2, name: post.title, item: canonical },
        ],
      },
    ],
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
