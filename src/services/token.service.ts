import { supabase } from '@/lib/supabase';
import { generateToken, hashToken } from '@/utils/jwt';
import type { ApiResponse, AuthToken, User } from '@/types';

/**
 * Token Service
 * Handles authentication token creation and management
 */

/**
 * Create authentication token for user
 * @param user - User object
 * @returns ApiResponse with token string
 */
export async function createAuthToken(
  user: User
): Promise<ApiResponse<{ token: string; user: User }>> {
  try {
    // Generate JWT token
    const token = generateToken({
      whatsapp_number: user.whatsapp_number,
      name: user.name || undefined,
      email: user.email || undefined,
    });

    // Hash token for database storage
    const tokenHash = await hashToken(token);

    // Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Store token in database
    const { error: insertError } = await supabase
      .from('auth_tokens')
      .insert({
        user_whatsapp_number: user.whatsapp_number,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      data: { token, user },
      message: 'Authentication token created successfully'
    };
  } catch (error) {
    console.error('Error creating auth token:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create token',
      message: 'An error occurred while creating authentication token'
    };
  }
}

/**
 * Verify if token exists in database
 * @param tokenHash - Hashed token
 * @returns ApiResponse with auth token data
 */
export async function verifyAuthToken(
  tokenHash: string
): Promise<ApiResponse<AuthToken>> {
  try {
    const { data: authToken, error } = await supabase
      .from('auth_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'Invalid token',
          message: 'Authentication token not found'
        };
      }
      throw error;
    }

    // Check if token is expired
    const now = new Date();
    const expiresAt = new Date(authToken.expires_at);

    if (now > expiresAt) {
      // Delete expired token
      await supabase
        .from('auth_tokens')
        .delete()
        .eq('id', authToken.id);

      return {
        success: false,
        error: 'Token expired',
        message: 'Authentication token has expired'
      };
    }

    return {
      success: true,
      data: authToken,
      message: 'Token is valid'
    };
  } catch (error) {
    console.error('Error verifying auth token:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify token',
      message: 'An error occurred during token verification'
    };
  }
}

/**
 * Delete authentication token (logout)
 * @param tokenHash - Hashed token
 * @returns ApiResponse
 */
export async function deleteAuthToken(
  tokenHash: string
): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('auth_tokens')
      .delete()
      .eq('token_hash', tokenHash);

    if (error) throw error;

    return {
      success: true,
      data: null,
      message: 'Token deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting auth token:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete token',
      message: 'An error occurred while deleting token'
    };
  }
}

/**
 * Clean up expired tokens (maintenance function)
 * @returns number of deleted records
 */
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('auth_tokens')
      .delete()
      .lt('expires_at', now)
      .select();

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
    return 0;
  }
}

/**
 * Delete all tokens for a user (logout from all devices)
 * @param whatsappNumber - User's WhatsApp number
 * @returns ApiResponse
 */
export async function deleteAllUserTokens(
  whatsappNumber: string
): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabase
      .from('auth_tokens')
      .delete()
      .eq('user_whatsapp_number', whatsappNumber);

    if (error) throw error;

    return {
      success: true,
      data: null,
      message: 'All tokens deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting user tokens:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tokens',
      message: 'An error occurred while deleting tokens'
    };
  }
}

