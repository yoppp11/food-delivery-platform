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
          url: process.env.REDIS_URL,
        }),
      }),
    }),
  ],
  providers: [CacheService, CacheInvalidationService],
  exports: [CacheModule, CacheService, CacheInvalidationService],
})
export class RedisCacheModule {}
