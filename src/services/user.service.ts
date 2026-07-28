import { apiFetch } from '@/utils/api-client';
import { ResUserDTO } from '@/types';

/**
 * Interface định nghĩa các phương thức cho dịch vụ người dùng (User Service).
 */
export interface IUserService {
  /**
   * Lấy thông tin hồ sơ của người dùng hiện tại đang đăng nhập.
   *
   * @returns Promise chứa thông tin chi tiết người dùng dưới dạng ResUserDTO.
   */
  getMyProfile(): Promise<ResUserDTO>;
}

/**
 * Lớp triển khai dịch vụ người dùng (User Service).
 * Giao tiếp trực tiếp với hệ thống backend thông qua apiFetch client.
 */
export class UserService implements IUserService {
  /**
   * Thực hiện cuộc gọi API lấy thông tin cá nhân của người dùng hiện tại.
   *
   * @returns Promise chứa thông tin chi tiết người dùng dưới dạng ResUserDTO.
   */
  async getMyProfile(): Promise<ResUserDTO> {
    return apiFetch<ResUserDTO>('/api/v1/users/me', {
      method: 'GET',
    });
  }
}

export const userService = new UserService();
