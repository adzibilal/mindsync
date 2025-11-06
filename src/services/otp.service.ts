import { supabase } from '@/lib/supabase';
import type { ApiResponse, OTPCode } from '@/types';

/**
 * OTP Service
 * Handles OTP verification and management
 */

/**
 * Verify OTP code
 * @param whatsappNumber - User's WhatsApp number
 * @param code - OTP code to verify
 * @returns ApiResponse with verification result
 */
export async function verifyOTP(
  whatsappNumber: string,
  code: string
): Promise<ApiResponse<OTPCode>> {
  try {
    // Check if OTP exists and is valid
    const { data: otpRecord, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('user_whatsapp_number', whatsappNumber)
      .eq('code', code)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'Invalid OTP code',
          message: 'OTP code not found or incorrect'
        };
      }
      throw error;
    }

    // Check if OTP is expired
    const now = new Date();
    const expiresAt = new Date(otpRecord.expires_at);

    if (now > expiresAt) {
      // Delete expired OTP
      await supabase
        .from('otp_codes')
        .delete()
        .eq('id', otpRecord.id);

      return {
        success: false,
        error: 'OTP expired',
        message: 'This OTP code has expired. Please request a new one.'
      };
    }

    // OTP is valid - delete it (one-time use)
    await supabase
      .from('otp_codes')
      .delete()
      .eq('id', otpRecord.id);

    return {
      success: true,
      data: otpRecord,
      message: 'OTP verified successfully'
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify OTP',
      message: 'An error occurred during OTP verification'
    };
  }
}

/**
 * Check if OTP exists for a user
 * @param whatsappNumber - User's WhatsApp number
 * @returns boolean
 */
export async function hasValidOTP(whatsappNumber: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('otp_codes')
      .select('expires_at')
      .eq('user_whatsapp_number', whatsappNumber)
      .single();

    if (error || !data) return false;

    // Check if not expired
    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    return now <= expiresAt;
  } catch (error) {
    console.error('Error checking OTP:', error);
    return false;
  }
}

/**
 * Clean up expired OTPs (maintenance function)
 * @returns number of deleted records
 */
export async function cleanupExpiredOTPs(): Promise<number> {
  try {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', now)
      .select();

    if (error) throw error;

    return data?.length || 0;
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
    return 0;
  }
}

