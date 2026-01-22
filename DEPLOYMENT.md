# Deployment Guide

This guide explains how to deploy the Food Delivery Platform using Docker and Docker Compose.

## Prerequisites

- Docker (20.10+)
- Docker Compose (2.0+)
- Environment variables configured

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and configure the following variables:

   ### Required Variables
   - `DB_USER`: Database username (default: postgres)
   - `DB_PASSWORD`: Strong database password
   - `DB_NAME`: Database name (default: food_delivery)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `BETTER_AUTH_SECRET`: Secure secret key (minimum 32 characters)
   - `BETTER_AUTH_URL`: Your application URL (e.g., https://yourdomain.com)

## Deployment Steps

### 1. Development Deployment

For development with hot-reload and debugging tools:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis (port 6379)
- PgAdmin (http://localhost:8080)
- Redis Commander (http://localhost:8081)

### 2. Production Deployment

For production with optimized builds:

```bash
docker-compose up -d --build
```

This will:
1. Build the backend and frontend Docker images
2. Start PostgreSQL, Redis (cache and queue), backend, and frontend services
3. Automatically run database migrations on backend startup
4. Expose the frontend on port 80 and backend API on port 3001

### 3. Verify Deployment

Check service health:
```bash
docker-compose ps
```

View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

Test API health:
```bash
curl http://localhost:3001/api/health
```

## Architecture

### Services

1. **PostgreSQL** (postgres:16-alpine)
   - Port: 5432
   - Persistent volume: `postgres_data`

2. **Redis Cache** (redis:7-alpine)
   - Port: 6379
   - Max memory: 256MB
   - Policy: allkeys-lru

3. **Redis Queue** (redis:7-alpine)
   - Port: 6380 (mapped from 6379)
   - Used for background job processing

4. **Backend** (NestJS)
   - Port: 3001
   - Auto-runs database migrations on startup
   - Health check: `/api/health`

5. **Frontend** (Nginx + Vite/React)
   - Port: 80
   - Proxies `/api` requests to backend

### Docker Build Process

#### Backend
1. Installs dependencies using pnpm
2. Generates Prisma client (using prisma.config.ts with fallback URL for build)
3. Builds NestJS application
4. Uses multi-stage build for smaller production image
5. Runs migrations and starts app via entrypoint script

Note: This project uses Prisma v7, which requires `prisma.config.ts` for configuration instead of defining the database URL in `schema.prisma`.

#### Frontend
1. Installs dependencies using pnpm
2. Builds Vite application
3. Serves static files via Nginx
4. Proxies API requests to backend

## Database Management

### Running Migrations

Migrations run automatically on backend startup. To run manually:

```bash
docker-compose exec backend npx prisma migrate deploy
```

### Creating New Migrations

```bash
# From your local development environment
cd backend
npx prisma migrate dev --name your_migration_name
```

### Accessing Database

Via PgAdmin (dev mode):
- URL: http://localhost:8080
- Email: admin@admin.com
- Password: admin

Via psql:
```bash
docker-compose exec postgres psql -U postgres -d food_delivery
```

## Troubleshooting

### Backend fails to start with "DATABASE_URL missing"

This project uses Prisma v7, which requires database configuration in `prisma.config.ts` instead of `schema.prisma`.

The configuration has been set up to:
- Use `prisma.config.ts` for database URL configuration (Prisma v7 requirement)
- Provide a fallback URL during build so `prisma generate` works without a real database
- Use the actual DATABASE_URL at runtime from docker-compose.yml

If you still encounter this, ensure your changes are saved and rebuild:
```bash
docker-compose build --no-cache backend
docker-compose up -d backend
```

### Frontend cannot connect to backend API

- Verify nginx configuration has correct backend port (3001)
- Check backend health: `curl http://localhost:3001/api/health`
- Check Docker network: `docker network inspect food-delivery-network`

### Migrations fail

- Ensure DATABASE_URL is correctly set in docker-compose.yml
- Check database connectivity: `docker-compose exec backend npx prisma db pull`
- View migration status: `docker-compose exec backend npx prisma migrate status`

### Port conflicts

If ports are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Change 3001 to 3002
```

## Maintenance

### Updating Dependencies

1. Update package.json
2. Rebuild images:
   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

### Backing Up Database

```bash
docker-compose exec postgres pg_dump -U postgres food_delivery > backup.sql
```

### Restoring Database

```bash
docker-compose exec -T postgres psql -U postgres food_delivery < backup.sql
```

### Viewing Resource Usage

```bash
docker stats
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **Passwords**: Use strong, unique passwords for production
3. **HTTPS**: Use a reverse proxy (like Traefik or Nginx) with SSL/TLS certificates
4. **Firewall**: Restrict database and Redis ports to internal network only
5. **Updates**: Regularly update Docker images for security patches

## Production Recommendations

1. Use managed database services (AWS RDS, Google Cloud SQL, etc.)
2. Use managed Redis services (AWS ElastiCache, Redis Cloud, etc.)
3. Implement proper logging and monitoring (ELK stack, Prometheus, Grafana)
4. Set up automated backups
5. Use container orchestration (Kubernetes, AWS ECS, etc.) for scalability
6. Implement CI/CD pipelines for automated deployments
7. Use environment-specific configurations

## Support

For issues and questions, please refer to the main README.md or create an issue in the repository.
