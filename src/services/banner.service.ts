import { apiFetch } from '@/utils/api-client';
import type {
  Banner,
  ReqCreateBannerDTO,
  ReqUpdateBannerDTO,
  BannerPaginationResult,
  BannerApiResponse,
} from '@/types/banner.type';

export const bannerService = {
  /**
   * Lấy danh sách banner đang hoạt động cho Client (Trang chủ)
   */
  getPublicBanners: (position: string = 'HOME_HERO') => {
    return apiFetch<BannerApiResponse<Banner[]>>(
      `/api/v1/banners/public?position=${encodeURIComponent(position)}`
    );
  },

  /**
   * Admin: Lấy danh sách banner có phân trang & tìm kiếm
   */
  getAllBanners: (
    params: {
      search?: string;
      position?: string;
      isActive?: boolean;
      page?: number;
      size?: number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.position) query.append('position', params.position);
    if (params.isActive !== undefined) query.append('isActive', String(params.isActive));
    if (params.page !== undefined) query.append('page', String(params.page));
    if (params.size !== undefined) query.append('size', String(params.size));

    const queryString = query.toString();
    const endpoint = `/api/v1/banners${queryString ? `?${queryString}` : ''}`;
    return apiFetch<BannerApiResponse<BannerPaginationResult>>(endpoint);
  },

  /**
   * Admin: Lấy chi tiết banner
   */
  getBannerById: (id: number) => {
    return apiFetch<BannerApiResponse<Banner>>(`/api/v1/banners/${id}`);
  },

  /**
   * Admin: Tạo mới banner
   */
  createBanner: (dto: ReqCreateBannerDTO) => {
    return apiFetch<BannerApiResponse<Banner>>('/api/v1/banners', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Admin: Cập nhật banner
   */
  updateBanner: (id: number, dto: ReqUpdateBannerDTO) => {
    return apiFetch<BannerApiResponse<Banner>>(`/api/v1/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Admin: Bật/tắt trạng thái banner
   */
  toggleStatus: (id: number, isActive: boolean) => {
    return apiFetch<BannerApiResponse<boolean>>(`/api/v1/banners/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ isActive }),
    });
  },

  /**
   * Admin: Xóa banner
   */
  deleteBanner: (id: number) => {
    return apiFetch<BannerApiResponse<boolean>>(`/api/v1/banners/${id}`, {
      method: 'DELETE',
    });
  },
};
