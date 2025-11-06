import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key-change-in-production';

interface JWTPayload {
  whatsapp_number: string;
  name?: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token is required',
        },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    return NextResponse.json({
      success: true,
      data: decoded,
      message: 'Token is valid',
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid or expired token',
      },
      { status: 401 }
    );
  }
}

