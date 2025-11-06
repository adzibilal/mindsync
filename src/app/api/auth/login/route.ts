import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/services/otp.service';
import { getUserByWhatsApp } from '@/services/auth.service';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Hash token using SHA-256
 */
async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsappNumber, otp } = body;

    // Validate input
    if (!whatsappNumber || !otp) {
      return NextResponse.json(
        {
          success: false,
          error: 'WhatsApp number and OTP are required',
        },
        { status: 400 }
      );
    }

    // Step 1: Verify OTP
    const otpResponse = await verifyOTP(whatsappNumber, otp);

    if (!otpResponse.success) {
      return NextResponse.json(
        {
          success: false,
          error: otpResponse.error || 'Invalid or expired OTP',
        },
        { status: 401 }
      );
    }

    // Step 2: Get user data
    const userResponse = await getUserByWhatsApp(whatsappNumber);

    if (!userResponse.success || !userResponse.data) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found. Please register first.',
        },
        { status: 404 }
      );
    }

    const user = userResponse.data;

    // Step 3: Generate JWT token
    const token = jwt.sign(
      {
        whatsapp_number: user.whatsapp_number,
        name: user.name || undefined,
        email: user.email || undefined,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    // Step 4: Hash token for database storage
    const tokenHash = await hashToken(token);

    // Step 5: Set expiration (7 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Step 6: Store token in database
    const { error: insertError } = await supabase
      .from('auth_tokens')
      .insert({
        user_whatsapp_number: user.whatsapp_number,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Error storing token:', insertError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create authentication session',
        },
        { status: 500 }
      );
    }

    // Step 7: Return token and user data
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          whatsapp_number: user.whatsapp_number,
          name: user.name || '',
          email: user.email || '',
        },
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

