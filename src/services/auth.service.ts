import { apiFetch } from '@/utils/api-client';
import { AuthResponse } from '@/types';

/**
 * Interface định nghĩa các phương thức cho dịch vụ Xác thực (Authentication Service).
 */
export interface IAuthService {
  /**
   * Yêu cầu đăng nhập tài khoản người dùng gửi tới Java Spring Boot backend.
   *
   * @param loginId - Email hoặc mã nhân viên của người dùng.
   * @param password - Mật khẩu của người dùng.
   * @returns Promise chứa thông tin token truy cập và thông tin người dùng.
   */
  login(loginId: string, password: string): Promise<AuthResponse>;
}

/**
 * Lớp triển khai dịch vụ Xác thực (Authentication Service).
 * Giao tiếp trực tiếp với hệ thống backend thông qua apiFetch client.
 */
export class AuthService implements IAuthService {
  /**
   * Thực hiện cuộc gọi API đăng nhập tài khoản.
   *
   * @param loginId - Email hoặc mã nhân viên của người dùng.
   * @param password - Mật khẩu của người dùng.
   * @returns Promise chứa thông tin token truy cập và thông tin người dùng.
   */
  async login(loginId: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ loginId, password }),
    });
  }
}

export const authService = new AuthService();
