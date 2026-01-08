/* eslint-disable prettier/prettier */
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
import {
  CreateMenuSchema,
  type CreateMenu,
  type UpdateMenu,
} from "../../schemas/menu";
import { BadRequestError } from "../../common/exception.filter";
import { CurrentMerchant, CurrentUser, Roles } from "../../common/decorators";
import { MenuApiResponse } from "./types";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryStorageService } from "../../common/cloudinary/cloudinary.storage";
import { ZodValidationPipe } from "../../common/pipes";
import { MerchantGuard, PermissionGuard } from "../../common/guards";
import {
  CheckOwnershipGuard,
  ResourceType,
} from "../../common/guards/check-ownership.guard";

@Controller("menus")
export class MenuController {
  constructor(
    private service: MenuService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {}

  @Get()
  async getAllMenus(
    @Query("search") search: string,
    @Query("page") page: number,
    @CurrentUser() user: User
  ): Promise<MenuApiResponse> {
    this.logger.info(user);
    return await this.service.getAllMenus(user, search, page);
  }

  @Post()
  @UseGuards(PermissionGuard, MerchantGuard)
  @UseFilters(BadRequestError)
  @UseInterceptors(
    FileInterceptor("image", {
      storage: CloudinaryStorageService,
    })
  )
  @Roles(["ADMIN", "MERCHANT"])
  async createMenus(
    @Body(new ZodValidationPipe(CreateMenuSchema)) body: CreateMenu,
    @CurrentUser() user: User,
    @CurrentMerchant() merchant: Merchant,
    @UploadedFile() file: Express.Multer.File
  ) {
    return await this.service.createMenu(user, merchant, body, file);
  }

  @Get(":id")
  async getById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getById(id);
  }

  @Put(":id")
  @UseGuards(PermissionGuard, MerchantGuard, CheckOwnershipGuard)
  @UseFilters(BadRequestError)
  @Roles(["ADMIN", "MERCHANT"])
  @ResourceType({ resourceType: "menu" })
  async updateMenu(
    @Body() body: UpdateMenu,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    return await this.service.updateMenu(id, body);
  }

  @Delete(":id")
  @UseGuards(PermissionGuard, MerchantGuard, CheckOwnershipGuard)
  @Roles(["ADMIN", "MERCHANT"])
  @ResourceType({ resourceType: "menu" })
  async deleteMenu(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.deleteMenu(id);
  }
}
