// src/utils/api-client.ts

const isServer = typeof window === 'undefined';

export class ApiError extends Error {
  status: number;
  info?: unknown;

  constructor(message: string, status: number, info?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.info = info;
  }
}

// Hàm đọc Cookie chuẩn trên Browser
function getCookie(name: string): string | null {
  if (isServer) return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = isServer
    ? `${process.env.BACKEND_API_URL || 'http://localhost:8080'}${cleanPath}`
    : cleanPath;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 1. Phía SERVER (Server Component / SSR): Lấy token qua next/headers
  if (isServer) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token =
        cookieStore.get('session_token')?.value ||
        cookieStore.get('access_token')?.value ||
        cookieStore.get('token')?.value;

      if (token && !headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      console.warn('Unable to access cookies on server-side context');
    }
  }
  // 2. Phía CLIENT (Trình duyệt): Lấy token từ localStorage hoặc Cookie
  else {
    let token: string | null = null;

    if (typeof localStorage !== 'undefined') {
      token = localStorage.getItem('token') || localStorage.getItem('access_token');
    }

    if (!token) {
      token = getCookie('session_token') || getCookie('access_token') || getCookie('token');
    }

    // Đính kèm Header Authorization
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (!token) {
      console.warn('[API WARN] Không tìm thấy token ở localStorage lẫn Cookie');
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      let errorInfo;
      try {
        errorInfo = await res.json();
      } catch {
        errorInfo = null;
      }

      const errorMessage = errorInfo?.message || `HTTP error! status: ${res.status}`;
      // console.error(`[API ERROR] ${res.status} ${url}:`, errorInfo);
      throw new ApiError(errorMessage, res.status, errorInfo);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // console.error(`[CONNECTION ERROR] Failed to fetch ${url}:`, error);
    throw new ApiError('Không thể kết nối đến máy chủ backend', 503);
  }
}
