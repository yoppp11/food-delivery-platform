import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { Menu } from "@prisma/client";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async getAllMenus(): Promise<Menu[]> {
    return await this.prisma.menu.findMany();
  }
}
