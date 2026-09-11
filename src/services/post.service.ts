import { apiFetch } from '@/utils/api-client';
import type {
  PaginatedResponse,
  PostReviewRecord,
  PostStatus,
  ReqPostCreateDTO,
  ReqPostFilterDTO,
  ReqPostReviewDTO,
  ReqPostUpdateDTO,
  ResPostDTO,
  ResPostListDTO,
  ResPostReviewDTO,
} from '@/types/post.type';

export class PostService {
  getPosts(
    filter: ReqPostFilterDTO = {},
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<ResPostListDTO>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });

    if (filter.keyword?.trim()) params.set('keyword', filter.keyword.trim());
    if (filter.status) params.set('status', filter.status);
    if (filter.categoryId) params.set('categoryId', String(filter.categoryId));
    if (filter.authorId) params.set('authorId', String(filter.authorId));
    if (filter.fromDate) params.set('fromDate', filter.fromDate);
    if (filter.toDate) params.set('toDate', filter.toDate);

    return apiFetch<PaginatedResponse<ResPostListDTO>>(`/api/v1/posts?${params.toString()}`);
  }

  getPublicPosts(
    filter: Omit<ReqPostFilterDTO, 'status' | 'authorId' | 'fromDate' | 'toDate'> = {},
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<ResPostListDTO>> {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (filter.keyword?.trim()) params.set('keyword', filter.keyword.trim());
    if (filter.categoryId) params.set('categoryId', String(filter.categoryId));
    return apiFetch<PaginatedResponse<ResPostListDTO>>(`/api/v1/posts/public?${params.toString()}`);
  }

  async getPostsExcludingCategory(
    filter: ReqPostFilterDTO,
    excludedCategoryId: number,
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<ResPostListDTO>> {
    if (filter.categoryId) {
      if (filter.categoryId === excludedCategoryId) {
        return {
          meta: { page, pageSize: size, pages: 0, total: 0 },
          result: [],
        };
      }
      return this.getPosts(filter, page, size);
    }

    // The current BE supports category inclusion but not category exclusion.
    // Fetch published/search results in larger chunks, preserve backend order,
    // remove recruitment posts, then paginate the remaining news on the FE.
    const chunkSize = 100;
    const first = await this.getPosts(filter, 1, chunkSize);
    const chunks: ResPostListDTO[][] = [first.result || []];

    for (let currentPage = 2; currentPage <= first.meta.pages; currentPage += 1) {
      const nextChunk = await this.getPosts(filter, currentPage, chunkSize);
      chunks.push(nextChunk.result || []);
    }

    const filtered = chunks
      .flat()
      .filter((post) => post.category?.id !== excludedCategoryId);

    const total = filtered.length;
    const pages = total === 0 ? 0 : Math.ceil(total / size);
    const start = (page - 1) * size;

    return {
      meta: { page, pageSize: size, pages, total },
      result: filtered.slice(start, start + size),
    };
  }

  getPostById(id: number): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>(`/api/v1/posts/${id}`);
  }

  getPostBySlug(slug: string): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>(`/api/v1/posts/slug/${encodeURIComponent(slug)}`);
  }

  getPublicPostBySlug(slug: string): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>(`/api/v1/posts/public/slug/${encodeURIComponent(slug)}`);
  }

  async getPublicPostsExcludingCategory(
    filter: Omit<ReqPostFilterDTO, 'status' | 'authorId' | 'fromDate' | 'toDate'>,
    excludedCategoryId: number,
    page = 1,
    size = 10
  ): Promise<PaginatedResponse<ResPostListDTO>> {
    if (filter.categoryId) {
      if (filter.categoryId === excludedCategoryId) {
        return { meta: { page, pageSize: size, pages: 0, total: 0 }, result: [] };
      }
      return this.getPublicPosts(filter, page, size);
    }

    const chunkSize = 100;
    const first = await this.getPublicPosts(filter, 1, chunkSize);
    const chunks: ResPostListDTO[][] = [first.result || []];
    for (let currentPage = 2; currentPage <= first.meta.pages; currentPage += 1) {
      const nextChunk = await this.getPublicPosts(filter, currentPage, chunkSize);
      chunks.push(nextChunk.result || []);
    }

    const filtered = chunks.flat().filter((post) => post.category?.id !== excludedCategoryId);
    const total = filtered.length;
    const pages = total === 0 ? 0 : Math.ceil(total / size);
    const start = (page - 1) * size;
    return { meta: { page, pageSize: size, pages, total }, result: filtered.slice(start, start + size) };
  }

  createPost(payload: ReqPostCreateDTO): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  updatePost(id: number, payload: ReqPostUpdateDTO): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>(`/api/v1/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  deletePost(id: number): Promise<void> {
    return apiFetch<void>(`/api/v1/posts/${id}`, { method: 'DELETE' });
  }

  changeStatus(id: number, status: PostStatus): Promise<void> {
    return apiFetch<void>(`/api/v1/posts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  reviewPost(postId: number, payload: ReqPostReviewDTO): Promise<PostReviewRecord> {
    return apiFetch<PostReviewRecord>(`/api/v1/posts/${postId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  getPostReviews(postId: number): Promise<ResPostReviewDTO[]> {
    return apiFetch<ResPostReviewDTO[]>(`/api/v1/posts/${postId}/reviews`);
  }
}

export const postService = new PostService();
