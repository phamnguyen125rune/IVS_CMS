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

/**
 * Hàm gọi API dùng chung, tự động xử lý cấu hình base URL, chèn Authorization token
 * ở phía server, và chuẩn hóa lỗi phản hồi.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const backendUrl =
    process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${backendUrl}${cleanPath}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Tự động chèn token session khi gọi API từ phía Server (Server Components / API Routes)
  if (isServer) {
    try {
      // Import động next/headers để tránh lỗi đóng gói trên trình duyệt client
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('session_token')?.value;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      console.warn(
        'Unable to access cookies on server-side request (likely not in request context)'
      );
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, fetchOptions);

    // Xử lý kiểm tra phản hồi lỗi HTTP
    if (!res.ok) {
      let errorInfo;
      try {
        errorInfo = await res.json();
      } catch {
        errorInfo = null;
      }

      const errorMessage = errorInfo?.message || `HTTP error! status: ${res.status}`;
      console.error(`[API ERROR] ${res.status} ${url}:`, errorInfo);

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
    console.error(`[CONNECTION ERROR] Failed to fetch ${url}:`, error);
    throw new ApiError('Không thể kết nối đến máy chủ backend', 503);
  }
}
