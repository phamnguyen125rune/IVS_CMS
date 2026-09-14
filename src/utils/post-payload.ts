import type { ReqPostCreateDTO } from '@/types/post.type';

export function mediaIdFromUrl(url?: string | null): number | null {
  const match = url?.match(/\/api\/v1\/media\/(\d+)\/view(?:[?#]|$)/);
  return match ? Number(match[1]) : null;
}

function validId(value: number): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('ID liên kết không hợp lệ.');
  return id;
}

function uniqueIds(values: number[]): number[] {
  return [...new Set(values.map(validId))];
}

function optional(value?: string): string | undefined {
  return value?.trim() || undefined;
}

export function preparePostPayload(input: ReqPostCreateDTO): ReqPostCreateDTO {
  const title = input.title.trim();
  const slug = input.slug.trim();
  const categoryId = Number(input.categoryId);

  if (!title) throw new Error('Vui lòng nhập tiêu đề.');
  if (!slug) throw new Error('Vui lòng nhập slug.');
  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
    throw new Error('Vui lòng chọn danh mục.');
  }

  const plainContent = input.content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  if (!plainContent && !/<(img|iframe|video|audio)\b/i.test(input.content)) {
    throw new Error('Vui lòng nhập nội dung bài viết.');
  }

  if (Array.from(title).length > 100) throw new Error('Tiêu đề tối đa 100 ký tự.');
  if (Array.from(slug).length > 255) throw new Error('Slug tối đa 255 ký tự.');

  const featuredMediaId = input.featuredMediaId == null ? null : validId(input.featuredMediaId);
  const ogImageId = input.ogImageId == null ? null : validId(input.ogImageId);
  const contentMediaIds = Array.from(
    input.content.matchAll(/\/api\/v1\/media\/(\d+)\/view/g),
    (match) => Number(match[1])
  );

  const mediaIds = uniqueIds([
    ...(featuredMediaId ? [featuredMediaId] : []),
    ...(ogImageId ? [ogImageId] : []),
    ...contentMediaIds,
    ...(input.mediaIds || []),
  ]);

  return {
    title,
    slug,
    summary: optional(input.summary),
    content: input.content,
    categoryId,
    metaTitle: optional(input.metaTitle),
    metaDescription: optional(input.metaDescription),
    canonicalUrl: optional(input.canonicalUrl),
    isIndexable: input.isIndexable ?? true,
    isFollowable: input.isFollowable ?? true,
    ogTitle: optional(input.ogTitle),
    ogDescription: optional(input.ogDescription),
    ogImageId,
    featuredMediaId,
    publishedAt: optional(input.publishedAt),
    tagIds: uniqueIds(input.tagIds || []),
    mediaIds,
  };
}
