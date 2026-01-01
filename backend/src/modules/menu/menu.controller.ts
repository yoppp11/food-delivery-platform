import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import type { Merchant, User } from "@prisma/client";
import { MenuService } from "./menu.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import type { CreateMenu, UpdateMenu } from "../../schemas/menu";
import { BadRequestError } from "../../common/exception.filter";
import { CurrentUser, Roles } from "../../common/decorators";
import { MenuApiResponse } from "./types";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryStorageService } from "../../common/cloudinary/cloudinary.storage";
import { PermissionGuard } from "../../common/guard";

@Controller("menus")
@UseGuards(PermissionGuard)
export class MenuController {
  constructor(
    private service: MenuService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  @Get()
  async getAllMenus(
    @Query("search") search: string,
    @Query("page") page: number,
    @CurrentUser() user: User,
  ): Promise<MenuApiResponse> {
    return await this.service.getAllMenus(user, search, page);
  }

  @Post()
  @UseFilters(BadRequestError)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: CloudinaryStorageService,
    }),
  )
  @Roles(["ADMIN", "MERCHANT"])
  async createMenus(
    @Body() body: CreateMenu,
    @CurrentUser() user: User & { merchants: Merchant[] },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.service.createMenu(user, body, file);
  }

  @Get(":id")
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getById(id);
  }

  @Put(":id")
  @UseFilters(BadRequestError)
  @Roles(["ADMIN", "MERCHANT"])
  async updateMenu(
    @Body() body: UpdateMenu,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return await this.service.updateMenu(id, body);
  }

  @Delete(":id")
  @Roles(["ADMIN", "MERCHANT"])
  async deleteMenu(@Param("id") id: string, @CurrentUser() user: User) {
    return await this.service.deleteMenu(id, user);
  }
}
