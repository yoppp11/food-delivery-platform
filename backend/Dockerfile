
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
RUN npx tsc prisma/seed.ts --outDir dist/prisma --esModuleInterop --resolveJsonModule --skipLibCheck --module commonjs --target ES2021 2>/dev/null || echo "Seed compilation warning - will use ts-node as fallback"

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

USER nestjs

# Run migrations first, then seed (only if seed file exists), then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && (node dist/prisma/seed.js 2>/dev/null || npx ts-node --transpile-only prisma/seed.ts || echo 'Seed skipped') && node dist/src/main.js"]
