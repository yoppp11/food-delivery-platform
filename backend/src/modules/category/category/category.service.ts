import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../../common/prisma.service";
import { Category } from "@prisma/client";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getAllCategory(): Promise<Category[]> {
    return await this.prisma.category.findMany();
  }
}
