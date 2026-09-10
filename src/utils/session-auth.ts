const USER_SESSION_TOKEN_KEY = 'cms_user_session_token';

export function setUserSessionToken(token?: string | null) {
  if (typeof window === 'undefined') return;

  if (token) {
    window.sessionStorage.setItem(USER_SESSION_TOKEN_KEY, token);
  } else {
    clearUserSessionToken();
  }
}

export function clearUserSessionToken() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(USER_SESSION_TOKEN_KEY);
}
