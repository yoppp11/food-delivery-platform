import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
} from "@nestjs/common";
import type { Merchant, User } from "@prisma/client";
import { MenuService } from "./menu.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import type { CreateMenu, UpdateMenu } from "../../schemas/menu";
import { BadRequestError } from "../../common/exception.filter";
import { AuthDec, MerchantDec } from "../../common/decorators";
import { MenuApiResponse } from "./types";

@Controller("menus")
export class MenuController {
  constructor(
    private service: MenuService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {}

  @Get()
  async getAllMenus(
    @Query("search") search: string,
    @Query("page", ParseIntPipe) page: number,
    @MerchantDec() merchant: Merchant
  ): Promise<MenuApiResponse> {
    return await this.service.getAllMenus(merchant.id, search, page);
  }

  @Post()
  @UseFilters(BadRequestError)
  async createMenus(
    @Body() body: CreateMenu,
    @AuthDec() user: User,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.service.createMenu(user, body, file);
  }

  @Put(":id")
  @UseFilters(BadRequestError)
  async updateMenu(
    @Body() body: UpdateMenu,
    @Param("id", ParseUUIDPipe) id: string,
    @AuthDec() user: User,
  ) {
    return await this.service.updateMenu(id, body);
  }
}
