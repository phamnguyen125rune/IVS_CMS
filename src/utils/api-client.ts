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
  // 1. Determine base URL
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';
  
  // Format path (ensure it starts with /)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${backendUrl}${cleanPath}`;

  // 2. Set headers
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // 3. Server-side token insertion
  if (isServer) {
    try {
      // Dynamically import next/headers to prevent bundle errors on client-side compilation
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('session_token')?.value;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      console.warn('Unable to access cookies on server-side request (likely not in request context)');
    }
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, fetchOptions);

    // 4. Global Error Interceptor
    if (!res.ok) {
      let errorInfo;
      try {
        errorInfo = await res.json();
      } catch {
        errorInfo = null;
      }

      const errorMessage = errorInfo?.message || `HTTP error! status: ${res.status}`;
      
      // Centralized error log
      console.error(`[API ERROR] ${res.status} ${url}:`, errorInfo);
      
      throw new ApiError(errorMessage, res.status, errorInfo);
    }

    // 5. Handle empty responses
    if (res.status === 204) {
      return {} as T;
    }

    return await res.json() as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(`[CONNECTION ERROR] Failed to fetch ${url}:`, error);
    throw new ApiError('Không thể kết nối đến máy chủ backend', 503);
  }
}
