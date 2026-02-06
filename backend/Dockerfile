
FROM node:22-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY .npmrc* ./

COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY .npmrc* ./

COPY backend ./backend

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app/backend

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate --schema=./prisma/schema.prisma

RUN npx nest build

RUN npx esbuild prisma/seed.ts \
    --bundle \
    --platform=node \
    --target=node22 \
    --outfile=dist/prisma/seed.js \
    --external:@prisma/client \
    --external:@prisma/adapter-pg \
    --external:pg \
    --external:dotenv \
    --external:crypto \
    || echo "Seed bundling skipped"

FROM node:22-alpine AS prod-deps

RUN apk add --no-cache libc6-compat openssl

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY .npmrc* ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile --prod

FROM node:22-alpine AS production

RUN apk add --no-cache libc6-compat openssl wget

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

WORKDIR /app

COPY --from=prod-deps --chown=nestjs:nodejs /app/node_modules ./node_modules

COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./dist

COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma ./prisma

COPY --from=builder --chown=nestjs:nodejs /app/backend/package.json ./package.json

COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma.config.ts ./prisma.config.ts

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo 'echo "🚀 Starting Food Delivery Platform Backend..."' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Step 1: Run database migrations' >> /app/entrypoint.sh && \
    echo 'echo "📦 Running Prisma migrations..."' >> /app/entrypoint.sh && \
    echo 'npx prisma migrate deploy --schema=./prisma/schema.prisma' >> /app/entrypoint.sh && \
    echo 'echo "✅ Migrations completed successfully"' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Step 2: Generate Prisma Client' >> /app/entrypoint.sh && \
    echo 'echo "🔧 Generating Prisma Client..."' >> /app/entrypoint.sh && \
    echo 'npx prisma generate --schema=./prisma/schema.prisma' >> /app/entrypoint.sh && \
    echo 'echo "✅ Prisma Client generated successfully"' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Step 3: Run database seeding (non-blocking on error)' >> /app/entrypoint.sh && \
    echo 'echo "🌱 Running database seed..."' >> /app/entrypoint.sh && \
    echo 'if [ -f "./dist/prisma/seed.js" ]; then' >> /app/entrypoint.sh && \
    echo '  node ./dist/prisma/seed.js || echo "⚠️ Seed completed with warnings (this is normal if data already exists)"' >> /app/entrypoint.sh && \
    echo 'else' >> /app/entrypoint.sh && \
    echo '  echo "⚠️ Seed file not found, skipping seeding"' >> /app/entrypoint.sh && \
    echo 'fi' >> /app/entrypoint.sh && \
    echo 'echo "✅ Seeding step completed"' >> /app/entrypoint.sh && \
    echo '' >> /app/entrypoint.sh && \
    echo '# Step 4: Start the NestJS server' >> /app/entrypoint.sh && \
    echo 'echo "🎯 Starting NestJS server on port ${PORT}..."' >> /app/entrypoint.sh && \
    echo 'exec node dist/src/main.js' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

USER nestjs

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT}/health || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
