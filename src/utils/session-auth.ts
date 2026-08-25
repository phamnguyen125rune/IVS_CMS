const STAFF_SESSION_TOKEN_KEY = 'cms_staff_session_token';

export function getStaffSessionToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.sessionStorage.getItem(STAFF_SESSION_TOKEN_KEY);
}

export function setStaffSessionToken(token?: string | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.sessionStorage.setItem(STAFF_SESSION_TOKEN_KEY, token);
  } else {
    clearStaffSessionToken();
  }
}

export function clearStaffSessionToken() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(STAFF_SESSION_TOKEN_KEY);
}

export function buildSessionEventUrl() {
  const token = getStaffSessionToken();
  if (!token) {
    return '/api/auth/session-events';
  }

  return `/api/auth/session-events?token=${encodeURIComponent(token)}`;
}

export function installStaffSessionFetch() {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const originalFetch = window.fetch;

  window.fetch = (input, init = {}) => {
    const token = getStaffSessionToken();
    if (!token || !isInternalApiRequest(input)) {
      return originalFetch(input, init);
    }

    const headers = new Headers(init.headers);
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return originalFetch(input, {
      ...init,
      headers,
    });
  };

  return () => {
    window.fetch = originalFetch;
  };
}

function isInternalApiRequest(input: RequestInfo | URL) {
  if (typeof input === 'string') {
    return input.startsWith('/api/');
  }

  if (input instanceof URL) {
    return input.origin === window.location.origin && input.pathname.startsWith('/api/');
  }

  try {
    const url = new URL(input.url);
    return url.origin === window.location.origin && url.pathname.startsWith('/api/');
  } catch {
    return false;
  }
}
