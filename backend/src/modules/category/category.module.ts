import { Module } from "@nestjs/common";
import { CategoryService } from "./category/category.service";
import { CategoryController } from "./category/category.controller";

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
