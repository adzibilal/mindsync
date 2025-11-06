import Cookies from 'js-cookie';

/**
 * Cookies Utility
 * Helper functions for managing browser cookies
 */

const TOKEN_KEY = 'mindsync_auth_token';
const USER_KEY = 'mindsync_user';

// Cookie options
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

/**
 * Set authentication token in cookies
 * @param token - JWT token
 */
export function setAuthToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
}

/**
 * Get authentication token from cookies
 * @returns token or null
 */
export function getAuthToken(): string | null {
  return Cookies.get(TOKEN_KEY) || null;
}

/**
 * Remove authentication token from cookies
 */
export function removeAuthToken(): void {
  Cookies.remove(TOKEN_KEY);
}

/**
 * Set user data in cookies
 * @param user - User object
 */
export function setUserData(user: Record<string, unknown>): void {
  Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
}

/**
 * Get user data from cookies
 * @returns user object or null
 */
export function getUserData(): Record<string, unknown> | null {
  const userData = Cookies.get(USER_KEY);
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
}

/**
 * Remove user data from cookies
 */
export function removeUserData(): void {
  Cookies.remove(USER_KEY);
}

/**
 * Clear all auth-related cookies
 */
export function clearAuth(): void {
  removeAuthToken();
  removeUserData();
}

/**
 * Check if user is authenticated (has token)
 * @returns boolean
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

