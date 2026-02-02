
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.25.0 --activate

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

RUN pnpm install --frozen-lockfile

COPY frontend ./frontend

ARG VITE_API_URL
ARG VITE_AUTH_URL
ARG VITE_USE_MOCK_API=false
ARG VITE_DEV_MODE=false

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_URL=$VITE_AUTH_URL
ENV VITE_USE_MOCK_API=$VITE_USE_MOCK_API
ENV VITE_DEV_MODE=$VITE_DEV_MODE

WORKDIR /app/frontend
RUN /app/node_modules/.bin/vite build

FROM nginx:alpine AS production

RUN rm /etc/nginx/conf.d/default.conf

COPY frontend/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/frontend/dist /usr/share/nginx/html

RUN apk add --no-cache curl && \
    mkdir -p /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /tmp && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
