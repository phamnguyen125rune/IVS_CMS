import { apiFetch } from '@/utils/api-client';
import { CmsRecord } from '@/lib/cms-demo-store';
import { ResultPaginationDTO } from '@/types';

export interface CmsRecordPayload {
  moduleKey: string;
  title: string;
  subtitle?: string;
  type?: string;
  status?: string;
  owner?: string;
  description?: string;
  imageUrl?: string;
}

export class CmsRecordService {
  async findAll(params: {
    moduleKey?: string;
    search?: string;
    status?: string;
    page?: number;
    size?: number;
  }): Promise<ResultPaginationDTO<CmsRecord>> {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        searchParams.set(key, String(value));
      }
    });
    return apiFetch<ResultPaginationDTO<CmsRecord>>(`/api/v1/cms-records?${searchParams}`);
  }

  async findPublished(moduleKey: string, page = 1, size = 20): Promise<CmsRecord[]> {
    return apiFetch<CmsRecord[]>(
      `/api/v1/public/cms-records?moduleKey=${moduleKey}&page=${page}&size=${size}`
    );
  }

  async create(payload: CmsRecordPayload): Promise<CmsRecord> {
    return apiFetch<CmsRecord>('/api/v1/cms-records', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async update(id: number, payload: CmsRecordPayload): Promise<CmsRecord> {
    return apiFetch<CmsRecord>(`/api/v1/cms-records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async updateStatus(id: number, status: string): Promise<CmsRecord> {
    return apiFetch<CmsRecord>(`/api/v1/cms-records/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async delete(id: number): Promise<void> {
    await apiFetch(`/api/v1/cms-records/${id}`, {
      method: 'DELETE',
    });
  }
}

export const cmsRecordService = new CmsRecordService();
