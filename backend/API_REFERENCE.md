# Better Auth API Reference

## Authentication Endpoints

All authentication endpoints are automatically provided by Better Auth through the NestJS Better Auth module.

Base URL: `http://localhost:3000/api/auth`

---

## Sign Up (Register)

**POST** `/api/auth/sign-up/email`

Create a new user account with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false,
    "image": null,
    "createdAt": "2025-12-14T00:00:00.000Z",
    "updatedAt": "2025-12-14T00:00:00.000Z"
  },
  "session": {
    "id": "session-id",
    "userId": "uuid",
    "expiresAt": "2025-12-28T00:00:00.000Z"
  }
}
```

---

## Sign In (Login)

**POST** `/api/auth/sign-in/email`

Sign in with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false
  },
  "session": {
    "id": "session-id",
    "userId": "uuid",
    "expiresAt": "2025-12-28T00:00:00.000Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Sign Out (Logout)

**POST** `/api/auth/sign-out`

Sign out the current user.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Get Session

**GET** `/api/auth/get-session`

Get the current user session.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "emailVerified": false
  },
  "session": {
    "id": "session-id",
    "userId": "uuid",
    "expiresAt": "2025-12-28T00:00:00.000Z"
  }
}
```

**Response (401 Unauthorized):**
```json
{
  "user": null,
  "session": null
}
```

---

## Update User

**POST** `/api/auth/update-user`

Update the current user's information.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "image": "https://example.com/avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "image": "https://example.com/avatar.jpg"
  }
}
```

---

## Change Password

**POST** `/api/auth/change-password`

Change the current user's password.

**Headers:**
```
Cookie: better-auth.session_token=<session-token>
```

**Request Body:**
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Forget Password

**POST** `/api/auth/forget-password`

Request a password reset email (requires email provider configuration).

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

## Reset Password

**POST** `/api/auth/reset-password`

Reset password using the token from the email.

**Request Body:**
```json
{
  "token": "reset-token",
  "password": "NewPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

## Testing with cURL

### Sign Up Example:
```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### Sign In Example:
```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \\
  -H "Content-Type: application/json" \\
  -c cookies.txt \\
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Get Session Example:
```bash
curl -X GET http://localhost:3000/api/auth/get-session \\
  -b cookies.txt
```

### Sign Out Example:
```bash
curl -X POST http://localhost:3000/api/auth/sign-out \\
  -b cookies.txt
```

---

## Testing with JavaScript/Fetch

### Sign Up:
```javascript
const response = await fetch('http://localhost:3000/api/auth/sign-up/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!',
    name: 'Test User'
  })
});

const data = await response.json();
console.log(data);
```

### Sign In:
```javascript
const response = await fetch('http://localhost:3000/api/auth/sign-in/email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!'
  })
});

const data = await response.json();
console.log(data);
```

### Get Session:
```javascript
const response = await fetch('http://localhost:3000/api/auth/get-session', {
  credentials: 'include'
});

const data = await response.json();
console.log(data);
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": "Password must be at least 8 characters"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 409 Conflict
```json
{
  "error": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Notes

1. **Session Management**: Better Auth uses HTTP-only cookies for session management by default.
2. **CORS**: Make sure to configure CORS properly in production.
3. **HTTPS**: Always use HTTPS in production for secure cookie transmission.
4. **Password Requirements**: Enforce strong password requirements on the client side.
5. **Rate Limiting**: Consider implementing rate limiting for authentication endpoints.

---

## Custom Fields

To add custom fields to the User model:

1. Update the Prisma schema:
```prisma
model User {
  // ...existing fields
  phoneNumber   String?
  address       String?
  locationId    String?
}
```

2. Run migration:
```bash
pnpm prisma migrate dev --name add_custom_fields
```

3. Custom fields will be included in the user object automatically.
