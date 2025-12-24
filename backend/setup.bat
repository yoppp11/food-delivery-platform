@echo off
echo ========================================
echo Food Delivery Platform - Setup Script
echo ========================================
echo.

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo Please update .env with your database credentials!
    echo.
) else (
    echo .env file already exists.
    echo.
)

echo Installing dependencies...
call pnpm install
echo.

echo Generating Prisma Client...
call pnpm prisma generate
echo.

echo Running database migrations...
call pnpm prisma migrate dev --name setup_better_auth
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update your .env file with correct database credentials
echo 2. Run: pnpm run start:dev
echo 3. Test the API at http://localhost:3000
echo.
echo For more information, see SETUP_GUIDE.md
echo.
pause
