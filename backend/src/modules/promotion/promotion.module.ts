import { Module } from "@nestjs/common";
import { PromotionController } from "./promotion.controller";
import { PromotionService } from "./promotion.service";

@Module({
  providers: [PromotionService],
  controllers: [PromotionController],
  exports: [PromotionService],
})
export class PromotionModule {}
