import { apiFetch } from '@/utils/api-client';
import { ReqCommentCreateDTO, ReqCommentUpdateDTO, ResCommentDTO } from '@/types/comment.type';

export class CommentService {
  async getPostComments(postId: number, status: string = 'approved'): Promise<ResCommentDTO[]> {
    return apiFetch<ResCommentDTO[]>(`/api/v1/posts/${postId}/comments?status=${status}`);
  }

  async createComment(payload: ReqCommentCreateDTO): Promise<any> {
    return apiFetch('/api/v1/comments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateComment(id: number, payload: ReqCommentUpdateDTO): Promise<any> {
    return apiFetch(`/api/v1/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteComment(id: number): Promise<void> {
    return apiFetch(`/api/v1/comments/${id}`, {
      method: 'DELETE',
    });
  }

  async changeStatus(
    id: number,
    status: 'pending' | 'approved' | 'rejected' | 'spam'
  ): Promise<void> {
    return apiFetch(`/api/v1/comments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const commentService = new CommentService();
