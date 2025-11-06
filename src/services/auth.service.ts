import { supabase } from '@/lib/supabase';
import type { 
  User, 
  CreateUserInput, 
  ApiResponse 
} from '@/types';

/**
 * Auth Service
 * Handles user authentication and registration logic
 */

/**
 * Register a new user
 * @param userData - User registration data
 * @returns ApiResponse with created user or error
 */
export async function registerUser(
  userData: CreateUserInput
): Promise<ApiResponse<User>> {
  try {
    // Check if user already exists by whatsapp number
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('whatsapp_number', userData.whatsapp_number)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is expected for new users
      throw checkError;
    }

    if (existingUser) {
      return {
        success: false,
        error: 'User with this WhatsApp number already exists',
        message: 'WhatsApp number is already registered'
      };
    }

    // Check if email already exists (if provided)
    if (userData.email) {
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('email', userData.email)
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        throw emailCheckError;
      }

      if (existingEmail) {
        return {
          success: false,
          error: 'User with this email already exists',
          message: 'Email is already registered'
        };
      }
    }

    // Create new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        whatsapp_number: userData.whatsapp_number,
        name: userData.name,
        email: userData.email
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return {
      success: true,
      data: newUser,
      message: 'User registered successfully'
    };
  } catch (error) {
    console.error('Error registering user:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to register user',
      message: 'An error occurred during registration'
    };
  }
}

/**
 * Get user by WhatsApp number
 * @param whatsappNumber - User's WhatsApp number
 * @returns ApiResponse with user data or error
 */
export async function getUserByWhatsApp(
  whatsappNumber: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('whatsapp_number', whatsappNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'User not found',
          message: 'No user found with this WhatsApp number'
        };
      }
      throw error;
    }

    return {
      success: true,
      data,
      message: 'User retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user',
      message: 'An error occurred while retrieving user'
    };
  }
}

/**
 * Get user by email
 * @param email - User's email address
 * @returns ApiResponse with user data or error
 */
export async function getUserByEmail(
  email: string
): Promise<ApiResponse<User>> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return {
          success: false,
          error: 'User not found',
          message: 'No user found with this email'
        };
      }
      throw error;
    }

    return {
      success: true,
      data,
      message: 'User retrieved successfully'
    };
  } catch (error) {
    console.error('Error getting user:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user',
      message: 'An error occurred while retrieving user'
    };
  }
}

/**
 * Check if a WhatsApp number is available
 * @param whatsappNumber - WhatsApp number to check
 * @returns boolean indicating availability
 */
export async function isWhatsAppAvailable(
  whatsappNumber: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('whatsapp_number')
      .eq('whatsapp_number', whatsappNumber)
      .single();

    if (error && error.code === 'PGRST116') {
      return true; // Not found means available
    }

    return !data; // If data exists, not available
  } catch (error) {
    console.error('Error checking WhatsApp availability:', error);
    return false;
  }
}

/**
 * Check if an email is available
 * @param email - Email to check
 * @returns boolean indicating availability
 */
export async function isEmailAvailable(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') {
      return true; // Not found means available
    }

    return !data; // If data exists, not available
  } catch (error) {
    console.error('Error checking email availability:', error);
    return false;
  }
}

