import { Controller, Get, Inject, Req } from "@nestjs/common";
import { Menu } from "@prisma/client";
import { MenuService } from "./menu.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Controller("menus")
export class MenuController {
  constructor(
    private service: MenuService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Get()
  async getAllMenus(@Req() request: Request): Promise<Menu[]> {
    this.logger.info(request);
    return await this.service.getAllMenus();
  }
}
