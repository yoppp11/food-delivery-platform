import { Controller, Get } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "@prisma/client";

@Controller("categories")
export class CategoryController {
  constructor(private services: CategoryService) {}

  @Get()
  async getAllCategories(): Promise<Category[]> {
    return await this.services.getAllCategory();
  }
}
