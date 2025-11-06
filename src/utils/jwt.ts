import jwt from 'jsonwebtoken';

/**
 * JWT Utility
 * Helper functions for JWT token generation and validation
 */

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // 7 days

export interface JWTPayload {
  whatsapp_number: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate JWT token
 * @param payload - User data to encode in token
 * @returns JWT token string
 */
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Decode JWT token without verification (for debugging)
 * @param token - JWT token string
 * @returns Decoded payload or null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    console.error('JWT decode failed:', error);
    return null;
  }
}

/**
 * Check if token is expired
 * @param token - JWT token string
 * @returns boolean
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  return Date.now() >= decoded.exp * 1000;
}

/**
 * Generate token hash for database storage
 * @param token - JWT token string
 * @returns SHA-256 hash of token
 */
export async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

