import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from "@nestjs/common";
import type { Menu, User } from "@prisma/client";
import { MenuService } from "./menu.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import type { CreateMenu } from "../../schemas/menu";
import { BadRequestError } from "../../common/exception.filter";
import { Auth } from "../../common/decorators";
import { FileInterceptor } from "@nestjs/platform-express";

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

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @UseFilters(BadRequestError)
  async createMenus(
    @Body() body: CreateMenu,
    @Auth() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.createMenu(user, body, file);
  }
}
