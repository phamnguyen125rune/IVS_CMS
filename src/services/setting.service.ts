import { apiFetch } from '@/utils/api-client';
import type { GeneralInfo, UpdateGeneralInfoRequest } from '@/types/setting.type';

interface GeneralInfoResponse {
  statusCode: number;
  message: string;
  data: GeneralInfo;
}

export const settingService = {
  /**

* Lấy thông tin chung của website.
*
* API này được sử dụng bởi:
* * Admin Settings
* * ClientFooter
* * Contact
    */
  getGeneralInfo: () => {
    return apiFetch<GeneralInfoResponse>('/api/v1/general-info');
  },

  /**

* Cập nhật thông tin chung của website.
*
* Chỉ gửi những field mà admin được phép chỉnh sửa.
  */
  updateGeneralInfo: (data: UpdateGeneralInfoRequest) => {
    return apiFetch<GeneralInfoResponse>('/api/v1/general-info', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
