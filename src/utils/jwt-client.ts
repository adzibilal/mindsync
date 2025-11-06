/**
 * JWT Client Utility
 * Client-safe JWT functions (no verification, just decoding)
 * Use this in client components instead of jwt.ts
 */

export interface JWTPayload {
  whatsapp_number: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode JWT token without verification (client-safe)
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded as JWTPayload;
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
}

/**
 * Check if token is expired (client-safe)
 * @param token - JWT token string
 * @returns boolean
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return Date.now() >= decoded.exp * 1000;
}

/**
 * Get token expiry date (client-safe)
 * @param token - JWT token string
 * @returns Date or null
 */
export function getTokenExpiry(token: string): Date | null {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
}

/**
 * Verify token via API (server-side verification)
 * @param token - JWT token string
 * @returns Promise with verification result
 */
export async function verifyTokenAPI(token: string): Promise<{
  success: boolean;
  data?: JWTPayload;
  error?: string;
}> {
  try {
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Token verification API error:', error);
    return {
      success: false,
      error: 'Failed to verify token',
    };
  }
}

