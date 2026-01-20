import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes";
import { CreateAddressSchema, UpdateAddressSchema } from "./types";
import type { CreateAddress, UpdateAddress } from "./types";
import type { User, UserAddres } from "@prisma/client";

@Controller("users/addresses")
@UseGuards(PermissionGuard)
export class AddressController {
  constructor(private readonly service: AddressService) {}

  @Get()
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async getAllAddresses(@CurrentUser() user: User): Promise<UserAddres[]> {
    return await this.service.getAllAddresses(user);
  }

  @Get(":id")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async getAddressById(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<UserAddres> {
    return await this.service.getAddressById(id, user);
  }

  @Post()
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async createAddress(
    @Body(new ZodValidationPipe(CreateAddressSchema)) body: CreateAddress,
    @CurrentUser() user: User,
  ): Promise<UserAddres> {
    return await this.service.createAddress(body, user);
  }

  @Put(":id")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async updateAddress(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateAddressSchema)) body: UpdateAddress,
    @CurrentUser() user: User,
  ): Promise<UserAddres> {
    return await this.service.updateAddress(id, body, user);
  }

  @Patch(":id/default")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async setDefaultAddress(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<UserAddres> {
    return await this.service.setDefaultAddress(id, user);
  }

  @Delete(":id")
  @Roles(["CUSTOMER", "MERCHANT", "DRIVER", "ADMIN"])
  async deleteAddress(
    @Param("id", ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<UserAddres> {
    return await this.service.deleteAddress(id, user);
  }
}
