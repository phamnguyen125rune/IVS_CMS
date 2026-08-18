import { ResUserDTO } from '@/types';
import { apiFetch } from '@/utils/api-client';

export class UserService {
  async getMyProfile(): Promise<ResUserDTO> {
    return apiFetch<ResUserDTO>('/api/v1/users/me');
  }
}

export const userService = new UserService();
