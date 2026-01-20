import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { DriverService } from "./driver.service";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { DriverLocation, type Driver, type User } from "@prisma/client";
import { ZodValidationPipe } from "../../common/pipes";
import {
  UpdateLocationSchema,
  RegisterDriverSchema,
  UpdateDriverProfileSchema,
} from "./types";
import type {
  UpdateLocation,
  RegisterDriver,
  UpdateDriverProfile,
} from "./types";

@Controller("drivers")
@UseGuards(PermissionGuard)
export class DriverController {
  constructor(private readonly service: DriverService) {}

  @Get()
  @Roles(["ADMIN"])
  async getDrivers() {
    return await this.service.getDrivers();
  }

  @Get("me")
  @Roles(["DRIVER", "ADMIN"])
  async getMyProfile(@CurrentUser() user: User): Promise<Driver> {
    return await this.service.getDetailDriver(user);
  }

  @Get("earnings")
  @Roles(["DRIVER"])
  async getEarnings(@CurrentUser() user: User) {
    return await this.service.getEarnings(user);
  }

  @Get("earnings/history")
  @Roles(["DRIVER"])
  async getEarningsHistory(
    @CurrentUser() user: User,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
  ) {
    return await this.service.getEarningsHistory(user, page, limit);
  }

  @Post("register")
  @Roles(["CUSTOMER"])
  async registerDriver(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(RegisterDriverSchema)) body: RegisterDriver,
  ): Promise<Driver> {
    return await this.service.registerDriver(user, body);
  }

  @Put("profile")
  @Roles(["DRIVER"])
  async updateDriverProfile(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(UpdateDriverProfileSchema))
    body: UpdateDriverProfile,
  ): Promise<Driver> {
    return await this.service.updateDriverProfile(user, body);
  }

  @Patch("updateLocation")
  @Roles(["DRIVER"])
  async updateLocation(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(UpdateLocationSchema)) body: UpdateLocation,
  ): Promise<DriverLocation> {
    return await this.service.updateLocation(user, body);
  }

  @Patch("availability")
  @Roles(["DRIVER"])
  async toggleAvailability(
    @Body("isAvailable") isAvailable: boolean,
    @CurrentUser() user: User,
  ) {
    return await this.service.toggleAvailability(user, isAvailable);
  }

  @Get(":id")
  async getDetailDriver(@Param("id", ParseUUIDPipe) id: string) {
    return await this.service.getDriver(id);
  }
}
