import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import Redis from "ioredis";

@Controller("health")
export class HealthController {
  private redis: Redis | null = null;

  constructor(private prisma: PrismaService) {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_CACHE_HOST || "localhost",
        port: parseInt(process.env.REDIS_CACHE_PORT || "6379", 10),
        password: process.env.REDIS_CACHE_PASSWORD || undefined,
      });
    } catch {
      this.redis = null;
    }
  }

  @Get()
  async check() {
    const health: Record<string, unknown> = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {},
    };

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      (health.services as Record<string, unknown>).database = "healthy";
    } catch {
      (health.services as Record<string, unknown>).database = "unhealthy";
      health.status = "degraded";
    }

    try {
      if (this.redis) {
        await this.redis.ping();
        (health.services as Record<string, unknown>).redis = "healthy";
      } else {
        (health.services as Record<string, unknown>).redis = "not configured";
      }
    } catch {
      (health.services as Record<string, unknown>).redis = "unhealthy";
      health.status = "degraded";
    }

    return health;
  }

  @Get("ready")
  async readiness() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ready" };
    } catch {
      return { status: "not ready" };
    }
  }

  @Get("live")
  liveness() {
    return { status: "alive" };
  }
}
