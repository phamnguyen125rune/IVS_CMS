import { apiFetch } from '@/utils/api-client';
import { Tag } from '@/types/tag.type';

export class TagService {
  async getAllTags(): Promise<Tag[]> {
    return apiFetch<Tag[]>('/api/v1/tags');
  }
}

export const tagService = new TagService();