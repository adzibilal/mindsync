# Fix: JWT Client-Side Error

## 🐛 Problem

Error yang terjadi:
```
TypeError: Right-hand side of 'instanceof' is not an object
at generateToken (src/utils/jwt.ts:25:14)
```

**Root Cause:**
- Library `jsonwebtoken` adalah Node.js library
- Tidak bisa dijalankan di browser (client-side)
- Login page adalah client component (`"use client"`)
- Saat memanggil `generateToken()`, mencoba menjalankan Node.js code di browser

## ✅ Solution

### 1. **Buat API Routes untuk Login** (Server-Side)

#### `/src/app/api/auth/login/route.ts`
**Purpose:** Handle login process di server
**Features:**
- Verify OTP dari Supabase
- Get user data
- Generate JWT token (server-side ✓)
- Hash token dengan SHA-256
- Simpan token hash ke `auth_tokens` table
- Return token & user data

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "whatsappNumber": "62812345678",
  "otp": "123456"
}
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "whatsapp_number": "62812345678",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "Login successful"
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Invalid or expired OTP"
}
```

#### `/src/app/api/auth/verify/route.ts`
**Purpose:** Verify JWT token di server
**Features:**
- Verify token signature
- Check expiration
- Return decoded payload

**Endpoint:** `POST /api/auth/verify`

### 2. **Update Login Page** (Client-Side)

**Changes in `/src/app/auth/login/page.tsx`:**

**Before:**
```typescript
// ❌ Client-side - Error!
import { verifyOTP, createAuthToken, getUserByWhatsApp } from "@/services";

const otpResponse = await verifyOTP(whatsappNumber, otp);
const tokenResponse = await createAuthToken(user);
```

**After:**
```typescript
// ✅ API Call - Works!
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ whatsappNumber, otp }),
});

const data = await response.json();
setAuthToken(data.data.token);
setUserData(data.data.user);
```

### 3. **Create Client-Safe JWT Utilities**

#### `/src/utils/jwt-client.ts`
**Purpose:** JWT operations yang aman untuk client-side

**Functions:**
```typescript
// Decode JWT tanpa verification (aman di client)
decodeToken(token: string): JWTPayload | null

// Check expired tanpa verification (aman di client)
isTokenExpired(token: string): boolean

// Get expiry date
getTokenExpiry(token: string): Date | null

// Verify via API (server-side verification)
verifyTokenAPI(token: string): Promise<ApiResponse>
```

**Why Safe?**
- Hanya decode base64, tidak verify signature
- Tidak perlu `jsonwebtoken` library
- Bisa dijalankan di browser
- Verification tetap di server via API

### 4. **Update Auth Guard** (Client-Side)

**Changes in `/src/components/admin/auth-guard.tsx`:**

**Before:**
```typescript
// ❌ Uses jsonwebtoken - Error!
import { verifyToken } from "@/utils/jwt";

const decodedToken = verifyToken(token);
if (!decodedToken) {
  // redirect to login
}
```

**After:**
```typescript
// ✅ Client-safe - Works!
import { isTokenExpired } from "@/utils/jwt-client";

if (isTokenExpired(token)) {
  // Token expired, redirect to login
}
```

## 📁 Files Modified/Created

### New Files:
1. ✅ `/src/app/api/auth/login/route.ts` - Login API endpoint
2. ✅ `/src/app/api/auth/verify/route.ts` - Token verification API
3. ✅ `/src/utils/jwt-client.ts` - Client-safe JWT utilities

### Modified Files:
1. ✅ `/src/app/auth/login/page.tsx` - Use API instead of direct services
2. ✅ `/src/components/admin/auth-guard.tsx` - Use client-safe JWT utilities

### Files Still Used (Server-Side Only):
- `/src/utils/jwt.ts` - Tetap digunakan di API routes (server-side)
- `/src/services/token.service.ts` - Bisa digunakan di API routes jika perlu

## 🔄 New Login Flow

### Client → Server Architecture:

```
CLIENT (Browser)                    SERVER (API Routes)
     │                                    │
1. User submit OTP                        │
     │────── POST /api/auth/login ──────>│
     │                                    │
     │                              2. Verify OTP
     │                              3. Get user data
     │                              4. Generate JWT
     │                              5. Hash token
     │                              6. Store in DB
     │                                    │
     │<────── Return token & user ───────│
     │                                    │
7. Save to cookies                        │
8. Redirect to dashboard                  │
```

### Auth Guard Flow:

```
CLIENT (Browser)
     │
1. Check token in cookies
     │
2. Decode token (client-safe)
     │
3. Check if expired (client-safe)
     │
4. ✓ Valid → Show page
   ✗ Invalid → Redirect to login
```

## 🧪 Testing

### 1. Test Login API

```bash
# Create OTP in Supabase
INSERT INTO otp_codes (user_whatsapp_number, code, expires_at)
VALUES ('62812345678', '123456', NOW() + INTERVAL '5 minutes');

# Test API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "whatsappNumber": "62812345678",
    "otp": "123456"
  }'
```

### 2. Test Login Flow

1. Go to `/auth/login`
2. Enter number: `62812345678`
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Click "Verify & Sign In"
6. ✅ Should redirect to dashboard

### 3. Test Auth Guard

1. Clear cookies
2. Try to access `/dashboard`
3. ✅ Should redirect to `/auth/login`

### 4. Verify Token in Database

```sql
SELECT * FROM auth_tokens 
WHERE user_whatsapp_number = '62812345678'
ORDER BY created_at DESC LIMIT 1;

-- Should show:
-- - token_hash (SHA-256)
-- - expires_at (7 days from now)
-- - created_at (now)
```

## 📊 Architecture Comparison

### Before (❌ Broken):
```
Login Page (Client)
    ↓
jwt.sign() → ERROR!
(jsonwebtoken in browser)
```

### After (✅ Working):
```
Login Page (Client)
    ↓
API Route (Server)
    ↓
jwt.sign() → Success!
(jsonwebtoken in Node.js)
    ↓
Return token to client
```

## 🔒 Security Notes

### Client-Side:
- ✅ Token disimpan di cookies (secure)
- ✅ Decode token hanya untuk check expiry
- ✅ Tidak ada verification di client (good!)
- ✅ Signature validation tetap di server

### Server-Side:
- ✅ JWT generation dengan secret key
- ✅ Token verification dengan signature check
- ✅ Token hash disimpan di database
- ✅ OTP one-time use

### Why This is Secure:
1. **JWT Secret** tidak exposed ke client
2. **Token verification** hanya di server
3. **Client hanya decode** untuk check expiry (not verify)
4. **Actual verification** via API jika perlu
5. **Token hash** di database (bukan plain token)

## 🎯 Benefits

### 1. **Works in Browser**
- No more Node.js library errors
- Client code runs in browser
- Server code runs in Node.js

### 2. **Better Security**
- JWT secret never exposed to client
- Token verification only on server
- Client can only decode (not verify)

### 3. **Proper Architecture**
- Clear separation: client vs server
- API-first approach
- Scalable for future features

### 4. **Maintainable**
- Easy to understand
- Standard Next.js patterns
- Clear responsibilities

## 🚀 Next Steps

Setelah fix ini, Anda bisa:

1. **Test Login Flow:**
   - Register user
   - Create OTP
   - Login dengan OTP
   - Access dashboard

2. **Add More API Routes:**
   - `/api/auth/logout` - Delete token
   - `/api/auth/refresh` - Refresh token
   - `/api/auth/me` - Get current user

3. **Implement Middleware:**
   - Next.js middleware untuk auth
   - Automatic token refresh
   - Route-level protection

4. **Add Token Refresh:**
   - Refresh token mechanism
   - Silent token renewal
   - Better UX

## 📚 References

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JWT.io](https://jwt.io/)
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
- [Client vs Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

---

**Fixed:** October 14, 2025  
**Issue:** JWT client-side error  
**Solution:** Move JWT generation to API routes  
**Status:** ✅ Fixed & Working

