import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types (based on your schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          whatsapp_number: string;
          name: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          whatsapp_number: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          whatsapp_number?: string;
          name?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
      otp_codes: {
        Row: {
          id: string;
          user_whatsapp_number: string;
          code: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_whatsapp_number: string;
          code: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_whatsapp_number?: string;
          code?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
      auth_tokens: {
        Row: {
          id: string;
          user_whatsapp_number: string;
          token_hash: string;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_whatsapp_number: string;
          token_hash: string;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_whatsapp_number?: string;
          token_hash?: string;
          expires_at?: string;
          created_at?: string;
        };
      };
    };
  };
}

