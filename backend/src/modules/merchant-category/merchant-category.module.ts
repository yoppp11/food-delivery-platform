import { Module } from "@nestjs/common";
import { MerchantCategoryController } from "./merchant-category.controller";
import { MerchantCategoryService } from "./merchant-category.service";

@Module({
  controllers: [MerchantCategoryController],
  providers: [MerchantCategoryService],
})
export class CategoryModule {}
