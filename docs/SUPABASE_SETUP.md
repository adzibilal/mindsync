# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the MindSync application.

## 📋 Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Access to your Supabase project dashboard

## 🚀 Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (e.g., `https://xxxxxxxxxxx.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 3. Database Schema

The database schema is already defined in `DB_SCHEMA.sql`. Make sure your Supabase database has the following table:

**Users Table:**
- `whatsapp_number` (varchar, PRIMARY KEY)
- `name` (varchar, nullable)
- `email` (varchar, nullable, unique)
- `created_at` (timestamp with time zone)

### 4. Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the registration page: `http://localhost:3000/auth/register`

3. Try registering a new user with:
   - Full name
   - Valid email
   - WhatsApp number (format: 62XXXXXXXXXX)

## 📁 Files Modified/Created

### New Files:
- `src/lib/supabase.ts` - Supabase client configuration
- `src/services/auth.service.ts` - Authentication service layer
- `src/types/index.ts` - TypeScript type definitions
- `.env.example` - Environment variables template

### Modified Files:
- `src/app/auth/register/page.tsx` - Updated with Supabase integration
- `src/services/index.ts` - Export auth service

## 🎯 Features Implemented

### Registration Page (`/auth/register`)
- ✅ Form validation for WhatsApp number format
- ✅ Duplicate check for WhatsApp number
- ✅ Duplicate check for email
- ✅ Error handling with user-friendly messages
- ✅ Loading states during submission
- ✅ Redirect to login page after successful registration
- ✅ Terms and conditions checkbox

### Auth Service (`src/services/auth.service.ts`)
- `registerUser()` - Register new user with validation
- `getUserByWhatsApp()` - Fetch user by WhatsApp number
- `getUserByEmail()` - Fetch user by email
- `isWhatsAppAvailable()` - Check WhatsApp number availability
- `isEmailAvailable()` - Check email availability

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use Row Level Security (RLS)** in Supabase for production
3. **Validate input on both client and server side**
4. **Use HTTPS in production** for secure communication

## 📝 API Response Format

All service functions return a consistent API response:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## 🐛 Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env.local` exists with correct variables
- Restart the development server after adding environment variables

### Error: "Failed to register user"
- Check Supabase dashboard for database errors
- Verify the users table exists with correct schema
- Check network tab for API errors

### WhatsApp Number Format Issues
- Must start with `62` (Indonesia country code)
- Must be 11-15 digits total (62 + 9-13 digits)
- Example: `62812345678`

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## 🎉 Next Steps

After completing the setup, you can:
1. Implement OTP verification flow
2. Add authentication token management
3. Create protected routes
4. Implement user profile management
5. Add document upload functionality

---

**Note:** This integration follows Next.js and TypeScript best practices with proper separation of concerns (services, types, UI components).

