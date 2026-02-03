
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./

COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

COPY backend ./backend

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

WORKDIR /app/backend

ENV PATH="/app/node_modules/.bin:$PATH"
ENV NODE_OPTIONS="--max-old-space-size=4096"

RUN prisma generate --schema=./prisma/schema.prisma

RUN nest build

FROM node:22-alpine AS production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

COPY --from=builder --chown=nestjs:nodejs /app/backend/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/backend/prisma.config.ts ./prisma.config.ts

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3001
ENV PATH="/app/node_modules/.bin:$PATH"

EXPOSE 3001

USER nestjs

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["sh", "-c", "prisma migrate deploy --schema=./prisma/schema.prisma && node dist/src/main.js"]
