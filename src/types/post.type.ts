export type PostStatus = 'PENDING' | 'DRAFT' | 'REJECTED' | 'DELETED' | 'APPROVED' | 'PUBLISHED' | 'UNPUBLISHED';

export interface TagInfo {
    id: number;
    name: string;
    slug: string;
}

export interface MediaInfo {
    id: number;
    filePath: string;
    fileType: string;
    altText?: string;
}

export interface CategoryInfo {
    id: number;
    name: string;
}

export interface AuthorInfo {
    id: number;
    name: string;
}

export interface OpenGraph {
    title?: string;
    description?: string;
    imageUrl?: string;
}

export interface PostMetadata {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    robots?: string;
    openGraph?: OpenGraph;
}

export interface ResPostDTO {
    id: number;
    title: string;
    slug: string;
    summary?: string;
    content: string;
    status: PostStatus;
    category?: CategoryInfo;
    author?: AuthorInfo;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    metadata?: PostMetadata;
    jsonLd?: any;
    tags?: TagInfo[];
    mediaList?: MediaInfo[];
}

export interface ResPostListDTO {
    id: number;
    title: string;
    slug: string;
    summary?: string;
    status: PostStatus;
    category?: CategoryInfo;
    author?: AuthorInfo;
    featuredMedia?: string;
    publishedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ReqPostCreateDTO {
    title: string;
    slug: string;
    summary?: string;
    content: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    isIndexable?: boolean;
    isFollowable?: boolean;
    ogTitle?: string;
    ogDescription?: string;
    ogImageId?: number | null;
    featuredMediaId?: number | null;
    categoryId: number;
    publishedAt?: string;
    tagIds?: number[];
    mediaIds?: number[];
}

export interface ReqPostUpdateDTO extends ReqPostCreateDTO {
    // status?: PostStatus;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    pages: number;
    total: number;
}

export interface PaginatedResponse<T> {
    meta: PaginationMeta;
    result: T[];
}export interface ReqPostFilterDTO {
    keyword?: string;
    status?: PostStatus | '';
    categoryId?: number;
    authorId?: number;
    fromDate?: string;
    toDate?: string;
}

export type PostReviewActionEnum = 'REJECTED' | 'PUBLISHED' | 'UNPUBLISHED' | 'APPROVED';

export interface ReqPostReviewDTO {
    action: PostReviewActionEnum;
    comment?: string;
}

export interface ReviewerInfo {
    userId: number;
    fullName: string;
    avatarUrl: string;
}

export interface ResPostReviewDTO {
    reviewId: number;
    postId: number;
    reviewerId: number;
    action: PostReviewActionEnum;
    comment: string;
    createdAt: string;
    updatedAt?: string;
    reviewer?: ReviewerInfo;
}