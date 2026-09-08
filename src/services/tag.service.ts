import { apiFetch } from '@/utils/api-client';
import { Tag } from '@/types/tag.type';

export class TagService {
  async getAllTags(): Promise<Tag[]> {
    return apiFetch<Tag[]>('/api/v1/tags');
  }

  async createTag(payload: { tagName: string; slug: string }): Promise<void> {
    return apiFetch('/api/v1/tags', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const tagService = new TagService();