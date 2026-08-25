import { apiFetch } from '@/utils/api-client';
import type { GeneralInfo } from '@/types/setting.type';

export const settingService = {
  getGeneralInfo: () => {
    return apiFetch<{ statusCode: number; message: string; data: GeneralInfo }>('/api/v1/general-info');
  },

  updateGeneralInfo: (data: GeneralInfo) => {
    return apiFetch<{ statusCode: number; message: string; data: GeneralInfo }>('/api/v1/general-info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};