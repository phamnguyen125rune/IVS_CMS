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

  getPostById(id: number): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>(`/api/v1/posts/${id}`);
  }

  getPostBySlug(slug: string): Promise<ResPostDTO> {
    return apiFetch<ResPostDTO>(`/api/v1/posts/slug/${encodeURIComponent(slug)}`);
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
