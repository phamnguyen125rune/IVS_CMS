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

  requestForgotPasswordOtp(email: string): Promise<void>;

  verifyForgotPasswordOtp(email: string, otp: string): Promise<ForgotPasswordVerifyResponse>;

  resetForgotPassword(payload: ResetPasswordPayload): Promise<void>;
}

export interface ForgotPasswordVerifyResponse {
  email: string;
  resetToken: string;
}

export interface ResetPasswordPayload {
  email: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
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

  async requestForgotPasswordOtp(email: string): Promise<void> {
    await apiFetch('/api/v1/auth/forgot-password/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyForgotPasswordOtp(email: string, otp: string): Promise<ForgotPasswordVerifyResponse> {
    return apiFetch<ForgotPasswordVerifyResponse>('/api/v1/auth/forgot-password/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async resetForgotPassword(payload: ResetPasswordPayload): Promise<void> {
    await apiFetch('/api/v1/auth/forgot-password/reset', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }
}

export const authService = new AuthService();
