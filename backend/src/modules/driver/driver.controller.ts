import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { DriverService } from "./driver.service";
import { PermissionGuard } from "../../common/guards";
import { CurrentUser, Roles } from "../../common/decorators";
import { DriverLocation, type Driver, type User } from "@prisma/client";
import { ZodValidationPipe } from "../../common/pipes";
import { type UpdateLocation, UpdateLocationSchema } from "./types";

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
