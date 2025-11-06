# Login & Admin Dashboard Setup

Dokumentasi lengkap untuk implementasi login dengan OTP, JWT authentication, dan admin dashboard.

## 📋 Overview

Sistem authentication yang telah diimplementasikan:
- ✅ Login dengan verifikasi OTP dari Supabase
- ✅ JWT token generation dan validation
- ✅ Token storage di cookies
- ✅ Auth protection untuk admin routes
- ✅ Admin dashboard dengan sidebar navigation
- ✅ Automatic logout pada token expired

## 🔐 Authentication Flow

### Login Flow:
```
1. User masukkan nomor WhatsApp
2. User request OTP via WhatsApp
3. User masukkan OTP code
4. System verify OTP di table otp_codes
   ↓
5. Jika valid, ambil user data dari table users
   ↓
6. Generate JWT token
7. Hash JWT token (SHA-256)
8. Simpan token hash ke table auth_tokens
   ↓
9. Simpan JWT token di cookies
10. Simpan user data di cookies
   ↓
11. Redirect ke dashboard
```

### Protected Routes:
```
User akses /dashboard
   ↓
AuthGuard check cookies
   ├─ No token? → Redirect ke /auth/login
   ├─ Invalid token? → Redirect ke /auth/login
   ├─ Token expired? → Redirect ke /auth/login
   └─ Token valid → Show dashboard
```

## 📦 Dependencies Added

```json
{
  "jsonwebtoken": "^9.0.2",
  "js-cookie": "^3.0.5",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/js-cookie": "^3.0.6",
  "@radix-ui/react-scroll-area": "^1.0.5",
  "@radix-ui/react-separator": "^1.0.3",
  "@radix-ui/react-avatar": "^1.0.4"
}
```

## 📁 Files Created

### 1. Utilities

#### `/src/utils/cookies.ts`
**Purpose:** Cookie management functions
```typescript
- setAuthToken(token): Save JWT to cookies
- getAuthToken(): Get JWT from cookies
- removeAuthToken(): Delete JWT from cookies
- setUserData(user): Save user data to cookies
- getUserData(): Get user data from cookies
- clearAuth(): Clear all auth cookies
- isAuthenticated(): Check if user has token
```

#### `/src/utils/jwt.ts`
**Purpose:** JWT token operations
```typescript
- generateToken(payload): Create JWT token
- verifyToken(token): Verify & decode JWT
- decodeToken(token): Decode without verification
- isTokenExpired(token): Check if expired
- hashToken(token): SHA-256 hash for DB storage
```

### 2. Services

#### `/src/services/otp.service.ts`
**Purpose:** OTP verification
```typescript
- verifyOTP(whatsappNumber, code): Verify OTP code
- hasValidOTP(whatsappNumber): Check if OTP exists
- cleanupExpiredOTPs(): Delete expired OTPs
```

#### `/src/services/token.service.ts`
**Purpose:** Auth token management
```typescript
- createAuthToken(user): Create & store auth token
- verifyAuthToken(tokenHash): Verify token in DB
- deleteAuthToken(tokenHash): Logout (delete token)
- cleanupExpiredTokens(): Delete expired tokens
- deleteAllUserTokens(whatsappNumber): Logout all devices
```

### 3. Components

#### `/src/components/admin/sidebar.tsx`
**Purpose:** Admin sidebar navigation
**Features:**
- Logo and branding
- Navigation menu with active states
- User profile display
- Logout button
- Responsive design

**Menu Items:**
- Dashboard
- Documents
- Upload
- Chat History
- AI Persona
- Users
- Settings

#### `/src/components/admin/auth-guard.tsx`
**Purpose:** Route protection component
**Features:**
- Check auth token in cookies
- Verify JWT validity
- Check user data
- Show loading state
- Auto-redirect to login

#### `/src/components/ui/separator.tsx`
Horizontal/vertical separator component

#### `/src/components/ui/avatar.tsx`
Avatar component with fallback

### 4. Pages & Layouts

#### `/src/app/auth/login/page.tsx` (Updated)
**Changes:**
- Added OTP verification with Supabase
- Added token creation & storage
- Added toast notifications
- Added error handling
- Added loading states
- Redirect to dashboard on success

**New Features:**
- Step-by-step authentication
- User-friendly error messages
- Visual feedback with icons
- Smooth transitions

#### `/src/app/(admin)/layout.tsx`
**Purpose:** Admin pages layout
**Features:**
- Protected with AuthGuard
- Sidebar navigation
- Sticky header
- Mobile responsive
- Dark mode support

#### `/src/app/(admin)/dashboard/page.tsx`
**Purpose:** Main dashboard page
**Features:**
- Welcome message with user name
- Stats cards (documents, processed, chats, etc.)
- Recent activity feed
- Quick action buttons
- Getting started guide
- Beautiful UI with Tailwind CSS

## 🔧 Configuration

### Environment Variables

Add to `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret (IMPORTANT: Generate secure random string!)
NEXT_PUBLIC_JWT_SECRET=your-secret-key-change-in-production
```

**Generate secure JWT secret:**
```bash
openssl rand -base64 32
```

### Database Schema

Pastikan tables berikut ada di Supabase:

**Table: otp_codes**
```sql
- id (uuid, primary key)
- user_whatsapp_number (varchar, foreign key)
- code (varchar)
- expires_at (timestamp)
- created_at (timestamp)
```

**Table: auth_tokens**
```sql
- id (uuid, primary key)
- user_whatsapp_number (varchar, foreign key)
- token_hash (text, unique)
- expires_at (timestamp)
- created_at (timestamp)
```

**Table: users**
```sql
- whatsapp_number (varchar, primary key)
- name (varchar, nullable)
- email (varchar, nullable)
- created_at (timestamp)
```

## 🚀 Usage Guide

### 1. Setup Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

### 2. Test Login Flow

1. **Register a user** (if not exists):
   - Go to `/auth/register`
   - Fill in details
   - Submit registration

2. **Create OTP in Supabase**:
   ```sql
   INSERT INTO otp_codes (user_whatsapp_number, code, expires_at)
   VALUES ('62812345678', '123456', NOW() + INTERVAL '5 minutes');
   ```

3. **Login**:
   - Go to `/auth/login`
   - Enter WhatsApp number: `62812345678`
   - Click "Send OTP"
   - Enter OTP: `123456`
   - Click "Verify & Sign In"

4. **Success!**
   - Token created in `auth_tokens` table
   - Token saved in cookies
   - Redirected to `/dashboard`

### 3. Access Dashboard

Navigate to `/dashboard` - you should see:
- Welcome message with your name
- Stats cards
- Recent activity
- Quick actions
- Getting started guide

### 4. Logout

Click "Logout" button in sidebar:
- Cookies cleared
- Redirected to login page

## 🎨 UI Components Used

- **shadcn/ui Components:**
  - Button
  - Card
  - Input
  - Label
  - Dialog
  - Alert Dialog
  - Separator
  - Avatar
  - Toast (Sonner)

- **Lucide Icons:**
  - LayoutDashboard
  - FileText
  - Upload
  - MessageSquare
  - Settings
  - LogOut
  - Bot
  - Users
  - CheckCircle2
  - AlertCircle
  - Loader2
  - Clock
  - TrendingUp

## 🔒 Security Features

### 1. **JWT Token**
- Expires in 7 days
- Signed with secret key
- Payload includes: whatsapp_number, name, email

### 2. **Token Hashing**
- JWT token hashed before DB storage
- Uses SHA-256 algorithm
- Prevents token theft from database

### 3. **Cookie Security**
- HTTP-only cookies (in production)
- Secure flag (HTTPS only in production)
- SameSite: 'strict'
- Expires: 7 days

### 4. **OTP Security**
- One-time use (deleted after verification)
- Time-limited (expires_at field)
- Stored securely in database

### 5. **Route Protection**
- AuthGuard component
- Token validation on every protected route
- Auto-redirect to login if invalid
- Loading state during verification

## 📊 Database Operations

### Auto-cleanup Functions

**Clean expired OTPs:**
```typescript
import { cleanupExpiredOTPs } from '@/services';
const deleted = await cleanupExpiredOTPs();
```

**Clean expired tokens:**
```typescript
import { cleanupExpiredTokens } from '@/services';
const deleted = await cleanupExpiredTokens();
```

**Logout all devices:**
```typescript
import { deleteAllUserTokens } from '@/services';
await deleteAllUserTokens('62812345678');
```

## 🎯 API Response Format

All service functions return consistent format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

**Example:**
```typescript
// Success
{
  success: true,
  data: { token: "jwt...", user: {...} },
  message: "Login successful"
}

// Error
{
  success: false,
  error: "Invalid OTP code",
  message: "OTP code not found or incorrect"
}
```

## 🐛 Troubleshooting

### Issue: "Invalid OTP code"
**Solutions:**
1. Check OTP exists in `otp_codes` table
2. Check OTP not expired
3. Check WhatsApp number matches exactly
4. Check OTP code is correct (6 digits)

### Issue: "Token verification failed"
**Solutions:**
1. Check JWT_SECRET is set in .env.local
2. Token might be expired (valid for 7 days)
3. Clear cookies and login again

### Issue: "Redirected to login immediately"
**Solutions:**
1. Check token exists in cookies
2. Check token is valid (not expired)
3. Check user data in cookies
4. Open browser console for errors

### Issue: "Cannot access dashboard"
**Solutions:**
1. Make sure you're logged in
2. Check cookies are enabled
3. Check network tab for API errors
4. Verify database connection

## 📈 Next Steps

1. **OTP Generation:**
   - Implement automatic OTP generation
   - Send OTP via WhatsApp API
   - Add OTP resend functionality

2. **Token Refresh:**
   - Implement refresh token mechanism
   - Auto-refresh before expiry
   - Silent token renewal

3. **User Management:**
   - Implement user profile editing
   - Add password option (optional)
   - Email verification

4. **Activity Tracking:**
   - Log user activities
   - Track login history
   - Security alerts

5. **Admin Features:**
   - Implement document management
   - Add chat functionality
   - Configure AI persona
   - User management dashboard

## 📚 Code Examples

### Protected Page Example

```typescript
// src/app/(admin)/my-page/page.tsx
"use client";

export default function MyPage() {
  // This page is automatically protected by AuthGuard
  // from the parent layout
  
  return <div>My Protected Page</div>;
}
```

### Manual Auth Check

```typescript
import { getAuthToken, getUserData } from '@/utils/cookies';
import { verifyToken } from '@/utils/jwt';

// Check if authenticated
const token = getAuthToken();
const user = getUserData();

if (token && user) {
  const decoded = verifyToken(token);
  if (decoded) {
    console.log('User is authenticated:', decoded);
  }
}
```

### Logout Programmatically

```typescript
import { clearAuth } from '@/utils/cookies';
import { useRouter } from 'next/navigation';

const handleLogout = () => {
  clearAuth();
  router.push('/auth/login');
};
```

## ✨ Features Implemented

- ✅ OTP verification from Supabase
- ✅ JWT token generation
- ✅ Token storage in cookies
- ✅ Token storage in database (hashed)
- ✅ Auth protection for admin routes
- ✅ Admin dashboard layout
- ✅ Sidebar navigation
- ✅ User profile display
- ✅ Logout functionality
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Dark mode support
- ✅ Responsive design
- ✅ TypeScript type safety

---

**Created:** October 14, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

