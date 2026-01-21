# Redis Caching, Docker & Testing Specification

## Food Delivery Platform - Performance & Deployment Enhancement

**Version:** 1.0  
**Date:** January 21, 2026  
**Author:** Development Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Scope](#project-scope)
3. [Redis Caching Implementation](#redis-caching-implementation)
4. [Docker Deployment](#docker-deployment)
5. [Testing Strategy](#testing-strategy)
6. [Success Criteria](#success-criteria)
7. [Timeline & Milestones](#timeline--milestones)
8. [Appendix](#appendix)

---

## Executive Summary

This specification outlines the implementation plan for adding Redis caching to all API routes, containerizing the application with Docker for deployment, and establishing comprehensive unit and integration tests to achieve >80% code coverage.

### Goals

- **Performance**: Reduce API response times by 40-60% for frequently accessed data
- **Scalability**: Enable horizontal scaling through Docker containerization
- **Reliability**: Achieve >80% test coverage to ensure system stability
- **Deployment**: Streamline CI/CD pipeline with Docker-based deployments

---

## Project Scope

### Current State

| Component | Status |
|-----------|--------|
| Backend Framework | NestJS v11 |
| Database | PostgreSQL with Prisma ORM |
| Queue System | BullMQ with Redis |
| Testing | Jest (minimal coverage) |
| Containerization | None |

### Target State

| Component | Enhancement |
|-----------|-------------|
| Caching | Redis cache layer for all API routes |
| Containerization | Docker + Docker Compose |
| Unit Tests | >80% coverage |
| Integration Tests | E2E tests for all critical flows |
| CI/CD | GitHub Actions pipeline |

---

## Redis Caching Implementation

### 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Cache Interceptor                            │
│                  (Check Redis First)                             │
└─────────────────────────────────────────────────────────────────┘
                       │                    │
                       ▼                    ▼
              ┌──────────────┐      ┌──────────────┐
              │    Redis     │      │   Service    │
              │    Cache     │◄────▶│    Layer     │
              └──────────────┘      └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  PostgreSQL  │
                                    └──────────────┘
```

### 2. Caching Strategy by Module

#### 2.1 Merchant Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /merchants` | `merchants:list:{query_hash}` | 5 min | Merchant create/update/delete |
| `GET /merchants/:id` | `merchant:{id}` | 10 min | Merchant update |
| `GET /merchants/featured` | `merchants:featured:{limit}` | 15 min | Merchant rating change |
| `GET /merchants/nearby` | `merchants:nearby:{lat}:{lng}:{distance}` | 5 min | Merchant location update |
| `GET /merchants/:id/menus` | `merchant:{id}:menus` | 5 min | Menu CRUD |
| `GET /merchants/:id/categories` | `merchant:{id}:categories` | 10 min | Category CRUD |
| `GET /merchants/:id/reviews` | `merchant:{id}:reviews:{page}` | 5 min | Review create |

#### 2.2 Menu Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /menus` | `menus:list:{query_hash}` | 5 min | Menu create/update/delete |
| `GET /menus/:id` | `menu:{id}` | 10 min | Menu update |
| `GET /menus/:id/variants` | `menu:{id}:variants` | 5 min | Variant CRUD |

#### 2.3 Category Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /categories` | `categories:all` | 30 min | Category create/update/delete |
| `GET /categories/:id` | `category:{id}` | 30 min | Category update |

#### 2.4 Order Module (Limited Caching)

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /orders/:id/status-history` | `order:{id}:history` | 1 min | Status change |
| `GET /orders/:id/track` | `order:{id}:tracking` | 30 sec | Location update |

> **Note**: Active order data should NOT be cached due to real-time nature.

#### 2.5 User Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /users/:id/profile` | `user:{id}:profile` | 15 min | Profile update |
| `GET /users/:id/addresses` | `user:{id}:addresses` | 15 min | Address CRUD |

#### 2.6 Promotion Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /promotions` | `promotions:active` | 5 min | Promotion CRUD |
| `GET /promotions/:code` | `promotion:code:{code}` | 5 min | Promotion update |

#### 2.7 Driver Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /drivers/available` | `drivers:available:{area_hash}` | 30 sec | Driver status change |
| `GET /drivers/:id` | `driver:{id}` | 5 min | Driver update |

#### 2.8 Admin Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /admin/dashboard/stats` | `admin:stats` | 1 min | Order/User changes |
| `GET /admin/users` | `admin:users:{query_hash}` | 2 min | User CRUD |
| `GET /admin/merchants` | `admin:merchants:{query_hash}` | 2 min | Merchant CRUD |

#### 2.9 Notification Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /notifications` | `notifications:user:{userId}` | 1 min | New notification |

#### 2.10 Review Module

| Endpoint | Cache Key Pattern | TTL | Invalidation Trigger |
|----------|-------------------|-----|----------------------|
| `GET /reviews/merchant/:id` | `reviews:merchant:{id}:{page}` | 5 min | Review create |
| `GET /reviews/driver/:id` | `reviews:driver:{id}:{page}` | 5 min | Review create |

### 3. Implementation Components

#### 3.1 Redis Cache Module

```typescript
// src/common/cache/cache.module.ts
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
        ttl: 300, // default 5 minutes
      }),
    }),
  ],
  exports: [CacheModule],
})
export class RedisCacheModule {}
```

#### 3.2 Cache Decorator

```typescript
// src/common/decorators/cache.decorator.ts
export const CacheKey = (key: string) => SetMetadata('cache_key', key);
export const CacheTTL = (ttl: number) => SetMetadata('cache_ttl', ttl);
export const CacheInvalidate = (...keys: string[]) => 
  SetMetadata('cache_invalidate', keys);
```

#### 3.3 Cache Interceptor

```typescript
// src/common/interceptors/cache.interceptor.ts
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    // Cache logic implementation
  }
}
```

#### 3.4 Cache Invalidation Service

```typescript
// src/common/cache/cache-invalidation.service.ts
@Injectable()
export class CacheInvalidationService {
  async invalidatePattern(pattern: string): Promise<void>;
  async invalidateKeys(...keys: string[]): Promise<void>;
  async invalidateMerchantCache(merchantId: string): Promise<void>;
  async invalidateUserCache(userId: string): Promise<void>;
  async invalidateOrderCache(orderId: string): Promise<void>;
}
```

### 4. User Stories - Redis Caching

#### US-RC-001: Redis Cache Infrastructure
**As a** developer  
**I want** a centralized Redis caching module  
**So that** I can easily add caching to any service

**Acceptance Criteria:**
- [ ] Redis connection is established on application startup
- [ ] Connection errors are handled gracefully with fallback to database
- [ ] Cache module is injectable into any service
- [ ] Environment variables configure Redis connection (host, port, password)
- [ ] Health check endpoint verifies Redis connectivity

#### US-RC-002: Merchant Listing Cache
**As a** customer  
**I want** merchant listings to load quickly  
**So that** I can browse restaurants without waiting

**Acceptance Criteria:**
- [ ] `GET /merchants` response cached for 5 minutes
- [ ] Cache key includes query parameters (pagination, filters)
- [ ] Cache invalidated when any merchant is created/updated/deleted
- [ ] Response time < 50ms for cached requests
- [ ] Cache miss logs are captured for monitoring

#### US-RC-003: Menu Items Cache
**As a** customer  
**I want** menu items to load instantly when viewing a restaurant  
**So that** I can quickly browse and order

**Acceptance Criteria:**
- [ ] Menu items cached per merchant for 5 minutes
- [ ] Menu variants included in cached response
- [ ] Cache invalidated on menu item CRUD operations
- [ ] Images URLs resolved before caching

#### US-RC-004: Category Cache
**As a** customer  
**I want** categories to be instantly available  
**So that** I can filter restaurants by cuisine type

**Acceptance Criteria:**
- [ ] All categories cached for 30 minutes
- [ ] Cache refreshed on category CRUD
- [ ] Cache warming on application startup

#### US-RC-005: Cache Invalidation
**As a** system  
**I want** stale cache to be automatically invalidated  
**So that** users always see up-to-date information

**Acceptance Criteria:**
- [ ] Pattern-based invalidation for related caches
- [ ] Event-driven invalidation via decorators
- [ ] Manual invalidation API for admin
- [ ] Invalidation logged for debugging

#### US-RC-006: Cache Metrics
**As a** developer  
**I want** to monitor cache hit/miss rates  
**So that** I can optimize caching strategy

**Acceptance Criteria:**
- [ ] Cache hit/miss logged per endpoint
- [ ] Metrics exposed via `/metrics` endpoint
- [ ] Dashboard integration for monitoring
- [ ] Alerts configured for low hit rates

---

## Docker Deployment

### 1. Container Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Stack                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  nginx   │  │ backend  │  │ frontend │  │ postgres         │ │
│  │  proxy   │  │ (nestjs) │  │ (vite)   │  │ (database)       │ │
│  │  :80/443 │  │  :3000   │  │  :5173   │  │  :5432           │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘ │
│                     │                                            │
│  ┌──────────────────┼──────────────────────────────────────────┐ │
│  │                  ▼                                          │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐  │ │
│  │  │  redis   │  │  redis   │  │  cloudinary (external)   │  │ │
│  │  │  cache   │  │  queue   │  │                          │  │ │
│  │  │  :6379   │  │  :6380   │  │                          │  │ │
│  │  └──────────┘  └──────────┘  └──────────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### 2. Docker Files

#### 2.1 Backend Dockerfile

**File:** `backend/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm prisma generate

# Build application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

RUN npm install -g pnpm

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/main.js"]
```

#### 2.2 Frontend Dockerfile

**File:** `frontend/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine AS production

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

#### 2.3 Docker Compose

**File:** `docker-compose.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: food-delivery-db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis-cache:
    image: redis:7-alpine
    container_name: food-delivery-redis-cache
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_cache_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis-queue:
    image: redis:7-alpine
    container_name: food-delivery-redis-queue
    command: redis-server --appendonly yes
    volumes:
      - redis_queue_data:/data
    ports:
      - "6380:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: food-delivery-backend
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      REDIS_CACHE_HOST: redis-cache
      REDIS_CACHE_PORT: 6379
      REDIS_QUEUE_HOST: redis-queue
      REDIS_QUEUE_PORT: 6379
      NODE_ENV: production
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis-cache:
        condition: service_healthy
      redis-queue:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: food-delivery-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    container_name: food-delivery-proxy
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    ports:
      - "443:443"
    depends_on:
      - backend
      - frontend

volumes:
  postgres_data:
  redis_cache_data:
  redis_queue_data:
```

#### 2.4 Docker Compose for Development

**File:** `docker-compose.dev.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: food_delivery_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_dev_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_dev_data:/data

  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      REDIS_HOSTS: local:redis:6379
    ports:
      - "8081:8081"
    depends_on:
      - redis

volumes:
  postgres_dev_data:
  redis_dev_data:
```

### 3. User Stories - Docker

#### US-D-001: Backend Containerization
**As a** DevOps engineer  
**I want** the backend to run in a Docker container  
**So that** deployment is consistent across environments

**Acceptance Criteria:**
- [ ] Multi-stage Dockerfile reduces image size (<500MB)
- [ ] Container starts successfully with all dependencies
- [ ] Health check endpoint returns 200
- [ ] Environment variables are configurable
- [ ] Logs are accessible via `docker logs`
- [ ] Prisma migrations run on startup

#### US-D-002: Frontend Containerization
**As a** DevOps engineer  
**I want** the frontend to run in a Docker container  
**So that** static assets are served efficiently

**Acceptance Criteria:**
- [ ] Nginx serves built static files
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] Health check returns 200
- [ ] Container size < 50MB

#### US-D-003: Docker Compose Orchestration
**As a** developer  
**I want** to run the entire stack with one command  
**So that** local development matches production

**Acceptance Criteria:**
- [ ] `docker-compose up` starts all services
- [ ] Services wait for dependencies (health checks)
- [ ] Data persists across restarts (volumes)
- [ ] Network isolation between services
- [ ] Easy teardown with `docker-compose down`

#### US-D-004: Development Environment
**As a** developer  
**I want** a lightweight Docker setup for development  
**So that** I can develop with real database and cache

**Acceptance Criteria:**
- [ ] Hot reload works with mounted volumes
- [ ] Database GUI accessible (pgAdmin or similar)
- [ ] Redis GUI accessible (Redis Commander)
- [ ] Fast startup time (<30 seconds)

#### US-D-005: Production-Ready Configuration
**As a** DevOps engineer  
**I want** production-optimized Docker configuration  
**So that** the application is secure and performant

**Acceptance Criteria:**
- [ ] Non-root user in containers
- [ ] Security scanning passes (no critical vulnerabilities)
- [ ] Resource limits configured
- [ ] Restart policies defined
- [ ] SSL/TLS termination at nginx
- [ ] Rate limiting configured

---

## Testing Strategy

### 1. Test Pyramid

```
                    ┌───────────────────┐
                    │   E2E Tests       │  5%
                    │   (Playwright)    │
                    ├───────────────────┤
                    │                   │
                    │  Integration      │  25%
                    │  Tests (Jest)     │
                    │                   │
                    ├───────────────────┤
                    │                   │
                    │                   │
                    │   Unit Tests      │  70%
                    │   (Jest)          │
                    │                   │
                    │                   │
                    └───────────────────┘
```

### 2. Coverage Requirements

| Module | Current | Target | Priority |
|--------|---------|--------|----------|
| Merchant Service | ~10% | >85% | High |
| Order Service | ~10% | >90% | Critical |
| Cart Service | ~5% | >85% | High |
| Menu Service | ~10% | >80% | Medium |
| User Service | ~15% | >85% | High |
| Payment Service | ~5% | >90% | Critical |
| Driver Service | ~5% | >85% | High |
| Admin Service | ~10% | >80% | Medium |
| Auth Service | ~20% | >90% | Critical |
| Cache Service | 0% | >80% | High |
| **Overall** | **~10%** | **>80%** | **Required** |

### 3. Unit Test Specifications

#### 3.1 Merchant Service Tests

```typescript
// src/modules/merchant/merchant.service.spec.ts

describe('MerchantService', () => {
  describe('getAllMerchants', () => {
    it('should return paginated merchants');
    it('should filter by approval status');
    it('should filter by isOpen');
    it('should search by name');
    it('should handle empty results');
  });

  describe('getMerchantById', () => {
    it('should return merchant with relations');
    it('should throw NotFoundException for invalid id');
    it('should cache response');
  });

  describe('createMerchant', () => {
    it('should create merchant with valid data');
    it('should throw on duplicate name');
    it('should set default approval status to PENDING');
    it('should invalidate merchants list cache');
  });

  describe('updateMerchant', () => {
    it('should update merchant fields');
    it('should not allow changing ownerId');
    it('should invalidate cache on update');
  });

  describe('deleteMerchant', () => {
    it('should soft delete merchant');
    it('should cascade to related entities');
    it('should invalidate cache');
  });

  describe('getFeaturedMerchants', () => {
    it('should return top rated merchants');
    it('should respect limit parameter');
    it('should only include approved merchants');
  });

  describe('getNearbyMerchants', () => {
    it('should calculate distance correctly');
    it('should filter by maxDistance');
    it('should order by distance ascending');
  });
});
```

#### 3.2 Order Service Tests

```typescript
// src/modules/order/order.service.spec.ts

describe('OrderService', () => {
  describe('createOrder', () => {
    it('should create order from cart');
    it('should calculate total correctly');
    it('should apply promotions');
    it('should set initial status to CREATED');
    it('should validate cart belongs to user');
    it('should invalidate cart after order');
  });

  describe('getOrders', () => {
    it('should return user orders');
    it('should include order items');
    it('should paginate results');
  });

  describe('getActiveOrders', () => {
    it('should only return non-completed orders');
    it('should include tracking information');
  });

  describe('editStatus', () => {
    it('should update order status');
    it('should add status history entry');
    it('should notify user on status change');
    it('should validate status transition');
    it('should prevent invalid transitions');
  });

  describe('cancelOrder', () => {
    it('should cancel if status is CREATED');
    it('should cancel if status is PAID');
    it('should fail if order is PREPARING');
    it('should trigger refund process');
  });

  describe('reorder', () => {
    it('should create new order from previous');
    it('should check item availability');
    it('should update prices to current');
  });
});
```

#### 3.3 Cart Service Tests

```typescript
// src/modules/cart/cart.service.spec.ts

describe('CartService', () => {
  describe('getActiveCart', () => {
    it('should return active cart for user');
    it('should create new cart if none exists');
    it('should not return expired carts');
  });

  describe('addItem', () => {
    it('should add item to cart');
    it('should update quantity if item exists');
    it('should calculate item total');
    it('should update cart subtotal');
    it('should validate merchant consistency');
  });

  describe('updateItem', () => {
    it('should update item quantity');
    it('should recalculate totals');
    it('should remove item if quantity is 0');
  });

  describe('removeItem', () => {
    it('should remove item from cart');
    it('should recalculate subtotal');
  });

  describe('clearCart', () => {
    it('should remove all items');
    it('should reset subtotal to 0');
  });

  describe('checkout', () => {
    it('should change cart status to CHECKOUT');
    it('should validate minimum order amount');
    it('should check merchant is open');
  });
});
```

#### 3.4 Cache Service Tests

```typescript
// src/common/cache/cache.service.spec.ts

describe('CacheService', () => {
  describe('get', () => {
    it('should return cached value');
    it('should return null for missing key');
    it('should handle connection errors gracefully');
  });

  describe('set', () => {
    it('should store value with TTL');
    it('should serialize objects');
    it('should handle large objects');
  });

  describe('delete', () => {
    it('should remove cached key');
    it('should return true if deleted');
    it('should return false if not found');
  });

  describe('invalidatePattern', () => {
    it('should delete all matching keys');
    it('should handle wildcards');
    it('should be atomic');
  });

  describe('getOrSet', () => {
    it('should return cached value if exists');
    it('should call factory if cache miss');
    it('should cache factory result');
    it('should handle concurrent requests');
  });
});
```

### 4. Integration Test Specifications

#### 4.1 Order Flow Integration Tests

```typescript
// test/order.e2e-spec.ts

describe('Order Flow (e2e)', () => {
  describe('Complete Order Flow', () => {
    it('should complete full order lifecycle', async () => {
      // 1. Customer creates cart
      // 2. Customer adds items
      // 3. Customer creates order
      // 4. Customer pays
      // 5. Merchant accepts
      // 6. Merchant prepares
      // 7. Driver picks up
      // 8. Driver delivers
      // 9. Order completed
    });
  });

  describe('Order Cancellation', () => {
    it('should allow cancellation before preparation');
    it('should process refund on cancellation');
    it('should notify all parties');
  });

  describe('Order with Promotion', () => {
    it('should apply valid promotion code');
    it('should reject expired promotion');
    it('should enforce usage limits');
  });
});
```

#### 4.2 Authentication Integration Tests

```typescript
// test/auth.e2e-spec.ts

describe('Authentication (e2e)', () => {
  describe('Registration', () => {
    it('should register new user');
    it('should reject duplicate email');
    it('should hash password');
  });

  describe('Login', () => {
    it('should return tokens on valid credentials');
    it('should reject invalid password');
    it('should reject non-existent user');
  });

  describe('Protected Routes', () => {
    it('should allow access with valid token');
    it('should reject expired token');
    it('should reject invalid token');
  });

  describe('Role-based Access', () => {
    it('should allow customer to access customer routes');
    it('should deny customer access to admin routes');
    it('should allow admin access to all routes');
  });
});
```

#### 4.3 Payment Integration Tests

```typescript
// test/payment.e2e-spec.ts

describe('Payment (e2e)', () => {
  describe('Payment Creation', () => {
    it('should create payment for order');
    it('should return payment URL');
  });

  describe('Payment Callback', () => {
    it('should update payment status on callback');
    it('should update order status on success');
    it('should handle duplicate callbacks');
  });

  describe('Refund', () => {
    it('should process refund for cancelled order');
    it('should update payment status');
  });
});
```

#### 4.4 Cache Integration Tests

```typescript
// test/cache.e2e-spec.ts

describe('Cache Integration (e2e)', () => {
  describe('Merchant Cache', () => {
    it('should cache merchant list');
    it('should return cached response on second request');
    it('should invalidate on merchant update');
  });

  describe('Cache Fallback', () => {
    it('should fallback to database on Redis failure');
    it('should recover when Redis comes back');
  });

  describe('Cache Invalidation', () => {
    it('should invalidate related caches atomically');
    it('should handle concurrent invalidations');
  });
});
```

### 5. User Stories - Testing

#### US-T-001: Unit Test Infrastructure
**As a** developer  
**I want** a robust unit testing setup  
**So that** I can write and run tests easily

**Acceptance Criteria:**
- [ ] Jest configured with TypeScript support
- [ ] Mocking utilities available (jest.mock)
- [ ] Test database setup for isolated tests
- [ ] Coverage reports generated
- [ ] Tests run in CI pipeline

#### US-T-002: Merchant Service Unit Tests
**As a** developer  
**I want** comprehensive merchant service tests  
**So that** merchant functionality is verified

**Acceptance Criteria:**
- [ ] All public methods have tests
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Cache interactions mocked
- [ ] Database calls mocked
- [ ] Coverage > 85%

#### US-T-003: Order Service Unit Tests
**As a** developer  
**I want** complete order service tests  
**So that** order processing is reliable

**Acceptance Criteria:**
- [ ] All order status transitions tested
- [ ] Payment integration mocked
- [ ] Notification triggers tested
- [ ] Validation errors tested
- [ ] Coverage > 90%

#### US-T-004: Integration Test Suite
**As a** QA engineer  
**I want** integration tests for critical flows  
**So that** system behavior is validated

**Acceptance Criteria:**
- [ ] Order flow tested end-to-end
- [ ] Authentication flow tested
- [ ] Payment flow tested
- [ ] Tests use real database (test container)
- [ ] Tests are isolated and repeatable

#### US-T-005: Test Coverage Reporting
**As a** tech lead  
**I want** automated coverage reports  
**So that** I can track testing progress

**Acceptance Criteria:**
- [ ] Coverage report generated on each test run
- [ ] HTML report available for detailed view
- [ ] Coverage thresholds enforced (>80%)
- [ ] Coverage integrated with CI/CD
- [ ] Coverage badge displayed in README

#### US-T-006: CI/CD Test Pipeline
**As a** developer  
**I want** tests to run automatically  
**So that** regressions are caught early

**Acceptance Criteria:**
- [ ] Unit tests run on every PR
- [ ] Integration tests run on merge to main
- [ ] Coverage must pass thresholds to merge
- [ ] Test results visible in PR
- [ ] Failing tests block merge

---

## Success Criteria

### Redis Caching

| Criteria | Metric | Target |
|----------|--------|--------|
| Cache Hit Rate | % of requests served from cache | >70% |
| Response Time Improvement | Average response time reduction | >40% |
| Cache Invalidation Accuracy | Stale data incidents | 0 |
| Fallback Reliability | Database fallback success rate | 100% |
| Memory Efficiency | Redis memory usage | <512MB |

### Docker Deployment

| Criteria | Metric | Target |
|----------|--------|--------|
| Container Startup Time | Time to healthy state | <30s |
| Image Size | Backend container | <500MB |
| Image Size | Frontend container | <50MB |
| Security Scan | Critical vulnerabilities | 0 |
| Uptime | Container availability | >99.9% |

### Testing

| Criteria | Metric | Target |
|----------|--------|--------|
| Unit Test Coverage | Lines of code | >80% |
| Integration Test Coverage | Critical flows | 100% |
| Test Execution Time | Full suite | <5 min |
| Test Reliability | Flaky test rate | <1% |
| CI Pipeline Success Rate | Builds passing | >95% |

---

## Timeline & Milestones

### Phase 1: Redis Caching (2 Weeks)

| Week | Tasks |
|------|-------|
| Week 1 | - Set up Redis cache module<br>- Implement cache interceptor<br>- Add caching to Merchant module<br>- Add caching to Menu module |
| Week 2 | - Add caching to remaining modules<br>- Implement cache invalidation<br>- Add monitoring/metrics<br>- Performance testing |

### Phase 2: Docker Deployment (1 Week)

| Day | Tasks |
|-----|-------|
| Day 1-2 | - Create backend Dockerfile<br>- Create frontend Dockerfile<br>- Test individual containers |
| Day 3-4 | - Create docker-compose.yml<br>- Configure networking<br>- Add health checks |
| Day 5 | - Create development compose file<br>- Documentation<br>- Security hardening |

### Phase 3: Testing (3 Weeks)

| Week | Tasks |
|------|-------|
| Week 1 | - Unit tests for Merchant service<br>- Unit tests for Order service<br>- Unit tests for Cart service |
| Week 2 | - Unit tests for remaining services<br>- Integration test infrastructure<br>- Auth integration tests |
| Week 3 | - Order flow integration tests<br>- Cache integration tests<br>- CI/CD pipeline setup<br>- Coverage optimization |

### Total Duration: 6 Weeks

---

## Appendix

### A. Environment Variables

```env
# Redis Cache
REDIS_CACHE_HOST=localhost
REDIS_CACHE_PORT=6379
REDIS_CACHE_PASSWORD=
REDIS_CACHE_DB=0

# Redis Queue (BullMQ)
REDIS_QUEUE_HOST=localhost
REDIS_QUEUE_PORT=6380
REDIS_QUEUE_PASSWORD=
REDIS_QUEUE_DB=0

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/food_delivery

# Application
NODE_ENV=production
PORT=3000
```

### B. Dependencies to Add

```json
{
  "dependencies": {
    "@nestjs/cache-manager": "^2.2.0",
    "cache-manager": "^5.4.0",
    "cache-manager-ioredis-yet": "^2.1.0"
  },
  "devDependencies": {
    "@testcontainers/postgresql": "^10.0.0",
    "@testcontainers/redis": "^10.0.0",
    "testcontainers": "^10.0.0"
  }
}
```

### C. File Structure

```
backend/
├── src/
│   ├── common/
│   │   ├── cache/
│   │   │   ├── cache.module.ts
│   │   │   ├── cache.service.ts
│   │   │   ├── cache.service.spec.ts
│   │   │   ├── cache-invalidation.service.ts
│   │   │   └── cache.interceptor.ts
│   │   ├── decorators/
│   │   │   └── cache.decorator.ts
│   │   └── ...
│   └── modules/
│       └── merchant/
│           ├── merchant.service.ts
│           └── merchant.service.spec.ts
├── test/
│   ├── jest-e2e.json
│   ├── setup.ts
│   ├── order.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── payment.e2e-spec.ts
│   └── cache.e2e-spec.ts
├── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

### D. Monitoring & Observability

```typescript
// Cache Metrics Example
interface CacheMetrics {
  hits: number;
  misses: number;
  hitRate: number;
  avgLatency: number;
  keyCount: number;
  memoryUsage: number;
}
```

### E. References

- [NestJS Caching Documentation](https://docs.nestjs.com/techniques/caching)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Jest Testing Documentation](https://jestjs.io/docs/getting-started)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
