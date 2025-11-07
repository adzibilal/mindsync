/**
 * Types & Interfaces
 * 
 * Folder ini berisi semua TypeScript type definitions dan interfaces
 * yang digunakan di seluruh aplikasi.
 */

// ========== User Types ==========
export interface User {
  whatsapp_number: string;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface CreateUserInput {
  whatsapp_number: string;
  name: string;
  email: string;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
}

// ========== OTP Types ==========
export interface OTPCode {
  id: string;
  user_whatsapp_number: string;
  code: string;
  expires_at: string;
  created_at: string;
}

export interface CreateOTPInput {
  user_whatsapp_number: string;
  code: string;
  expires_at: string;
}

// ========== Auth Types ==========
export interface AuthToken {
  id: string;
  user_whatsapp_number: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
}

// ========== API Response Types ==========
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// ========== Form Types ==========
export interface RegisterFormData {
  name: string;
  email: string;
  whatsappNumber: string;
}

export interface LoginFormData {
  whatsappNumber: string;
  otp?: string;
}

// ========== Document Types ==========
export interface Document {
  id: string;
  user_whatsapp_number: string;
  file_name: string;
  status: 'uploaded' | 'processing' | 'completed' | 'error';
  uploaded_at: string;
}

// ========== Cameo Persona Types ==========
export interface CameoPersona {
  user_whatsapp_number: string;
  cameo_name: string;
  system_prompt: string;
  image_url: string | null;
  updated_at: string;
}

export {};
