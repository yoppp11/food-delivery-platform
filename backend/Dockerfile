# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY backend/package.json ./backend/
COPY backend/prisma ./backend/prisma/

RUN pnpm install --frozen-lockfile

COPY backend ./backend

ENV PATH="/app/node_modules/.bin:$PATH"

# Increase Node.js memory limit for build process (4GB)
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Dummy DATABASE_URL for prisma generate (no actual connection needed)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy?schema=public"

RUN cd backend && prisma generate

# Compile prisma.config.ts to JavaScript for production use
RUN cd backend && npx tsc prisma.config.ts --esModuleInterop --module NodeNext --moduleResolution NodeNext --outDir .

RUN cd backend && nest build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/package.json ./
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/prisma.config.js ./prisma.config.js
COPY backend/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

USER nestjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

ENTRYPOINT ["./docker-entrypoint.sh"]
