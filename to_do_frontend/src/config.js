const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the base URL for the backend API derived from env var REACT_APP_API_BASE_URL. */
  return API_BASE_URL.replace(/\/+$/, '');
}

// PUBLIC_INTERFACE
export function getSiteUrl() {
  /** Returns the site URL for redirects if needed; sourced from REACT_APP_SITE_URL. */
  return (process.env.REACT_APP_SITE_URL || window.location.origin).replace(/\/+$/, '');
}

const TOKEN_KEY = 'auth_token';

// PUBLIC_INTERFACE
export function getAuthToken() {
  /** Gets the persisted auth token from localStorage. */
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function setAuthToken(token) {
  /** Persists the auth token to localStorage. */
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore write errors
  }
}

// PUBLIC_INTERFACE
export function clearAuthToken() {
  /** Clears the auth token from localStorage. */
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
