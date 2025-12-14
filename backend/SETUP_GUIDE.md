# Better Auth + Prisma + PostgreSQL Setup Guide

## Overview
This guide will help you set up Better Auth with Prisma and PostgreSQL in your NestJS application.

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database running
- pnpm package manager

## Step 1: Database Configuration

### 1.1 Update your `.env` file with your PostgreSQL credentials:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/food_delivery_db?schema=public"
BETTER_AUTH_SECRET="your-secret-key-here-change-this-in-production"
BETTER_AUTH_URL="http://localhost:3000"
NODE_ENV="development"
```

**Important:** 
- Replace `username` and `password` with your PostgreSQL credentials
- Replace `food_delivery_db` with your database name
- Generate a strong secret for `BETTER_AUTH_SECRET` (use: `openssl rand -base64 32`)

### 1.2 Create the database if it doesn't exist:

```bash
# Using PostgreSQL CLI
createdb food_delivery_db

# Or using psql
psql -U postgres
CREATE DATABASE food_delivery_db;
\q
```

## Step 2: Install Dependencies

All required packages are already installed in your `package.json`:
- `@prisma/client`
- `@prisma/adapter-pg`
- `better-auth`
- `@thallesp/nestjs-better-auth`
- `pg`

If you need to reinstall:
```bash
cd backend
pnpm install
```

## Step 3: Run Prisma Migration

Generate the database schema and create tables:

```bash
cd backend
pnpm prisma migrate dev --name setup_better_auth
```

This will:
- Create the Better Auth tables (user, account, session, verification)
- Create your application tables (roles, categories, menus, orders, etc.)
- Generate the Prisma Client

## Step 4: Generate Prisma Client

If not already generated:

```bash
cd backend
pnpm prisma generate
```

## Step 5: Verify Your Setup

### 5.1 Check Database Tables

Connect to your database and verify tables were created:

```bash
psql -U postgres -d food_delivery_db
\dt
```

You should see these tables:
- `user` - User accounts
- `account` - OAuth accounts and credentials
- `session` - User sessions
- `verification` - Email verification tokens
- `roles` - User roles
- `userRoles` - User-role relationships
- `categories` - Menu categories
- `menus` - Menu items
- `menuSizes` - Menu size variants
- `menuAddons` - Menu add-ons
- `orders` - Customer orders
- `orderItems` - Order line items
- `orderItemAddons` - Order item add-ons

### 5.2 Test Prisma Connection

Create a test file or use Prisma Studio:

```bash
cd backend
pnpm prisma studio
```

This opens a visual database browser at `http://localhost:5555`

## Step 6: Understanding the Schema

### Better Auth Tables

**User Table:**
- Stores user authentication data
- Fields: id, name, email, emailVerified, image, phoneNumber, address
- Custom field: locationId
- Relations: accounts, sessions, userRole

**Account Table:**
- Stores authentication provider data
- Supports multiple providers (email/password, OAuth)
- Fields: userId, accountId, providerId, accessToken, refreshToken, password

**Session Table:**
- Stores active user sessions
- Fields: userId, expiresAt, ipAddress, userAgent

**Verification Table:**
- Stores email verification tokens
- Fields: identifier, value, expiresAt

### Your Application Tables

- **Role & UserRole:** For role-based access control
- **Category & Menu:** For menu management
- **MenuSize & MenuAddon:** For menu customization
- **Order, OrderItem, OrderItemAddon:** For order management

## Step 7: Using Better Auth in Your Application

### 7.1 Authentication Endpoints

Better Auth automatically provides these endpoints via the NestJS module:

- `POST /api/auth/sign-up` - Register a new user
- `POST /api/auth/sign-in` - Sign in with email/password
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Verify email (when enabled)

### 7.2 Example: Sign Up Request

```bash
curl -X POST http://localhost:3000/api/auth/sign-up \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

### 7.3 Example: Sign In Request

```bash
curl -X POST http://localhost:3000/api/auth/sign-in \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

### 7.4 Protected Routes Example

Create a guard for protected routes:

```typescript
// src/auth/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { auth } from '../../lib/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return false;
    }
    
    request.user = session.user;
    return true;
  }
}
```

Use in controllers:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';

@Controller('protected')
export class ProtectedController {
  @Get()
  @UseGuards(AuthGuard)
  getProtectedData() {
    return { message: 'This is protected data' };
  }
}
```

## Step 8: Run Your Application

```bash
cd backend
pnpm run start:dev
```

Your application should now be running with Better Auth enabled!

## Troubleshooting

### Database Connection Issues

1. **"Connection refused"**
   - Ensure PostgreSQL is running: `sudo service postgresql status`
   - Check port (default 5432): `netstat -an | grep 5432`

2. **"Authentication failed"**
   - Verify username/password in DATABASE_URL
   - Check PostgreSQL authentication settings in `pg_hba.conf`

3. **"Database does not exist"**
   - Create the database: `createdb food_delivery_db`

### Prisma Migration Issues

1. **"Migration failed to apply"**
   - Drop and recreate the database: `pnpm prisma migrate reset`
   - Then run: `pnpm prisma migrate dev`

2. **"Schema drift detected"**
   - Run: `pnpm prisma migrate dev`
   - Or reset: `pnpm prisma migrate reset`

### Better Auth Issues

1. **"Secret not defined"**
   - Ensure BETTER_AUTH_SECRET is set in `.env`
   - Load env vars in `main.ts` or use `dotenv/config`

2. **"Session not created"**
   - Check database tables exist
   - Verify Prisma Client is generated
   - Check baseURL matches your application URL

## Next Steps

1. **Enable Email Verification:**
   - Set `requireEmailVerification: true` in `src/lib/auth.ts`
   - Configure email provider (see Better Auth docs)

2. **Add OAuth Providers:**
   - Add Google, GitHub, etc. (see Better Auth documentation)

3. **Implement Role-Based Access Control:**
   - Use the Role and UserRole tables
   - Create custom guards based on roles

4. **Add Session Management:**
   - Implement session expiry logic
   - Add refresh token functionality

5. **Security Enhancements:**
   - Add rate limiting
   - Implement CORS properly
   - Use HTTPS in production
   - Add password strength validation

## Useful Commands

```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Reset database
pnpm prisma migrate reset

# Open Prisma Studio
pnpm prisma studio

# Format schema file
pnpm prisma format

# Check migration status
pnpm prisma migrate status
```

## Resources

- [Better Auth Documentation](https://better-auth.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Better Auth Package](https://github.com/thallesp/nestjs-better-auth)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## Support

If you encounter issues:
1. Check the Better Auth Discord
2. Review Prisma GitHub issues
3. Check NestJS documentation
