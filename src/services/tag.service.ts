import { apiFetch } from '@/utils/api-client';
import type { ReqTagCreateDTO, Tag } from '@/types/tag.type';

export class TagService {
  getAllTags(): Promise<Tag[]> {
    return apiFetch<Tag[]>('/api/v1/tags');
  }

  createTag(payload: ReqTagCreateDTO): Promise<void> {
    return apiFetch<void>('/api/v1/tags', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  deleteTag(id: number): Promise<void> {
    return apiFetch<void>(`/api/v1/tags/${id}`, { method: 'DELETE' });
  }
}

export const tagService = new TagService();
