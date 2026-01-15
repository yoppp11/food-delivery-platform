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

  @Get("me")
  @Roles(["DRIVER", "ADMIN"])
  async getMyProfile(@CurrentUser() user: User): Promise<Driver> {
    return await this.service.getDetailDriver(user);
  }

  @Patch(":id")
  async updateLocation(
    @Param("id", ParseUUIDPipe) id: string,
    @Body(new ZodValidationPipe(UpdateLocationSchema)) body: UpdateLocation,
  ): Promise<DriverLocation> {
    return await this.service.updateLocation(id, body);
  }
}
