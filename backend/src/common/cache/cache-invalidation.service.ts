import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import type { Cache } from "cache-manager";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import Redis from "ioredis";

@Injectable()
export class CacheInvalidationService {
  private redis: Redis | null = null;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.initRedis();
  }

  private initRedis(): void {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_CACHE_HOST || "localhost",
        port: parseInt(process.env.REDIS_CACHE_PORT || "6379", 10),
        password: process.env.REDIS_CACHE_PASSWORD || undefined,
        db: parseInt(process.env.REDIS_CACHE_DB || "0", 10),
      });
    } catch (error) {
      this.logger.error("Failed to initialize Redis for pattern invalidation", error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      if (!this.redis) {
        this.logger.warn("Redis not available for pattern invalidation");
        return;
      }

      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        this.logger.debug(`Cache INVALIDATE pattern ${pattern}: ${keys.length} keys deleted`);
      }
    } catch (error) {
      this.logger.error(`Cache pattern invalidation error for ${pattern}:`, error);
    }
  }

  async invalidateKeys(...keys: string[]): Promise<void> {
    try {
      for (const key of keys) {
        await this.cacheManager.del(key);
      }
      this.logger.debug(`Cache INVALIDATE keys: ${keys.join(", ")}`);
    } catch (error) {
      this.logger.error(`Cache key invalidation error:`, error);
    }
  }

  async invalidateMerchantCache(merchantId: string): Promise<void> {
    await this.invalidatePattern(`merchant:${merchantId}*`);
    await this.invalidatePattern(`merchants:*`);
    this.logger.debug(`Invalidated merchant cache for ${merchantId}`);
  }

  async invalidateMenuCache(merchantId: string): Promise<void> {
    await this.invalidatePattern(`menu:*`);
    await this.invalidatePattern(`menus:*`);
    await this.invalidatePattern(`merchant:${merchantId}:menus*`);
    this.logger.debug(`Invalidated menu cache for merchant ${merchantId}`);
  }

  async invalidateCategoryCache(): Promise<void> {
    await this.invalidatePattern(`categories:*`);
    await this.invalidatePattern(`category:*`);
    this.logger.debug("Invalidated category cache");
  }

  async invalidateUserCache(userId: string): Promise<void> {
    await this.invalidatePattern(`user:${userId}*`);
    this.logger.debug(`Invalidated user cache for ${userId}`);
  }

  async invalidateOrderCache(orderId: string): Promise<void> {
    await this.invalidatePattern(`order:${orderId}*`);
    this.logger.debug(`Invalidated order cache for ${orderId}`);
  }

  async invalidateDriverCache(driverId?: string): Promise<void> {
    if (driverId) {
      await this.invalidatePattern(`driver:${driverId}*`);
    }
    await this.invalidatePattern(`drivers:*`);
    this.logger.debug(`Invalidated driver cache${driverId ? ` for ${driverId}` : ""}`);
  }

  async invalidatePromotionCache(): Promise<void> {
    await this.invalidatePattern(`promotions:*`);
    await this.invalidatePattern(`promotion:*`);
    this.logger.debug("Invalidated promotion cache");
  }

  async invalidateReviewCache(merchantId?: string, driverId?: string): Promise<void> {
    if (merchantId) {
      await this.invalidatePattern(`reviews:merchant:${merchantId}*`);
    }
    if (driverId) {
      await this.invalidatePattern(`reviews:driver:${driverId}*`);
    }
    this.logger.debug("Invalidated review cache");
  }

  async invalidateNotificationCache(userId: string): Promise<void> {
    await this.invalidatePattern(`notifications:user:${userId}*`);
    this.logger.debug(`Invalidated notification cache for ${userId}`);
  }

  async invalidateAdminCache(): Promise<void> {
    await this.invalidatePattern(`admin:*`);
    this.logger.debug("Invalidated admin cache");
  }
}
