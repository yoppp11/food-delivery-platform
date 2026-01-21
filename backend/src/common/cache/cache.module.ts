import { Global, Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-ioredis-yet";
import { CacheService } from "./cache.service";
import { CacheInvalidationService } from "./cache-invalidation.service";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          host: process.env.REDIS_CACHE_HOST || "localhost",
          port: parseInt(process.env.REDIS_CACHE_PORT || "6379", 10),
          password: process.env.REDIS_CACHE_PASSWORD || undefined,
          db: parseInt(process.env.REDIS_CACHE_DB || "0", 10),
          ttl: 300000,
        }),
      }),
    }),
  ],
  providers: [CacheService, CacheInvalidationService],
  exports: [CacheModule, CacheService, CacheInvalidationService],
})
export class RedisCacheModule {}
