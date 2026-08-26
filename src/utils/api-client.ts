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

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Client: Gọi relative path để Middleware bắt và làm Proxy
  // Server: Gọi thẳng Java backend
  const backendUrl = isServer
    ? process.env.JAVA_API_URL || process.env.BACKEND_API_URL || 'http://localhost:8080'
    : '';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${backendUrl}${cleanPath}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Ở Client, Middleware (proxy.ts) sẽ lo việc đính kèm token. Chỉ xử lý gắn token trực tiếp trên Server Component.
  if (isServer) {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('session_token')?.value;

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      console.warn('Unable to access cookies on server-side request');
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
      console.error(`[API ERROR] ${res.status} ${url}:`, errorInfo);
      throw new ApiError(errorMessage, res.status, errorInfo);
    }

    if (res.status === 204) return {} as T;

    const text = await res.text();
    if (!text) return {} as T;

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error(`[CONNECTION ERROR] Failed to fetch ${url}:`, error);
    throw new ApiError('Không thể kết nối đến backend', 503);
  }
}