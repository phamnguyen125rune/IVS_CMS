import { apiFetch } from '@/utils/api-client';
import {
  ReqPostCreateDTO,
  ReqPostUpdateDTO,
  ResPostDTO,
  ResPostListDTO,
  PostStatus,
  PaginatedResponse,
  ReqPostFilterDTO,
  ReqPostReviewDTO,
  ResPostReviewDTO,
} from '@/types/post.type';

type ApiResponse<T> = T | { data?: T };

export class PostService {
  async getPosts(
    filter: ReqPostFilterDTO,
    page: number = 1,
    size: number = 10
  ): Promise<PaginatedResponse<ResPostListDTO>> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (filter.keyword) params.append('keyword', filter.keyword);
    if (filter.status) params.append('status', filter.status);
    if (filter.categoryId) params.append('categoryId', filter.categoryId.toString());
    if (filter.authorId) params.append('authorId', filter.authorId.toString());

    const res = await apiFetch<ApiResponse<PaginatedResponse<ResPostListDTO>>>(
      `/api/v1/posts?${params.toString()}`
    );
    return (res && 'data' in res && res.data ? res.data : res) as PaginatedResponse<ResPostListDTO>;
  }

  async getPostById(id: number): Promise<ResPostDTO> {
    const res = await apiFetch<ApiResponse<ResPostDTO>>(`/api/v1/posts/${id}`);
    return (res && 'data' in res && res.data ? res.data : res) as ResPostDTO;
  }

  async createPost(payload: ReqPostCreateDTO): Promise<ResPostDTO> {
    const res = await apiFetch<ApiResponse<ResPostDTO>>('/api/v1/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return (res && 'data' in res && res.data ? res.data : res) as ResPostDTO;
  }

  async updatePost(id: number, payload: ReqPostUpdateDTO): Promise<ResPostDTO> {
    const res = await apiFetch<ApiResponse<ResPostDTO>>(`/api/v1/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return (res && 'data' in res && res.data ? res.data : res) as ResPostDTO;
  }

  async deletePost(id: number): Promise<void> {
    await apiFetch(`/api/v1/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async changeStatus(id: number, status: PostStatus): Promise<void> {
    await apiFetch(`/api/v1/posts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async reviewPost(postId: number, payload: ReqPostReviewDTO): Promise<ResPostReviewDTO> {
    const res = await apiFetch<ApiResponse<ResPostReviewDTO>>(`/api/v1/posts/${postId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return (res && 'data' in res && res.data ? res.data : res) as ResPostReviewDTO;
  }

  async getPostReviews(postId: number): Promise<ResPostReviewDTO[]> {
    const res = await apiFetch<ApiResponse<ResPostReviewDTO[]>>(`/api/v1/posts/${postId}/reviews`);
    return (res && 'data' in res && res.data ? res.data : res) as ResPostReviewDTO[];
  }
}

export const postService = new PostService();
