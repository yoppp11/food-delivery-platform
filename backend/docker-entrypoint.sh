#!/bin/sh
set -e

# Remove TypeScript config file that can't be executed in production Alpine container
# This allows Prisma to use the datasource from schema.prisma directly
rm -f prisma/prisma.config.ts

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node dist/main.js
